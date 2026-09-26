"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import { trackScheduleClick } from "@/lib/analytics";
import { useLeadForm } from "@/components/forms/useLeadForm";
import LeadFormExtras from "@/components/forms/LeadFormExtras";
import WhatsAppMark from "@/components/ui/WhatsAppMark";
import { SERVICES as ALL_SERVICES } from "@/lib/services";
import { siteConfig } from "@/lib/site";

const SOCIALS = [
  { src: "/icons/contact-social-2.svg", label: "LinkedIn", href: siteConfig.social.linkedin },
  { src: "/icons/contact-social-4.svg", label: "Facebook", href: siteConfig.social.facebook },
];

/**
 * What the form actually buys you. A brief is a real piece of work to write, so
 * the column beside it says what happens to one rather than showing a stock
 * photograph of somebody else's desk.
 */
const AFTER_SEND = [
  {
    number: "01",
    title: "A person opens it",
    body: "Not a queue and not a bot. The engineer who would run the build is the one who reads the brief.",
  },
  {
    number: "02",
    title: "A scope comes back",
    body: "Written scope, fixed estimate, a timeline — and the two projects in our work closest to yours.",
  },
  {
    number: "03",
    title: "An honest answer",
    body: "Including “not us” when that is the answer, with a pointer to who would be a better fit.",
  },
];

const SERVICES = [...ALL_SERVICES.map((service) => service.title), "Something else"];

const BUDGETS = ["Under $5K", "$5K–$10K", "$10K–$20K", "$20K–$50K", "$50K+"];

const FIELD_BASE =
  "h-[52px] w-full border-b bg-transparent py-[16px] font-display text-[14px] font-medium leading-[1.2] tracking-[-0.18px] text-black outline-none placeholder:text-[#707070]";

