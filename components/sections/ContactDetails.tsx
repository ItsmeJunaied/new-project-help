"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/anim";
import { trackScheduleClick } from "@/lib/analytics";
import { useLeadForm } from "@/components/forms/useLeadForm";
import LeadFormExtras from "@/components/forms/LeadFormExtras";
import { HEADLINE_SERVICES } from "@/lib/services";
import { TEAM } from "@/lib/team";
import { siteConfig } from "@/lib/site";

/**
 * The concept's brief tray, to its own measurements: one black tray at 32px
 * with 10px of padding, holding a dark aside and a white 24px card side by
 * side on a 5fr/8fr split above 1080px and stacked below it.
 *
 * The aside is the reassurance column — who reads the brief, what you get for
 * sending it, and the three direct routes under a hairline. The card is the
 * form: a header row, two chip groups, name and email side by side, the
 * project field, and a black pill with a green disc pushed into its right end.
 *
 * The fields are the ones the API actually accepts — see
 * components/forms/useLeadForm.ts. The concept's "I'm interested in" maps to
 * `service` and its budget row to `budget`; both are real radio groups rather
 * than buttons writing to hidden inputs, so they are keyboard-navigable,
 * announce themselves as groups, and clear on a form reset with no state to
 * keep in step. Attachments and the bot check are ours and the concept has no
 * equivalent, so they sit above the button, where they read as part of the
 * form rather than as furniture.
 */

/**
 * Seven headline services plus an escape hatch. The full list runs to fifteen,
 * which is a wall of chips — these are the seven the site leads with, and
 * anything else arrives through "Something else" and the brief itself.
 */
const SERVICE_CHIPS = [...HEADLINE_SERVICES.map((service) => service.title), "Something else"];

const BUDGET_CHIPS = ["Under $5K", "$5K–$10K", "$10K–$20K", "$20K–$50K", "$50K+"];

/**
 * What you get for sending one — the concept's four ticks, in our words.
 *
 * Split into a lead and a tail rather than held as one string. Four lines of
 * evenly-weighted grey is a block a visitor skims past; setting the claim
 * itself in white with a green rule under it and dropping the rest back to
 * muted gives each line one thing the eye lands on, and the four leads read as
 * a list of their own before any of the tails are read.
 */
type Promise = { lead: string; tail: string };

export const PROMISES: Promise[] = [
  { lead: "An engineer", tail: "reads every brief — never a sales desk" },
  { lead: "NDA signed", tail: "the same day you ask for one" },
  { lead: "A real number", tail: "in the reply, never “starting from”" },
  { lead: "No bots,", tail: "no auto-replies, no chatbots" },
];

/** The same four as plain lines, for the closing block's ribbon. */
export const PROMISE_LINES = PROMISES.map(({ lead, tail }) => `${lead} ${tail}`);

/**
 * Who the brief goes to — the first real person in lib/team.ts.
 *
 * Held there rather than written in here so the contact page and the About
 * page can never disagree about somebody's title. With the list empty this
 * still falls back to the desk and a monogram rather than to a stock portrait,
 * which is the rule that file sets out at length.
 */
