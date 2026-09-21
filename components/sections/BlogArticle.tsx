"use client";

import Image from "next/image";
import { useRef } from "react";
import type { ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import ParallaxImage from "@/components/ui/ParallaxImage";
import RuleList from "@/components/ui/RuleList";
import ShareRow from "@/components/ui/ShareRow";
import { siteConfig } from "@/lib/site";

function Heading({ children }: { children: ReactNode }) {
  return (
    <h2 className="w-full font-display text-[32px] font-semibold leading-[46px] text-pure-black">
      {children}
    </h2>
  );
}

function Body({ children }: { children: ReactNode }) {
  return (
    <p className="w-full font-body text-[16px] leading-[24px] tracking-[-0.16px] text-ash-dark">
      {children}
    </p>
  );
}

export default function BlogArticle() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".article-title", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.15,
      });

      gsap.from(".article-aside", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        delay: 0.4,
      });

      gsap.from(".article-hero", {
        y: 48,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.3,
      });

      gsap.utils.toArray<HTMLElement>(".article-block").forEach((block) => {
        gsap.from(block, {
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: reveal(block, { start: "top 92%" }),
        });
      });

      gsap.from(".article-divider", {
        scaleY: 0,
        duration: 1.2,
        ease: "power2.inOut",
        transformOrigin: "top center",
        scrollTrigger: reveal(sectionRef.current?.querySelector(".article-columns") ?? null, { start: "top 82%" }),
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id="156:10148"
      className="w-full bg-bg pb-[80px] pt-[40px] lg:pb-[159px] lg:pt-[90px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-6 lg:px-0">
        <div className="flex w-full flex-col items-start gap-[40px] lg:flex-row lg:items-start lg:justify-between lg:gap-0">
          <h1 className="article-title font-display text-[clamp(2.5rem,4.7vw,68px)] font-medium leading-[1.1] tracking-[-1.5px] text-black lg:min-w-0 lg:max-w-[917px] lg:flex-1">
            How We Scope a SaaS MVP That Ships in 8&ndash;12 Weeks
          </h1>

          <RuleList
            title="{ BLOG  DETAILS }"
            body="How we turn a rough product idea into a signed scope, a fixed estimate, and working software inside a quarter"
            className="article-aside w-full lg:h-[150px] lg:w-auto"
            contentClassName="lg:w-[322px]"
          />
        </div>

        <div className="article-hero mt-[40px] w-full lg:mt-[70px]">
          <ParallaxImage
            src="/images/blog-detail-hero.jpg"
            alt="Engineers planning a delivery schedule on a whiteboard"
            sizes="(max-width: 1023px) 100vw, 1440px"
            className="relative h-[280px] w-full sm:h-[440px] lg:h-[679px]"
          />
        </div>

        <div className="article-columns relative mt-[56px] flex w-full flex-col gap-[56px] lg:mt-[67px] lg:flex-row lg:gap-0">
          {/* Sidebar */}
          <div className="flex w-full flex-col gap-[24px] lg:w-[546px] lg:shrink-0">
            <div className="article-block flex w-full flex-col gap-[18px]">
              <Heading>Introduction</Heading>
              <Body>
                Most MVPs miss their date for the same reason: the scope was agreed in a
                conversation rather than in writing. Here is the process we run before a
                line of code is written — what we ask, what we deliberately leave out, and
                why a fixed estimate is possible once the tenancy, billing and access model
                are settled up front.
              </Body>
            </div>

            <div className="article-block flex w-full flex-col">
              <span className="block h-px w-full bg-[#e7e7e7]" aria-hidden />
              <p className="flex h-[55px] items-center font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-primary-orange">
                Delivery
              </p>
              <span className="block h-px w-full bg-[#e7e7e7]" aria-hidden />
              <p className="flex h-[54px] items-center font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-black">
                June 1, 2026
              </p>
              <span className="block h-px w-full bg-[#e7e7e7]" aria-hidden />
              <div className="flex h-[58px] items-center gap-[12px]">
                <span className="flex size-[30px] shrink-0 items-center justify-center overflow-clip rounded-full bg-[#151515]">
                  <span className="font-display text-[11px] font-medium leading-none text-white">JH</span>
                </span>
                <span className="font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-black">
                  Junaied Hossain
                </span>
              </div>
              <span className="block h-px w-full bg-[#e7e7e7]" aria-hidden />

              <div className="mt-[16px] flex w-full flex-col items-start gap-6">
                <ShareRow
                  title="Share Article"
                  url={`${siteConfig.url}/blog/saas-mvp-scope`}
                  text="How We Scope a SaaS MVP That Ships in 8–12 Weeks"
                />
              </div>
            </div>
          </div>

          {/* Column rule */}
          <span
            aria-hidden
            className="article-divider hidden self-stretch bg-[#e7e7e7] lg:ml-[31px] lg:mr-[31px] lg:block lg:w-px"
          />

          {/* Article body */}
          {/* 546 sidebar + 62 rule gutters + 832 body is exactly the 1440
              canvas, so the body column flexes instead of being pinned to 832 —
              identical at 1440, and it absorbs the scrollbar below that. */}
          <div className="flex w-full min-w-0 flex-col gap-[18px] lg:max-w-[832px] lg:flex-1">
            <div className="article-block flex w-full flex-col gap-[18px]">
              <Heading>Start With the Deadline, Not the Feature List</Heading>
              <Body>
                The first question we ask is never &ldquo;what should it do?&rdquo; It is
                &ldquo;what has to be true on launch day, and who is waiting for it?&rdquo;
                A feature list expands to fill whatever time you give it. A deadline with a
                named audience forces the trade-offs into the open while they are still
                cheap to make.
                <br />
                From there we work backwards: the smallest set of capabilities that lets a
                real user complete a real task end to end, and everything else parked in a
                written &ldquo;not in v1&rdquo; list the client signs off on too.
              </Body>
            </div>

            <div className="article-block flex w-full flex-col gap-[18px] lg:pt-[11px]">
              <Heading>Settle the Expensive Decisions First</Heading>
              <Body>
                Tenancy, access control and billing are the three decisions you cannot
                cheaply reverse. How isolated is each customer&rsquo;s data? Who can see
                what, and who grants that? Does the plan gate features, seats, usage, or
                some combination? We answer those in week one, on paper, before any screen
                exists.
              </Body>
              <Body>
                Everything downstream gets easier once they are settled. Schema, API
                surface, admin tooling and the deployment pipeline all follow from those
                three answers — which is exactly why a fixed estimate is possible after
                discovery and dishonest before it.
              </Body>
            </div>

            <div className="article-block relative mt-[24px] h-[280px] w-full overflow-hidden sm:h-[380px] lg:mt-[46px] lg:h-[477px]">
              <Image
                src="/images/blog-detail-inline.jpg"
                alt="Sprint board showing two-week delivery cycles"
                fill
                sizes="(max-width: 1023px) 100vw, 832px"
                className="object-cover"
              />
            </div>

            <div className="article-block flex w-full flex-col gap-[18px] lg:mt-[58px]">
              <Heading>Ship in Two-Week Slices</Heading>
              <Body>
                Every fortnight something real lands on staging. Not a status deck, not a
                Figma walkthrough — software the client can click. That cadence is the
                whole point: it means a wrong assumption costs two weeks to correct instead
                of surfacing at the end, and it gives the client a genuine chance to
                redirect us while redirecting is still cheap.
              </Body>
            </div>

            <div className="article-block flex w-full flex-col gap-[18px] lg:mt-[47px]">
              <Heading>Say No Before Invoicing, Not After</Heading>
              <Body>
                If a feature is not worth what it costs, we say so during scoping rather
                than after the client has paid for it. That single habit is why the 8&ndash;12
                week number holds: the MVPs that slip are almost never slowed by
                engineering, they are slowed by a feature nobody was willing to cut.
              </Body>
            </div>

            <div className="article-block mt-[24px] flex w-full items-center justify-center bg-[#151515] px-[40px] py-[18px] lg:mt-[36px]">
              <p className="w-full font-body text-[16px] leading-[24px] tracking-[-0.16px] text-white lg:w-[792px]">
                &ldquo;An estimate you cannot defend is not an estimate, it is a wish. Do the
                architecture work first, then quote — and be willing to tell the client
                which half of their feature list is not worth building.&rdquo;
              </p>
            </div>

            <div className="article-block flex w-full flex-col gap-[18px] lg:mt-[46px]">
              <Heading>Conclusion</Heading>
              <Body>
                A quarter is enough time to put a real product in front of real users,
                provided the expensive decisions are made in week one and the scope is
                written down rather than remembered. Discovery, a signed scope, two-week
                slices, and an honest no where it is warranted &mdash; that is the whole
                method, and it is why we can put a date on it.
              </Body>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
