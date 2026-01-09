import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

class GmailClient {
  constructor() {
    this.credentialsPath = path.join(ROOT_DIR, 'credentials', 'google-credentials.json');
    this.tokenPath = path.join(ROOT_DIR, 'credentials', 'google-token.json');
    this.auth = null;
    this.gmail = null;
  }

  async loadCredentials() {
    try {
      const content = await fs.readFile(this.credentialsPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(chalk.red('Google credentials ikke funnet.'));
      console.log(chalk.yellow('\nFor å sette opp Gmail-integrasjon:'));
      console.log('1. Gå til: https://console.cloud.google.com/');
      console.log('2. Opprett nytt prosjekt');
      console.log('3. Aktiver Gmail API');
      console.log('4. Opprett OAuth 2.0 credentials');
      console.log('5. Last ned credentials.json');
      console.log(`6. Lagre som: ${this.credentialsPath}\n`);
      throw error;
    }
  }

  async loadToken() {
    try {
      const content = await fs.readFile(this.tokenPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      return null;
    }
  }

  async saveToken(token) {
    const dir = path.dirname(this.tokenPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(this.tokenPath, JSON.stringify(token, null, 2));
  }

  async authorize() {
    if (this.auth) return this.auth;

    const credentials = await this.loadCredentials();
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have a token
    const token = await this.loadToken();
    if (token) {
      oAuth2Client.setCredentials(token);
      this.auth = oAuth2Client;
      return this.auth;
    }

    // Need to get new token
    console.log(chalk.yellow('\nGmail ikke autorisert. Kjør: npm run crm gmail:auth\n'));
    throw new Error('Gmail ikke autorisert');
  }

  async getAuthUrl() {
    const credentials = await this.loadCredentials();
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.modify'
      ]
    });

    return { oAuth2Client, authUrl };
  }

  async authenticate(code) {
    const { oAuth2Client } = await this.getAuthUrl();
    const { tokens } = await oAuth2Client.getToken(code);
    await this.saveToken(tokens);
    console.log(chalk.green('✓ Gmail autorisert!'));
  }

  async init() {
    this.auth = await this.authorize();
    this.gmail = google.gmail({ version: 'v1', auth: this.auth });
  }

  // List messages
  async listMessages(query = '', maxResults = 20) {
    if (!this.gmail) await this.init();

    const spinner = ora('Henter e-poster...').start();

    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults
      });

      spinner.succeed(`Hentet ${response.data.messages?.length || 0} e-poster`);
      return response.data.messages || [];
    } catch (error) {
      spinner.fail('Feil ved henting av e-poster');
      console.error(chalk.red(error.message));
      throw error;
    }
  }

  // Get message details
  async getMessage(messageId) {
    if (!this.gmail) await this.init();

    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full'
      });

      return this.parseMessage(response.data);
    } catch (error) {
      console.error(chalk.red(error.message));
      throw error;
    }
  }

  // Parse message to readable format
  parseMessage(message) {
    const headers = message.payload.headers;

    const getHeader = (name) => {
      const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
      return header ? header.value : '';
    };

    let body = '';
    if (message.payload.body.data) {
      body = Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
    } else if (message.payload.parts) {
      const textPart = message.payload.parts.find(part =>
        part.mimeType === 'text/plain' || part.mimeType === 'text/html'
      );
      if (textPart && textPart.body.data) {
        body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
      }
    }

    return {
      id: message.id,
      threadId: message.threadId,
      from: getHeader('From'),
      to: getHeader('To'),
      subject: getHeader('Subject'),
      date: getHeader('Date'),
      body,
      snippet: message.snippet,
      labelIds: message.labelIds || []
    };
  }

  // Search emails by customer email
  async getEmailsByCustomer(customerEmail, maxResults = 20) {
    const query = `from:${customerEmail} OR to:${customerEmail}`;
    const messages = await this.listMessages(query, maxResults);

    // Get full details for each message
    const fullMessages = await Promise.all(
      messages.map(msg => this.getMessage(msg.id))
    );

    return fullMessages;
  }

  // Send email
  async sendEmail({ to, subject, body, from = 'me' }) {
    if (!this.gmail) await this.init();

    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      body
    ].join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    try {
      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage
        }
      });

      console.log(chalk.green(`✓ E-post sendt til ${to}`));
      return response.data;
    } catch (error) {
      console.error(chalk.red('Feil ved sending av e-post:', error.message));
      throw error;
    }
  }
}

export const gmailClient = new GmailClient();
