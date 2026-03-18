'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { societyNameToSlug } from '@/lib/utils/slug';

interface KidActivity {
  emoji: string;
  name: string;
  location: string;
  time: string;
}

interface DiscountInfo {
  text: string;
  linkText: string;
  linkUrl: string;
}

interface SocietyContentData {
  overview: { title: string; text: string }[];
  history: { text: string; milestones: { label: string; detail: string }[] };
  location: string;
  duration: string;
  pricing: string;
  amenities: string[];
  fellowship?: string;
  fellowshipUrl?: string;
  longtermer?: string;
  kidFriendly?: { description: string; activities: KidActivity[] };
  discount?: DiscountInfo;
  howToEnter: { text: string; linkText?: string; linkUrl?: string };
  faqs: { question: string; answer: string }[];
}

export const SOCIETY_CONTENT: Record<string, SocietyContentData> = {
  'network-school': {
    overview: [
      {
        title: 'What is Network School?',
        text: 'Founded by Balaji Srinivasan, Network School is a residential community designed for builders, creators, and techno-optimists. It blends the best aspects of a university, startup accelerator, and intentional living space into a single program where members live, learn, and build together.',
      },
      {
        title: 'Who joins Network School?',
        text: 'The community attracts a wide mix of people — software engineers, digital nomads, content creators, fitness enthusiasts, event organizers, and founders. What they share is a desire to live intentionally alongside others who are building something meaningful.',
      },
    ],
    history: {
      text: 'Network School launched its first cohort in September 2024 as a 100-day pilot in Forest City, Malaysia. The idea was born from Balaji Srinivasan\'s vision of replacing declining traditional institutions with a digital-first, community-driven alternative — inspired in part by his time teaching at Stanford.\n\nAfter strong demand during the initial run, the program expanded into a year-round residency with double the capacity, featuring ongoing cohorts, hundreds of guest speakers, and a growing calendar of events.\n\nThe team is now developing a permanent campus in the same area, intended to serve as a blueprint that can be replicated in other locations around the world.',
      milestones: [
        { label: 'First Cohort', detail: '128 members | 100 days' },
        { label: 'Year-Round Residency', detail: '256 members | 365 days' },
        { label: 'Permanent Campus', detail: '1024 members | Ongoing' },
      ],
    },
    location: 'Network School is located in Forest City, Malaysia, a large-scale development within the Singapore-Johor Special Economic Zone. Members have access to private rooms, a gym, coworking areas, and auditorium spaces. This site serves as the primary hub for the foreseeable future.\n\nAs the community grows, the long-term plan includes establishing additional locations worldwide, creating a decentralized network of connected campuses.',
    duration: 'The current program runs year-round as a continuous residency. Members can join for a minimum of one month and extend their stay on a monthly basis.\n\nThe goal is for the campus to eventually transition into a permanent neighborhood with ongoing intake.',
    pricing: 'Membership costs $3,000 per month for a private room, or $1,500 per month with a roommate.\n\nThe pricing follows an all-inclusive model — covering accommodation, meals, fitness, coworking, and events — so members can focus entirely on learning, building, and connecting.',
    amenities: [
      'Serviced room',
      'All-you-can-eat restaurant',
      '24/7 gym access',
      'Fitness classes',
      '24/7 co-working access',
      'Content studios',
      'Maker space',
      'High-speed Wi-Fi',
      'Workshops, lectures, and events',
    ],
    fellowship: 'Founders and creators can apply for a fellowship worth $100,000 in funding for a new or existing venture. The main requirement is relocating to the Network School campus for one year.',
    fellowshipUrl: 'https://balajis.com/p/network-school-fellowship?hide_intro_popup=true',
    longtermer: 'To become a Longtermer, start by [applying for a regular stay](https://ns.com/wagmit/apply). Once on campus, Balaji typically hosts an introductory lunch where he shares more about the program. In short, Longtermers commit to a 12-month stay and in return gain access to private apartments, reduced rent, long-term visa assistance, a potential community token allocation, and membership in the core long-term community.',
    kidFriendly: {
      description: 'Yes! The community actively works to make Network School welcoming for families with children. Babysitting is available every weekday, there are customized kids\' menus for meals, and kid-friendly activities run throughout the week. Here are some examples of regular activities:',
      activities: [
        { emoji: '🍳', name: 'Breakfast Club', location: 'NS Breakfast Area', time: '8:40 AM – 9:20 AM' },
        { emoji: '🎨', name: 'Craft with me: Watercolor Bookmarks', location: 'NS Cafe', time: '11:00 AM – 12:00 PM' },
        { emoji: '🍱', name: 'Lunch Bunch', location: 'NS 13th Floor', time: '12:15 PM – 1:00 PM' },
        { emoji: '💻', name: 'App Builder School (All Ages)', location: 'NS Library', time: '12:30 PM – 1:30 PM' },
        { emoji: '🏊', name: 'Swim Club', location: 'NS Pool', time: '2:00 PM – 3:00 PM' },
      ],
    },
    discount: {
      text: 'Network School typically does not offer discounts. However, if you apply using our link (or any other member\'s link), you\'ll receive a prioritized application review as well as one week of free stay.',
      linkText: 'Prioritized review & 1 week free stay',
      linkUrl: 'https://ns.com/wagmit/apply',
    },
    howToEnter: {
      text: 'Cohorts begin on the first of each month. There are no strict prerequisites, but priority is given to applicants who plan longer stays and bring relevant skills in engineering, creation, or community building. Once accepted, you\'ll need to pay the first month\'s rent to confirm your spot. Applying through a member referral can strengthen your application.',
      linkText: 'here',
      linkUrl: 'https://ns.com/wagmit/apply',
    },
    faqs: [
      { question: 'What is Network School?', answer: 'Network School is a live-in community for founders, remote workers, creators, and other builders.' },
      { question: 'How do I book a stay?', answer: 'You [apply first](https://ns.com/wagmit/apply). Accepted members are then invited to join.' },
      { question: 'How much does it cost?', answer: 'Pricing starts at $1,500/month with roommates. Private rooms at $3,000/month. If you qualify for being a long-term after 1 month, you might get an apartment or private hotel room with lower rent.' },
      { question: 'How do I pay?', answer: 'Both fiat card payment or crypto is accepted, we recommend crypto if you want to reduce the transaction cost.' },
      { question: 'What\'s included?', answer: 'Accommodation, meals, gym access, coworking, events, workshops, lectures, fitness classes, and high-speed Wi-Fi.' },
      { question: 'Is food included?', answer: 'Yes, great meals are included.' },
      { question: 'Is Wi-Fi included?', answer: 'Yes, high-speed Wi-Fi is included.' },
      { question: 'Is it good for remote work?', answer: 'Yes, it is designed for remote workers and builders.' },
      { question: 'Are private rooms available?', answer: 'Yes, both shared and private options appear to be available.' },
      { question: 'Can I come with a partner or family?', answer: 'Yes, Network School aims to be family-friendly. Your partner needs to apply as well, then contact support@ns.com to confirm. Price is $3,000/month for a couple or family. The team might be able to help you with a 2nd room if space is available.' },
      { question: 'Can I bring coworkers or friends?', answer: 'Possibly. Contact support@ns.com for rooming and admission details.' },
      { question: 'How long can I stay?', answer: 'Monthly stays are standard, with possible extensions and the option to become an NS long-termer.' },
      { question: 'When do cohorts start?', answer: 'Admissions are rolling rather than tied to one fixed annual start date. You generally move in 1st each month.' },
      { question: 'Do I need a visa?', answer: 'It depends on your passport and how long you plan to stay. Most nationalities can enter Malaysia with a 90-day visa-free. You will get more info as soon as you are accepted.' },
      { question: 'What is the refund policy?', answer: 'Public terms say all sales are final and non-refundable.' },
      { question: 'Is there an age requirement?', answer: 'Yes, you must be 18+.' },
      { question: 'How does Network School referral work?', answer: 'Existing members can refer applicants. Referred applicants receive a prioritized review and one week of free stay. Here is our [referral link](https://ns.com/wagmit/apply).' },
      { question: 'How do I get help?', answer: 'If you are curious how life at Network School is you can schedule a [15 min call with us](https://calendar.app.google/qLMUJ9FyAX3n9Ccm7), if you already booked contact support at support@ns.com.' },
    ],
  },
};

