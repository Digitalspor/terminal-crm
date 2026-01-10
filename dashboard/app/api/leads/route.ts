import { getLeads, createLead, deleteLead, updateLeadStatus } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const leads = getLeads();
  return NextResponse.json(leads);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lead = createLead(body);
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    const success = deleteLead(id);
    if (success) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();
    if (!id || !body.status) {
      return NextResponse.json({ error: "ID and status required" }, { status: 400 });
    }
    const success = updateLeadStatus(id, body.status);
    if (success) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
