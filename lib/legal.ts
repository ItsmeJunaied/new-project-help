/**
 * Privacy policy and terms of service, carried over word for word from the
 * current live site so the published commitments do not silently change during
 * the swap. Both were last revised on July 30, 2026.
 */

import { siteConfig } from "@/lib/site";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

export const LEGAL_LAST_UPDATED = "July 30, 2026";

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: "1. Introduction",
    paragraphs: [
      `${siteConfig.name} ("we," "our," or "us") provides software development, cloud infrastructure, and AI/ML consulting services. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you visit our website, apply for a role with us, or engage us for services. By using our website, you agree to the practices described in this policy.`,
    ],
  },
  {
    heading: "2. Information We Collect",
    paragraphs: [
      "We collect information in the following ways:",
    ],
    list: [
      "Information you provide directly: your name, email address, phone number, company details, and message content when you contact us, request a consultation, or submit a job application.",
      "Application data: resume links, portfolio URLs, and cover letters submitted through our careers pages.",
      "Automatically collected data: IP address, browser type, device information, pages visited, and referring URLs, collected through standard web server logs and analytics.",
      "Cookies and similar technologies: used to remember preferences and understand site usage, as described in Section 4.",
    ],
  },
  {
    heading: "3. How We Use Your Information",
    paragraphs: ["We use the information we collect to:"],
    list: [
      "Respond to inquiries and provide requested information about our services",
      "Evaluate and process job applications",
      "Improve our website, services, and user experience",
      "Send service-related communications, such as replies to your inquiries",
      "Detect, prevent, and address technical issues, fraud, or security incidents",
      "Comply with applicable legal obligations",
    ],
  },
  {
    heading: "4. Cookies and Tracking Technologies",
    paragraphs: [
      "Our website may use cookies and similar tracking technologies to analyze traffic and improve functionality. You can control cookie preferences through your browser settings; disabling cookies may limit some website functionality. We do not use cookies to sell personal information to third parties.",
    ],
  },
  {
    heading: "5. How We Share Information",
    paragraphs: [
      "We do not sell your personal information. We may share information with:",
    ],
    list: [
      "Service providers who help us operate our website, hosting, analytics, and communication tools (e.g., our scheduling and video-conferencing providers), under confidentiality obligations",
      "Professional advisors, such as legal or accounting firms, where necessary",
      "Authorities, where required to comply with a legal obligation, court order, or governmental request",
      "A successor entity, in the event of a merger, acquisition, or sale of assets, subject to this policy or a materially similar one",
    ],
  },
  {
    heading: "6. Data Security",
    paragraphs: [
      "We implement reasonable administrative, technical, and physical safeguards designed to protect personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    heading: "7. Data Retention",
    paragraphs: [
      "We retain personal information for as long as necessary to fulfill the purposes described in this policy, unless a longer retention period is required or permitted by law. Job application data is retained for a reasonable period to support our hiring process and may be deleted upon request.",
    ],
  },
  {
    heading: "8. Your Rights",
    paragraphs: [
      "Depending on your location, you may have rights to access, correct, delete, or restrict the use of your personal information, and to object to certain processing. To exercise any of these rights, contact us using the details in Section 11 and we will respond within a reasonable timeframe.",
    ],
  },
  {
    heading: "9. Children's Privacy",
    paragraphs: [
      "Our website and services are not directed to individuals under the age of 16, and we do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can take appropriate action.",
    ],
  },
  {
    heading: "10. International Data Transfers",
    paragraphs: [
      "We are based in Bangladesh and may process information using service providers located in other countries. Where we transfer personal information internationally, we take steps to ensure it receives an adequate level of protection consistent with this policy.",
    ],
  },
  {
    heading: "11. Contact Us",
    paragraphs: [
      `If you have questions about this Privacy Policy or how we handle your data, contact us at ${siteConfig.email} or ${siteConfig.phone}.`,
    ],
  },
  {
    heading: "12. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will post the updated policy on this page with a revised effective date. Continued use of our website after changes take effect constitutes acceptance of the revised policy.",
    ],
  },
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: "1. Acceptance of Terms",
    paragraphs: [
      `These Terms of Service ("Terms") govern your access to and use of the ${siteConfig.name} website and services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree, please do not use our Services.`,
    ],
  },
  {
    heading: "2. Description of Services",
    paragraphs: [
      `${siteConfig.name} provides software development, cloud infrastructure, DevOps, and AI/ML consulting services. Information on our website, including case studies, blog content, and job postings, is provided for general informational purposes and does not constitute a binding offer unless confirmed in a separate signed agreement or statement of work.`,
    ],
  },
  {
    heading: "3. Use of the Website",
    paragraphs: ["You agree not to:"],
    list: [
      "Use the website for any unlawful purpose or in violation of these Terms",
      "Attempt to gain unauthorized access to our systems, networks, or data",
      "Interfere with or disrupt the operation of the website or servers",
      "Scrape, harvest, or collect information from the website using automated means without our consent",
      "Submit false, misleading, or fraudulent information through any form on our website, including job applications and contact forms",
    ],
  },
  {
    heading: "4. Intellectual Property",
    paragraphs: [
      "All content on this website — including text, graphics, logos, case studies, and blog articles — is owned by or licensed to us and is protected by copyright, trademark, and other intellectual property laws. You may view and share content for personal, non-commercial reference, but you may not reproduce, distribute, or create derivative works from our content without prior written permission.",
      "Client and project names referenced on this website are used to describe work we have performed and remain the property of their respective owners.",
    ],
  },
  {
    heading: "5. User Submissions",
    paragraphs: [
      "When you submit information through our contact form, job application forms, or similar features, you represent that the information is accurate and that you have the right to provide it. You grant us permission to use submitted information for the purpose it was provided — such as evaluating a job application or responding to a business inquiry — as further described in our Privacy Policy.",
      "Job applications submitted through this website are stored in our recruitment system and sent to our hiring team. We retain them for a reasonable period to support our hiring process, and will delete them on request — see the Privacy Policy for how to ask.",
    ],
  },
  {
    heading: "6. Third-Party Links and Services",
    paragraphs: [
      "Our website may link to or embed third-party services, such as scheduling tools and map providers. We do not control and are not responsible for the content, privacy practices, or availability of third-party websites or services. Use of third-party services is subject to their own terms and privacy policies.",
    ],
  },
  {
    heading: "7. Disclaimers",
    paragraphs: [
      `The Services and all content on this website are provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the website will be uninterrupted, secure, or error-free.`,
    ],
  },
  {
    heading: "8. Limitation of Liability",
    paragraphs: [
      `To the maximum extent permitted by law, ${siteConfig.name} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the website or Services, even if advised of the possibility of such damages. Our total liability for any claim arising from these Terms or the Services shall not exceed the amount paid by you, if any, for the specific service giving rise to the claim.`,
    ],
  },
  {
    heading: "9. Indemnification",
    paragraphs: [
      `You agree to indemnify and hold harmless ${siteConfig.name}, its employees, and contractors from any claims, damages, liabilities, and expenses (including reasonable legal fees) arising out of your use of the website, violation of these Terms, or infringement of any third-party rights.`,
    ],
  },
  {
    heading: "10. Client Engagements",
    paragraphs: [
      "These Terms govern general use of our website. Specific client engagements — including scope, pricing, timelines, deliverables, and confidentiality — are governed by a separate signed agreement or statement of work between the client and us, which will take precedence over these Terms for matters it addresses.",
    ],
  },
  {
    heading: "11. Termination",
    paragraphs: [
      "We reserve the right to suspend or restrict access to our website for any user who violates these Terms, at our sole discretion and without prior notice.",
    ],
  },
  {
    heading: "12. Governing Law",
    paragraphs: [
      "These Terms are governed by the laws of the People's Republic of Bangladesh, without regard to its conflict of law principles. Any disputes arising from these Terms or your use of the Services shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.",
    ],
  },
  {
    heading: "13. Changes to These Terms",
    paragraphs: [
      "We may revise these Terms from time to time. The updated version will be posted on this page with a revised effective date. Continued use of the website after changes take effect constitutes acceptance of the revised Terms.",
    ],
  },
  {
    heading: "14. Contact Us",
    paragraphs: [
      `Questions about these Terms can be directed to ${siteConfig.email} or ${siteConfig.phone}.`,
    ],
  },
];