function Label({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-[#111]"
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
      const trigger = reveal(sectionRef.current, { start: "top 88%" });
      const fields = sectionRef.current?.querySelector(".contact-fields") ?? null;

      gsap.from(".contact-aside", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: trigger,
      });

      gsap.from(".contact-form-heading", {
        y: 32,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: trigger,
      });

      gsap.from(".contact-field", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: reveal(fields, { start: "top 90%" }),
      });

      // The three steps draw in one after another, so the column reads as a
      // sequence rather than a block of three paragraphs.
      gsap.from(".contact-step", {
        x: -16,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.12,
        delay: 0.2,
        scrollTrigger: trigger,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-node-id="156:10877"
      className="w-full bg-bg pb-[80px] lg:pb-[174px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-[64px] px-6 lg:flex-row lg:gap-[95px] lg:px-[40px]">
        {/* Left: what the brief buys you, then the two ways round the form */}
        <div className="flex w-full flex-col gap-[24px] lg:w-[521px] lg:shrink-0">
          <div className="contact-aside flex w-full flex-col gap-[28px] border-[1.265px] border-[#e6e9dd] bg-white p-[28px]">
            <div className="flex w-full flex-col gap-[10px]">
              <p className="font-body text-[14px] font-medium uppercase leading-[1.2] tracking-[0.5px] text-primary-green">
                [ After you hit send ]
              </p>
              <p className="font-display text-[28px] font-medium leading-[1.15] tracking-[-0.75px] text-[#111]">
                Three steps, four business hours
              </p>
            </div>

            <ol className="flex w-full flex-col">
              {AFTER_SEND.map((step, index) => (
                <li
                  key={step.number}
                  className={`contact-step flex w-full gap-[18px] py-[20px] ${
                    index === 0 ? "pt-0" : "border-t border-[#e6e9dd]"
                  } ${index === AFTER_SEND.length - 1 ? "pb-0" : ""}`}
                >
                  <span className="mt-[2px] font-mono text-[13px] font-medium leading-[1.2] tracking-[0.5px] text-primary-green">
                    {step.number}
                  </span>
                  <div className="flex flex-col gap-[6px]">
                    <p className="font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-[#111]">
                      {step.title}
                    </p>
                    <p className="font-body text-[15px] leading-[23px] tracking-[-0.16px] text-[#646464]">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="contact-aside flex w-full flex-col gap-[16px] border-[1.265px] border-[#e6e9dd] p-[28px]">
            <p className="font-body text-[14px] font-medium uppercase leading-[1.2] tracking-[0.5px] text-[#707070]">
              Rather talk it through first?
            </p>

            <a
              href={siteConfig.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full items-center gap-[12px] border-b border-[#e6e9dd] pb-[16px] transition-colors hover:border-primary-green"
            >
              <WhatsAppMark className="size-[22px] shrink-0 text-[#111] transition-colors group-hover:text-primary-green" />
              <span className="font-display text-[20px] font-medium leading-[1.3] tracking-[-0.25px] text-[#111] transition-colors group-hover:text-primary-green">
                {siteConfig.phoneDisplay}
              </span>
              <span className="ml-auto font-body text-[13px] leading-[1.2] text-[#707070]">
                WhatsApp
              </span>
            </a>

            <a
              href={siteConfig.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackScheduleClick("contact_aside")}
              className="group flex w-full items-center gap-[12px]"
            >
              <span className="font-display text-[20px] font-medium leading-[1.3] tracking-[-0.25px] text-[#111] transition-colors group-hover:text-primary-green">
                Book a call directly
              </span>
              <span className="ml-auto font-body text-[13px] leading-[1.2] text-[#707070]">
                30 min
              </span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                aria-hidden="true"
                className="shrink-0 text-[#111] transition-transform duration-300 group-hover:translate-x-[3px] group-hover:text-primary-green"
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
          </div>

          <div className="contact-aside flex w-full items-start gap-[10px]">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex size-[50.583px] shrink-0 items-center justify-center border-[1.265px] border-[#e6e9dd] transition-colors hover:border-black"
              >
                <span className="relative size-[24.027px]">
                  <Image src={social.src} alt="" fill className="object-contain" />
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submit(event.currentTarget);
          }}
          className="flex w-full flex-col gap-[24px] lg:w-[824px]"
        >
          <h2 className="contact-form-heading w-full font-display text-[clamp(2.25rem,4.4vw,64px)] font-medium leading-[1.1] tracking-[-1.5px] text-[#111]">
            Tell us about your project
          </h2>

          {/* Honeypot — off-screen and hidden from assistive tech, so only a bot
              filling every field will put anything in it. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute left-[-9999px] size-0 opacity-0"
          />

          <div className="contact-fields mt-[36px] flex w-full flex-col gap-[24px]">
            <div className="contact-field flex w-full flex-col gap-[12px]">
              <Label htmlFor="contact-name">Name</Label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                placeholder="Enter full name"
                className={`${FIELD_BASE} border-primary-green`}
              />
            </div>

            <div className="contact-field flex w-full flex-col items-start justify-center gap-[24px] sm:flex-row">
              <div className="flex w-full flex-1 flex-col gap-[12px]">
                <Label htmlFor="contact-email">Email Address</Label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter email address..."
                  className={`${FIELD_BASE} border-black/10 focus:border-primary-green`}
                />
              </div>
              <div className="flex w-full flex-1 flex-col gap-[12px]">
                <Label htmlFor="contact-phone">PHONE NUMBER</Label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  className={`${FIELD_BASE} border-black/10 focus:border-primary-green`}
                />
              </div>
            </div>

            <div className="contact-field flex w-full flex-col items-start justify-center gap-[24px] sm:flex-row">
              <div className="flex w-full flex-1 flex-col gap-[12px]">
                <Label htmlFor="contact-service">SERVICE REQUIRED*</Label>
                <select
                  id="contact-service"
                  name="service"
                  required
                  defaultValue=""
                  className={`${FIELD_BASE} border-black/10 pl-[4px] pr-[16px] text-[#707070] focus:border-primary-green`}
                >
                  <option value="" disabled>
                    Select Your Service
                  </option>
                  {SERVICES.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex w-full flex-1 flex-col gap-[12px]">
                <Label htmlFor="contact-budget">PROJECT BUDGET*</Label>
                <select
                  id="contact-budget"
                  name="budget"
                  required
                  defaultValue=""
                  className={`${FIELD_BASE} border-black/10 pl-[4px] pr-[16px] text-[#707070] focus:border-primary-green`}
                >
                  <option value="" disabled>
                    Select Your Range
                  </option>
                  {BUDGETS.map((budget) => (
                    <option key={budget} value={budget}>
                      {budget}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="contact-field flex w-full flex-col gap-[12px]">
              <label
                htmlFor="contact-details"
                className="font-body text-[18px] font-medium uppercase leading-[18px] tracking-[-0.25px] text-[#111]"
              >
                Project details
              </label>
              <textarea
                id="contact-details"
                name="message"
                required
                placeholder="Example Text"
                className="min-h-[132px] w-full resize-y border-b border-black/10 bg-transparent pt-[16px] font-display text-[14px] font-medium leading-[1.2] tracking-[-0.18px] text-black outline-none placeholder:text-[#707070] focus:border-primary-green"
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

          <button
            type="submit"
            disabled={status === "sending"}
            className="contact-field flex w-fit items-center justify-center rounded-[1000px] bg-black px-[32px] py-[16px] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <span className="font-body text-[18px] font-medium uppercase leading-[27px] tracking-[-0.25px] text-white">
              {status === "sending" ? "Sending…" : "Send a message"}
            </span>
          </button>

          {/* Only rendered once there is something to say, so the resting
              layout is exactly as drawn. */}
          <p
            role="status"
            aria-live="polite"
            hidden={status !== "sent" && status !== "error"}
            className={`font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] ${
              status === "error" ? "text-[#c02626]" : "text-[#111]"
            }`}
          >
            {status === "sent"
              ? "Thanks — your brief is in. We reply within 4 business hours."
              : error}
          </p>
        </form>
      </div>
    </section>
  );
}
