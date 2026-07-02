import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { buildReportHtml } from "@/lib/pdf/report-html";
import { createClient } from "@/lib/supabase/server";
import type { Analysis, AnalysisMessage } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: analysisRow } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("status", "completed")
    .single();

  if (!analysisRow) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: messages } = await supabase
    .from("analysis_messages")
    .select("*")
    .eq("analysis_id", id)
    .order("created_at", { ascending: true });

  const analysis = analysisRow as Analysis;
  const msgs = (messages ?? []) as AnalysisMessage[];
  const html = buildReportHtml(analysis, msgs);
  const input = analysis.input_data as { name?: string };
  const filename = `${(input?.name ?? "grill-report").replace(/[^\w\s-]/g, "").slice(0, 50)}.pdf`;

  const launchOptions: Parameters<typeof puppeteer.launch>[0] = {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  const browser = await puppeteer.launch(launchOptions);

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "15mm", bottom: "20mm", left: "15mm" },
    });

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } finally {
    await browser.close();
  }
}
