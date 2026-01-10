import { exec } from "child_process";
import { promisify } from "util";
import { supabase } from "../core/supabase.js";

const execAsync = promisify(exec);

interface SSHResult {
  success: boolean;
  output: string;
  error?: string;
  exitCode: number;
}

interface KinstaCredentials {
  siteId: string;
  environment: string;
  sshHost: string;
  sshUser: string;
}

export async function getCustomerSSHCredentials(
  customerId: string,
): Promise<KinstaCredentials | null> {
  const { data: customer } = await supabase
    .from("customers")
    .select("kinsta_site_id, kinsta_environment, wordpress_url")
    .eq("id", customerId)
    .single();

  if (!customer?.kinsta_site_id) {
    return null;
  }

  // Kinsta SSH format: ssh {site_id}@{site_id}.kinsta.cloud
  // For staging: {site_id}@stg-{site_id}.kinsta.cloud
  const environment = customer.kinsta_environment || "live";
  const siteId = customer.kinsta_site_id;

  const sshHost =
    environment === "staging"
      ? `stg-${siteId}.kinsta.cloud`
      : `${siteId}.kinsta.cloud`;

  return {
    siteId,
    environment,
    sshHost,
    sshUser: siteId,
  };
}

export async function executeSSH(
  credentials: KinstaCredentials,
  command: string,
  options?: { timeout?: number },
): Promise<SSHResult> {
  const { sshHost, sshUser } = credentials;
  const timeout = options?.timeout || 60000; // 60 seconds default

  // Build SSH command with options for non-interactive use
  const sshCommand = `ssh -o StrictHostKeyChecking=no -o BatchMode=yes -o ConnectTimeout=10 ${sshUser}@${sshHost} "${command.replace(/"/g, '\\"')}"`;

  console.log(`[SSH] Executing: ${command}`);

  try {
    const { stdout, stderr } = await execAsync(sshCommand, {
      timeout,
      maxBuffer: 10 * 1024 * 1024, // 10MB
    });

    return {
      success: true,
      output: stdout,
      error: stderr || undefined,
      exitCode: 0,
    };
  } catch (error: unknown) {
    const execError = error as { code?: number; stdout?: string; stderr?: string; message?: string };
    return {
      success: false,
      output: execError.stdout || "",
      error: execError.stderr || execError.message || "Unknown error",
      exitCode: execError.code || 1,
    };
  }
}

export async function executeWPCLI(
  credentials: KinstaCredentials,
  wpCommand: string,
): Promise<SSHResult> {
  // Kinsta path: /www/{site_id}/public
  const cdPath = `/www/${credentials.siteId}/public`;
  const fullCommand = `cd ${cdPath} && wp ${wpCommand}`;

  return executeSSH(credentials, fullCommand);
}

export async function executeMultipleCommands(
  credentials: KinstaCredentials,
  commands: string[],
): Promise<{ results: SSHResult[]; allSucceeded: boolean }> {
  const results: SSHResult[] = [];
  let allSucceeded = true;

  for (const command of commands) {
    const isWpCommand = command.startsWith("wp ");
    const result = isWpCommand
      ? await executeWPCLI(credentials, command.replace(/^wp\s+/, ""))
      : await executeSSH(credentials, command);

    results.push(result);

    if (!result.success) {
      allSucceeded = false;
      // Don't continue if a command fails (unless it's a non-critical check)
      break;
    }
  }

  return { results, allSucceeded };
}
