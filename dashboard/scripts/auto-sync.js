#!/usr/bin/env node

/**
 * Auto-sync script for CRM Dashboard
 * - Watches for file changes
 * - Auto-saves (debounced)
 * - Commits and pushes to git
 * - Can pull changes from remote
 */

const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const DEBOUNCE_MS = 5000; // Wait 5 seconds after last change before committing
const POLL_INTERVAL_MS = 30000; // Check for remote changes every 30 seconds

let debounceTimer = null;
let changedFiles = new Set();
let isCommitting = false;

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  gray: "\x1b[90m",
};

function log(message, color = "reset") {
  const timestamp = new Date().toLocaleTimeString("nb-NO");
  console.log(`${colors.gray}[${timestamp}]${colors.reset} ${colors[color]}${message}${colors.reset}`);
}

function execPromise(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: path.join(__dirname, ".."), ...options }, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function gitStatus() {
  try {
    const { stdout } = await execPromise("git status --porcelain");
    return stdout.trim().split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

async function gitPull() {
  try {
    const { stdout } = await execPromise("git pull --rebase origin main");
    if (stdout.includes("Already up to date")) {
      return false;
    }
    log("Hentet oppdateringer fra git", "blue");
    return true;
  } catch (err) {
    log(`Kunne ikke hente fra git: ${err.stderr}`, "red");
    return false;
  }
}

async function gitCommitAndPush(files) {
  if (isCommitting) return;
  isCommitting = true;

  try {
    // Filter out temp files and non-existent files
    const validFiles = Array.from(files).filter(f => {
      if (f.includes(".tmp.") || f.endsWith(".tmp")) return false;
      const fullPath = path.join(__dirname, "..", f);
      return fs.existsSync(fullPath);
    });

    if (validFiles.length === 0) {
      log("Ingen gyldige filer å committe", "gray");
      isCommitting = false;
      return;
    }

    // Add all changes (safer than specifying files)
    await execPromise("git add -A");

    // Check if there's anything to commit
    const status = await gitStatus();
    const staged = status.filter(s => !s.startsWith(" ") && !s.startsWith("?"));

    if (staged.length === 0) {
      log("Ingen endringer å committe", "gray");
      isCommitting = false;
      return;
    }

    // Generate commit message
    const fileCount = staged.length;
    const timestamp = new Date().toLocaleString("nb-NO");
    const message = `auto: Oppdatert ${fileCount} fil(er) - ${timestamp}`;

    // Commit
    await execPromise(`git commit -m "${message}"`);
    log(`Committed: ${message}`, "green");

    // Push
    await execPromise("git push origin main");
    log("Pushet til git", "green");

  } catch (err) {
    log(`Git-feil: ${err.stderr || err.message}`, "red");
  } finally {
    isCommitting = false;
  }
}

function scheduleCommit() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(async () => {
    if (changedFiles.size > 0) {
      const files = new Set(changedFiles);
      changedFiles.clear();
      await gitCommitAndPush(files);
    }
  }, DEBOUNCE_MS);
}

function watchDirectory(dir, ignored = []) {
  const ignoredPaths = [
    "node_modules",
    ".next",
    ".git",
    "*.log",
    ...ignored,
  ];

  function shouldIgnore(filepath) {
    return ignoredPaths.some(pattern => {
      if (pattern.includes("*")) {
        const regex = new RegExp(pattern.replace("*", ".*"));
        return regex.test(filepath);
      }
      return filepath.includes(pattern);
    });
  }

  log(`Overvåker: ${dir}`, "blue");
  log(`Auto-commit etter ${DEBOUNCE_MS / 1000}s inaktivitet`, "gray");
  log(`Sjekker remote hver ${POLL_INTERVAL_MS / 1000}s`, "gray");

  fs.watch(dir, { recursive: true }, (eventType, filename) => {
    if (!filename || shouldIgnore(filename)) return;

    const filepath = path.join(dir, filename);

    // Check if file still exists (might be deleted)
    if (!fs.existsSync(filepath)) {
      log(`Slettet: ${filename}`, "yellow");
    } else {
      log(`Endret: ${filename}`, "yellow");
    }

    changedFiles.add(filename);
    scheduleCommit();
  });

  // Poll for remote changes
  setInterval(async () => {
    if (!isCommitting && changedFiles.size === 0) {
      await gitPull();
    }
  }, POLL_INTERVAL_MS);
}

// Main
const dashboardDir = path.join(__dirname, "..");
log("=== CRM Auto-Sync Startet ===", "green");
watchDirectory(dashboardDir);

// Handle graceful shutdown
process.on("SIGINT", () => {
  log("\nAvslutter auto-sync...", "yellow");
  process.exit(0);
});
