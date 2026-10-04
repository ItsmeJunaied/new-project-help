"use client";

import { type ChangeEvent } from "react";

import { formatBytes, MAX_ATTACHMENTS } from "@/components/forms/useLeadForm";

type LeadFormExtrasProps = {
  files: File[];
  addFiles: (files: File[]) => void;
  removeFile: (index: number) => void;
  /** Light copy for the dark contact panel, dark for the pale one. */
  tone?: "light" | "dark";
  id: string;
};

/**
 * The part both contact forms need but neither design drew: file attachments,
 * which the live site accepts up to three of. Kept in one place so the two
 * forms cannot drift apart on it.
 */
export default function LeadFormExtras({
  files,
  addFiles,
  removeFile,
  tone = "dark",
  id,
}: LeadFormExtrasProps) {
  const muted = tone === "light" ? "text-[#a8a29e]" : "text-[#707070]";
  const body = tone === "light" ? "text-[#f7f7f7]" : "text-ash-dark";
  const border = tone === "light" ? "border-[#3f3f46]" : "border-[#c9c9c9]";
  const hoverBorder = tone === "light" ? "hover:border-white" : "hover:border-black";
  const chip = tone === "light" ? "border-[#3f3f46] text-[#f7f7f7]" : "border-[#c9c9c9] text-black";

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    addFiles(selected);
  }

  return (
    <div className="flex w-full flex-col gap-[16px]">
      <div className="flex w-full flex-col gap-[10px]">
        <label
          htmlFor={`${id}-attachments`}
          className={`inline-flex w-fit cursor-pointer items-center gap-[8px] border-b ${border} ${hoverBorder} pb-[4px] font-body text-[14px] leading-[20px] tracking-[-0.16px] ${muted} transition-colors`}
        >
          <span aria-hidden>+</span>
          Attach a brief or spec (up to {MAX_ATTACHMENTS} files, 4 MB each)
        </label>
        <input
          id={`${id}-attachments`}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.fig,.zip"
          onChange={handleChange}
          className="sr-only"
        />

        {files.length > 0 && (
          <ul className="flex w-full flex-wrap gap-[8px]">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className={`flex items-center gap-[8px] rounded-[100px] border px-[14px] py-[6px] font-body text-[13px] leading-[18px] ${chip}`}
              >
                <span className="max-w-[180px] truncate">{file.name}</span>
                <span className={muted}>{formatBytes(file.size)}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  aria-label={`Remove ${file.name}`}
                  className="transition-opacity hover:opacity-60"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className={`font-body text-[12px] leading-[18px] tracking-[-0.16px] ${body} opacity-70`}>
        We reply within one business day. Your details are never shared or sold.
      </p>
    </div>
  );
}
