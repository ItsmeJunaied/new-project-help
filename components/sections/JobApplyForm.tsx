"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { magnetic, reveal } from "@/lib/anim";
import { trackApplication } from "@/lib/analytics";

type Status = "idle" | "sending" | "sent" | "error";

const MAX_RESUME_BYTES = 4 * 1024 * 1024;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const FIELD_CLASS =
  "h-[52px] w-full border-b border-[#c9c9c9] bg-transparent font-body text-[16px] leading-[24px] tracking-[-0.16px] text-black outline-none transition-colors placeholder:text-ash-muted focus:border-black";

const LABEL_CLASS =
  "font-display text-[14px] font-medium uppercase leading-[1.2] tracking-[0.5px] text-[#707070]";

type JobApplyFormProps = {
  jobSlug: string;
  jobTitle: string;
};

/**
 * Application form for a single role. Posts to /api/careers/apply, which is the
 * same backend endpoint the live site's apply page uses, so applications land
 * in the existing admin alongside everything submitted before the swap.
 */
export default function JobApplyForm({ jobSlug, jobTitle }: JobApplyFormProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [resume, setResume] = useState<File | null>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 88%" });

      gsap.from(".apply-reveal", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.05,
        scrollTrigger: trigger,
      });

      return magnetic(buttonRef.current, 0.18);
    },
    { scope: sectionRef },
  );

  function handleResumeChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";

    if (!file) return;

    if (file.size > MAX_RESUME_BYTES) {
      setStatus("error");
      setError(`"${file.name}" is over 4 MB. Please attach a smaller file.`);
      return;
    }

    setStatus("idle");
    setError("");
    setResume(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: a real applicant never fills a field they cannot see.
    if (String(data.get("website") ?? "").trim()) {
      form.reset();
      setResume(null);
      setStatus("sent");
      return;
    }

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();

    if (!name || !email) {
      setStatus("error");
      setError("Please fill in your name and email.");
      return;
    }

    if (!resume) {
      setStatus("error");
      setError("Please attach your CV or resume.");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const dataUrl = await readAsDataUrl(resume);

      const response = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobSlug,
          jobTitle,
          name,
          email,
          phone: String(data.get("phone") ?? "").trim() || undefined,
          portfolioUrl: String(data.get("portfolioUrl") ?? "").trim() || undefined,
          coverLetter: String(data.get("coverLetter") ?? "").trim() || undefined,
          resume: {
            dataUrl,
            fileName: resume.name,
            fileType: resume.type,
            size: resume.size,
          },
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string | string[] } | null;
        const detail = Array.isArray(payload?.error) ? payload.error[0] : payload?.error;
        throw new Error(typeof detail === "string" && detail ? detail : "");
      }

      form.reset();
      setResume(null);
      setStatus("sent");
      trackApplication(jobSlug);
    } catch (cause) {
      setStatus("error");
      setError(
        cause instanceof Error && cause.message
          ? cause.message
          : "We couldn't send that. Please try again, or email hello@projecthelpbd.com.",
      );
    }
  }

  return (
    <section
      id="apply"
      ref={sectionRef}
      className="w-full scroll-mt-[100px] bg-[#f4f4f4] px-6 py-[80px] lg:px-0 lg:py-[120px]"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="flex w-full flex-col items-start gap-[48px] lg:flex-row lg:gap-[100px]">
          <div className="apply-reveal flex w-full flex-col gap-[16px] lg:w-[420px] lg:shrink-0">
            <p className="font-mono text-[14px] font-medium uppercase leading-[16px] tracking-[0.5px] text-primary-orange">
              [ Apply ]
            </p>
            <h2 className="font-display text-[clamp(2rem,3.4vw,48px)] font-medium leading-[1.1] tracking-[-1.5px] text-black">
              Apply for this role
            </h2>
            <p className="font-body text-[16px] leading-[24px] tracking-[-0.16px] text-ash-dark">
              One form, no account to create. We read every application and reply either
              way — usually within a week.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-[28px] lg:min-w-0 lg:flex-1">
            <div className="grid w-full gap-[28px] sm:grid-cols-2">
              <div className="apply-reveal flex flex-col gap-[8px]">
                <label className={LABEL_CLASS} htmlFor="apply-name">
                  Full name *
                </label>
                <input id="apply-name" name="name" required autoComplete="name" className={FIELD_CLASS} />
              </div>

              <div className="apply-reveal flex flex-col gap-[8px]">
                <label className={LABEL_CLASS} htmlFor="apply-email">
                  Email *
                </label>
                <input
                  id="apply-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={FIELD_CLASS}
                />
              </div>

              <div className="apply-reveal flex flex-col gap-[8px]">
                <label className={LABEL_CLASS} htmlFor="apply-phone">
                  Phone
                </label>
                <input id="apply-phone" name="phone" autoComplete="tel" className={FIELD_CLASS} />
              </div>

              <div className="apply-reveal flex flex-col gap-[8px]">
                <label className={LABEL_CLASS} htmlFor="apply-portfolio">
                  Portfolio or LinkedIn
                </label>
                <input id="apply-portfolio" name="portfolioUrl" inputMode="url" className={FIELD_CLASS} />
              </div>
            </div>

            <div className="apply-reveal flex flex-col gap-[8px]">
              <label className={LABEL_CLASS} htmlFor="apply-cover">
                Why this role?
              </label>
              <textarea
                id="apply-cover"
                name="coverLetter"
                rows={4}
                className="w-full resize-none border-b border-[#c9c9c9] bg-transparent py-[10px] font-body text-[16px] leading-[24px] tracking-[-0.16px] text-black outline-none transition-colors placeholder:text-ash-muted focus:border-black"
              />
            </div>

            <div className="apply-reveal flex flex-col gap-[12px]">
              <span className={LABEL_CLASS}>CV / Resume *</span>
              <label className="flex w-full cursor-pointer items-center justify-between gap-[16px] border border-dashed border-[#c9c9c9] px-[20px] py-[18px] transition-colors hover:border-black">
                <span className="font-body text-[15px] leading-[22px] tracking-[-0.16px] text-ash-dark">
                  {resume ? `${resume.name} · ${formatBytes(resume.size)}` : "PDF, DOC or DOCX — up to 4 MB"}
                </span>
                <span className="shrink-0 rounded-[100px] border border-black px-[16px] py-[8px] font-body text-[14px] font-medium leading-[20px] text-black">
                  {resume ? "Replace" : "Choose file"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf"
                  onChange={handleResumeChange}
                  className="sr-only"
                />
              </label>
            </div>

            {/* Honeypot — hidden from real applicants, irresistible to bots. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="pointer-events-none absolute size-px overflow-hidden opacity-0"
            />

            <div className="apply-reveal flex flex-col gap-[12px]">
              <button
                ref={buttonRef}
                type="submit"
                disabled={status === "sending"}
                className="flex h-[52px] w-full items-center justify-center rounded-[100px] border border-black bg-black px-[28px] font-body text-[16px] font-medium leading-[24px] tracking-[-0.25px] text-white transition-colors hover:bg-transparent hover:text-black disabled:opacity-60 sm:w-auto sm:self-start"
              >
                {status === "sending" ? "Sending…" : "Send application"}
              </button>

              <p
                aria-live="polite"
                className={`min-h-[20px] font-body text-[14px] leading-[20px] tracking-[-0.16px] ${
                  status === "error" ? "text-primary-orange" : "text-ash-dark"
                }`}
              >
                {status === "sent" && "Thanks — your application is in. We'll be in touch."}
                {status === "error" && error}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
