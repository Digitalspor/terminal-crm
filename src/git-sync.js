import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';
import ora from 'ora';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);

class GitSync {
  constructor() {
    this.autoCommit = process.env.AUTO_COMMIT !== 'false';
    this.autoPush = process.env.AUTO_PUSH !== 'false';
  }

  async exec(command, silent = false) {
    try {
      const { stdout, stderr } = await execAsync(command);
      if (!silent && stdout) console.log(stdout);
      if (!silent && stderr) console.error(chalk.yellow(stderr));
      return { stdout, stderr, success: true };
    } catch (error) {
      if (!silent) console.error(chalk.red(error.message));
      return { stdout: '', stderr: error.message, success: false };
    }
  }

  async status() {
    console.log(chalk.bold('\n📊 Git Status:\n'));
    await this.exec('git status');
  }

  async hasChanges() {
    const { stdout } = await this.exec('git status --porcelain', true);
    return stdout.trim().length > 0;
  }

  async pull() {
    const spinner = ora('Pulling changes...').start();
    const result = await this.exec('git pull --rebase', true);

    if (result.success) {
      spinner.succeed('Pulled changes from remote');
    } else {
      if (result.stderr.includes('CONFLICT')) {
        spinner.fail('Merge conflicts detected!');
        console.log(chalk.red('\n⚠️  Konflikt! Løs konflikter manuelt:\n'));
        console.log('1. Kjør: git status');
        console.log('2. Åpne filer med konflikt og fiks');
        console.log('3. Kjør: git add .');
        console.log('4. Kjør: git rebase --continue');
        console.log('5. Kjør: npm run crm sync\n');
      } else {
        spinner.fail('Pull failed');
      }
    }

    return result.success;
  }

  async commit(message) {
    if (!this.autoCommit) {
      console.log(chalk.yellow('Auto-commit er skrudd av'));
      return false;
    }

    const hasChanges = await this.hasChanges();
    if (!hasChanges) {
      console.log(chalk.gray('Ingen endringer å committe'));
      return true;
    }

    const spinner = ora('Committing changes...').start();

    await this.exec('git add .', true);
    const result = await this.exec(`git commit -m "${message}"`, true);

    if (result.success) {
      spinner.succeed(chalk.green(`Committed: ${message}`));
      return true;
    } else {
      spinner.fail('Commit failed');
      return false;
    }
  }

  async push() {
    if (!this.autoPush) {
      console.log(chalk.yellow('Auto-push er skrudd av'));
      return false;
    }

    const spinner = ora('Pushing to remote...').start();
    const result = await this.exec('git push', true);

    if (result.success) {
      spinner.succeed('Pushed to remote');
      return true;
    } else {
      if (result.stderr.includes('rejected')) {
        spinner.warn('Push rejected - remote has changes');
        console.log(chalk.yellow('\n⚠️  Remote har endringer. Pulling først...\n'));
        await this.pull();
        return await this.push();
      } else {
        spinner.fail('Push failed');
      }
      return false;
    }
  }

  async commitAndPush(message) {
    const committed = await this.commit(message);
    if (committed && this.autoPush) {
      await this.push();
    }
  }

  async pullAndPush() {
    console.log(chalk.bold.cyan('\n🔄 Synkroniserer med Git...\n'));

    const pulled = await this.pull();
    if (!pulled) return;

    const hasChanges = await this.hasChanges();
    if (hasChanges) {
      await this.commitAndPush('sync: Auto-sync lokale endringer');
    } else {
      console.log(chalk.green('\n✓ Alt er synkronisert!\n'));
    }
  }
}

export const gitSync = new GitSync();
