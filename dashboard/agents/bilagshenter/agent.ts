import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// Tool definitions for the bilagshenter agent
const tools: Anthropic.Tool[] = [
  {
    name: "fetch_emails",
    description:
      "Henter e-poster med vedlegg fra Gmail som inneholder fakturaer eller kvitteringer. Returnerer liste med e-post metadata og vedlegg.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description:
            "Gmail søkequery, f.eks. 'has:attachment (from:faktura OR subject:kvittering) is:unread'",
        },
        maxResults: {
          type: "number",
          description: "Maks antall e-poster å hente (default: 10)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "parse_document",
    description:
      "Parser et bilag (PDF eller bilde) og ekstraherer strukturert informasjon som leverandør, beløp, MVA, dato etc.",
    input_schema: {
      type: "object" as const,
      properties: {
        documentUrl: {
          type: "string",
          description: "URL eller base64-encodet dokument",
        },
        documentType: {
          type: "string",
          enum: ["pdf", "image"],
          description: "Type dokument",
        },
      },
      required: ["documentUrl", "documentType"],
    },
  },
  {
    name: "categorize_expense",
    description:
      "Kategoriserer en kostnad basert på leverandør og beskrivelse. Returnerer foreslått Fiken kontokode.",
    input_schema: {
      type: "object" as const,
      properties: {
        vendor: {
          type: "string",
          description: "Leverandørnavn",
        },
        description: {
          type: "string",
          description: "Beskrivelse av kjøpet",
        },
        amount: {
          type: "number",
          description: "Beløp i NOK",
        },
      },
      required: ["vendor", "description", "amount"],
    },
  },
  {
    name: "upload_to_fiken",
    description:
      "Laster opp et bilag til Fiken og oppretter en kjøpspost.",
    input_schema: {
      type: "object" as const,
      properties: {
        vendor: {
          type: "string",
          description: "Leverandørnavn",
        },
        date: {
          type: "string",
          description: "Bilagsdato (YYYY-MM-DD)",
        },
        netAmount: {
          type: "number",
          description: "Beløp eks. MVA i øre",
        },
        vatAmount: {
          type: "number",
          description: "MVA-beløp i øre",
        },
        accountCode: {
          type: "string",
          description: "Fiken kontokode (f.eks. 6540)",
        },
        description: {
          type: "string",
          description: "Beskrivelse av kjøpet",
        },
        attachmentUrl: {
          type: "string",
          description: "URL til vedlegg",
        },
      },
      required: ["vendor", "date", "netAmount", "vatAmount", "accountCode", "description"],
    },
  },
  {
    name: "mark_email_processed",
    description: "Markerer en e-post som behandlet ved å legge til label og arkivere.",
    input_schema: {
      type: "object" as const,
      properties: {
        emailId: {
          type: "string",
          description: "Gmail e-post ID",
        },
        label: {
          type: "string",
          description: "Label å legge til (default: 'Bilag/Behandlet')",
        },
      },
      required: ["emailId"],
    },
  },
  {
    name: "report_result",
    description: "Rapporterer resultat av bilagsbehandling.",
    input_schema: {
      type: "object" as const,
      properties: {
        processed: {
          type: "number",
          description: "Antall behandlede bilag",
        },
        failed: {
          type: "number",
          description: "Antall feilede bilag",
        },
        details: {
          type: "array",
          items: {
            type: "object",
            properties: {
              vendor: { type: "string" },
              amount: { type: "number" },
              status: { type: "string" },
            },
          },
          description: "Detaljer om hvert bilag",
        },
      },
      required: ["processed", "failed", "details"],
    },
  },
];

