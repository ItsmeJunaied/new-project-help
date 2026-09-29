"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { trackScheduleClick } from "@/lib/analytics";
import { useLeadForm } from "@/components/forms/useLeadForm";
import LeadFormExtras from "@/components/forms/LeadFormExtras";
import BriefStatus from "@/components/sections/BriefStatus";
import { HEADLINE_SERVICES } from "@/lib/services";
import { siteConfig } from "@/lib/site";

/**
 * The top of the contact page, built to the supplied concept.
 *
 * The shape that makes it work, and the one an earlier pass here missed: the
 * brief is ONE black tray with a white card sitting inside it, not two columns
 * standing next to each other. The tray is 32px-rounded with 10px of padding,
 * so the white card floats 10px in on every side and the dark aside shares the
 * same body — which is why the block reads as a single object with two halves
 * rather than as a layout. It carries a wide, soft shadow for the same reason.
 *
 * Everything inside follows the concept's own measurements: pill chips for the
 * service, 12px-radius chips for the budget laid out on a fluid grid, filled
 * inputs on the page's own cream rather than underlines, and a submit that is
 * a black pill with a green disc pushed into its right end.
 *
 * Our palette throughout — the concept's #79C242, #0A0A0A and #F4F4EF map onto
 * the brand green, --color-black and --color-bg. The one thing brought over
 * untouched is Instrument Serif italic on the second half of the headline,
 * which is the accent the whole design turns on.
 */

/** The four things worth knowing before writing anything. */
const PROMISES = [
  "An engineer reads it — not a sales desk, not a bot",
  "A written reply inside four business hours",
  "A fixed number in the reply, never “starting from”",
  "An NDA signed the same day, before you share anything",
];

const DIRECT = [
  {
    label: "Book a free 30-min call",
    href: siteConfig.calendlyUrl,
    external: true,
    onClick: () => trackScheduleClick("contact_aside"),
  },
  {
    label: `WhatsApp · ${siteConfig.phoneDisplay}`,
    href: siteConfig.whatsappHref,
    external: true,
  },
  {
    label: siteConfig.email,
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

/** Filled, not underlined: the concept's fields sit on the page's own cream
 *  inside the white card, and darken their border on focus. */
const FIELD =
  "w-full rounded-[14px] border border-bg bg-bg px-[16px] py-[14px] font-body text-[16px] leading-[1.4] tracking-[-0.1px] text-black outline-none transition-colors placeholder:text-[#8f8f88] focus:border-black";

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-body text-[13px] font-medium leading-none tracking-[-0.1px] text-black"
    >
      {children}
    </label>
  );
}

/**
 * A chip is a real radio input with the box visually hidden, not a button
 * writing to a hidden field. The group is then keyboard-navigable with the
 * arrow keys, it announces itself as a radio group, the value arrives in
 * FormData under the same key the select used — so nothing downstream changed
 * — and a form reset clears it with no state to keep in step.
 *
 * `shape` is the concept's own distinction: the service row is pills and the
 * budget row is soft rectangles on a fluid grid, which stops two rows of
 * chips reading as one undifferentiated mass.
 */
