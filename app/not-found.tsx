import type { Metadata } from "next";
import Link from "next/link";

import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Page not found",
  // A 404 already carries a noindex signal from its status code, but the tag
  // stops the page being indexed if it is ever served with a 200 by a proxy.
  robots: { index: false, follow: true },
};

const DESTINATIONS = [
  { label: "Case studies", href: "/case-study", note: "Systems we have shipped, with the numbers" },
  { label: "Services", href: "/services", note: "What we build and how we price it" },
  { label: "Blog", href: "/blog", note: "Architecture and delivery notes" },
  { label: "Contact", href: "/contact", note: "Tell us what you are trying to ship" },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="w-full bg-bg px-6 pb-[100px] pt-[60px] lg:px-0 lg:pb-[160px] lg:pt-[100px]">
          <div className="mx-auto w-full max-w-[1440px]">
            <p className="font-mono text-[14px] font-medium uppercase leading-[16px] tracking-[0.5px] text-primary-green">
              [ 404 ]
            </p>

            <h1 className="mt-[16px] font-display text-[clamp(2.75rem,6vw,88px)] font-medium leading-[1.05] tracking-[-2px] text-black lg:max-w-[900px]">
              That page isn&rsquo;t here anymore.
            </h1>

            <p className="mt-[20px] font-body text-[18px] leading-[28px] tracking-[-0.16px] text-ash-dark lg:max-w-[620px]">
              The link may be out of date, or the page may have moved during our site
              rebuild. Here is where most people were heading.
            </p>

            <ul className="mt-[48px] flex w-full flex-col lg:max-w-[900px]">
              {DESTINATIONS.map((item) => (
                <li key={item.href} className="w-full">
                  <span className="block h-px w-full bg-[#e7e7e7]" aria-hidden />
                  <Link
                    href={item.href}
                    className="group flex w-full items-center justify-between gap-[16px] py-[22px]"
                  >
                    <span className="flex min-w-0 flex-col gap-[4px]">
                      <span className="font-display text-[24px] font-medium leading-[1.2] tracking-[-0.5px] text-black transition-colors group-hover:text-primary-green">
                        {item.label}
                      </span>
                      <span className="font-body text-[15px] leading-[22px] tracking-[-0.16px] text-[#707070]">
                        {item.note}
                      </span>
                    </span>
                    <span className="shrink-0 font-display text-[24px] leading-none text-black transition-transform duration-300 group-hover:translate-x-[4px]">
                      &rarr;
                    </span>
                  </Link>
                </li>
              ))}
              <li aria-hidden className="w-full">
                <span className="block h-px w-full bg-[#e7e7e7]" />
              </li>
            </ul>

            <div className="mt-[48px] flex w-full flex-col gap-[16px] lg:max-w-[900px]">
              <p className="font-display text-[14px] font-medium uppercase leading-[1.2] tracking-[0.5px] text-[#707070]">
                Looking for a specific service?
              </p>
              <ul className="flex flex-wrap items-center gap-[10px]">
                {SERVICES.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex rounded-[100px] border border-[#e7e7e7] px-[16px] py-[8px] font-body text-[14px] leading-[20px] tracking-[-0.16px] text-[#707070] transition-colors hover:border-black hover:text-black"
                    >
                      {service.shortTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
