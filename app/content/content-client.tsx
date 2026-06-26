"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  FileText,
  Library,
  Radio,
  Users,
} from "lucide-react";
import { contentVoices, readingCanons } from "@/lib/data/content-hub";
import type { ReadingResource, SubstackPost } from "@/lib/types/content-hub";
import type { UIArticle } from "@/lib/types/articles";

interface ContentClientProps {
  substackPosts: SubstackPost[];
  ecosystemArticles: UIArticle[];
}

const SUBSTACK_HOME = "https://nsnodes.substack.com";
const SUBSTACK_SUBSCRIBE = "https://nsnodes.substack.com/subscribe";
const EDITION_ACCENTS = [
  {
    bg: "bg-palette-3/10",
    border: "border-palette-3/70",
    text: "text-palette-3",
  },
  {
    bg: "bg-palette-8/10",
    border: "border-palette-8/70",
    text: "text-palette-8",
  },
  {
    bg: "bg-palette-6/10",
    border: "border-palette-6/70",
    text: "text-palette-6",
  },
  {
    bg: "bg-palette-5/10",
    border: "border-palette-5/70",
    text: "text-palette-5",
  },
];

function getEditionAccent(index: number) {
  return EDITION_ACCENTS[index % EDITION_ACCENTS.length];
}

function SubstackIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M22.54 8.24H1.46V5.41h21.08v2.83ZM1.46 10.81V24L12 18.11 22.54 24V10.81H1.46ZM22.54 0H1.46v2.84h21.08V0Z" />
    </svg>
  );
}

function SectionHeader({
  icon,
  title,
  note,
}: {
  icon: React.ReactNode;
  title: string;
  note?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3 border-b border-dashed border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-border bg-card text-foreground">
          {icon}
        </span>
        <h2 className="min-w-0 break-words font-mono text-lg font-bold sm:text-xl">[ {title} ]</h2>
      </div>
      {note && (
        <p className="hidden max-w-xl font-mono text-xs leading-relaxed text-muted-foreground sm:block sm:text-right">
          {note}
        </p>
      )}
    </div>
  );
}

function IndexChip({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="border border-border bg-card px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      {label}
    </a>
  );
}

