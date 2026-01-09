import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const execAsync = promisify(exec);

class UserContext {
  constructor() {
    this.currentUser = null;
  }

  async getCurrentGitUser() {
    if (this.currentUser) return this.currentUser;

    try {
      const { stdout: name } = await execAsync('git config user.name');
      const { stdout: email } = await execAsync('git config user.email');

      this.currentUser = {
        name: name.trim(),
        email: email.trim(),
        id: this.slugify(name.trim())
      };

      return this.currentUser;
    } catch (error) {
      console.error(chalk.red('Feil: Git bruker ikke konfigurert'));
      console.log(chalk.yellow('\nKonfigurer Git bruker med:'));
      console.log('git config --global user.name "Ditt Navn"');
      console.log('git config --global user.email "din@email.com"\n');
      throw error;
    }
  }

  async getUserId() {
    const user = await this.getCurrentGitUser();
    return user.id;
  }

  async getUserName() {
    const user = await this.getCurrentGitUser();
    return user.name;
  }

  slugify(text) {
    return text
      .toLowerCase()
      .replace(/æ/g, 'ae')
      .replace(/ø/g, 'o')
      .replace(/å/g, 'a')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

export const userContext = new UserContext();
