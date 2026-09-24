"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import { TEAM, type TeamMember } from "@/lib/team";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

function TeamCard({ member }: { member: TeamMember }) {
  const profiles = [
    member.links?.linkedin && { href: member.links.linkedin, src: "/icons/social-linkedin.svg", label: "LinkedIn" },
  ].filter(Boolean) as { href: string; src: string; label: string }[];

  return (
    <article className="team-card relative aspect-[460.84/478.8] w-full overflow-hidden bg-[#232323]">
      {member.photo ? (
        <Image
          src={member.photo}
          alt={`${member.name}, ${member.role}`}
          fill
          sizes="(max-width: 1023px) 100vw, 461px"
          className="object-cover grayscale"
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center font-display text-[96px] font-medium leading-none text-white/20">
          {initials(member.name)}
        </span>
      )}

      {/* The design clips this panel, so only the name row and socials show. */}
      <div className="absolute bottom-[23.16px] left-1/2 flex h-[79.052px] w-[calc(100%-36px)] max-w-[424.903px] -translate-x-1/2 items-center overflow-clip bg-black/10 backdrop-blur-[4.492px]">
        <div className="flex w-full items-center justify-between gap-4 pl-[17.9px] pr-[9px]">
          <div className="flex min-w-0 flex-col items-start">
            <p className="truncate font-display text-[21.56px] font-bold leading-[32.339px] text-[#f6f6f6]">
              {member.name}
            </p>
            <p className="truncate font-display text-[12.576px] font-medium leading-[17.966px] text-white/90">
              {member.role}
            </p>
          </div>

          {profiles.length > 0 && (
            <div className="flex shrink-0 items-center">
              {profiles.map((profile) => (
                <a
                  key={profile.label}
                  href={profile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on ${profile.label}`}
                  className="flex size-[48px] items-center justify-center transition-opacity hover:opacity-70"
                >
                  <span className="relative size-[24px]">
                    <Image src={profile.src} alt="" fill className="object-contain" />
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

/** Renders nothing until lib/team.ts carries real people — see the note there. */
export default function AboutTeam() {
  if (TEAM.length === 0) return null;
  return <AboutTeamGrid />;
}

function AboutTeamGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 78%" });

      gsap.from(".team-heading-inner", {
        yPercent: 110,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: trigger,
      });

      gsap.from(".team-meta", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      gsap.from(".team-divider", {
        scaleX: 0,
        duration: 1,
        ease: "power2.inOut",
        transformOrigin: "left center",
        scrollTrigger: trigger,
      });

      gsap.from(".team-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: reveal(document.querySelector(".team-grid"), { start: "top 88%" }),
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id="156:8711"
      className="w-full overflow-hidden bg-black py-[80px] lg:pb-[160.5px] lg:pt-[160px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-6 lg:px-[40px]">
        <div className="flex w-full flex-col items-start gap-6 lg:flex-row lg:gap-[755px]">
          <p className="team-meta shrink-0 font-body text-[18px] font-medium leading-[18px] tracking-[-0.25px] text-ash-muted">
            [ Team ]
          </p>
          <div className="w-full lg:max-w-[907.2px] lg:pr-[284.19px]">
            <h2 className="font-display text-[clamp(2.25rem,4.4vw,64px)] font-medium leading-[1] tracking-[-3px] text-white lg:whitespace-nowrap">
              <span className="block overflow-hidden">
                <span className="team-heading-inner block">The people behind</span>
              </span>
              <span className="block overflow-hidden">
                <span className="team-heading-inner block">Project Help</span>
              </span>
            </h2>
          </div>
        </div>

        <div className="team-divider mt-[40px] h-px w-full bg-[#313131]" />

        <div className="team-grid mt-[48px] grid w-full grid-cols-1 gap-x-[28.74px] gap-y-[44.92px] sm:grid-cols-2 lg:mt-[60px] lg:grid-cols-3">
          {TEAM.map((member) => (
            <TeamCard key={`${member.name}-${member.role}`} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
