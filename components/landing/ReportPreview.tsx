import Link from "next/link";
import { ConversionStrip } from "@/components/landing/ConversionStrip";
import { StreamingMarkdown } from "@/components/StreamingMarkdown";
import {
  DEMO_PDF_PATH,
  DEMO_STAGE_1_MARKDOWN,
  DEMO_STAGE_11_MARKDOWN,
} from "@/lib/demo-report";
import { REPORT_CTA, REPORT_PREVIEW } from "@/lib/landing-content";

const markdownClassName =
  "[&_h2]:text-grill-green [&_h3]:text-grill-text [&_td]:border-white/10 [&_th]:border-white/10 [&_th]:bg-grill-bg [&_p]:text-grill-muted [&_strong]:text-grill-text [&_li]:text-grill-muted";

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-yellow-400/15 text-yellow-400">
      {status}
    </span>
  );
}

export function ReportPreview() {
  return (
    <section id="demo" className="px-6 py-16 md:py-20 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
          {REPORT_PREVIEW.title}
        </h2>
        <p className="text-grill-muted text-center text-sm mb-8">
          {REPORT_PREVIEW.subtitle}
        </p>

        <div className="space-y-4 mb-8">
          <div className="bg-grill-surface rounded-xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/5">
              <h3 className="font-semibold text-grill-text text-sm md:text-base">
                {REPORT_PREVIEW.stage1Title}
              </h3>
              <StatusBadge status="YELLOW" />
            </div>
            <div className="p-6 md:p-8">
              <StreamingMarkdown
                content={DEMO_STAGE_1_MARKDOWN}
                className={markdownClassName}
              />
            </div>
          </div>

          <details className="group bg-grill-surface rounded-xl border border-white/10 overflow-hidden">
            <summary className="cursor-pointer px-5 py-4 font-medium text-grill-text list-none flex justify-between items-center gap-4 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-3 min-w-0">
                <span className="truncate">{REPORT_PREVIEW.stage11Summary}</span>
                <StatusBadge status="YELLOW" />
              </span>
              <span className="text-grill-muted group-open:rotate-45 transition-transform text-xl leading-none shrink-0">
                +
              </span>
            </summary>
            <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-white/5 pt-6">
              <StreamingMarkdown
                content={DEMO_STAGE_11_MARKDOWN}
                className={markdownClassName}
              />
            </div>
          </details>
        </div>

        <div className="flex justify-center mb-12">
          <Link
            href={DEMO_PDF_PATH}
            download
            className="inline-flex items-center justify-center font-semibold rounded-xl transition-colors px-6 py-3 text-sm bg-grill-blue/20 text-grill-blue border border-grill-blue/30 hover:bg-grill-blue/30"
          >
            {REPORT_PREVIEW.pdfLabel}
          </Link>
        </div>

        <div className="text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-6">{REPORT_CTA.title}</h3>
          <ConversionStrip align="center" />
        </div>
      </div>
    </section>
  );
}
