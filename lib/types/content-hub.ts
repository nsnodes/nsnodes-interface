export interface SubstackPost {
  id: number;
  issueNumber: number | null;
  title: string;
  subtitle: string;
  url: string;
  coverImage: string | null;
  date: string;
  shortDate: string;
  readTime: string;
  wordCount: number;
  tags: string[];
}

export interface ReadingResource {
  kind: string;
  title: string;
  by: string;
  byLabel?: string;
  year: string;
  url: string;
  note: string;
  ctaLabel?: string;
  thumbnail?: {
    src?: string;
    alt: string;
    fit?: "cover" | "contain";
    position?: "center" | "left" | "right";
    label?: string;
    surface?: "light" | "dark";
  };
}

export interface ReadingCanon {
  id: string;
  label: string;
  blurb: string;
  items: ReadingResource[];
}

export interface ContentVoice {
  name: string;
  handle: string;
  avatarUrl?: string;
  role: string;
  url: string;
  xUrl?: string;
  note: string;
}
