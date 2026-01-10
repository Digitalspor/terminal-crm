const FIKEN_API_URL = "https://api.fiken.no/api/v2";

interface FikenPurchaseInput {
  vendor: string;
  vendorOrgNumber?: string;
  date: string; // YYYY-MM-DD
  dueDate?: string;
  description: string;
  netAmount: number; // i øre
  vatAmount: number; // i øre
  accountCode: string;
  attachment?: {
    filename: string;
    data: Buffer;
    mimeType: string;
  };
}

interface FikenSupplier {
  contactId: number;
  name: string;
  organizationNumber?: string;
}

/**
 * Finner eller oppretter leverandør i Fiken
 */
async function findOrCreateSupplier(
  token: string,
  companySlug: string,
  vendor: string,
  orgNumber?: string
): Promise<number | null> {
  try {
    // Søk etter eksisterende leverandør
    const searchRes = await fetch(
      `${FIKEN_API_URL}/companies/${companySlug}/contacts?supplierOnly=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (searchRes.ok) {
      const suppliers: FikenSupplier[] = await searchRes.json();

      // Først, prøv å matche på org.nr
      if (orgNumber) {
        const byOrgNr = suppliers.find(
          (s) => s.organizationNumber === orgNumber.replace(/\s/g, "")
        );
        if (byOrgNr) return byOrgNr.contactId;
      }

      // Deretter, prøv å matche på navn
      const byName = suppliers.find(
        (s) => s.name.toLowerCase() === vendor.toLowerCase()
      );
      if (byName) return byName.contactId;
    }

    // Opprett ny leverandør
    console.log(`[Fiken] Oppretter ny leverandør: ${vendor}`);
    const createRes = await fetch(
      `${FIKEN_API_URL}/companies/${companySlug}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: vendor,
          organizationNumber: orgNumber?.replace(/\s/g, ""),
          supplier: true,
          customer: false,
        }),
      }
    );

    if (createRes.ok) {
      const location = createRes.headers.get("Location");
      // Hent contactId fra Location header
      const contactId = location?.split("/").pop();
      if (contactId) return parseInt(contactId);
    }

    return null;
  } catch (error) {
    console.error("[Fiken] Feil ved leverandørsøk:", error);
    return null;
  }
}

/**
 * Laster opp kjøp/bilag til Fiken
 */
export async function uploadPurchaseToFiken(
  input: FikenPurchaseInput
): Promise<{ success: boolean; purchaseId?: string; error?: string }> {
  const token = process.env.FIKEN_API_TOKEN || process.env.FIKEN_TOKEN;
  const companySlug = process.env.FIKEN_COMPANY_SLUG;

  if (!token || !companySlug) {
    return { success: false, error: "Fiken ikke konfigurert" };
  }

  try {
    // Finn eller opprett leverandør
    const supplierId = await findOrCreateSupplier(
      token,
      companySlug,
      input.vendor,
      input.vendorOrgNumber
    );

    // Bestem MVA-type basert på beløp
    let vatType = "NONE";
    if (input.vatAmount > 0) {
      const vatPercent = (input.vatAmount / input.netAmount) * 100;
      if (vatPercent >= 24 && vatPercent <= 26) {
        vatType = "HIGH";
      } else if (vatPercent >= 14 && vatPercent <= 16) {
        vatType = "MEDIUM";
      } else if (vatPercent >= 11 && vatPercent <= 13) {
        vatType = "LOW";
      }
    }

    // Opprett kjøp
    const purchaseData = {
      date: input.date,
      dueDate: input.dueDate || input.date,
      kind: "cash_purchase", // eller "supplier_invoice" for fakturaer
      paid: true,
      paymentDate: input.date,
      paymentAccount: "1920", // Bank
      lines: [
        {
          description: input.description,
          account: input.accountCode,
          vatType: vatType,
          netPrice: input.netAmount,
          vat: input.vatAmount,
        },
      ],
      ...(supplierId && {
        supplier: {
          contactId: supplierId,
        },
      }),
    };

    console.log("[Fiken] Oppretter kjøp:", JSON.stringify(purchaseData, null, 2));

    const purchaseRes = await fetch(
      `${FIKEN_API_URL}/companies/${companySlug}/purchases`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(purchaseData),
      }
    );

    if (!purchaseRes.ok) {
      const errorText = await purchaseRes.text();
      console.error("[Fiken] Feil ved oppretting:", purchaseRes.status, errorText);
      return { success: false, error: `Fiken API feil: ${purchaseRes.status}` };
    }

    // Hent purchaseId fra Location header
    const location = purchaseRes.headers.get("Location");
    const purchaseId = location?.split("/").pop();

    // Last opp vedlegg hvis tilgjengelig
    if (input.attachment && purchaseId) {
      await uploadAttachment(token, companySlug, purchaseId, input.attachment);
    }

    console.log(`[Fiken] Kjøp opprettet: ${purchaseId}`);
    return { success: true, purchaseId };
  } catch (error) {
    console.error("[Fiken] Feil:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Laster opp vedlegg til eksisterende kjøp
 */
async function uploadAttachment(
  token: string,
  companySlug: string,
  purchaseId: string,
  attachment: { filename: string; data: Buffer; mimeType: string }
): Promise<boolean> {
  try {
    const formData = new FormData();
    const blob = new Blob([attachment.data], { type: attachment.mimeType });
    formData.append("file", blob, attachment.filename);

    const res = await fetch(
      `${FIKEN_API_URL}/companies/${companySlug}/purchases/${purchaseId}/attachments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (res.ok) {
      console.log(`[Fiken] Vedlegg lastet opp: ${attachment.filename}`);
      return true;
    }

    console.error("[Fiken] Feil ved vedleggsopplasting:", res.status);
    return false;
  } catch (error) {
    console.error("[Fiken] Vedleggsfeil:", error);
    return false;
  }
}

/**
 * Mapper kontokode til Fiken kontonummer
 */
export function getAccountCode(category: string): string {
  const categoryMap: Record<string, string> = {
    "programvare": "6540",
    "it": "6540",
    "software": "6540",
    "domene": "6540",
    "hosting": "6540",
    "utstyr": "6500",
    "hardware": "6500",
    "elektronikk": "6500",
    "revisor": "6700",
    "regnskap": "6700",
    "kontor": "6800",
    "rekvisita": "6800",
    "reise": "7000",
    "diett": "7000",
    "transport": "7000",
    "markedsføring": "7100",
    "reklame": "7100",
    "annonse": "7100",
    "telefon": "6900",
    "mobil": "6900",
    "internett": "6900",
    "forsikring": "7320",
    "bank": "7770",
  };

  const lowerCategory = category.toLowerCase();
  for (const [key, code] of Object.entries(categoryMap)) {
    if (lowerCategory.includes(key)) {
      return code;
    }
  }

  return "6900"; // Default: Annen driftskostnad
}