function Chip({
  name,
  value,
  id,
  required,
  shape = "pill",
}: {
  name: string;
  value: string;
  id: string;
  /** Set on ONE radio per group — that makes the whole group required, which
   *  is what the `required` select this replaced used to do. */
  required?: boolean;
  shape?: "pill" | "block";
}) {
  return (
    <span className={shape === "pill" ? "inline-flex" : "flex"}>
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
        className={`flex cursor-pointer select-none items-center justify-center border border-black/12 text-center font-body leading-none text-ash-dark transition-[background-color,border-color,color] duration-150 hover:border-black/35 hover:text-black peer-checked:border-black peer-checked:bg-black peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-green ${
          shape === "pill"
            ? "rounded-full px-[16px] py-[10px] text-[14px]"
            : "w-full rounded-[12px] px-[6px] py-[12px] text-[14px]"
        }`}
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
      gsap.from(".cd-intro", {
        y: 20,
        opacity: 0,
        duration: 0.85,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.15,
      });

      gsap.from(".cd-title", {
        y: 26,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.1,
      });

      // The tray arrives as one object, because that is what it is.
      gsap.from(".cd-tray", {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.3,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-node-id="156:10877"
      className="w-full bg-bg px-6 pb-[72px] pt-[48px] lg:px-[40px] lg:pb-[120px] lg:pt-[80px]"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Headline left, the one-line explanation right, both sitting on the
            same baseline — the concept aligns this row to its bottom edge. */}
        <div className="grid w-full grid-cols-1 items-end gap-x-[64px] gap-y-[24px] pb-[36px] lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:pb-[56px]">
          <div className="flex flex-col items-start gap-[24px]">
            <span className="cd-intro inline-flex items-center gap-[10px] rounded-full border border-black/10 bg-white py-[8px] pl-[10px] pr-[14px]">
              <span className="size-[8px] shrink-0 rounded-full bg-primary-green shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-primary-green)_22%,transparent)]" />
              <span className="font-body text-[13px] font-medium leading-none tracking-[-0.1px] text-black">
                Reply within 4 business hours
              </span>
            </span>

            <h1 className="cd-title font-display text-[clamp(48px,6.4vw,96px)] font-semibold leading-[0.94] tracking-[-0.055em] text-balance text-black">
              Tell us what{" "}
              {/* The face is loaded italic-only, so it needs `italic` to be
                  asked for by name — `not-italic` would leave the browser
                  looking for an upright cut that was never shipped. */}
              <span className="font-serif font-normal italic tracking-[-0.02em]">
                you&rsquo;re building
              </span>
            </h1>
          </div>

          <p className="cd-intro max-w-[480px] font-body text-[18px] leading-[1.55] tracking-[-0.1px] text-pretty text-neutral-paragraph">
            An engineer reads every brief and replies within four business hours — with a
            written scope, a fixed number, and the two projects in our work closest to
            yours.
          </p>
        </div>

        {/* The tray. One black object, 10px of padding, and the white card
            floating inside it. */}
        <div
          id="brief"
          className="cd-tray grid w-full grid-cols-1 gap-[10px] rounded-[32px] bg-black p-[10px] shadow-[0_40px_100px_rgba(10,10,10,0.16)] lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]"
        >
          <aside className="flex flex-col justify-between gap-[40px] p-[20px] text-bg lg:p-[32px]">
            <div className="flex flex-col gap-[24px]">
              <span className="font-mono text-[12px] uppercase leading-none tracking-[0.08em] text-primary-green">
                Your brief goes to
              </span>

              {/* The concept puts a founder's portrait here. We have no team
                  photographs on file — lib/team.ts is empty on purpose — so
                  the slot carries the live desk instead, which is both true
                  and harder to fake than a headshot. */}
              <BriefStatus onDark />

              <ul className="flex flex-col gap-[12px]">
                {PROMISES.map((promise) => (
                  <li
                    key={promise}
                    className="flex items-start gap-[12px] font-body text-[14px] leading-[1.45] tracking-[-0.1px] text-white/80"
                  >
                    <span
                      aria-hidden
                      className="mt-[1px] flex size-[20px] shrink-0 items-center justify-center rounded-full bg-primary-green text-white"
                    >
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6.4 4.6 9 10 3.2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {promise}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col border-t border-white/12">
              <span className="pb-[4px] pt-[18px] font-mono text-[12px] uppercase leading-none tracking-[0.08em] text-white/55">
                Or reach us directly
              </span>

              {DIRECT.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={item.onClick}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center justify-between gap-[12px] border-b border-white/12 py-[14px] font-body text-[15px] font-medium leading-[1.3] tracking-[-0.1px] text-bg transition-colors hover:text-primary-green"
                >
                  {item.label}
                  <span aria-hidden className="shrink-0 text-primary-green">
                    <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
                      <path
                        d="M3 12 12 3M4.6 3H12v7.4"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </aside>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void submit(event.currentTarget);
            }}
            className="flex w-full flex-col gap-[28px] rounded-[24px] bg-white p-[22px] lg:p-[40px]"
          >
            <div className="flex w-full flex-wrap items-baseline justify-between gap-[12px] border-b border-black/[0.07] pb-[22px]">
              <span className="font-display text-[26px] font-semibold leading-none tracking-[-0.035em] text-black">
                Project brief
              </span>
              <span className="font-mono text-[12px] uppercase leading-none tracking-[0.08em] text-neutral-paragraph">
                3 min · async
              </span>
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

            <fieldset className="flex w-full flex-col gap-[12px] border-0 p-0">
              <legend className="font-body text-[13px] font-medium leading-none tracking-[-0.1px] text-black">
                I&rsquo;m interested in:*
              </legend>
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

            <fieldset className="flex w-full flex-col gap-[12px] border-0 p-0">
              <legend className="font-body text-[13px] font-medium leading-none tracking-[-0.1px] text-black">
                Project budget *
              </legend>
              {/* Fluid grid rather than a wrapped row, so five ranges share
                  the width evenly and reflow to two rows on a phone. */}
              <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(92px,1fr))] gap-[8px]">
                {BUDGET_CHIPS.map((option, index) => (
                  <Chip
                    key={option}
                    name="budget"
                    value={option}
                    id={`bud-${index}`}
                    required={index === 0}
                    shape="block"
                  />
                ))}
              </div>
            </fieldset>

            <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <FieldLabel htmlFor="contact-name">Full name*</FieldLabel>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Jane Rahman"
                  className={FIELD}
                />
              </div>
              <div className="flex flex-col gap-[8px]">
                <FieldLabel htmlFor="contact-email">Email address*</FieldLabel>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder="jane@company.com"
                  className={FIELD}
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-[8px]">
              <FieldLabel htmlFor="contact-phone">Phone — optional</FieldLabel>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                placeholder="+880 …"
                className={FIELD}
              />
            </div>

            <div className="flex w-full flex-col gap-[8px]">
              <FieldLabel htmlFor="contact-details">About project*</FieldLabel>
              <textarea
                id="contact-details"
                name="message"
                required
                rows={4}
                placeholder="Scope, timeline, links, and what you want to launch"
                className={`${FIELD} min-h-[124px] resize-y`}
              />
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

            <button
              type="submit"
              disabled={status === "sending"}
              className="group flex w-full items-center justify-between rounded-full bg-black py-[8px] pl-[26px] pr-[8px] transition-colors duration-300 hover:bg-[#1f1f1f] disabled:opacity-60"
            >
              <span className="font-body text-[16px] font-semibold leading-none tracking-[-0.1px] text-bg">
                {status === "sending" ? "Sending…" : "Send the brief"}
              </span>
              <span className="flex size-[46px] shrink-0 items-center justify-center rounded-full bg-primary-green text-white">
                <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden>
                  <path
                    d="M3.5 9h11M10 4.5 14.5 9 10 13.5"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:translate-x-[2px]"
                  />
                </svg>
              </span>
            </button>

            {/* Only rendered once there is something to say, so the resting
                layout is exactly as drawn. */}
            <p
              role="status"
              aria-live="polite"
              hidden={status !== "sent" && status !== "error"}
              className={`font-body text-[15px] font-medium leading-[1.4] tracking-[-0.1px] ${
                status === "error" ? "text-[#b42318]" : "text-black"
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
