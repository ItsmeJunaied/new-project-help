import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/JsonLd";
import Header from "@/components/sections/Header";
import JobDetail from "@/components/sections/JobDetail";
import JobApplyForm from "@/components/sections/JobApplyForm";
import Footer from "@/components/sections/Footer";
import { getJob, jobDescription, JOBS } from "@/lib/careers";
import { breadcrumbJsonLd, buildMetadata, jobPostingJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return JOBS.map((job) => ({ slug: job.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/career/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const job = getJob(slug);

  if (!job) return { title: "Role not found" };

  return buildMetadata({
    title: `${job.title} — Careers`,
    description: job.summary,
    path: `/career/${job.slug}`,
    keywords: [job.title, "jobs at Project Help", `${job.department} jobs Bangladesh`],
  });
}

export default async function JobPage({ params }: PageProps<"/career/[slug]">) {
  const { slug } = await params;
  const job = getJob(slug);

  if (!job) notFound();

  return (
    <>
      <Header activeLabel="CAREER" />
      <main id="main">
        <JobDetail job={job} />
        <JobApplyForm jobSlug={job.slug} jobTitle={job.title} />
      </main>
      <Footer />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Career", path: "/career" },
            { name: job.title, path: `/career/${job.slug}` },
          ]),
          jobPostingJsonLd({
            title: job.title,
            description: jobDescription(job),
            path: `/career/${job.slug}`,
            datePosted: job.postedDate,
            validThrough: job.validThrough,
            employmentType: job.type === "Full-time" ? "FULL_TIME" : job.type === "Part-time" ? "PART_TIME" : "CONTRACTOR",
            locationType: job.remote ? "TELECOMMUTE" : "ONSITE",
          }),
        ]}
      />
    </>
  );
}
