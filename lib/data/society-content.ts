import fs from 'node:fs';
import path from 'node:path';

export interface KidActivity {
  emoji: string;
  name: string;
  location: string;
  time: string;
  url?: string;
}

export interface DiscountInfo {
  text: string;
  linkText: string;
  linkUrl: string;
}

// All fields are optional. The scraper omits sections it can't source from
// first-party material, so the renderer must tolerate any missing field.
export interface SocietyContentData {
  overview?: { title: string; text: string }[];
  history?: { text?: string; milestones?: { label: string; detail: string }[] };
  location?: string;
  duration?: string;
  pricing?: string;
  amenities?: string[];
  fellowship?: string;
  fellowshipUrl?: string;
  longtermer?: string;
  kidFriendly?: { description: string; activities: KidActivity[] };
  discount?: DiscountInfo;
  howToEnter?: { text?: string; linkText?: string; linkUrl?: string };
  faqs?: { question: string; answer: string }[];
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'societies');

export function loadSocietyContent(slug: string): SocietyContentData | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as SocietyContentData;
}