function IssueHero({ post }: { post?: SubstackPost }) {
  if (!post) {
    return (
      <article className="border-2 border-border bg-card p-6 shadow-brutal-md">
        <p className="font-mono text-sm text-muted-foreground">
          NSNodes Weekly could not be loaded right now. The archive is still available on Substack.
        </p>
      </article>
    );
  }

  return (
    <article className="min-w-0 overflow-hidden border-2 border-border bg-card shadow-brutal-md">
      <div className="relative min-h-40 border-b border-border bg-background sm:min-h-64">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={`Cover image for ${post.title}`}
            fill
            priority
            sizes="(min-width: 1024px) 760px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full min-h-40 items-center justify-center bg-palette-3/10 font-mono text-xs text-muted-foreground sm:min-h-64">
            NSNODES WEEKLY
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/45 to-transparent p-4">
          <div className="inline-flex border border-border bg-background px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-normal text-palette-3">
            live from nsnodes.substack.com
          </div>
        </div>
      </div>

      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-6 lg:p-7">
        <div className="min-w-0 max-w-[320px] space-y-4 sm:max-w-none sm:space-y-5">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="border border-foreground bg-background px-2 py-1 font-bold">
              NSNODES WEEKLY{post.issueNumber ? ` #${post.issueNumber}` : ""}
            </span>
            <span className="text-muted-foreground">
              {post.date} · {post.readTime}
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="max-w-full whitespace-normal break-words font-mono text-lg font-bold leading-tight text-palette-8 sm:max-w-4xl sm:text-2xl md:text-3xl lg:text-4xl">
              {post.title}
            </h2>
            <p className="max-w-full whitespace-normal break-words font-mono text-sm leading-relaxed text-muted-foreground sm:max-w-3xl sm:text-base">
              {post.subtitle}
            </p>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-border bg-background px-2 py-1 font-mono text-xs text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 border-2 border-foreground bg-foreground px-4 py-2.5 text-center font-mono text-sm font-bold text-background shadow-brutal-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none sm:w-auto sm:py-3"
            >
              Read latest issue <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={SUBSTACK_SUBSCRIBE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 border-2 border-border bg-background px-4 py-2.5 text-center font-mono text-sm text-foreground shadow-brutal-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none sm:w-auto sm:py-3"
            >
              Subscribe on Substack <SubstackIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <aside className="grid min-w-0 grid-cols-3 gap-3 border-t border-dashed border-border pt-4 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <div className="space-y-1">
            <div className="font-mono text-xs text-muted-foreground">source</div>
            <div className="font-mono text-sm font-bold">Substack</div>
          </div>
          <div className="space-y-1">
            <div className="font-mono text-xs text-muted-foreground">words</div>
            <div className="font-mono text-sm font-bold">{post.wordCount || "Live"}</div>
          </div>
          <div className="space-y-1">
            <div className="font-mono text-xs text-muted-foreground">archive</div>
            <a
              href={`${SUBSTACK_HOME}/archive`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex h-8 w-8 items-center justify-center border border-border bg-background hover:bg-accent hover:text-featured"
              aria-label="Open NSNodes Substack archive"
            >
              <SubstackIcon className="h-4 w-4" />
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}

function EditionThumbnail({ post, index }: { post: SubstackPost; index: number }) {
  const accent = getEditionAccent(index);

  return (
    <span
      className={`relative block h-14 w-20 shrink-0 overflow-hidden border ${accent.border} ${accent.bg}`}
    >
      {post.coverImage ? (
        <Image
          src={post.coverImage}
          alt=""
          fill
          sizes="80px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <span className={`flex h-full items-center justify-center font-mono text-xs font-bold ${accent.text}`}>
          {post.issueNumber ? `#${post.issueNumber}` : "post"}
        </span>
      )}
    </span>
  );
}

function EditionsList({
  posts,
  currentPostId,
}: {
  posts: SubstackPost[];
  currentPostId?: number;
}) {
  const previous = posts
    .filter((post) => post.issueNumber !== null && post.id !== currentPostId)
    .slice(0, 8);

  return (
    <div className="border-2 border-border bg-card shadow-brutal-md">
      <div className="border-b border-border px-4 py-3 font-mono text-sm font-bold">
        [ PREVIOUS EDITIONS ]
      </div>
      <div className="divide-y divide-border">
        {previous.map((post, index) => {
          const accent = getEditionAccent(index);
          return (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-3 px-4 py-3 font-mono text-xs transition-colors hover:bg-accent"
            >
              <EditionThumbnail post={post} index={index} />
              <span className="flex min-w-0 flex-col gap-1 self-center">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">
                    {post.issueNumber ? `#${post.issueNumber}` : "post"}
                  </span>
                  <span className="text-muted-foreground">{post.shortDate}</span>
                </span>
                <span className={`line-clamp-2 min-w-0 font-bold leading-snug ${accent.text}`}>
                  {post.title}
                </span>
              </span>
            </a>
          );
        })}
      </div>
      <a
        href={`${SUBSTACK_HOME}/archive`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between border-t border-border px-4 py-3 font-mono text-xs font-bold hover:bg-accent"
      >
        Open full archive <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  );
}

function getResourceInitials(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function isExternalUrl(url: string) {
  return /^https?:\/\//.test(url);
}

function ResourceThumbnail({
  item,
  index,
}: {
  item: ReadingResource;
  index: number;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const accent = getEditionAccent(index);
  const imageSrc = item.thumbnail?.src && !imageFailed ? item.thumbnail.src : null;
  const fit = item.thumbnail?.fit === "contain" ? "object-contain p-4" : "object-cover";
  const position =
    item.thumbnail?.position === "left"
      ? "object-left"
      : item.thumbnail?.position === "right"
        ? "object-right"
        : "object-center";
  const fallbackLabel = item.thumbnail?.label ?? item.title;
  const surfaceClass = item.thumbnail?.surface === "light" ? "bg-white text-black" : accent.bg;
  const byLabel = item.byLabel ?? "by";

  if (item.kind === "Model") {
    return (
      <div
        className={`relative h-36 overflow-hidden border-b border-border ${accent.bg} ${accent.border} sm:h-44`}
      >
        <div className="flex h-full flex-col justify-between p-4 font-mono sm:p-5">
          <div className="flex items-center justify-between text-[10px] uppercase text-muted-foreground">
            <span>Field model</span>
            <span>Societies dashboard</span>
          </div>
          <div className="space-y-3">
            <div className={`max-w-[18rem] break-words text-2xl font-bold leading-none ${accent.text} sm:text-4xl`}>
              {fallbackLabel}
            </div>
            <div className="h-1 w-16 bg-current opacity-60" />
          </div>
          <div className="max-w-[28rem] truncate text-[10px] text-muted-foreground">
            {byLabel} {item.by}
          </div>
        </div>
      </div>
    );
  }

  if (item.kind === "Book") {
    return (
      <div
        className={`relative h-40 overflow-hidden border-b border-border ${accent.bg} ${accent.border} sm:h-44`}
      >
        <div className="grid h-full grid-cols-[88px_minmax(0,1fr)] items-center gap-3 px-4 pb-6 pt-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-4 sm:px-5">
          <div className="relative h-28 overflow-hidden sm:h-32">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={item.thumbnail?.alt ?? `${item.title} cover`}
                fill
                unoptimized
                loading="eager"
                sizes="120px"
                className="object-contain"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className={`flex h-full items-center justify-center border border-border bg-background font-mono ${accent.text}`}>
                <span className="text-xl font-bold">{getResourceInitials(item.title)}</span>
              </div>
            )}
          </div>
          <div className="min-w-0 font-mono">
            <div className="mb-2 inline-flex border border-border bg-background/80 px-2 py-1 text-[10px] uppercase text-muted-foreground">
              Published {item.year}
            </div>
            <div className={`break-words text-lg font-bold leading-tight ${accent.text} sm:text-xl`}>
              {item.title}
            </div>
            <div className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {item.by}
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-background/90 px-2 py-1 font-mono text-[10px] text-muted-foreground backdrop-blur-sm">
          <span>{item.kind}</span>
          <span>{item.year}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative h-36 overflow-hidden border-b border-border ${surfaceClass} ${accent.border} sm:h-44`}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={item.thumbnail?.alt ?? `${item.title} thumbnail`}
          fill
          unoptimized
          loading="eager"
          sizes="(min-width: 768px) 520px, 100vw"
          className={`${fit} ${position} transition-transform duration-300 group-hover:scale-[1.03]`}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className={`flex h-full flex-col items-center justify-center gap-2 p-4 text-center font-mono ${accent.text} sm:p-5`}>
          <span className="text-[10px] uppercase text-foreground/60">{item.kind}</span>
          <span className="max-w-[16rem] break-words text-lg font-bold leading-tight sm:text-2xl">
            {fallbackLabel || getResourceInitials(item.title)}
          </span>
          <span className="max-w-[14rem] truncate text-[10px] text-foreground/60">
            {byLabel} {item.by}
          </span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-background/90 px-2 py-1 font-mono text-[10px] text-muted-foreground backdrop-blur-sm">
        <span>{item.kind}</span>
        <span>{item.year}</span>
      </div>
    </div>
  );
}

function LibrarySection() {
  const [activeCanonId, setActiveCanonId] = useState(readingCanons[0]?.id ?? "");
  const activeCanon = useMemo(
    () => readingCanons.find((canon) => canon.id === activeCanonId) ?? readingCanons[0],
    [activeCanonId]
  );

  return (
    <section id="library" className="space-y-5 sm:space-y-6">
      <SectionHeader
        icon={<Library className="h-4 w-4" />}
        title="THE LIBRARY"
        note="Hand-picked references for going deeper into the space."
      />

      <div className="space-y-3">
        <div
          role="tablist"
          aria-label="Library sections"
          className="grid max-w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-start"
        >
          {readingCanons.map((canon, index) => (
            <button
              key={canon.id}
              type="button"
              role="tab"
              aria-selected={activeCanon.id === canon.id}
              onClick={() => setActiveCanonId(canon.id)}
              className={`inline-flex min-h-11 w-full min-w-0 max-w-full items-center justify-center gap-1.5 border-2 px-2 py-2 font-mono text-[10px] transition-all sm:w-auto sm:min-w-fit sm:gap-2 sm:px-3 sm:text-sm ${
                activeCanon.id === canon.id
                  ? "border-foreground bg-foreground text-background shadow-none"
                  : "border-border bg-card text-foreground shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              }`}
            >
              <span className={activeCanon.id === canon.id ? "text-background/70" : "text-muted-foreground"}>
                0{index + 1}
              </span>
              <span className="truncate font-bold sm:whitespace-nowrap">[ {canon.label.toUpperCase()} ]</span>
            </button>
          ))}
        </div>
        {activeCanon && (
          <p className="border border-dashed border-border bg-card px-4 py-3 font-mono text-xs leading-relaxed text-muted-foreground">
            {activeCanon.blurb}
          </p>
        )}
      </div>

      {activeCanon && (
        <div className="grid gap-3 md:grid-cols-2">
          {activeCanon.items.map((item, index) => (
            <a
              key={`${item.title}-${item.url}`}
              href={item.url}
              target={isExternalUrl(item.url) ? "_blank" : undefined}
              rel={isExternalUrl(item.url) ? "noopener noreferrer" : undefined}
              className="group overflow-hidden border-2 border-border bg-card font-mono shadow-brutal-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              <ResourceThumbnail item={item} index={index} />
              {item.kind === "Book" ? (
                <div className="p-3 sm:p-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.note}</p>
                </div>
              ) : (
                <div className="grid gap-3 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>0{index + 1}</span>
                      <span>{item.kind}</span>
                      <span>{item.year}</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold leading-snug">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {item.byLabel ?? "by"} {item.by}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.note}</p>
                  {item.ctaLabel && (
                    <div className="inline-flex w-fit items-center gap-2 border border-border bg-background px-2 py-1 text-xs font-bold text-foreground">
                      {item.ctaLabel} <ArrowUpRight className="h-3 w-3" />
                    </div>
                  )}
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

function EcosystemRadar({ articles }: { articles: UIArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <section id="radar" className="space-y-6">
      <SectionHeader
        icon={<Radio className="h-4 w-4" />}
        title="ECOSYSTEM RADAR"
        note="Recent articles from our network"
      />

      <div className="grid gap-3 lg:grid-cols-4">
        {articles.slice(0, 8).map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-44 flex-col justify-between border border-border bg-card p-4 font-mono transition-colors hover:bg-accent"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>{article.author}</span>
                <span>{article.source}</span>
              </div>
              <h3 className="line-clamp-3 text-sm font-bold leading-snug">{article.title}</h3>
              {article.subtitle && (
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {article.subtitle}
                </p>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
              <span>{article.date}</span>
              <ArrowUpRight className="h-3 w-3" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function VoicesSection() {
  return (
    <section id="voices" className="space-y-6">
      <SectionHeader
        icon={<Users className="h-4 w-4" />}
        title="VOICES"
        note="A compact, non-exhaustive directory of people worth tracking."
      />

      <div className="border-2 border-border bg-card shadow-brutal-md">
        <div className="border-b border-border p-4 font-mono text-sm text-muted-foreground">
          A starter map, not a ranking. We will keep refining it as the field evolves.
        </div>
        <div className="divide-y divide-border">
          {contentVoices.map((voice) => (
            <div
              key={voice.handle}
              className="grid gap-3 p-4 font-mono lg:grid-cols-[minmax(250px,290px)_minmax(140px,180px)_1fr_auto] lg:items-center"
            >
              <div className="flex min-w-0 items-center gap-3">
                <VoiceAvatar name={voice.name} avatarUrl={voice.avatarUrl} />
                <div className="min-w-0">
                  <div className="truncate font-bold">{voice.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{voice.handle}</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{voice.role}</div>
              <p className="text-sm leading-relaxed text-muted-foreground lg:max-w-none">{voice.note}</p>
              <div className="flex gap-2">
                {voice.xUrl && (
                  <a
                    href={voice.xUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-border px-2 py-1 text-xs hover:bg-accent"
                  >
                    X
                  </a>
                )}
                <a
                  href={voice.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-border px-2 py-1 text-xs hover:bg-accent"
                >
                  Site
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VoiceAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-background text-xs font-bold text-muted-foreground shadow-[3px_3px_0_hsl(var(--border))]">
      {avatarUrl && !imageFailed ? (
        <Image
          src={avatarUrl}
          alt={`${name} profile image`}
          fill
          sizes="44px"
          className="object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export default function ContentClient({
  substackPosts,
  ecosystemArticles,
}: ContentClientProps) {
  const latestPost = substackPosts[0];

  return (
    <div className="mx-auto w-full max-w-[calc(100vw-1.5rem)] space-y-10 overflow-hidden whitespace-normal pb-24 sm:max-w-7xl sm:space-y-12 lg:pb-8">
      <section className="space-y-7 border-b border-dashed border-border pb-8 text-center sm:pb-10">
        <div className="space-y-4">
          <h1 className="font-mono text-3xl font-bold sm:text-5xl">[ READINGS ]</h1>
          <p className="mx-auto max-w-[320px] whitespace-normal break-words font-mono text-sm leading-relaxed text-muted-foreground sm:max-w-3xl sm:text-base">
            Weekly digest, hand-picked resources, and voices shaping the space.
          </p>
        </div>
        <div className="grid grid-cols-[minmax(0,160px)_minmax(0,160px)] justify-center gap-2 sm:flex sm:flex-wrap">
          <IndexChip href="#weekly" label="[ weekly ]" />
          <IndexChip href="#library" label="[ library ]" />
          <IndexChip href="#radar" label="[ radar ]" />
          <IndexChip href="#voices" label="[ voices ]" />
        </div>
      </section>

      <section id="weekly" className="space-y-6">
        <SectionHeader
          icon={<SubstackIcon className="h-4 w-4" />}
          title="NSNODES WEEKLY"
          note="Our weekly digest on the latest updates in the space"
        />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <IssueHero post={latestPost} />
          <EditionsList posts={substackPosts} currentPostId={latestPost?.id} />
        </div>
      </section>

      <LibrarySection />

      <EcosystemRadar articles={ecosystemArticles} />

      <VoicesSection />

      <section className="grid gap-4 border-2 border-border bg-card p-5 font-mono shadow-brutal-md md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="text-lg font-bold">[ HELP CURATE THE STACK ]</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Missing a canonical essay, field report, operator, or project? Route suggestions through NSNodes so this stays editorial instead of becoming a link dump.
          </p>
        </div>
        <a
          href="/contact"
          className="inline-flex items-center justify-center gap-2 border-2 border-border bg-background px-4 py-3 text-sm shadow-brutal-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
        >
          Suggest a link <FileText className="h-4 w-4" />
        </a>
      </section>

      <footer className="flex flex-col gap-3 border-t border-dashed border-border pt-6 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>nsnodes / readings</span>
        <div className="flex gap-4">
          <a href={`${SUBSTACK_HOME}/archive`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            archive
          </a>
          <a href={`${SUBSTACK_HOME}/feed`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            rss
          </a>
          <a href={SUBSTACK_SUBSCRIBE} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            subscribe
          </a>
        </div>
      </footer>
    </div>
  );
}
