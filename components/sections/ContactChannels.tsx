"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { magnetic, reveal } from "@/lib/anim";
import { trackScheduleClick } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";

/**
 * The three ways to reach us that are not the form — email, WhatsApp and a
 * booked call — plus the office on a map. The live site had all four; the form
 * alone loses everyone who would rather talk than write.
 */
export default function ContactChannels() {
  const sectionRef = useRef<HTMLElement>(null);
  const bookRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 88%" });

      gsap.from(".channel-card", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: trigger,
      });

      gsap.from(".channel-map", {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: reveal(sectionRef.current?.querySelector(".channel-map") ?? null, {
          start: "top 90%",
        }),
      });

      return magnetic(bookRef.current, 0.18);
    },
    { scope: sectionRef },
  );

  const channels = [
    {
      label: "Email",
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
      note: "Best for a brief with attachments",
      external: false,
    },
    {
      label: "WhatsApp",
      value: siteConfig.phone,
      href: siteConfig.whatsappHref,
      note: "Fastest during Dhaka business hours",
      external: true,
    },
    {
      label: "Office",
      value: `${siteConfig.address.street}, ${siteConfig.address.locality} ${siteConfig.address.postalCode}`,
      href: "https://maps.app.goo.gl/",
      note: "Visits by appointment",
      external: true,
      plain: true,
    },
  ];

  return (
    <section ref={sectionRef} className="w-full bg-bg px-6 pb-[80px] lg:px-[40px] lg:pb-[140px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[48px]">
        <div className="grid w-full gap-[20px] lg:grid-cols-3">
          {channels.map((channel) => (
            <div
              key={channel.label}
              className="channel-card flex w-full flex-col gap-[10px] border-t border-black/20 pt-[20px]"
            >
              <p className="font-display text-[14px] font-medium uppercase leading-[1.2] tracking-[0.5px] text-[#707070]">
                {channel.label}
              </p>
              {channel.plain ? (
                <p className="font-display text-[20px] font-medium leading-[1.3] tracking-[-0.25px] text-black">
                  {channel.value}
                </p>
              ) : (
                <a
                  href={channel.href}
                  {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="font-display text-[20px] font-medium leading-[1.3] tracking-[-0.25px] text-black transition-colors hover:text-primary-green"
                >
                  {channel.value}
                </a>
              )}
              <p className="font-body text-[15px] leading-[22px] tracking-[-0.16px] text-[#707070]">
                {channel.note}
              </p>
            </div>
          ))}
        </div>

        <div className="flex w-full flex-col items-start gap-[24px] bg-[#151515] px-[28px] py-[32px] lg:flex-row lg:items-center lg:justify-between lg:px-[48px]">
          <div className="flex flex-col gap-[8px] lg:max-w-[620px]">
            <p className="font-display text-[clamp(1.5rem,2.4vw,32px)] font-medium leading-[1.2] tracking-[-0.75px] text-white">
              Would rather talk it through?
            </p>
            <p className="font-body text-[16px] leading-[24px] tracking-[-0.16px] text-[#a8a29e]">
              Thirty minutes with an engineer, not a salesperson. Bring the problem — you
              will leave with a rough shape, a rough number and an honest answer.
            </p>
          </div>

          <a
            ref={bookRef}
            href={siteConfig.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackScheduleClick("contact_page")}
            className="flex shrink-0 items-center justify-center rounded-[100px] bg-primary-green px-[28px] py-[15px] font-body text-[16px] font-medium leading-[24px] tracking-[-0.25px] text-white transition-opacity hover:opacity-90"
          >
            Book a free call
          </a>
        </div>

        <div className="channel-map relative h-[280px] w-full overflow-hidden sm:h-[360px] lg:h-[420px]">
          <iframe
            src={siteConfig.mapEmbedSrc}
            title={`${siteConfig.name} office location on Google Maps`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="size-full border-0 grayscale"
          />
        </div>
      </div>
    </section>
  );
}
