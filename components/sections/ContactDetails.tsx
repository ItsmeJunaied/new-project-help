"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import { trackScheduleClick } from "@/lib/analytics";
import { useLeadForm } from "@/components/forms/useLeadForm";
import LeadFormExtras from "@/components/forms/LeadFormExtras";
import BriefStatus from "@/components/sections/BriefStatus";
import WhatsAppMark from "@/components/ui/WhatsAppMark";
import { SERVICES as ALL_SERVICES } from "@/lib/services";
import { siteConfig } from "@/lib/site";

/**
 * The top of the contact page: the title, and then immediately the form.
 *
 * It used to open on a hero, then four route cards, then a timeline, and the
 * form was most of a screen down — which is a long way to make somebody scroll
 * to do the one thing the page exists for. Everything that was above it either
 * moved into the margin beside it or moved below it.
 *
 * The boxes went with it. A column of bordered white rectangles is what a
 * template looks like; the same content set on hairline rules, with room
 * around it, is what it looks like when somebody has drawn it. There is one
 * filled surface left on this screen — the live panel — and it earns being the
 * only one.
 */

const SOCIALS = [
  { src: "/icons/contact-social-2.svg", label: "LinkedIn", href: siteConfig.social.linkedin },
  { src: "/icons/contact-social-4.svg", label: "Facebook", href: siteConfig.social.facebook },
];

/**
 * The ways round the form, for the people who would rather not write one.
 * They sit beside it rather than above it, so they are available without ever
 * standing between a visitor and the thing they came to do.
 */
const DIRECT = [
  {
    label: "Book a call",
    value: "30 minutes, free",
    href: siteConfig.calendlyUrl,
    external: true,
    onClick: () => trackScheduleClick("contact_aside"),
  },
  {
    label: "WhatsApp",
    value: siteConfig.phoneDisplay,
    href: siteConfig.whatsappHref,
    external: true,
    mark: true,
  },
  {
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    external: false,
  },
];

/**
 * What to put in the brief — the help a blank textarea actually needs.
 *
 * The last line matters as much as the list: told to supply five things,
 * somebody holding two of them closes the tab.
 */
const BRIEF_HINTS = [
  "The problem in your words, not a feature list",
  "Who uses it — ten colleagues or ten thousand customers",
  "What exists already, including half-finished",
  "When it has to work by, and what happens if it slips",
  "Roughly what you can spend. A range is fine",
];

const SERVICES = [...ALL_SERVICES.map((service) => service.title), "Something else"];

const BUDGETS = ["Under $5K", "$5K–$10K", "$10K–$20K", "$20K–$50K", "$50K+"];

/**
 * Fields are a rule and a line of type — no boxes, no fills, no rounded
 * corners. The green underline is the focus state and the only colour in the
 * form, so where you are is never in question.
 */
const FIELD_BASE =
  "h-[54px] w-full border-b bg-transparent py-[16px] font-display text-[15px] font-medium leading-[1.2] tracking-[-0.18px] text-black outline-none transition-colors placeholder:text-[#9a9a9a]";

function Label({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-mono text-[11px] uppercase leading-none tracking-[0.16em] text-neutral-paragraph"
    >
      {children}
    </label>
  );
}

