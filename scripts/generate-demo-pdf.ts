import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";
import { getDemoAnalysis, getDemoMessages } from "../lib/demo-report";
import { buildReportHtml } from "../lib/pdf/report-html";

async function main() {
  const analysis = getDemoAnalysis();
  const messages = getDemoMessages();
  const html = buildReportHtml(analysis, messages);

  const outDir = path.join(process.cwd(), "public", "demo");
  const outFile = path.join(outDir, "sample-report.pdf");

  await mkdir(outDir, { recursive: true });

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
    await writeFile(outFile, pdf);
    console.log(`Demo PDF written to ${outFile}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
