"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { trackScheduleClick } from "@/lib/analytics";
import { useLeadForm } from "@/components/forms/useLeadForm";
import LeadFormExtras from "@/components/forms/LeadFormExtras";
import BriefStatus from "@/components/sections/BriefStatus";
import { CLIENTS } from "@/lib/clients";
import { HEADLINE_SERVICES } from "@/lib/services";
import { siteConfig } from "@/lib/site";

/**
 * The v1 brief-form section: a sticky column of proof on the left, and the
 * form itself as a single black card on the right.
 *
 * Measurements are the concept's. The card is 28px-rounded on a wide soft
 * shadow; its header carries the sender and a green SLA pill over a hairline
 * rule; the service chips are pills and the budget chips are 12px blocks on a
 * fluid 92px grid, both filling green when chosen; every field is a filled
 * #161615 box with its label inside it and a borderless input under that; and
 * the submit is a green pill with a black disc pushed into its right end —
 * the inverse of the light card's button, which is the point of the dark one.
 *
 * The proof column is where ours diverges, because it has to. The concept
 * stacks a Clutch rating, a Dribbble award and a Behance feature. We are on
 * none of those platforms and have no ratings to show, so the same three card
 * shapes carry what is true instead: the figures the service pages quote, the
 * client marks we have permission for, and the live desk.
 */

/**
 * Seven headline services plus an escape hatch. The full list runs to fifteen,
 * which is a wall of chips — these are the seven the site leads with, and
 * anything else arrives through "Something else" and the brief itself.
 */
const SERVICE_CHIPS = [...HEADLINE_SERVICES.map((service) => service.title), "Something else"];

const BUDGET_CHIPS = ["Under $5K", "$5K–$10K", "$10K–$20K", "$20K–$50K", "$50K+"];

/**
 * A chip is a real radio input with the box visually hidden, not a button
 * writing to a hidden field. The group is then keyboard-navigable with the
 * arrow keys, it announces itself as a radio group, the value arrives in
 * FormData under the same key the select used — so nothing downstream changed
 * — and a form reset clears it with no state to keep in step.
 *
 * `shape` is the concept's own distinction: the service row is pills and the
 * budget row is soft rectangles on a fluid grid, which stops two rows of chips
 * reading as one undifferentiated mass.
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
        className={`flex cursor-pointer select-none items-center justify-center border border-white/15 text-center font-body leading-none text-white/85 transition-[background-color,border-color,color] duration-150 hover:border-white/40 hover:text-white peer-checked:border-primary-green peer-checked:bg-primary-green peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-green ${
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

/** A field is a filled box with its label inside it, not a label above a box. */
function Field({
  id,
  name,
  label,
  placeholder,
  type = "text",
  required,
  textarea,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className="flex w-full flex-col gap-[8px] rounded-[14px] border border-white/12 bg-[#161615] px-[16px] py-[14px] transition-colors focus-within:border-primary-green"
    >
      <span className="font-body text-[12px] leading-none tracking-[-0.1px] text-white/55">
        {label}
      </span>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={4}
          placeholder={placeholder}
          className="w-full resize-y border-0 bg-transparent p-0 font-body text-[16px] leading-[1.5] text-bg outline-none placeholder:text-white/30"
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className="w-full border-0 bg-transparent p-0 font-body text-[16px] leading-[1.3] text-bg outline-none placeholder:text-white/30"
        />
      )}
    </label>
  );
}

