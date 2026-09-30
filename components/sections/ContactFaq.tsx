"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";

/**
 * The concept's FAQ, to its own measurements: a two-column grid with the
 * heading sticky in the left column and a stack of bordered white cards on the
 * right, each opening on a 36px circular toggle that fills green and turns 45
 * degrees into a cross.
 *
 * The panel is animated by grid-template-rows rather than by height, so it can
 * open to its content's real size without anything being measured first, and
 * the copy inside settles with it instead of snapping into place.
 *
 * The questions are contact-specific — what happens if you send the form —
 * rather than the shared site FAQ, which answers what the company does.
 */

type Entry = { id: string; q: string; a: string };

const ENTRIES: Entry[] = [
  {
    id: "f1",
    q: "How fast do you actually reply?",
    a: "Within four business hours, always — and from a named person rather than an autoresponder. If the honest answer needs longer than that to write, you still get a reply inside four hours telling you when the real one is coming.",
  },
  {
    id: "f2",
    q: "Can you sign an NDA before I share details?",
    a: "Yes, and the same day you ask. Say so in the opening line and nothing sensitive needs to go into the form at all: send the shape of the problem, we send the NDA back, and the detail follows once it is signed.",
  },
  {
    id: "f3",
    q: "Do I need to know what I want first?",
    a: "No. Most of the useful briefs we get are a description of something that is not working, written by somebody who is not technical. If you already have a specification we will read it; if you have a paragraph and a deadline, that is enough to start.",
  },
  {
    id: "f4",
    q: "Does any of this cost money before I sign?",
    a: "Nothing before the contract. The call, the scope, the written estimate and the technical questions along the way are all free, and you can stop after any of them owing us nothing. There is no discovery fee and no deposit to get a number.",
  },
  {
    id: "f5",
    q: "What if we are not the right fit?",
    a: "We say so in the first reply, and point you at whoever would be better. It costs us a lead and saves you a month, and it is the reason the reply comes from an engineer rather than from somebody paid to close.",
  },
  {
    id: "f6",
    q: "Can you take over something half-built?",
    a: "Often, and it is a large part of what we do. It starts with an audit of the codebase, the infrastructure and the test coverage, and ends with a written plan of what to fix, what to refactor and what to rebuild — before anybody writes a new feature.",
  },
  {
    id: "f7",
    q: "Who owns the code at the end?",
    a: "You do, in full, including the repository history and the infrastructure definitions. Handover includes the documentation and the access, and nothing is held back as leverage for a support contract.",
  },
];

export default function ContactFaq() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openId, setOpenId] = useState<string>(ENTRIES[0].id);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 84%" });

      gsap.from(".fq-head", {
        y: 22,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      gsap.from(".fq-item", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.07,
        delay: 0.1,
        scrollTrigger: trigger,
      });
    },
    { scope: sectionRef },
  );

  // The grid row handles the height; this settles the copy inside it so an
  // opening answer arrives rather than appearing.
  useGSAP(
    () => {
      if (!openId || prefersReducedMotion()) return;

      const panel = sectionRef.current?.querySelector(`#fq-panel-${openId} p`);
      if (!panel) return;

      gsap.fromTo(
        panel,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "power2.out", delay: 0.1 },
      );
    },
    { scope: sectionRef, dependencies: [openId] },
  );

  return (
    <section
      ref={sectionRef}
      className="mx-auto grid w-full max-w-[1360px] grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] gap-x-[clamp(48px,6vw,96px)] gap-y-[48px] px-[clamp(20px,4vw,48px)] pb-[clamp(80px,9vw,128px)]"
    >
      <div className="fq-head flex flex-col gap-[20px] self-start lg:sticky lg:top-[100px]">
        <span className="flex items-center gap-[10px] font-mono text-[12px] uppercase leading-none tracking-[0.1em] text-black">
          <span aria-hidden className="h-[2px] w-[24px] shrink-0 bg-primary-green" />
          FAQ
        </span>
        <h2 className="font-display text-[clamp(40px,4.6vw,64px)] font-semibold leading-[0.98] tracking-[-0.05em] text-balance text-black">
          Before you{" "}
          <span className="font-serif font-normal italic tracking-[-0.02em]">
            send the brief
          </span>
        </h2>
      </div>

      <div className="flex flex-col gap-[10px]">
        {ENTRIES.map((entry) => {
          const open = entry.id === openId;

          return (
            <div
              key={entry.id}
              className="fq-item overflow-hidden rounded-[20px] border border-black/12 bg-white"
            >
              <h3 className="m-0">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? "" : entry.id)}
                  aria-expanded={open}
                  aria-controls={`fq-panel-${entry.id}`}
                  className="flex w-full cursor-pointer items-center justify-between gap-[20px] border-0 bg-transparent px-[24px] py-[22px] text-left"
                >
                  <span className="font-display text-[18px] font-semibold leading-[1.3] tracking-[-0.02em] text-black">
                    {entry.q}
                  </span>
                  <span
                    aria-hidden
                    className={`flex size-[36px] shrink-0 items-center justify-center rounded-full text-[20px] leading-none transition-[transform,background-color,color] duration-300 ${
                      open
                        ? "rotate-45 bg-primary-green text-black"
                        : "bg-black/[0.055] text-black"
                    }`}
                  >
                    +
                  </span>
                </button>
              </h3>

              {/* Rows rather than height: the panel opens to whatever the copy
                  actually needs, with nothing measured in advance. */}
              <div
                id={`fq-panel-${entry.id}`}
                className={`grid transition-[grid-template-rows] duration-400 ease-out ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="m-0 max-w-[680px] px-[24px] pb-[24px] font-body text-[16px] leading-[1.65] tracking-[-0.1px] text-pretty text-[#4a4a45]">
                    {entry.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
