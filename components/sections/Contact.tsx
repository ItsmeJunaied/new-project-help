"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { magnetic, reveal } from "@/lib/anim";
import { useLeadForm } from "@/components/forms/useLeadForm";
import LeadFormExtras from "@/components/forms/LeadFormExtras";

/** Same service list the contact page offers. */
const SERVICES = [
  "SaaS Platform Development",
  "eCommerce & Digital Commerce",
  "DevOps & Cloud Infrastructure",
  "AI/ML & Data Analytics",
  "Mobile App Development",
];

const BUDGETS = ["Under $5K", "$5K–$10K", "$10K–$20K", "$20K–$50K", "$50K+"];

const DETAIL_LINES = [
  "Skip the call. Drop a one-pager — what the system has to do, the",
  "metric you'd move, the deadline. Within 4 business hours we send",
  "back a written scope, a fixed estimate, and the two projects",
  "closest to the problem you're describing.",
];

const LABEL =
  "w-full font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-black";

const FIELD =
  "h-[38px] w-full min-h-[33px] border-b border-[#c8c8c8] bg-transparent pb-[12.5px] pt-[3.5px] font-body text-[16px] leading-[24px] tracking-[-0.16px] text-black outline-none placeholder:text-[#a8a29e] focus:border-black";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const { status, error, submit, files, addFiles, removeFile, setCaptchaToken, turnstileRef } =
    useLeadForm();

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 78%" });

      gsap.from(".contact-heading-inner", {
        yPercent: 110,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: trigger,
      });

      gsap.from(".contact-reveal", {
        y: 26,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: trigger,
      });

      const card = sectionRef.current?.querySelector(".contact-form-card") ?? null;
      const cardTrigger = reveal(card, { start: "top 88%" });

      gsap.from(".contact-form-card", {
        y: 72,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: cardTrigger,
      });

      // The rows draw themselves in one at a time, so the form assembles
      // instead of arriving as one flat panel.
      gsap.from(".contact-field", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.09,
        delay: 0.3,
        scrollTrigger: cardTrigger,
      });

      gsap.from(".contact-submit", {
        y: 18,
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: "back.out(1.7)",
        delay: 0.7,
        scrollTrigger: cardTrigger,
      });

      // The orange plate keeps a slow breathing scale, so the left column has
      // something moving even once its text has settled.
      gsap.to(".contact-plate", {
        scaleY: 1.06,
        transformOrigin: "top center",
        duration: 2.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      return magnetic(submitRef.current, 0.22);
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-node-id="156:7579"
      className="w-full bg-black px-6 py-[80px] lg:px-[40px] lg:py-[120px]"
    >
      <div className="mx-auto flex w-full max-w-[1372px] flex-col items-start justify-between gap-[64px] lg:flex-row lg:items-stretch lg:gap-0">
        <div className="flex w-full flex-col items-start justify-between gap-[64px] lg:w-[554px] lg:max-w-[554px]">
          <div className="flex w-full flex-col items-start gap-[12px] lg:w-[699px]">
            <p className="contact-reveal font-body text-[18px] font-medium leading-[18px] tracking-[-0.25px] text-primary-green">
              [ Project Brief ]
            </p>

            <h2 className="w-full font-display text-[clamp(2.25rem,4.4vw,64px)] font-medium leading-[1.1] tracking-[-1.5px] text-[#f7f7f7] lg:w-[681px] lg:pr-[17.52px]">
              <span className="block overflow-hidden">
                <span className="contact-heading-inner block">
                  Bring us the brief<span className="text-primary-green">,</span> we
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="contact-heading-inner block">bring back the scope</span>
              </span>
            </h2>

            <p className="contact-reveal font-display text-[20px] leading-[1.3] tracking-[-0.25px] text-[#c8c8c8]">
              {DETAIL_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>

          <div className="contact-reveal flex w-full flex-col items-start gap-[12px]">
            <div className="flex w-[144px] max-w-[144px] flex-col items-start justify-center bg-primary-green">
              <div className="contact-plate h-[144px] w-full" />
            </div>
            <div className="flex w-full flex-col items-start gap-[6px]">
              <p className="w-full font-body text-[24px] font-medium leading-[24px] tracking-[0.24px] text-[#f7f7f7]">
                Junaied Hossain
              </p>
              <p className="w-full font-body text-[16px] font-medium leading-[24px] tracking-[-0.64px] text-[#c4c4c4]">
                CEO &amp; Founder
              </p>
            </div>
            <div className="flex w-full items-center gap-[8px]">
              <span className="size-[8px] shrink-0 bg-primary-green" />
              <span className="font-display text-[14px] font-medium leading-[1.2] tracking-[-0.18px] text-[#c8c8c8]">
                REPLY WITHIN 4 BUSINESS HOURS
              </span>
            </div>
          </div>
        </div>

        {/* Same field set as the contact page, drawn in this section's card.
            min-h rather than h so the card keeps its drawn height without
            clipping once a validation or success line appears. */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submit(event.currentTarget);
          }}
          className="contact-form-card flex w-full flex-col items-center justify-center bg-[#f7f7f7] px-[24px] py-[40px] shadow-[6px_-4px_80px_0px_rgba(167,167,167,0.03),0px_6px_111.8px_0px_rgba(0,0,0,0.1)] sm:px-[32px] lg:min-h-[710px] lg:w-[594px] lg:min-w-0 lg:max-w-[594px] lg:flex-1 lg:py-[66px]"
        >
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

          <div className="flex w-full flex-col items-start gap-[48px]">
            <div className="flex w-full flex-col items-start gap-[34px]">
              <div className="contact-field flex w-full flex-col items-start gap-[12px]">
                <label htmlFor="home-contact-name" className={LABEL}>
                  Full name*
                </label>
                <input
                  id="home-contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Jon Stark"
                  className={FIELD}
                />
              </div>

              <div className="flex w-full flex-col items-start justify-center gap-[34px] sm:flex-row sm:gap-[16px]">
                <div className="contact-field flex w-full flex-1 flex-col items-start gap-[12px]">
                  <label htmlFor="home-contact-email" className={LABEL}>
                    Email Address*
                  </label>
                  <input
                    id="home-contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="example@domain.com"
                    className={FIELD}
                  />
                </div>

                <div className="contact-field flex w-full flex-1 flex-col items-start gap-[12px]">
                  <label htmlFor="home-contact-phone" className={LABEL}>
                    Phone number
                  </label>
                  <input
                    id="home-contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+880 1XXXXXXXXX"
                    className={FIELD}
                  />
                </div>
              </div>

              <div className="flex w-full flex-col items-start justify-center gap-[34px] sm:flex-row sm:gap-[16px]">
                <div className="contact-field flex w-full flex-1 flex-col items-start gap-[12px]">
                  <label htmlFor="home-contact-service" className={LABEL}>
                    Service required*
                  </label>
                  <select
                    id="home-contact-service"
                    name="service"
                    required
                    defaultValue=""
                    className={`${FIELD} pr-[16px]`}
                  >
                    <option value="" disabled>
                      Select your service
                    </option>
                    {SERVICES.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="contact-field flex w-full flex-1 flex-col items-start gap-[12px]">
                  <label htmlFor="home-contact-budget" className={LABEL}>
                    Project budget*
                  </label>
                  <select
                    id="home-contact-budget"
                    name="budget"
                    required
                    defaultValue=""
                    className={`${FIELD} pr-[16px]`}
                  >
                    <option value="" disabled>
                      Select your range
                    </option>
                    {BUDGETS.map((budget) => (
                      <option key={budget} value={budget}>
                        {budget}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="contact-field flex w-full flex-col items-start gap-[11.99px]">
                <label htmlFor="home-contact-message" className={LABEL}>
                  Project details*
                </label>
                <textarea
                  id="home-contact-message"
                  name="message"
                  required
                  rows={2}
                  placeholder="What the system has to do, and by when"
                  className="min-h-[60px] w-full resize-y border-b border-[#c8c8c8] bg-transparent pb-[35px] font-body text-[16px] leading-[24px] tracking-[-0.16px] text-black outline-none placeholder:text-[#a8a29e] focus:border-black"
                />
              </div>
            </div>

            <LeadFormExtras
              id="home-contact"
              tone="dark"
              files={files}
              addFiles={addFiles}
              removeFile={removeFile}
              setCaptchaToken={setCaptchaToken}
              turnstileRef={turnstileRef}
            />

            <div className="flex w-full flex-col items-start gap-[16px]">
              <button
                ref={submitRef}
                type="submit"
                disabled={status === "sending"}
                className="contact-submit flex items-center justify-center gap-[8px] rounded-[1000px] bg-primary-green px-[32px] py-[16px] transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                <span className="font-body text-[18px] font-medium leading-[27px] tracking-[-0.25px] text-white">
                  {status === "sending" ? "Sending…" : "Send the brief"}
                </span>
                <span className="relative size-[22px] shrink-0">
                  <Image
                    src="/icons/icon-button-plus-on-light.svg"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </span>
              </button>

              {/* Only rendered once there is something to say, so the resting
                  card is exactly as drawn. */}
              <p
                role="status"
                aria-live="polite"
                hidden={status !== "sent" && status !== "error"}
                className={`font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] ${
                  status === "error" ? "text-[#c02626]" : "text-black"
                }`}
              >
                {status === "sent"
                  ? "Thanks — your brief is in. We reply within 4 business hours."
                  : error}
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
