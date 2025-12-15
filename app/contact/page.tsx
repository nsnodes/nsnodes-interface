import { generatePageMetadata } from '@/lib/utils/metadata';
import ContactClient from './contact-client';

export const metadata = generatePageMetadata(
  "Contact",
  "Get in touch with the NSNodes team. Join our community on Telegram or reach out via email."
);

export default function ContactPage() {
  return <ContactClient />;
}
