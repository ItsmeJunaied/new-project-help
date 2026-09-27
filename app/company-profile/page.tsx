import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import ProfileDeck from "@/components/sections/ProfileDeck";
import PrintButton from "@/components/ui/PrintButton";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import {
  COMPANY_PROFILE_HREF,
  PROFILE_EDITION,
  PROFILE_SLIDE_COUNT,
} from "@/lib/company-profile";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: `Company Profile ${PROFILE_EDITION}`,
  description:
    "The Project Help company profile: what we build, the sectors we have shipped into, how an engagement runs, selected work with its outcomes, and what you are left holding at handover.",
  path: COMPANY_PROFILE_HREF,
  keywords: [
    "Project Help company profile",
    "software company profile Bangladesh",
    "custom software development capabilities",
  ],
});

export default function CompanyProfilePage() {
  return (
    <>
      <div className="print-hide">
        <Header />
      </div>

      <main id="main" className="w-full bg-bg pb-[100px] pt-[48px] print:pb-0 print:pt-0">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[40px] print:max-w-none print:px-0">
          <div className="print-hide flex flex-col gap-[28px] border-b border-black/10 pb-[36px] lg:flex-row lg:items-end lg:justify-between lg:gap-[56px]">
            <div className="max-w-[760px]">
              <p className="font-mono text-[12px] uppercase leading-none tracking-[0.16em] text-neutral-paragraph">
                {siteConfig.name} &middot; Company Profile {PROFILE_EDITION}
              </p>
              <h1 className="mt-[18px] font-display text-[clamp(2.25rem,5vw,64px)] font-medium leading-[1.04] tracking-[-0.04em] text-black">
                Everything a client asks before they sign
              </h1>
              <p className="mt-[20px] font-body text-[clamp(1rem,1.4vw,19px)] leading-[1.55] tracking-[-0.2px] text-ash-dark">
                {PROFILE_SLIDE_COUNT} pages: what we build, where it has
                shipped, how an engagement runs, and what you own at the end.
                Read it here or take the PDF &mdash; both come off this page, so
                they cannot disagree with each other.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-[12px]">
              <PrintButton className="flex items-center gap-[10px] rounded-[100px] bg-primary-green px-[26px] py-[15px] font-body text-[16px] font-semibold leading-[24px] tracking-[-0.2px] text-black transition-colors hover:bg-[#95e534]">
                Download PDF
                <span aria-hidden>&darr;</span>
              </PrintButton>
              <a
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[10px] rounded-[100px] border border-black/15 px-[26px] py-[15px] font-body text-[16px] font-semibold leading-[24px] tracking-[-0.2px] text-black transition-colors hover:border-black/40"
              >
                Book a call
                <span aria-hidden>&rarr;</span>
              </a>
            </div>
          </div>

          <div className="mt-[40px] print:mt-0">
            <ProfileDeck />
          </div>
        </div>
      </main>

      <div className="print-hide">
        <Footer />
      </div>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: `Company Profile ${PROFILE_EDITION}`, path: COMPANY_PROFILE_HREF },
        ])}
      />
    </>
  );
}