const READER = TEAM[0];

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
  /** Set on ONE radio per group — that makes the whole group required. */
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
        className={`flex cursor-pointer select-none items-center justify-center border border-black/15 bg-white text-center font-body leading-none text-black transition-[background-color,border-color] duration-150 hover:border-black peer-checked:border-primary-green peer-checked:bg-primary-green peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-black ${
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

/**
 * The concept's field: a 13px label above a filled 14px box whose border is
 * the same colour as its fill until it takes focus, when it goes black.
 *
 * The concept fills the box with its page colour, which is a warm grey against
 * the white card. Ours is all but white, so the fill is a 4.5% wash of the ink
 * instead — the same relationship between card and field, in our palette.
 */
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
  const box =
    "w-full rounded-[14px] border border-transparent bg-black/[0.045] px-[16px] py-[14px] font-body text-[16px] text-black outline-none transition-colors placeholder:text-neutral-paragraph focus:border-black";

  return (
    <label htmlFor={id} className="flex w-full flex-col gap-[8px]">
      <span className="font-body text-[13px] font-medium leading-none tracking-[-0.1px] text-black">
        {label}
      </span>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={4}
          placeholder={placeholder}
          className={`${box} resize-y leading-[1.5]`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className={`${box} leading-[1.3]`}
        />
      )}
    </label>
  );
}

/** The three direct routes under the hairline in the aside. */
const DIRECT = [
  {
    label: "Book a free 30-min call",
    href: siteConfig.calendlyUrl,
    external: true,
    onClick: () => trackScheduleClick("contact_brief_aside"),
  },
  {
    label: `WhatsApp · ${siteConfig.phoneDisplay}`,
    href: siteConfig.whatsappHref,
    external: true,
  },
  { label: siteConfig.email, href: `mailto:${siteConfig.email}` },
];

export default function ContactDetails() {
  const sectionRef = useRef<HTMLElement>(null);
  const {
    status,
    error,
    submit,
    files,
    addFiles,
    removeFile,
    setCaptchaToken,
    turnstileRef,
  } = useLeadForm();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".cd-tray", {
        y: 36,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.3,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="mx-auto w-full max-w-[1360px] px-[clamp(20px,4vw,48px)] pb-[clamp(72px,8vw,120px)]"
    >
      <div
        id="brief"
        className="cd-tray grid w-full scroll-mt-[90px] grid-cols-1 gap-[10px] rounded-[32px] bg-black p-[10px] shadow-[0_40px_100px_rgba(10,10,10,0.16)] min-[1080px]:grid-cols-[minmax(0,5fr)_minmax(0,8fr)]"
      >
        {/* Left: who reads it, what you get, and the three direct routes. */}
        <aside className="flex flex-col justify-between gap-[32px] p-[clamp(20px,2.4vw,32px)] text-bg">
          <div className="flex flex-1 flex-col gap-[26px]">
            <span className="font-mono text-[12px] uppercase leading-none tracking-[0.08em] text-primary-green">
              Your brief goes to
            </span>

            <div className="flex items-center gap-[18px]">
              <div className="relative flex-none">
                {READER?.photo ? (
                  // Square, not a disc: the portrait is square and the crop a
                  // circle would take off its corners is the shoulders, which
                  // is most of what makes a headshot read as a person.
                  <Image
                    src={READER.photo}
                    alt={`${READER.name}, ${READER.role}`}
                    width={360}
                    height={360}
                    sizes="96px"
                    className="block size-[96px] rounded-[20px] bg-[#262624] object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="flex size-[96px] items-center justify-center rounded-[20px] bg-[#262624] font-display text-[30px] font-semibold tracking-[-0.03em] text-primary-green"
                  >
                    PH
                  </span>
                )}
                <span
                  aria-hidden
                  className="absolute -bottom-[3px] -right-[3px] size-[18px] rounded-full border-[3px] border-black bg-primary-green"
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <span className="font-display text-[26px] font-semibold leading-[1.1] tracking-[-0.03em]">
                  {READER?.name ?? "The engineering desk"}
                </span>
                <span className="font-body text-[15px] leading-[1.3] tracking-[-0.1px] text-white/60">
                  {READER?.role ?? "Read by the engineers who build"}
                </span>
              </div>
            </div>

            {/* Set larger than the concept's 14px and spaced wider. The aside
                is the shorter of the two columns and the tray stretches it to
                the form's height, so at the concept's size this list left a
                hole in the middle of a black panel. The type does the filling
                rather than a spacer, which also makes the four claims the
                loudest thing in the column. */}
            <ul className="m-0 flex flex-1 list-none flex-col justify-between gap-[20px] p-0">
              {PROMISES.map(({ lead, tail }) => (
                <li
                  key={lead}
                  className="flex items-start gap-[14px] font-body text-[17px] leading-[1.5] tracking-[-0.15px]"
                >
                  <span
                    aria-hidden
                    className="mt-[3px] flex size-[22px] flex-none items-center justify-center rounded-full bg-primary-green text-[12px] font-bold leading-none text-black"
                  >
                    ✓
                  </span>
                  <span className="text-pretty text-white/55">
                    <strong className="font-semibold text-bg underline decoration-primary-green decoration-[2px] underline-offset-[4px]">
                      {lead}
                    </strong>{" "}
                    {tail}
                  </span>
                </li>
              ))}
            </ul>

          </div>

          <div className="flex flex-col border-t border-white/12">
            {/* The office first, then the three routes — one block, so the foot
                of the column is a single list instead of two competing ones. */}
            <a
              href={siteConfig.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-[12px] py-[18px] transition-colors hover:text-primary-green"
            >
              <span aria-hidden className="mt-[2px] shrink-0 text-primary-green">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 14.5s5-4.2 5-8a5 5 0 1 0-10 0c0 3.8 5 8 5 8Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <circle cx="8" cy="6.4" r="1.8" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </span>
              <span className="font-body text-[14px] leading-[1.45] tracking-[-0.1px] text-white/70 transition-colors group-hover:text-primary-green">
                {siteConfig.addressLine}
              </span>
            </a>

            <span className="border-t border-white/12 pb-[4px] pt-[18px] font-mono text-[12px] uppercase leading-none tracking-[0.08em] text-white/60">
              Or reach us directly
            </span>
            {DIRECT.map((route) => (
              <a
                key={route.label}
                href={route.href}
                onClick={route.onClick}
                {...(route.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center justify-between gap-[12px] break-all border-b border-white/12 py-[16px] font-body text-[16px] font-medium leading-[1.3] tracking-[-0.1px] text-bg transition-colors hover:text-primary-green"
              >
                {route.label}
                <span aria-hidden className="shrink-0 text-primary-green">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </aside>

        {/* Right: the form on a white card. */}
        <div className="rounded-[24px] bg-white p-[clamp(22px,3vw,40px)]">
          {status === "sent" ? (
            <div className="flex flex-col items-start gap-[20px] px-[4px] pb-[40px] pt-[64px]">
              <span
                aria-hidden
                className="flex size-[60px] items-center justify-center rounded-full bg-primary-green font-display text-[26px] font-semibold text-black"
              >
                ✓
              </span>
              <p className="m-0 font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.04em] text-balance text-black">
                Thank you — your brief has been received.
              </p>
              <p className="m-0 font-body text-[15px] leading-[1.5] text-neutral-paragraph">
                An engineer replies within four business hours. For a faster answer,{" "}
                <a
                  href={siteConfig.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b-2 border-primary-green font-semibold text-black"
                >
                  WhatsApp {siteConfig.phoneDisplay}
                </a>
                .
              </p>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void submit(event.currentTarget);
              }}
              className="flex flex-col gap-[28px]"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-[12px] border-b border-black/10 pb-[22px]">
                <span className="font-display text-[26px] font-semibold leading-[1.1] tracking-[-0.035em] text-black">
                  Project brief
                </span>
                <span className="font-mono text-[12px] uppercase leading-none tracking-[0.08em] text-neutral-paragraph">
                  3 min · async
                </span>
              </div>

              {/* Honeypot — off-screen and hidden from assistive tech, so only
                  a bot filling every field puts anything in it. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute left-[-9999px] size-0 opacity-0"
              />

              <fieldset className="m-0 flex w-full flex-col gap-[12px] border-0 p-0">
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

              <fieldset className="m-0 flex w-full flex-col gap-[12px] border-0 p-0">
                <legend className="font-body text-[13px] font-medium leading-none tracking-[-0.1px] text-black">
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

              <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[16px]">
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
                id="contact-details"
                name="message"
                label="About project*"
                placeholder="Scope, timeline, links, and what you want to launch"
                required
                textarea
              />

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
                className="group flex w-full items-center justify-between rounded-full border-0 bg-black py-[8px] pl-[26px] pr-[8px] transition-colors duration-300 hover:bg-[#1f1f1f] disabled:opacity-60"
              >
                <span className="font-body text-[16px] font-semibold leading-none tracking-[-0.1px] text-bg">
                  {status === "sending" ? "Sending…" : "Send the brief"}
                </span>
                <span className="flex size-[46px] shrink-0 items-center justify-center rounded-full bg-primary-green text-black">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
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
                hidden={status !== "error"}
                className="m-0 font-body text-[14px] font-medium leading-[1.45] tracking-[-0.1px] text-[#b42318]"
              >
                {error}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
