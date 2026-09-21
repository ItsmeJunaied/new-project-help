"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import { coverImage, formatPostDate, postHref, type BlogPost } from "@/lib/blog";

/**
 * The design lays four tiles on the 1440 canvas at fixed coordinates — wide and
 * narrow alternating, staggered down the page. Posts come from the API now, so
 * that block repeats every four tiles instead of being a one-off; each group is
 * its own positioned container, which keeps the drawn layout exact and lets the
 * page grow to any number of posts.
 */
const SLOTS = [
  { placement: "lg:left-0 lg:top-0 lg:w-[832px]", image: "h-[260px] sm:h-[420px] lg:h-[560px]", sizes: "(max-width: 1023px) 100vw, 832px" },
  { placement: "lg:left-[852px] lg:top-0 lg:w-[588px]", image: "h-[300px] sm:h-[520px] lg:h-[741px]", sizes: "(max-width: 1023px) 100vw, 588px" },
  { placement: "lg:left-0 lg:top-[765px] lg:w-[588px]", image: "h-[300px] sm:h-[520px] lg:h-[741px]", sizes: "(max-width: 1023px) 100vw, 588px" },
  { placement: "lg:left-[608px] lg:top-[913px] lg:w-[832px]", image: "h-[260px] sm:h-[420px] lg:h-[560px]", sizes: "(max-width: 1023px) 100vw, 832px" },
];

/**
 * Height a group needs, by how many tiles it holds. Absolutely positioned
 * children contribute nothing to their parent's height, so the last group —
 * which is usually partial — has to be told how tall it is or the section
 * collapses behind the footer.
 */
const GROUP_HEIGHTS = ["0px", "680px", "861px", "1626.36px", "1626.36px"];

function groupPosts(posts: BlogPost[]) {
  const groups: BlogPost[][] = [];
  for (let i = 0; i < posts.length; i += SLOTS.length) {
    groups.push(posts.slice(i, i + SLOTS.length));
  }
  return groups;
}

type BlogGridProps = {
  posts: BlogPost[];
};

export default function BlogGrid({ posts }: BlogGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const groups = useMemo(() => groupPosts(posts), [posts]);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".blog-tile").forEach((tile) => {
        const trigger = reveal(tile, { start: "top 90%" });

        gsap.from(tile.querySelector(".blog-tile-frame"), {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: trigger,
        });

        gsap.from(tile.querySelector(".blog-tile-body"), {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.18,
          scrollTrigger: trigger,
        });

        if (prefersReducedMotion()) return;

        gsap.fromTo(
          tile.querySelector("img"),
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: tile,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    },
    { scope: sectionRef, dependencies: [posts.length], revertOnUpdate: true },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id="156:9952"
      className="w-full overflow-x-clip bg-bg pb-[80px] lg:pb-[147px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-0">
        {posts.length === 0 ? (
          <p className="py-[80px] text-center font-body text-[16px] leading-[24px] text-[#707070]">
            No articles published yet — check back soon.
          </p>
        ) : (
          <div className="flex flex-col gap-[48px] lg:gap-[100px]">
            {groups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="relative flex w-full flex-col gap-[48px] lg:block"
                style={{ ["--group-h" as string]: GROUP_HEIGHTS[group.length] }}
              >
                {/* The custom property carries the group's own height so each
                    one can be a different size without a class per variant. */}
                <span aria-hidden className="hidden lg:block lg:h-[var(--group-h)]" />

                {group.map((post, index) => {
                  const slot = SLOTS[index];
                  return (
                    <article key={post.slug} className={`blog-tile group w-full lg:absolute ${slot.placement}`}>
                      <Link href={postHref(post)} className="flex w-full flex-col items-start gap-[24px]">
                        <div className={`blog-tile-frame relative w-full overflow-clip ${slot.image}`}>
                          <Image
                            src={coverImage(post)}
                            alt={post.title}
                            fill
                            sizes={slot.sizes}
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        </div>

                        <div className="blog-tile-body flex w-full flex-col items-start gap-[16px]">
                          <h2 className="line-clamp-2 w-full font-display text-[24px] font-medium leading-[31.2px] tracking-[-0.75px] text-[#111]">
                            {post.title}
                          </h2>
                          <div className="flex w-full flex-wrap items-center gap-[8px]">
                            <span className="size-[8px] min-h-[8px] min-w-[8px] shrink-0 bg-[#dc7936]" />
                            <time
                              dateTime={post.publishedAt}
                              className="font-body text-[16px] leading-[16px] tracking-[-0.25px] text-[#707070]"
                            >
                              {formatPostDate(post.publishedAt)}
                            </time>
                            <span className="size-[4px] shrink-0 rounded-[1000px] bg-ash-muted" />
                            <span className="font-body text-[16px] leading-[16px] tracking-[-0.25px] text-[#707070]">
                              {post.readingTime}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
