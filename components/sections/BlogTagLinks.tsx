import Link from "next/link";

import { tagSlug } from "@/lib/blog";

/**
 * Topic navigation for the blog index.
 *
 * These were filter buttons that hid cards in the browser. That is fine for a
 * reader and worthless for search — there was no URL for "everything on
 * DevOps", so nothing to rank and nothing to link to. Each topic is now a real
 * page, and this is a plain server-rendered list of links to them.
 */
export default function BlogTagLinks({
  tags,
  activeTag,
}: {
  tags: string[];
  activeTag?: string;
}) {
  if (tags.length === 0) return null;

  return (
    <nav
      aria-label="Article topics"
      className="mx-auto w-full max-w-[1440px] px-6 pb-[48px] lg:px-[40px] lg:pb-[64px]"
    >
      <ul className="flex flex-wrap items-center gap-[10px]">
        <li>
          <Link
            href="/blog"
            aria-current={activeTag ? undefined : "page"}
            className={`inline-flex rounded-[100px] border px-[16px] py-[8px] font-body text-[14px] leading-[20px] tracking-[-0.16px] transition-colors ${
              activeTag
                ? "border-[#e7e7e7] text-[#707070] hover:border-black hover:text-black"
                : "border-black bg-black text-white"
            }`}
          >
            All
          </Link>
        </li>
        {tags.map((tag) => (
          <li key={tag}>
            <Link
              href={`/blog/tag/${tagSlug(tag)}`}
              aria-current={tag === activeTag ? "page" : undefined}
              className={`inline-flex rounded-[100px] border px-[16px] py-[8px] font-body text-[14px] leading-[20px] tracking-[-0.16px] transition-colors ${
                tag === activeTag
                  ? "border-black bg-black text-white"
                  : "border-[#e7e7e7] text-[#707070] hover:border-black hover:text-black"
              }`}
            >
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