export default function ContactDetails() {
  const sectionRef = useRef<HTMLElement>(null);
  const { status, error, submit, files, addFiles, removeFile, setCaptchaToken, turnstileRef } =
    useLeadForm();

  useGSAP(
    () => {
      gsap.from(".cd-title-line", {
        yPercent: 110,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.1,
      });

      gsap.from(".cd-intro", {
        y: 22,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        delay: 0.35,
      });

      gsap.from(".cd-rule", {
        scaleX: 0,
        duration: 1.1,
        ease: "power2.inOut",
        transformOrigin: "left center",
        delay: 0.5,
      });

      // The form is the point of the page, so it arrives on load rather than
      // waiting for a scroll trigger it may never get.
      gsap.from(".contact-field", {
        y: 20,
        opacity: 0,
        duration: 0.65,
        ease: "power2.out",
        stagger: 0.06,
        delay: 0.5,
      });

      gsap.from(".cd-aside", {
        y: 22,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.6,
      });

      gsap.from(".contact-step", {
        x: -12,
        opacity: 0,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.07,
        scrollTrigger: reveal(sectionRef.current, { start: "top 70%" }),
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-node-id="156:10877"
      className="w-full bg-bg pb-[80px] pt-[36px] lg:pb-[150px] lg:pt-[56px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[40px]">
        {/* The title, and nothing between it and the form but a rule. */}
        <div className="flex w-full flex-col items-start gap-[22px] lg:flex-row lg:items-end lg:justify-between lg:gap-[80px]">
          <div className="flex flex-col items-start gap-[18px]">
            <p className="cd-intro font-mono text-[11px] uppercase leading-none tracking-[0.2em] text-primary-green">
              Contact us
            </p>
            <h1 className="font-display text-[clamp(3rem,7.4vw,124px)] font-medium uppercase leading-[0.94] tracking-[-0.0625em] text-black">
              <span className="block overflow-hidden">
                <span className="cd-title-line block">Get in</span>
              </span>
              <span className="block overflow-hidden">
                <span className="cd-title-line block">Touch</span>
              </span>
            </h1>
          </div>

          <p className="cd-intro max-w-[430px] font-display text-[18px] leading-[1.45] tracking-[-0.2px] text-ash-dark lg:pb-[10px] lg:text-right">
            Send the problem, not a polished specification. Back comes a written scope, a
            fixed estimate and an honest answer — including{" "}
            <span className="text-black">“not us”</span> when that is the answer.
          </p>
        </div>

        <div className="cd-rule mt-[30px] h-px w-full bg-black/15 lg:mt-[44px]" />

        {/* Form on the right and the width it deserves; everything that
            supports it in a narrower column on the left. */}
        <div className="mt-[44px] flex w-full flex-col items-start gap-[56px] lg:mt-[62px] lg:flex-row lg:gap-[90px]">
          <div className="order-2 flex w-full flex-col gap-[42px] lg:order-1 lg:w-[380px] lg:shrink-0">
            <BriefStatus />

            {/* The ways round the form. Rules, not boxes — the row itself is
                the target and the whole of it lights up. */}
            <div className="cd-aside flex w-full flex-col">
              <p className="font-mono text-[11px] uppercase leading-none tracking-[0.2em] text-neutral-paragraph">
                Or skip the form
              </p>

              <ul className="mt-[18px] flex w-full flex-col border-t border-black/10">
                {DIRECT.map((item) => (
                  <li key={item.label} className="w-full border-b border-black/10">
                    <a
                      href={item.href}
                      onClick={item.onClick}
                      {...(item.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group flex w-full items-center gap-[14px] py-[18px] transition-colors"
                    >
                      {item.mark ? (
                        <WhatsAppMark className="size-[18px] shrink-0 text-black transition-colors group-hover:text-primary-green" />
                      ) : null}

                      <span className="flex flex-col gap-[4px]">
                        <span className="font-display text-[19px] font-medium leading-none tracking-[-0.3px] text-black transition-colors group-hover:text-primary-green">
                          {item.label}
                        </span>
                        <span className="font-body text-[13px] leading-none tracking-[-0.1px] text-neutral-paragraph">
                          {item.value}
                        </span>
                      </span>

                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 15 15"
                        fill="none"
                        aria-hidden
                        className="ml-auto shrink-0 text-black/30 transition-[transform,color] duration-300 group-hover:translate-x-[3px] group-hover:text-primary-green"
                      >
                        <path
                          d="M3 12 12 3M4.6 3H12v7.4"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* What to put in it. A plain ticked list — it is guidance, and
                guidance that looks like a feature panel gets skipped. */}
            <div className="cd-aside flex w-full flex-col">
              <p className="font-mono text-[11px] uppercase leading-none tracking-[0.2em] text-neutral-paragraph">
                Worth including
              </p>

              <ul className="mt-[18px] flex w-full flex-col gap-[13px]">
                {BRIEF_HINTS.map((hint) => (
                  <li key={hint} className="contact-step flex w-full items-start gap-[11px]">
                    <span
                      aria-hidden
                      className="mt-[6px] size-[5px] shrink-0 rotate-45 bg-primary-green"
                    />
                    <span className="font-body text-[14px] leading-[21px] tracking-[-0.1px] text-ash-dark">
                      {hint}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="contact-step mt-[20px] border-t border-black/10 pt-[18px] font-body text-[13px] leading-[20px] tracking-[-0.1px] text-neutral-paragraph">
                None of it is required — a paragraph and a way to reach you is enough.{" "}
                <span className="text-black">
                  Need an NDA first? Say so in the opening line and it is signed the same
                  day.
                </span>
              </p>
            </div>

            <div className="cd-aside flex w-full items-center gap-[20px]">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="relative size-[19px] opacity-45 transition-opacity hover:opacity-100"
                >
                  <Image src={social.src} alt="" fill className="object-contain" />
                </a>
              ))}
            </div>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void submit(event.currentTarget);
            }}
            className="order-1 flex w-full flex-col gap-[30px] lg:order-2 lg:flex-1"
          >
            {/* Honeypot — off-screen and hidden from assistive tech, so only a
                bot filling every field will put anything in it. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="absolute left-[-9999px] size-0 opacity-0"
            />

            <div className="contact-fields flex w-full flex-col gap-[30px]">
              <div className="contact-field flex w-full flex-col gap-[10px]">
                <Label htmlFor="contact-name">Your name</Label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Jane Rahman"
                  className={`${FIELD_BASE} border-black/15 focus:border-primary-green`}
                />
              </div>

              <div className="contact-field flex w-full flex-col items-start gap-[30px] sm:flex-row">
                <div className="flex w-full flex-1 flex-col gap-[10px]">
                  <Label htmlFor="contact-email">Email</Label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    className={`${FIELD_BASE} border-black/15 focus:border-primary-green`}
                  />
                </div>
                <div className="flex w-full flex-1 flex-col gap-[10px]">
                  <Label htmlFor="contact-phone">Phone — optional</Label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    placeholder="+880 …"
                    className={`${FIELD_BASE} border-black/15 focus:border-primary-green`}
                  />
                </div>
              </div>

              <div className="contact-field flex w-full flex-col items-start gap-[30px] sm:flex-row">
                <div className="flex w-full flex-1 flex-col gap-[10px]">
                  <Label htmlFor="contact-service">What you need</Label>
                  <select
                    id="contact-service"
                    name="service"
                    required
                    defaultValue=""
                    className={`${FIELD_BASE} border-black/15 pr-[16px] focus:border-primary-green`}
                  >
                    <option value="" disabled>
                      Choose a service
                    </option>
                    {SERVICES.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex w-full flex-1 flex-col gap-[10px]">
                  <Label htmlFor="contact-budget">Budget</Label>
                  <select
                    id="contact-budget"
                    name="budget"
                    required
                    defaultValue=""
                    className={`${FIELD_BASE} border-black/15 pr-[16px] focus:border-primary-green`}
                  >
                    <option value="" disabled>
                      Choose a range
                    </option>
                    {BUDGETS.map((budget) => (
                      <option key={budget} value={budget}>
                        {budget}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="contact-field flex w-full flex-col gap-[10px]">
                <Label htmlFor="contact-details">The problem</Label>
                <textarea
                  id="contact-details"
                  name="message"
                  required
                  placeholder="What is not working, who it affects, and what you have tried so far…"
                  className="min-h-[150px] w-full resize-y border-b border-black/15 bg-transparent pt-[16px] font-display text-[15px] font-medium leading-[1.5] tracking-[-0.18px] text-black outline-none transition-colors placeholder:text-[#9a9a9a] focus:border-primary-green"
                />
              </div>
            </div>

            <LeadFormExtras
              id="contact-page"
              tone="dark"
              files={files}
              addFiles={addFiles}
              removeFile={removeFile}
              setCaptchaToken={setCaptchaToken}
              turnstileRef={turnstileRef}
            />

            <div className="contact-field flex w-full flex-wrap items-center gap-x-[24px] gap-y-[16px]">
              <button
                type="submit"
                disabled={status === "sending"}
                className="group flex items-center gap-[12px] rounded-[1000px] bg-black py-[17px] pl-[32px] pr-[22px] transition-[transform,opacity] duration-300 hover:-translate-y-[2px] disabled:translate-y-0 disabled:opacity-60"
              >
                <span className="font-body text-[15px] font-medium uppercase leading-none tracking-[0.02em] text-white">
                  {status === "sending" ? "Sending…" : "Send the brief"}
                </span>
                <span className="flex size-[26px] items-center justify-center rounded-full bg-primary-green text-white">
                  <svg width="12" height="12" viewBox="0 0 15 15" fill="none" aria-hidden>
                    <path
                      d="M3 12 12 3M4.6 3H12v7.4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-300 group-hover:translate-x-[1px]"
                    />
                  </svg>
                </span>
              </button>

              <p className="font-body text-[13px] leading-[19px] tracking-[-0.1px] text-neutral-paragraph">
                A written reply within four business hours.
              </p>
            </div>

            {/* Only rendered once there is something to say, so the resting
                layout is exactly as drawn. */}
            <p
              role="status"
              aria-live="polite"
              hidden={status !== "sent" && status !== "error"}
              className={`font-display text-[17px] font-medium leading-[1.3] tracking-[-0.18px] ${
                status === "error" ? "text-[#c02626]" : "text-black"
              }`}
            >
              {status === "sent"
                ? "Thanks — your brief is in. We reply within 4 business hours."
                : error}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
