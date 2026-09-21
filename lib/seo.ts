import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

type BuildMetadataOptions = {
  title: string;
  description: string;
  /** Route-relative path, e.g. "/services". Becomes the canonical URL. */
  path: string;
  /** Route-relative OG image path. Falls back to the site-wide card. */
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  keywords?: string[];
};

const DEFAULT_OG_IMAGE = "/images/hero-portrait.webp";

/**
 * Single source of truth for per-page metadata: canonical URL, Open Graph and
 * Twitter cards all derive from the same title/description/path, so a page can
 * never ship with a canonical that disagrees with its social card.
 */
export function buildMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  publishedTime,
  keywords,
}: BuildMetadataOptions): Metadata {
  const url = path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;

  // The root layout's title template only applies to child segments, so the home
  // page brands itself. Everywhere else the template appends the site name — and
  // the social card must not append it a second time.
  const socialTitle = title.includes(siteConfig.name)
    ? title
    : `${title} | ${siteConfig.name}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: "en_US",
      type,
      ...(publishedTime ? { publishedTime } : {}),
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image],
    },
  };
}

/** Organization + LocalBusiness entity, emitted once from the root layout. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    foundingDate: siteConfig.founded,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.locality,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.linkedin,
      siteConfig.social.whatsapp,
    ],
    areaServed: "Worldwide",
    knowsAbout: [
      "SaaS platform development",
      "eCommerce development",
      "DevOps and cloud infrastructure",
      "AI and machine learning applications",
      "Mobile app development",
      "Cybersecurity",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    inLanguage: "en",
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function serviceJsonLd(service: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: `${siteConfig.url}${service.path}`,
    provider: { "@id": `${siteConfig.url}/#organization` },
    areaServed: "Worldwide",
    serviceType: "Custom software development",
  };
}

export function articleJsonLd(article: {
  headline: string;
  description: string;
  path: string;
  image: string;
  datePublished: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.headline,
    description: article.description,
    image: `${siteConfig.url}${article.image}`,
    datePublished: article.datePublished,
    dateModified: article.datePublished,
    author: { "@type": "Person", name: article.author },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    mainEntityOfPage: `${siteConfig.url}${article.path}`,
    inLanguage: "en",
  };
}

export function caseStudyJsonLd(study: {
  name: string;
  description: string;
  path: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: study.name,
    description: study.description,
    url: `${siteConfig.url}${study.path}`,
    image: `${siteConfig.url}${study.image}`,
    creator: { "@id": `${siteConfig.url}/#organization` },
    inLanguage: "en",
  };
}

/**
 * The blog index as an ordered list of its articles. Gives search engines the
 * post URLs and their order straight from the page that links them, which is
 * what earns the article carousel treatment for a hub page like this.
 */
export function blogListJsonLd(
  posts: { title: string; path: string; datePublished: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteConfig.url}/blog#list`,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteConfig.url}${post.path}`,
      name: post.title,
    })),
  };
}

/** Google Jobs entry for a role on /career. */
export function jobPostingJsonLd(job: {
  title: string;
  description: string;
  path: string;
  datePosted: string;
  validThrough: string;
  employmentType: string;
  locationType?: "TELECOMMUTE" | "ONSITE";
}) {
  const remote = job.locationType === "TELECOMMUTE";

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    employmentType: job.employmentType,
    url: `${siteConfig.url}${job.path}`,
    hiringOrganization: { "@id": `${siteConfig.url}/#organization` },
    directApply: true,
    ...(remote ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: siteConfig.address.countryName } } : {}),
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.address.street,
        addressLocality: siteConfig.address.locality,
        postalCode: siteConfig.address.postalCode,
        addressCountry: siteConfig.address.country,
      },
    },
  };
}

/**
 * Article entity for a post fetched from the API. Unlike `articleJsonLd` the
 * image may already be an absolute Cloudinary URL, so it is only prefixed when
 * it is a path in this app's own /public.
 */
export function blogPostingJsonLd(post: {
  headline: string;
  description: string;
  path: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: string;
  keywords?: string[];
  wordCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.headline,
    description: post.description,
    image: post.image.startsWith("http") ? post.image : `${siteConfig.url}${post.image}`,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: { "@type": "Person", name: post.author },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    mainEntityOfPage: `${siteConfig.url}${post.path}`,
    isPartOf: { "@id": `${siteConfig.url}/blog#list` },
    inLanguage: "en",
    ...(post.keywords?.length ? { keywords: post.keywords.join(", ") } : {}),
    ...(post.wordCount ? { wordCount: post.wordCount } : {}),
  };
}