// Tool implementations
async function executeTool(
  toolName: string,
  toolInput: Record<string, unknown>
): Promise<string> {
  console.log(`\n[Tool] ${toolName}:`, JSON.stringify(toolInput, null, 2));

  switch (toolName) {
    case "fetch_emails":
      // TODO: Implement Gmail API integration
      return JSON.stringify({
        success: true,
        emails: [
          {
            id: "email-001",
            from: "faktura@domeneshop.no",
            subject: "Faktura for domenefornyelse",
            date: "2026-01-10",
            attachments: [
              {
                filename: "faktura-12345.pdf",
                mimeType: "application/pdf",
                url: "data:application/pdf;base64,..."
              }
            ]
          }
        ],
        count: 1
      });

    case "parse_document":
      // TODO: Implement Claude Vision parsing
      return JSON.stringify({
        success: true,
        parsed: {
          vendor: "Domeneshop AS",
          orgNumber: "988303211",
          invoiceNumber: "12345",
          date: "2026-01-10",
          dueDate: "2026-01-24",
          netAmount: 15920, // øre
          vatAmount: 3980,  // øre
          totalAmount: 19900,
          currency: "NOK",
          description: "Domenefornyelse: digitalspor.no"
        }
      });

    case "categorize_expense":
      // Kategoriseringslogikk
      const vendor = (toolInput.vendor as string).toLowerCase();
      let accountCode = "6900"; // Default: Annen driftskostnad
      let category = "Annen driftskostnad";

      if (vendor.includes("domeneshop") || vendor.includes("domene")) {
        accountCode = "6540";
        category = "Programvare og IT-tjenester";
      } else if (vendor.includes("elkjøp") || vendor.includes("power") || vendor.includes("komplett")) {
        accountCode = "6500";
        category = "Verktøy og utstyr";
      } else if (vendor.includes("fiken")) {
        accountCode = "6700";
        category = "Revisor og regnskapsfører";
      }

      return JSON.stringify({
        success: true,
        accountCode,
        category
      });

    case "upload_to_fiken":
      // TODO: Implement Fiken API integration
      return JSON.stringify({
        success: true,
        purchaseId: "fiken-purchase-12345",
        message: "Bilag lastet opp til Fiken"
      });

    case "mark_email_processed":
      // TODO: Implement Gmail label/archive
      return JSON.stringify({
        success: true,
        message: `E-post ${toolInput.emailId} markert som behandlet`
      });

    case "report_result":
      console.log("\n=== BILAGSHENTER RESULTAT ===");
      console.log(`Behandlet: ${toolInput.processed}`);
      console.log(`Feilet: ${toolInput.failed}`);
      console.log("Detaljer:", toolInput.details);
      return JSON.stringify({ success: true });

    default:
      return JSON.stringify({ error: `Ukjent verktøy: ${toolName}` });
  }
}

// Main agent function
export async function runBilagshenterAgent(): Promise<void> {
  console.log("\n=== BILAGSHENTER AGENT STARTET ===\n");

  const systemPrompt = `Du er en bilagshenter-agent for et norsk selskap. Din oppgave er å:

1. Hente e-poster med fakturaer/kvitteringer fra Gmail
2. Parse hvert vedlegg for å ekstrahere strukturert data
3. Kategorisere kostnaden med riktig kontokode
4. Laste opp bilaget til Fiken
5. Markere e-posten som behandlet
6. Rapportere resultatet

Bruk verktøyene i riktig rekkefølge. Vær nøyaktig med beløp (bruk øre) og datoer (YYYY-MM-DD).

Vanlige kontokoder:
- 6500: Verktøy og utstyr
- 6540: Programvare og IT-tjenester
- 6700: Revisor og regnskapsfører
- 6800: Kontorkostnader
- 6900: Annen driftskostnad
- 7000: Reise og diett
- 7100: Markedsføring

Start med å hente nye e-poster.`;

  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: "Kjør bilagshenter - hent og behandle alle nye bilag fra e-post."
    }
  ];

  let continueLoop = true;

  while (continueLoop) {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      tools,
      messages
    });

    // Process response
    for (const block of response.content) {
      if (block.type === "text") {
        console.log("\n[Agent]:", block.text);
      } else if (block.type === "tool_use") {
        const toolResult = await executeTool(block.name, block.input as Record<string, unknown>);

        // Add assistant message and tool result
        messages.push({
          role: "assistant",
          content: response.content
        });
        messages.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: block.id,
              content: toolResult
            }
          ]
        });
      }
    }

    // Check if we should continue
    if (response.stop_reason === "end_turn") {
      continueLoop = false;
    } else if (response.stop_reason !== "tool_use") {
      continueLoop = false;
    }
  }

  console.log("\n=== BILAGSHENTER AGENT FERDIG ===\n");
}

// Run if executed directly
if (require.main === module) {
  runBilagshenterAgent().catch(console.error);
}
