import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface ParsedInvoice {
  vendor: string;
  vendorOrgNumber?: string;
  invoiceNumber?: string;
  date: string;
  dueDate?: string;
  netAmount: number; // i øre
  vatAmount: number; // i øre
  totalAmount: number; // i øre
  currency: string;
  description: string;
  lineItems?: {
    description: string;
    quantity?: number;
    unitPrice?: number;
    amount: number;
  }[];
  confidence: number; // 0-1
}

/**
 * Parser et bilagsdokument med Claude Vision
 */
export async function parseInvoiceDocument(
  documentData: Buffer,
  mimeType: string,
  filename: string
): Promise<ParsedInvoice | null> {
  console.log(`[Parser] Analyserer: ${filename} (${mimeType})`);

  try {
    // Konverter til base64
    const base64Data = documentData.toString("base64");

    // Bestem mediatype
    let mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp" = "image/png";
    if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
      mediaType = "image/jpeg";
    } else if (mimeType.includes("gif")) {
      mediaType = "image/gif";
    } else if (mimeType.includes("webp")) {
      mediaType = "image/webp";
    }

    // For PDF, vi må konvertere til bilde først eller bruke PDF-parsing
    // Her antar vi at det er et bilde eller at PDF er konvertert
    if (mimeType.includes("pdf")) {
      console.log("[Parser] PDF støtte krever konvertering til bilde");
      // TODO: Implementer PDF til bilde konvertering
      // For nå returnerer vi null for PDF
      return null;
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: "text",
              text: `Analyser denne fakturaen/kvitteringen og ekstraher følgende informasjon.

Returner BARE et JSON-objekt med følgende struktur (ingen annen tekst):
{
  "vendor": "Leverandørnavn",
  "vendorOrgNumber": "Org.nr hvis synlig (kun tall)",
  "invoiceNumber": "Fakturanummer",
  "date": "YYYY-MM-DD (bilagsdato)",
  "dueDate": "YYYY-MM-DD (forfallsdato hvis relevant)",
  "netAmount": 0, // Beløp eks. MVA i øre (f.eks. 100 kr = 10000)
  "vatAmount": 0, // MVA-beløp i øre
  "totalAmount": 0, // Total inkl. MVA i øre
  "currency": "NOK",
  "description": "Kort beskrivelse av hva som er kjøpt",
  "lineItems": [
    {
      "description": "Linjebeskrivelse",
      "quantity": 1,
      "unitPrice": 10000,
      "amount": 10000
    }
  ],
  "confidence": 0.95 // Hvor sikker du er på dataene (0-1)
}

Viktig:
- Alle beløp skal være i øre (100 kr = 10000 øre)
- Datoer skal være i YYYY-MM-DD format
- Org.nr skal kun inneholde tall (9 siffer)
- Hvis du ikke finner en verdi, sett den til null
- Sett confidence lavere hvis bildet er uklart eller data mangler`
            },
          ],
        },
      ],
    });

    // Parse responsen
    const content = response.content[0];
    if (content.type !== "text") {
      console.error("[Parser] Uventet respons type");
      return null;
    }

    // Prøv å parse JSON fra responsen
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[Parser] Kunne ikke finne JSON i respons");
      return null;
    }

    const parsed: ParsedInvoice = JSON.parse(jsonMatch[0]);
    console.log(`[Parser] Ekstrahert: ${parsed.vendor} - ${parsed.totalAmount / 100} kr`);

    return parsed;
  } catch (error) {
    console.error("[Parser] Feil ved parsing:", error);
    return null;
  }
}

/**
 * Kategoriserer kostnad basert på leverandør og beskrivelse
 */
export function categorizeExpense(
  vendor: string,
  description: string
): { accountCode: string; category: string } {
  const vendorLower = vendor.toLowerCase();
  const descLower = description.toLowerCase();

  // Leverandørbasert kategorisering
  const vendorCategories: Record<string, { code: string; name: string }> = {
    "domeneshop": { code: "6540", name: "Domene og hosting" },
    "one.com": { code: "6540", name: "Domene og hosting" },
    "github": { code: "6540", name: "Programvare" },
    "microsoft": { code: "6540", name: "Programvare" },
    "google": { code: "6540", name: "IT-tjenester" },
    "apple": { code: "6500", name: "Utstyr" },
    "elkjøp": { code: "6500", name: "Utstyr" },
    "power": { code: "6500", name: "Utstyr" },
    "komplett": { code: "6500", name: "Utstyr" },
    "fiken": { code: "6700", name: "Regnskapstjenester" },
    "regnskap": { code: "6700", name: "Regnskapstjenester" },
    "revisor": { code: "6700", name: "Revisjonstjenester" },
    "telenor": { code: "6900", name: "Telefoni" },
    "telia": { code: "6900", name: "Telefoni" },
    "ice": { code: "6900", name: "Telefoni" },
    "if forsikring": { code: "7320", name: "Forsikring" },
    "gjensidige": { code: "7320", name: "Forsikring" },
    "tryg": { code: "7320", name: "Forsikring" },
    "vy": { code: "7000", name: "Reise" },
    "sas": { code: "7000", name: "Reise" },
    "norwegian": { code: "7000", name: "Reise" },
    "widerøe": { code: "7000", name: "Reise" },
    "ruter": { code: "7000", name: "Reise" },
    "facebook": { code: "7100", name: "Markedsføring" },
    "meta": { code: "7100", name: "Markedsføring" },
    "linkedin": { code: "7100", name: "Markedsføring" },
  };

  // Sjekk leverandør
  for (const [key, value] of Object.entries(vendorCategories)) {
    if (vendorLower.includes(key)) {
      return { accountCode: value.code, category: value.name };
    }
  }

  // Beskrivelsesbasert kategorisering
  if (descLower.includes("domene") || descLower.includes("hosting")) {
    return { accountCode: "6540", category: "Domene og hosting" };
  }
  if (descLower.includes("lisens") || descLower.includes("abonnement")) {
    return { accountCode: "6540", category: "Programvare" };
  }
  if (descLower.includes("kontor") || descLower.includes("rekvisita")) {
    return { accountCode: "6800", category: "Kontorkostnader" };
  }
  if (descLower.includes("reise") || descLower.includes("fly") || descLower.includes("tog")) {
    return { accountCode: "7000", category: "Reise" };
  }

  // Default
  return { accountCode: "6900", category: "Annen driftskostnad" };
}
