import { BRAND_GREEN } from "@/lib/brand";

export const siteConfig = {
  name: "Project Help",
  tagline: "Custom Software Development Company",
  description:
    "Project Help is a custom software development company building SaaS platforms, eCommerce systems, cloud infrastructure and AI/ML applications for clients worldwide.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.projecthelpbd.com",
  email: "hello@projecthelpbd.com",
  phone: "+8801975005362",
  /** The same number, grouped for reading. Never use this one in a tel: href. */
  phoneDisplay: "+880 1975-005362",
  whatsappHref: "https://wa.me/8801975005362",
  founded: "2021",
  /** 30-minute intro call. Same link the current live site books against. */
  calendlyUrl: `https://calendly.com/hello-projecthelpbd/30min?primary_color=${BRAND_GREEN.replace("#", "").toLowerCase()}`,
  /**
   * The office in Google Maps proper, by coordinate rather than by name: a
   * search on "Codesk" can land on any of them, and the pair below is the one
   * the embed above is already centred on.
   */
  mapsHref: "https://www.google.com/maps/search/?api=1&query=23.7902366%2C90.4101466",
  directionsHref:
    "https://www.google.com/maps/dir/?api=1&destination=23.7902366%2C90.4101466",
  /**
   * The office as a plain map view, by coordinate.
   *
   * The embed this replaces was built around the Codesk listing, and a listing
   * embed brings Google's own furniture with it: a place card over the top-left
   * corner and a marker of its own. The contact page draws both itself, so this
   * one asks for the view and nothing else — same centre, same zoom, no
   * chrome. Google issues this form itself when you ask maps.google.com for
   * `?ll=<lat>,<lng>&z=16&output=embed`.
   */
  mapEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d7301.5940937088581!2d90.4101466!3d23.7902366!3m2!1i1024!2i768!4f13.1!6i16!3m1!1sen!5m1!1sen",
  address: {
    street: "3rd Floor, House 76/A, Road 11, Banani",
    locality: "Dhaka",
    postalCode: "1213",
    country: "BD",
    countryName: "Bangladesh",
  },
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61550310609210",
    linkedin: "https://www.linkedin.com/company/projecthelpbd",
    whatsapp: "https://wa.me/8801975005362",
  },
} as const;

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
] as const;

export const navLinks = [
  { label: "HOME", href: "/" },
  { label: "SERVICES", href: "/services" },
  { label: "ABOUT US", href: "/about" },
  { label: "CASE STUDY", href: "/case-study" },
  { label: "BLOG", href: "/blog" },
  { label: "CAREER", href: "/career" },
] as const;
