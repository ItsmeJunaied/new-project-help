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
   * The office as Google's own place embed.
   *
   * This is the listing for Project Help itself rather than a coordinate view,
   * so the marker, the name and the place card are Google's and are correct
   * without us drawing anything over the top. Supplied by the office.
   */
  mapEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14602.62487983703!2d90.3797689871582!3d23.79525330000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7cbac58cad1%3A0x87e09007f5541b3c!2sProject%20Help!5e0!3m2!1sen!2sbd!4v1790761844820!5m2!1sen!2sbd",
  /** The address on one line, for a label that has no room for a block. */
  addressLine: "3rd Floor, House 76, Road 11, Banani, Dhaka 1213",
  address: {
    street: "3rd Floor, House 76, Road 11, Banani",
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
