/**
 * Bilagshenter Agent - Hovedkjørescript
 *
 * Henter fakturaer og kvitteringer fra e-post,
 * parser dem med AI, og laster opp til Fiken.
 */

import Anthropic from "@anthropic-ai/sdk";
import { google } from "googleapis";
import {
  fetchEmailsWithAttachments,
  markEmailProcessed,
  decodeAttachment,
} from "./tools/gmail-attachments";
import { uploadPurchaseToFiken } from "./tools/fiken-upload";
import { parseInvoiceDocument, categorizeExpense } from "./tools/document-parser";

const client = new Anthropic();

interface AgentConfig {
  gmailCredentials?: {
    clientId: string;
    clientSecret: string;
    accessToken: string;
    refreshToken: string;
  };
  dryRun?: boolean; // Ikke last opp til Fiken, kun simuler
}

interface ProcessingResult {
  emailId: string;
  vendor: string;
  amount: number;
  status: "success" | "skipped" | "failed";
  fikenPurchaseId?: string;
  error?: string;
}

/**
 * Kjør bilagshenter-agenten
 */
export async function runBilagshenterAgent(
  config: AgentConfig = {}
): Promise<ProcessingResult[]> {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║      BILAGSHENTER AGENT STARTET        ║");
  console.log("╚════════════════════════════════════════╝\n");

  const results: ProcessingResult[] = [];
  const startTime = Date.now();

  try {
    // Sett opp Gmail-klient
    if (!config.gmailCredentials) {
      console.log("⚠️  Gmail-legitimasjon mangler - bruker demo-modus\n");
      return runDemoMode();
    }

    const oauth2Client = new google.auth.OAuth2(
      config.gmailCredentials.clientId,
      config.gmailCredentials.clientSecret
    );
    oauth2Client.setCredentials({
      access_token: config.gmailCredentials.accessToken,
      refresh_token: config.gmailCredentials.refreshToken,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Hent e-poster med vedlegg
    console.log("📧 Henter e-poster med vedlegg...\n");
    const emails = await fetchEmailsWithAttachments(gmail, {
      maxResults: 10,
    });

    if (emails.length === 0) {
      console.log("✓ Ingen nye bilag å behandle\n");
      return results;
    }

    console.log(`📋 Fant ${emails.length} e-poster med vedlegg\n`);
    console.log("─".repeat(50) + "\n");

    // Behandle hver e-post
    for (const email of emails) {
      console.log(`📩 Fra: ${email.from}`);
      console.log(`   Emne: ${email.subject}`);
      console.log(`   Vedlegg: ${email.attachments.length}`);

      for (const attachment of email.attachments) {
        console.log(`\n   📎 Behandler: ${attachment.filename}`);

        try {
          // Dekod vedlegg
          const documentBuffer = decodeAttachment(attachment.data);

          // Parse dokumentet med AI
          const parsed = await parseInvoiceDocument(
            documentBuffer,
            attachment.mimeType,
            attachment.filename
          );

          if (!parsed) {
            console.log("   ⚠️  Kunne ikke parse dokumentet");
            results.push({
              emailId: email.id,
              vendor: "Ukjent",
              amount: 0,
              status: "skipped",
              error: "Parsing feilet",
            });
            continue;
          }

          // Kategoriser kostnaden
          const category = categorizeExpense(parsed.vendor, parsed.description);
          console.log(`   → Leverandør: ${parsed.vendor}`);
          console.log(`   → Beløp: ${parsed.totalAmount / 100} kr`);
          console.log(`   → Kategori: ${category.category} (${category.accountCode})`);

          // Last opp til Fiken (hvis ikke dry run)
          if (config.dryRun) {
            console.log("   ✓ [DRY RUN] Ville lastet opp til Fiken");
            results.push({
              emailId: email.id,
              vendor: parsed.vendor,
              amount: parsed.totalAmount / 100,
              status: "success",
            });
          } else {
            const uploadResult = await uploadPurchaseToFiken({
              vendor: parsed.vendor,
              vendorOrgNumber: parsed.vendorOrgNumber,
              date: parsed.date,
              dueDate: parsed.dueDate,
              description: parsed.description,
              netAmount: parsed.netAmount,
              vatAmount: parsed.vatAmount,
              accountCode: category.accountCode,
              attachment: {
                filename: attachment.filename,
                data: documentBuffer,
                mimeType: attachment.mimeType,
              },
            });

            if (uploadResult.success) {
              console.log(`   ✓ Lastet opp til Fiken (${uploadResult.purchaseId})`);
              results.push({
                emailId: email.id,
                vendor: parsed.vendor,
                amount: parsed.totalAmount / 100,
                status: "success",
                fikenPurchaseId: uploadResult.purchaseId,
              });
            } else {
              console.log(`   ✗ Feil: ${uploadResult.error}`);
              results.push({
                emailId: email.id,
                vendor: parsed.vendor,
                amount: parsed.totalAmount / 100,
                status: "failed",
                error: uploadResult.error,
              });
            }
          }

          // Marker e-post som behandlet
          if (!config.dryRun) {
            await markEmailProcessed(gmail, email.id);
          }
        } catch (error) {
          console.log(`   ✗ Feil: ${error}`);
          results.push({
            emailId: email.id,
            vendor: "Ukjent",
            amount: 0,
            status: "failed",
            error: String(error),
          });
        }
      }

      console.log("\n" + "─".repeat(50) + "\n");
    }
  } catch (error) {
    console.error("Agent feil:", error);
  }

  // Oppsummering
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const success = results.filter((r) => r.status === "success").length;
  const failed = results.filter((r) => r.status === "failed").length;
  const skipped = results.filter((r) => r.status === "skipped").length;

  console.log("╔════════════════════════════════════════╗");
  console.log("║           OPPSUMMERING                 ║");
  console.log("╠════════════════════════════════════════╣");
  console.log(`║  ✓ Behandlet: ${success.toString().padEnd(24)}║`);
  console.log(`║  ✗ Feilet:    ${failed.toString().padEnd(24)}║`);
  console.log(`║  ⚠ Hoppet:    ${skipped.toString().padEnd(24)}║`);
  console.log(`║  ⏱ Tid:       ${(elapsed + "s").padEnd(24)}║`);
  console.log("╚════════════════════════════════════════╝\n");

  return results;
}

/**
 * Demo-modus for testing uten Gmail-tilkobling
 */
async function runDemoMode(): Promise<ProcessingResult[]> {
  console.log("🎭 Kjører i demo-modus med test-data\n");
  console.log("─".repeat(50) + "\n");

  // Simuler en faktura
  const demoInvoice = {
    vendor: "Domeneshop AS",
    vendorOrgNumber: "988303211",
    date: "2026-01-10",
    description: "Domenefornyelse: digitalspor.no",
    netAmount: 15920, // 159.20 kr eks MVA
    vatAmount: 3980, // 39.80 kr MVA
    totalAmount: 19900, // 199 kr inkl MVA
  };

  console.log(`📩 Demo-faktura:`);
  console.log(`   → Leverandør: ${demoInvoice.vendor}`);
  console.log(`   → Beløp: ${demoInvoice.totalAmount / 100} kr`);

  const category = categorizeExpense(demoInvoice.vendor, demoInvoice.description);
  console.log(`   → Kategori: ${category.category} (${category.accountCode})`);
  console.log(`   ✓ [DEMO] Ville lastet opp til Fiken\n`);

  return [
    {
      emailId: "demo-001",
      vendor: demoInvoice.vendor,
      amount: demoInvoice.totalAmount / 100,
      status: "success",
    },
  ];
}

// Kjør hvis startet direkte
const isMainModule = typeof Bun !== "undefined"
  ? Bun.main === Bun.argv[1] || import.meta.url.endsWith(Bun.argv[1].split("/").pop() || "")
  : typeof require !== "undefined" && require.main === module;

if (isMainModule || process.argv[1]?.includes("bilagshenter/index")) {
  runBilagshenterAgent({ dryRun: true })
    .then((results) => {
      console.log("Resultater:", results);
    })
    .catch(console.error);
}
