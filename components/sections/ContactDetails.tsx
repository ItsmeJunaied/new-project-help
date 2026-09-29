"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { trackScheduleClick } from "@/lib/analytics";
import { useLeadForm } from "@/components/forms/useLeadForm";
import LeadFormExtras from "@/components/forms/LeadFormExtras";
import BriefStatus from "@/components/sections/BriefStatus";
import WhatsAppMark from "@/components/ui/WhatsAppMark";
import { HEADLINE_SERVICES } from "@/lib/services";
import { siteConfig } from "@/lib/site";

/**
 * The top of the contact page: what the page is for on the left, the brief
 * form on the right.
 *
 * Two things carry it that the previous version did not have. The choices are
 * chips rather than dropdowns — a select hides its options behind a click, so
 * a visitor cannot see at a glance that we do the thing they came for, and a
 * budget select in particular reads as an interrogation where a row of ranges
 * reads as a question. And the form sits on a raised white panel, which makes
 * it the object on the page rather than a column of inputs sharing a
 * background with everything else.
 */

const SOCIALS = [
  { src: "/icons/contact-social-2.svg", label: "LinkedIn", href: siteConfig.social.linkedin },
  { src: "/icons/contact-social-4.svg", label: "Facebook", href: siteConfig.social.facebook },
];

/** The four things worth knowing before writing anything. */
const PROMISES = [
  "An engineer reads it — not a sales desk, not a bot",
  "A written reply inside four business hours",
  "A fixed number in the reply, never “starting from”",
  "An NDA signed the same day, before you share anything",
];

