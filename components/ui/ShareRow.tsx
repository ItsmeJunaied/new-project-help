"use client";

import Image from "next/image";
import { useState } from "react";

type ShareRowProps = {
  title: string;
  /** Absolute URL of the page being shared. */
  url: string;
  /** Headline the network pre-fills, where it supports one. */
  text: string;
};

/**
 * Real share targets. The designed article shipped these as `href="#"`, which
 * looks the same and does nothing — and a dead outbound link on every article
 * is a crawl signal we would rather not send.
 */
export default function ShareRow({ title, url, text }: ShareRowProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  const links = [
    {
      label: "LinkedIn",
      icon: "/icons/share-linkedin.svg",
      className: "bg-[#0a66c2] p-[8px]",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "Facebook",
      icon: "/icons/share-facebook.svg",
      className: "bg-[#1877f2] pl-[14px] pr-[13px] py-[10px]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "X",
      icon: "/icons/share-x.svg",
      className: "bg-[#090909] p-[10px]",
      href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is permission-gated and blocked in some browsers; the share
      // buttons beside it still work, so this stays silent.
    }
  }

  return (
    <div className="flex w-full flex-col gap-[10px]">
      <p className="w-full font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-black">
        {title}
      </p>
      <div className="flex h-[36px] w-full items-center gap-[8px]">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.label}`}
            className={`flex size-[36px] shrink-0 items-center justify-center rounded-[1000px] transition-opacity hover:opacity-80 ${link.className}`}
          >
            <span className="relative size-[16px]">
              <Image src={link.icon} alt="" fill className="object-contain" />
            </span>
          </a>
        ))}

        <button
          type="button"
          onClick={copyLink}
          className="ml-[4px] rounded-[100px] border border-[#e7e7e7] px-[14px] py-[8px] font-body text-[14px] leading-[20px] tracking-[-0.16px] text-[#707070] transition-colors hover:border-black hover:text-black"
        >
          {copied ? "Link copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