export default function ContactDetails() {
  const sectionRef = useRef<HTMLElement>(null);
  const { status, error, submit, files, addFiles, removeFile, setCaptchaToken, turnstileRef } =
    useLeadForm();

  useGSAP(
    () => {
      gsap.from(".cd-proof", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.1,
      });

      gsap.from(".cd-card", {
        y: 36,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-[1] w-full border-t border-black bg-bg"
      data-node-id="156:10877"
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-[clamp(40px,5vw,80px)] px-6 pb-[64px] pt-[56px] lg:px-[40px] lg:pb-[112px] lg:pt-[96px]">
        {/* Left: proof, sticky. */}
        <div className="flex flex-col gap-[12px] lg:sticky lg:top-[100px]">
          <div className="cd-proof flex flex-col gap-[40px] rounded-[28px] border border-black/12 bg-white p-[32px]">
            <div className="flex items-center justify-between gap-[12px]">
              <span className="font-mono text-[12px] uppercase leading-none tracking-[0.08em] text-neutral-paragraph">
                Delivered
              </span>
              <Link
                href="/case-study"
                aria-label="See the case studies"
                className="flex size-[40px] items-center justify-center rounded-full bg-black text-primary-green transition-colors hover:bg-[#1f1f1f]"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
                  <path
                    d="M3 12 12 3M4.6 3H12v7.4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>

            <div className="flex flex-col gap-[14px]">
              <div className="flex flex-wrap items-end gap-[16px]">
                <span className="font-display text-[clamp(72px,8vw,112px)] font-semibold leading-[0.85] tracking-[-0.06em] text-black">
                  28+
                </span>
                <span className="rounded-full bg-primary-green px-[12px] py-[6px] font-body text-[18px] leading-none tracking-[3px] text-white">
                  ★★★★★
                </span>
              </div>
              <span className="max-w-[360px] font-body text-[15px] leading-[1.5] tracking-[-0.1px] text-neutral-paragraph">
                Platforms, storefronts and internal systems delivered across eCommerce,
                health tech, fintech and logistics — with a 95% satisfaction rate measured
                on what shipped.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[12px]">
            <div className="cd-proof flex min-h-[180px] flex-col justify-between gap-[32px] rounded-[24px] bg-black p-[24px] text-bg">
              <span className="font-mono text-[12px] uppercase leading-none tracking-[0.08em] text-primary-green">
                Clients
              </span>
              <div className="flex flex-col gap-[14px]">
                <ul className="flex flex-wrap items-center gap-x-[18px] gap-y-[12px]">
                  {CLIENTS.map((client) => (
                    <li key={client.name}>
                      <Image
                        src={client.src}
                        alt={client.name}
                        width={client.width}
                        height={client.height}
                        sizes="161px"
                        className={`${client.rowClassName} w-auto brightness-0 invert`}
                      />
                    </li>
                  ))}
                </ul>
                <span className="font-body text-[13px] leading-[1.4] tracking-[-0.1px] text-white/55">
                  Marks shown with permission
                </span>
              </div>
            </div>

            <div className="cd-proof flex min-h-[180px] flex-col justify-between gap-[32px] rounded-[24px] bg-primary-green p-[24px] text-white">
              <span className="font-mono text-[12px] uppercase leading-none tracking-[0.08em]">
                Uptime
              </span>
              <span className="font-display text-[22px] font-semibold leading-[1.1] tracking-[-0.03em]">
                99.9% after migration, with monitoring and zero-downtime deploys built in
              </span>
            </div>
          </div>

          <div className="cd-proof">
            <BriefStatus />
          </div>
        </div>

        {/* Right: the form, one black card. */}
        <form
          id="brief"
          onSubmit={(event) => {
            event.preventDefault();
            void submit(event.currentTarget);
          }}
          className="cd-card flex w-full flex-col rounded-[28px] bg-black p-[22px] text-bg shadow-[0_40px_100px_rgba(10,10,10,0.18)] lg:p-[36px]"
        >
          <div className="flex flex-wrap items-center justify-between gap-[16px] border-b border-white/12 pb-[24px]">
            <div className="flex flex-col gap-[3px]">
              <span className="font-body text-[16px] font-semibold leading-none tracking-[-0.1px]">
                Project brief
              </span>
              <span className="font-body text-[13px] leading-none tracking-[-0.1px] text-white/55">
                Goes straight to an engineer
              </span>
            </div>
            <span className="rounded-full bg-primary-green px-[12px] py-[8px] font-mono text-[11px] uppercase leading-none tracking-[0.08em] text-white">
              Reply within 4 business hours
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

          <div className="flex flex-col gap-[28px] pt-[28px]">
            <fieldset className="flex w-full flex-col gap-[12px] border-0 p-0">
              <legend className="font-body text-[14px] font-medium leading-none tracking-[-0.1px] text-bg">
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
              <legend className="font-body text-[14px] font-medium leading-none tracking-[-0.1px] text-bg">
                Project budget *
              </legend>
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

            <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[12px]">
              <Field
                id="contact-name"
                name="name"
                label="Full name*"
                placeholder="Jane Rahman"
                required
              />
              <Field
                id="contact-email"
                name="email"
                type="email"
                label="Email address*"
                placeholder="jane@company.com"
                required
              />
            </div>

            <Field
              id="contact-phone"
              name="phone"
              type="tel"
              label="Phone — optional"
              placeholder="+880 …"
            />

            <Field
              id="contact-details"
              name="message"
              label="About project*"
              placeholder="Scope, timeline, links, and what you want to launch"
              required
              textarea
            />

            <LeadFormExtras
              id="contact-page"
              tone="light"
              files={files}
              addFiles={addFiles}
              removeFile={removeFile}
              setCaptchaToken={setCaptchaToken}
              turnstileRef={turnstileRef}
            />

            {/* Green pill with a black disc — the inverse of the light card's
                button, which is the whole point of putting it on black. */}
            <button
              type="submit"
              disabled={status === "sending"}
              className="group flex w-full items-center justify-between rounded-full bg-primary-green py-[8px] pl-[24px] pr-[8px] transition-opacity duration-300 hover:opacity-90 disabled:opacity-60"
            >
              <span className="font-body text-[16px] font-semibold leading-none tracking-[-0.1px] text-white">
                {status === "sending" ? "Sending…" : "Send the brief"}
              </span>
              <span className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-black text-primary-green">
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

            <p className="text-center font-body text-[14px] leading-[1.5] tracking-[-0.1px] text-white/55">
              Rather talk?{" "}
              <a
                href={siteConfig.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary-green"
              >
                WhatsApp {siteConfig.phoneDisplay}
              </a>{" "}
              ·{" "}
              <a
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackScheduleClick("contact_form_foot")}
                className="font-medium text-primary-green"
              >
                book a call
              </a>
            </p>

            {/* Only rendered once there is something to say, so the resting
                layout is exactly as drawn. */}
            <p
              role="status"
              aria-live="polite"
              hidden={status !== "sent" && status !== "error"}
              className={`text-center font-body text-[15px] font-medium leading-[1.4] tracking-[-0.1px] ${
                status === "error" ? "text-[#ff8f8f]" : "text-primary-green"
              }`}
            >
              {status === "sent"
                ? "Thanks — your brief is in. We reply within 4 business hours."
                : error}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