const DIRECT = [
  {
    label: "Book a free call",
    value: "30 minutes, no pitch",
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
 * Seven headline services plus an escape hatch. The full list runs to fifteen,
 * which is a wall of chips — these are the seven the site leads with, and
 * anything else arrives through "Something else" and the brief itself.
 */
const SERVICE_CHIPS = [...HEADLINE_SERVICES.map((service) => service.title), "Something else"];

const BUDGET_CHIPS = ["Under $5K", "$5K–$10K", "$10K–$20K", "$20K–$50K", "$50K+"];

const FIELD_BASE =
  "h-[52px] w-full border-b bg-transparent py-[14px] font-display text-[15px] font-medium leading-[1.2] tracking-[-0.18px] text-black outline-none transition-colors placeholder:text-[#a2a2a2]";

function Legend({ children }: { children: string }) {
  return (
    <legend className="mb-[14px] font-mono text-[11px] uppercase leading-none tracking-[0.18em] text-neutral-paragraph">
      {children}
    </legend>
  );
}

/**
 * A chip is a real radio input with the box visually hidden, not a button
 * writing to a hidden field. The group is then keyboard-navigable with the
 * arrow keys, it announces itself as a radio group, the value arrives in
 * FormData under the same key the select used — so nothing downstream changed
 * — and a form reset clears it without any state to keep in step.
 *
 * The lit state is `peer-checked:`, which needs the input to be a previous
 * sibling of the label. Hence the wrapper span: the two have to sit together
 * for the variant to reach across.
 */
function Chip({
  name,
  value,
  id,
  required,
}: {
  name: string;
  value: string;
  id: string;
  /** Set on ONE radio per group — that makes the whole group required, which
   *  is what the `required` select this replaced used to do. */
  required?: boolean;
}) {
  return (
    <span className="inline-flex">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        required={required}
        className="peer sr-only"
      />
      <label
        htmlFor={id}
        className="cursor-pointer select-none rounded-full border border-black/15 px-[15px] py-[9px] font-body text-[13px] leading-none tracking-[-0.1px] text-ash-dark transition-[background-color,border-color,color] duration-200 hover:border-black/35 hover:text-black peer-checked:border-black peer-checked:bg-black peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-green"
      >
        {value}
      </label>
    </span>
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
        stagger: 0.09,
        delay: 0.1,
      });

      gsap.from(".cd-intro", {
        y: 20,
        opacity: 0,
        duration: 0.85,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.35,
      });

      gsap.from(".cd-panel", {
        y: 34,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.3,
      });

      gsap.from(".cd-aside", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.55,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-node-id="156:10877"
      className="w-full bg-bg pb-[70px] pt-[32px] lg:pb-[120px] lg:pt-[48px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[40px]">
        <div className="flex w-full flex-col items-start gap-[44px] lg:flex-row lg:gap-[70px]">
          {/* Left: what the page is for, and the ways round the form. */}
          <div className="flex w-full flex-col lg:w-[500px] lg:shrink-0">
            <span className="cd-intro inline-flex w-fit items-center gap-[9px] rounded-full border border-black/10 bg-white px-[14px] py-[8px]">
              <span className="relative flex size-[7px]">
                <span
                  aria-hidden
                  className="absolute inset-0 animate-ping rounded-full bg-primary-green opacity-70"
                />
                <span className="relative size-[7px] rounded-full bg-primary-green" />
              </span>
              <span className="font-mono text-[10px] uppercase leading-none tracking-[0.18em] text-ink">
                Reply within 4 business hours
              </span>
            </span>

            {/* The mask each line rises out of is `overflow-hidden`, which
                crops whatever falls below the line box — and at this size the
                descender on "building", in italic, falls a long way below it.
                So the inner span carries bottom padding and the mask pulls the
                same amount back off its own height: the glyph gets room, and
                the two lines still sit at the spacing the type wants. */}
            <h1 className="mt-[22px] font-display text-[clamp(2.5rem,4.6vw,64px)] font-medium leading-[1.02] tracking-[-0.04em] text-black">
              <span className="block -mb-[0.16em] overflow-hidden">
                <span className="cd-title-line block pb-[0.16em]">Tell us what</span>
              </span>
              <span className="block -mb-[0.16em] overflow-hidden">
                {/* The italic second line is the one piece of type on the page
                    that is not doing a job — it is there to stop the headline
                    reading like a form label. */}
                <span className="cd-title-line block pb-[0.16em] italic text-ash-dark">
                  you&rsquo;re building
                </span>
              </span>
            </h1>

            <p className="cd-intro mt-[20px] max-w-[430px] font-body text-[15px] leading-[24px] tracking-[-0.1px] text-neutral-paragraph">
              Send the problem rather than a polished specification. Back comes a written
              scope, a fixed estimate, and the two projects in our work closest to yours —
              including <span className="text-black">“not us”</span> when that is the
              honest answer.
            </p>

            <div className="mt-[32px]">
              <BriefStatus />
            </div>

            <ul className="cd-aside mt-[32px] flex w-full flex-col gap-[13px]">
              {PROMISES.map((promise) => (
                <li key={promise} className="flex w-full items-start gap-[11px]">
                  <span
                    aria-hidden
                    className="mt-[1px] flex size-[18px] shrink-0 items-center justify-center rounded-full bg-primary-green text-white"
                  >
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6.4 4.6 9 10 3.2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="font-body text-[14px] leading-[21px] tracking-[-0.1px] text-ash-dark">
                    {promise}
                  </span>
                </li>
              ))}
            </ul>

            <div className="cd-aside mt-[34px] flex w-full flex-col">
              <p className="font-mono text-[11px] uppercase leading-none tracking-[0.18em] text-neutral-paragraph">
                Or reach us directly
              </p>

              <ul className="mt-[16px] flex w-full flex-col border-t border-black/10">
                {DIRECT.map((item) => (
                  <li key={item.label} className="w-full border-b border-black/10">
                    <a
                      href={item.href}
                      onClick={item.onClick}
                      {...(item.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group flex w-full items-center gap-[13px] py-[16px]"
                    >
                      {item.mark ? (
                        <WhatsAppMark className="size-[17px] shrink-0 text-black transition-colors group-hover:text-primary-green" />
                      ) : null}

                      <span className="flex flex-col gap-[4px]">
                        <span className="font-display text-[18px] font-medium leading-none tracking-[-0.3px] text-black transition-colors group-hover:text-primary-green">
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
                        className="ml-auto shrink-0 text-black/25 transition-[transform,color] duration-300 group-hover:translate-x-[3px] group-hover:text-primary-green"
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

              <div className="mt-[22px] flex w-full items-center gap-[18px]">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="relative size-[18px] opacity-40 transition-opacity hover:opacity-100"
                  >
                    <Image src={social.src} alt="" fill className="object-contain" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: the form, on a panel of its own. */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void submit(event.currentTarget);
            }}
            className="cd-panel flex w-full flex-col rounded-[24px] bg-white p-[26px] shadow-[0_40px_90px_-56px_rgba(0,0,0,0.5)] ring-1 ring-black/[0.06] lg:flex-1 lg:p-[40px]"
          >
            <div className="flex w-full items-center justify-between gap-[14px] border-b border-black/[0.08] pb-[20px]">
              <p className="font-display text-[21px] font-medium leading-none tracking-[-0.4px] text-black">
                Project brief
              </p>
              <p className="font-mono text-[10px] uppercase leading-none tracking-[0.18em] text-neutral-paragraph">
                3 min · async
              </p>
            </div>

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

            <fieldset className="mt-[26px] w-full border-0 p-0">
              <Legend>What do you need?</Legend>
              <div className="flex w-full flex-wrap gap-[8px]">
                {SERVICE_CHIPS.map((option, index) => (
                  <Chip
                    key={option}
                    name="service"
                    value={option}
                    id={`svc-${index}`}
                    required={index === 0}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-[28px] w-full border-0 p-0">
              <Legend>Rough budget</Legend>
              <div className="flex w-full flex-wrap gap-[8px]">
                {BUDGET_CHIPS.map((option, index) => (
                  <Chip
                    key={option}
                    name="budget"
                    value={option}
                    id={`bud-${index}`}
                    required={index === 0}
                  />
                ))}
              </div>
            </fieldset>

            <div className="mt-[30px] flex w-full flex-col items-start gap-[24px] sm:flex-row">
              <div className="flex w-full flex-1 flex-col gap-[8px]">
                <label
                  htmlFor="contact-name"
                  className="font-mono text-[11px] uppercase leading-none tracking-[0.18em] text-neutral-paragraph"
                >
                  Your name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Jane Rahman"
                  className={`${FIELD_BASE} border-black/15 focus:border-primary-green`}
                />
              </div>
              <div className="flex w-full flex-1 flex-col gap-[8px]">
                <label
                  htmlFor="contact-email"
                  className="font-mono text-[11px] uppercase leading-none tracking-[0.18em] text-neutral-paragraph"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  className={`${FIELD_BASE} border-black/15 focus:border-primary-green`}
                />
              </div>
            </div>

            <div className="mt-[24px] flex w-full flex-col gap-[8px]">
              <label
                htmlFor="contact-phone"
                className="font-mono text-[11px] uppercase leading-none tracking-[0.18em] text-neutral-paragraph"
              >
                Phone — optional
              </label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                placeholder="+880 …"
                className={`${FIELD_BASE} border-black/15 focus:border-primary-green`}
              />
            </div>

            <div className="mt-[24px] flex w-full flex-col gap-[8px]">
              <label
                htmlFor="contact-details"
                className="font-mono text-[11px] uppercase leading-none tracking-[0.18em] text-neutral-paragraph"
              >
                About the project
              </label>
              <textarea
                id="contact-details"
                name="message"
                required
                placeholder="What is not working, who it affects, and anything you have tried so far…"
                className="min-h-[124px] w-full resize-y border-b border-black/15 bg-transparent pt-[14px] font-display text-[15px] font-medium leading-[1.5] tracking-[-0.18px] text-black outline-none transition-colors placeholder:text-[#a2a2a2] focus:border-primary-green"
              />
            </div>

            <div className="mt-[26px]">
              <LeadFormExtras
                id="contact-page"
                tone="dark"
                files={files}
                addFiles={addFiles}
                removeFile={removeFile}
                setCaptchaToken={setCaptchaToken}
                turnstileRef={turnstileRef}
              />
            </div>

            <div className="mt-[28px] flex w-full flex-wrap items-center gap-x-[22px] gap-y-[14px] border-t border-black/[0.08] pt-[26px]">
              <button
                type="submit"
                disabled={status === "sending"}
                className="group flex items-center gap-[12px] rounded-[1000px] bg-black py-[15px] pl-[28px] pr-[18px] transition-[transform,opacity] duration-300 hover:-translate-y-[2px] disabled:translate-y-0 disabled:opacity-60"
              >
                <span className="font-body text-[15px] font-medium leading-none tracking-[0.01em] text-white">
                  {status === "sending" ? "Sending…" : "Send the brief"}
                </span>
                <span className="flex size-[26px] items-center justify-center rounded-full bg-primary-green text-white">
                  <svg width="12" height="12" viewBox="0 0 15 15" fill="none" aria-hidden>
                    <path
                      d="M3 7.5h8M7.6 4l3.5 3.5-3.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-300 group-hover:translate-x-[1.5px]"
                    />
                  </svg>
                </span>
              </button>

              <p className="font-body text-[13px] leading-[19px] tracking-[-0.1px] text-neutral-paragraph">
                No bots. No auto-reply. A person answers.
              </p>
            </div>

            {/* Only rendered once there is something to say, so the resting
                layout is exactly as drawn. */}
            <p
              role="status"
              aria-live="polite"
              hidden={status !== "sent" && status !== "error"}
              className={`mt-[18px] font-display text-[17px] font-medium leading-[1.3] tracking-[-0.18px] ${
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
