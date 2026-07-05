import { AudienceBlock } from "@/components/landing/AudienceBlock";
import { Deliverables } from "@/components/landing/Deliverables";
import { DemoCallout } from "@/components/landing/DemoCallout";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingJsonLd } from "@/components/landing/LandingJsonLd";
import { Manifesto } from "@/components/landing/Manifesto";
import { PricingCard } from "@/components/landing/PricingCard";
import { ProblemBlock } from "@/components/landing/ProblemBlock";
import { ReportPreview } from "@/components/landing/ReportPreview";
import { Testimonials } from "@/components/landing/Testimonials";

export default function LandingPage() {
  return (
    <div className="bg-grill-bg text-grill-text min-h-screen">
      <LandingJsonLd />
      <LandingHeader />
      <main>
        <Hero />
        <ProblemBlock />
        <AudienceBlock />
        <HowItWorks />
        <DemoCallout />
        <Deliverables />
        <ReportPreview />
        <Manifesto />
        <PricingCard />
        <Testimonials />
        <FAQAccordion />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
