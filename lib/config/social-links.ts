import { SiX, SiDiscord, SiTelegram, SiSubstack, SiGithub } from "react-icons/si";
import type { IconType } from "react-icons";

export interface SocialLink {
  name: string;
  url: string;
  icon: IconType;
  label: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "discord",
    url: "https://discord.gg/pA27FrbXjU",
    icon: SiDiscord,
    label: "Discord",
  },
  {
    name: "telegram",
    url: "https://t.me/+P3r-8XdRfXoyYWVl",
    icon: SiTelegram,
    label: "Telegram",
  },
  {
    name: "substack",
    url: "https://nsnodes.substack.com/",
    icon: SiSubstack,
    label: "Substack",
  },
  {
    name: "x",
    url: "https://x.com/intent/follow?screen_name=nsnodes",
    icon: SiX,
    label: "X",
  },
  {
    name: "github",
    url: "https://github.com/nsnodes",
    icon: SiGithub,
    label: "GitHub",
  },
];