// Render text with markdown-style [label](url) links
function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (match) {
          return (
            <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary transition-colors font-bold">
              {match[1]}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

function TextSection({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-2 border-border bg-card shadow-brutal-md">
      <div className="p-4 border-b border-border">
        <h2 className="font-mono font-bold text-sm">[ {title} ]</h2>
      </div>
      <div className="p-6 space-y-4">
        {text.split('\n\n').map((paragraph, i) => (
          <p key={i} className="text-sm font-mono text-muted-foreground leading-relaxed">{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

interface SocietyContentProps {
  societyName: string;
}

export function SocietyContent({ societyName }: SocietyContentProps) {
  const content = SOCIETY_CONTENT[societyNameToSlug(societyName)];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!content) return null;

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="border-2 border-border bg-card shadow-brutal-md">
        <div className="p-4 border-b border-border">
          <h2 className="font-mono font-bold text-sm">[ OVERVIEW ]</h2>
        </div>
        <div className="p-6 space-y-6">
          {content.overview.map((item, i) => (
            <div key={i}>
              <h3 className="font-mono font-bold text-base mb-2">{item.title}</h3>
              <p className="text-sm font-mono text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="border-2 border-border bg-card shadow-brutal-md">
        <div className="p-4 border-b border-border">
          <h2 className="font-mono font-bold text-sm">[ HISTORY ]</h2>
        </div>
        <div className="p-6 space-y-6">
          {content.history.text.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-sm font-mono text-muted-foreground leading-relaxed">{paragraph}</p>
          ))}
        </div>
      </div>

      <TextSection title="LOCATION" text={content.location} />
      <TextSection title="DURATION" text={content.duration} />
      <TextSection title="PRICING" text={content.pricing} />

      {/* Amenities */}
      <div className="border-2 border-border bg-card shadow-brutal-md">
        <div className="p-4 border-b border-border">
          <h2 className="font-mono font-bold text-sm">[ AMENITIES ]</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {content.amenities.map((amenity, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                <span className="text-primary">+</span>
                {amenity}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fellowship */}
      {content.fellowship && (
        <div className="border-2 border-border bg-card shadow-brutal-md">
          <div className="p-4 border-b border-border">
            <h2 className="font-mono font-bold text-sm">[ FELLOWSHIP ]</h2>
          </div>
          <div className="p-6">
            <p className="text-sm font-mono text-muted-foreground leading-relaxed">
              {(() => {
                if (!content.fellowshipUrl) return content.fellowship;

                const text = content.fellowship;
                const marker = 'fellowship';
                const idx = text.toLowerCase().indexOf(marker);
                if (idx === -1) return content.fellowship;

                const before = text.slice(0, idx);
                const matched = text.slice(idx, idx + marker.length);
                const after = text.slice(idx + marker.length);

                return (
                  <>
                    {before}
                    <a
                      href={content.fellowshipUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-primary transition-colors font-bold"
                    >
                      {matched}
                    </a>
                    {after}
                  </>
                );
              })()}
            </p>
          </div>
        </div>
      )}

      {/* Longtermer */}
      {content.longtermer && (
        <div className="border-2 border-border bg-card shadow-brutal-md">
          <div className="p-4 border-b border-border">
            <h2 className="font-mono font-bold text-sm">[ NS LONGTERMER ]</h2>
          </div>
          <div className="p-6">
            <p className="text-sm font-mono text-muted-foreground leading-relaxed">
              <RichText text={content.longtermer} />
            </p>
          </div>
        </div>
      )}

      {/* Kid Friendly */}
      {content.kidFriendly && (
        <div className="border-2 border-border bg-card shadow-brutal-md">
          <div className="p-4 border-b border-border">
            <h2 className="font-mono font-bold text-sm">[ KID FRIENDLY ]</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm font-mono text-muted-foreground leading-relaxed">{content.kidFriendly.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {content.kidFriendly.activities.map((activity, i) => (
                <div key={i} className="border-2 border-border p-3 bg-background">
                  <div className="font-mono font-bold text-sm mb-1">
                    {activity.emoji} {activity.name}
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">{activity.location}</div>
                  <div className="text-xs font-mono text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Discount */}
      {content.discount && (
        <div className="border-2 border-border bg-card shadow-brutal-md">
          <div className="p-4 border-b border-border">
            <h2 className="font-mono font-bold text-sm">[ NETWORK SCHOOL DISCOUNT ]</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm font-mono text-muted-foreground leading-relaxed">
              {(() => {
                const text = content.discount.text;
                const marker = 'our link';
                const idx = text.indexOf(marker);
                if (idx === -1) return text;

                const before = text.slice(0, idx);
                const after = text.slice(idx + marker.length);

                return (
                  <>
                    {before}
                    <a
                      href={content.discount.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-primary transition-colors font-bold"
                    >
                      {marker}
                    </a>
                    {after}
                  </>
                );
              })()}
            </p>
            <a
              href={content.discount.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border bg-primary text-primary-foreground font-mono text-sm font-bold shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-[transform,box-shadow]"
            >
              {content.discount.linkText}
            </a>
          </div>
        </div>
      )}

      {/* How to Enter */}
      <div className="border-2 border-border bg-card shadow-brutal-md">
        <div className="p-4 border-b border-border">
          <h2 className="font-mono font-bold text-sm">[ HOW TO ENTER ]</h2>
        </div>
        <div className="p-6 space-y-4">
          {content.howToEnter.text.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-sm font-mono text-muted-foreground leading-relaxed">
              {i === 0 && content.howToEnter.linkText && content.howToEnter.linkUrl ? (
                <>
                  Applications are submitted{' '}
                  <a
                    href={content.howToEnter.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-primary transition-colors font-bold"
                  >
                    {content.howToEnter.linkText}
                  </a>
                  .{' '}
                </>
              ) : null}
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="border-2 border-border bg-card shadow-brutal-md">
        <div className="p-4 border-b border-border">
          <h2 className="font-mono font-bold text-sm">[ FAQs ]</h2>
        </div>
        <div className="divide-y divide-border">
          {content.faqs.map((faq, i) => (
            <button
              key={i}
              type="button"
              className="w-full text-left p-4 hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-mono font-bold">{faq.question}</span>
                <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </div>
              {openFaq === i && (
                <p className="text-sm font-mono text-muted-foreground leading-relaxed mt-3 pr-8">
                  <RichText text={faq.answer} />
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
