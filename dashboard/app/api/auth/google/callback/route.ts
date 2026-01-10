/**
 * Google OAuth Callback
 * GET /api/auth/google/callback - Handles OAuth response
 */

import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback"
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    // Display tokens for manual .env.local update
    // In production, store these securely in database
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Gmail OAuth - Tokens</title>
  <style>
    body { font-family: system-ui; max-width: 800px; margin: 50px auto; padding: 20px; }
    .token-box { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0; word-break: break-all; }
    .label { font-weight: bold; color: #333; }
    .success { color: #22c55e; }
    code { background: #e5e5e5; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1 class="success">Gmail OAuth vellykket!</h1>
  <p>Kopier disse verdiene til <code>.env.local</code>:</p>

  <div class="token-box">
    <div class="label">GMAIL_ACCESS_TOKEN:</div>
    <div>${tokens.access_token || "N/A"}</div>
  </div>

  <div class="token-box">
    <div class="label">GMAIL_REFRESH_TOKEN:</div>
    <div>${tokens.refresh_token || "(Ikke mottatt - prøv å revoke access og kjør på nytt)"}</div>
  </div>

  <div class="token-box">
    <div class="label">Token utløper:</div>
    <div>${tokens.expiry_date ? new Date(tokens.expiry_date).toLocaleString("no-NO") : "N/A"}</div>
  </div>

  <h2>Neste steg:</h2>
  <ol>
    <li>Kopier GMAIL_REFRESH_TOKEN til <code>.env.local</code></li>
    <li>Start dev server på nytt</li>
    <li>Kjør bilagshenter: <code>bun run agent:bilag</code></li>
  </ol>

  <p><strong>NB:</strong> Access token utløper etter 1 time, men refresh_token brukes til å hente nye automatisk.</p>
</body>
</html>
`;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (err) {
    console.error("OAuth error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
