// Network State Jobs Database

export interface Job {
  title: string;
  company: string;
  location: string;
  type: string; // e.g. Full-time, Part-time, Contract
  salary: string;
  description: string;
  tags: string[];
  link: string;
}

export const jobsDatabase: Job[] = [
    {
      title: "Engineer: Crypto",
      company: "Network School",
      location: "Singapore-Johor Special Economic Zone, MY",
      type: "Full-time",
      salary: "Salary + Equity + Membership",
      description: "Work on every aspect of the Network School crypto stack, from onchain payments to new crypto-native functionality. Looking for builders familiar with Bitcoin, Ethereum, Solana, cryptography, and security best practices.",
      tags: ["Engineering", "Crypto", "On-site", "Singapore", "Full-time"],
      link: "https://jobs.ns.com/33467"
    },
    {
      title: "Engineer: Data Scientist",
      company: "Network School",
      location: "Singapore-Johor Special Economic Zone, MY",
      type: "Full-time",
      salary: "Salary + Equity + Membership",
      description: "Analyze datasets, evaluate Network School applications, and design AI-resistant applications at scale. Requires Python and PyData stack proficiency (Pandas, Pytorch, Jupyter, etc).",
      tags: ["Engineering", "Data Science", "Python", "Analytics", "On-site"],
      link: "https://jobs.ns.com/33468"
    },
    {
      title: "Engineer: Web Developer",
      company: "Network School",
      location: "Singapore-Johor Special Economic Zone, MY",
      type: "Full-time",
      salary: "Salary + Equity + Membership",
      description: "Full stack role building web apps using Python/Django/Postgres/React. Contribute to both internal tools and public-facing services at ns.com. Strong command line, Git, and deployment skills expected.",
      tags: ["Engineering", "Web Development", "Full Stack", "React", "Python"],
      link: "https://jobs.ns.com/33461"
    },
    {
      title: "Head of Facilities",
      company: "Network School",
      location: "Singapore-Johor Special Economic Zone, MY",
      type: "Full-time",
      salary: "Salary + Equity",
      description: "Lead the physical buildout of the Network School campus and future expansions. Oversee site selection, contractors, financial modeling, and compliance. Background in real estate, tech, or facilities management preferred.",
      tags: ["Operations", "Real Estate", "Facilities", "Leadership"],
      link: "https://jobs.ns.com/33462"
    },
    {
      title: "Lecturer",
      company: "Network School",
      location: "Singapore-Johor Special Economic Zone, MY",
      type: "Full-time",
      salary: "Salary + Equity + Membership",
      description: "Teach and research at the Network School’s new campus. Organize learnathons, develop onchain credentials, and explore decentralized education. Ideal for pragmatic academics with a STEM or open-source background.",
      tags: ["Education", "STEM", "Lecturer", "Crypto", "On-site"],
      link: "https://jobs.ns.com/33918"
    },
    {
      title: "Product Designer",
      company: "Network School",
      location: "Singapore-Johor Special Economic Zone, MY",
      type: "Full-time",
      salary: "Salary + Equity + Membership",
      description: "Design every digital and physical interface of the Network School. Requires strong Figma and visual design skills, taste, and experience across branding, UI, and multimedia. Crypto familiarity preferred.",
      tags: ["Design", "Product", "Figma", "Creative", "On-site"],
      link: "https://jobs.ns.com/33465"
    },
    {
      title: "Volunteer Lead",
      company: "Edge City",
      location: "San Martín de los Andes, Argentina (Edge City Patagonia)",
      type: "Volunteer/On-site",
      salary: "Not specified",
      description: "Lead the volunteer corps for Edge City Patagonia. Recruit and onboard volunteers, foster community, and ensure everyone has the support they need to contribute meaningfully to the monthlong popup village.",
      tags: ["Volunteer", "Community", "Events", "On-site"],
      link: "https://www.notion.so/edgecity/Edge-City-is-hiring-join-our-team-23ad45cdfc59808297dce5f1ed5f1bed"
    },
    {
      title: "Production Team Roles",
      company: "Edge City",
      location: "San Martín de los Andes, Argentina",
      type: "On-site",
      salary: "Not specified",
      description: "Edge City Patagonia seeks Production Assistants, Residency Coordinators, Technical Support, Space Managers and other roles to help run the popup village. These positions require organized, proactive individuals to manage AV equipment, coordinate wellness spaces and support residency leads.",
      tags: ["Events", "Production", "Operations", "On-site"],
      link: "https://www.notion.so/edgecity/Edge-City-is-hiring-join-our-team-23ad45cdfc59808297dce5f1ed5f1bed"
    },
    {
      title: "Growth and Community Lead",
      company: "Edge City",
      location: "Remote / Global",
      type: "Full-time",
      salary: "Not specified",
      description: "Scale Edge City’s reach by leading growth efforts across social media, newsletters, partnerships and events. The role focuses on storytelling, strategy and community-building to drive participation in popup villages and deepen engagement with the global network of builders.",
      tags: ["Marketing", "Community", "Growth", "Remote"],
      link: "https://www.notion.so/edgecity/Edge-City-is-hiring-join-our-team-23ad45cdfc59808297dce5f1ed5f1bed"
    },
    {
      title: "Next-Gen Marketing Generalist",
      company: "Infinita City",
      location: "Remote/Hybrid with trips to Roatán, Honduras",
      type: "Full-time (6-month trial, then permanent)",
      salary: "Competitive Salary",
      description: "A full-stack marketing, design and web-development role. Responsibilities include crafting landing page copy, producing visuals, building responsive Webflow pages, managing community updates and running digital marketing experiments. The role offers direct mentorship and hybrid work: remote plus opportunities to work in Roatán.",
      tags: ["Marketing", "Design", "Web Development", "AI", "Hybrid"],
      link: "https://www.infinita.city/careers/next-gen-marketing-generalist"
    },
    {
      title: "Commercial Developer (Biotech, Crypto and Local Partnerships)",
      company: "Infinita City",
      location: "Hybrid (Remote + on-site trips)",
      type: "Full-time",
      salary: "Not specified",
      description: "Grow the adoption of Infinita’s $LIVES token and build networks across biotech and crypto. Duties include onboarding users, partners and vendors; connecting biotech startups and crypto protocols; and liaising with investors.",
      tags: ["Business Development", "Partnerships", "Biotech", "Crypto"],
      link: "https://www.infinita.city/careers/commercial-developer"
    },
    {
      title: "Community Developer (Prospera/Roatán Hub)",
      company: "Infinita City",
      location: "Roatán, Honduras",
      type: "Full-time",
      salary: "Not specified",
      description: "High-energy role focused on growing the Roatán community. Responsibilities include organizing local events (dinners, sports clubs), serving as point of contact for residents, communicating weekly updates and supporting event logistics.",
      tags: ["Community", "Events", "Communications", "On-site"],
      link: "https://www.infinita.city/careers/community-developer"
    },
    {
      title: "Open-Ended Entrepreneurial Positions",
      company: "Infinita City",
      location: "Roatán, Honduras",
      type: "Full-time",
      salary: "Not specified",
      description: "A call for exceptional entrepreneurs to create their own roles. Suggested projects include developing a Roatan Institute of Technology, building a bio-cyberpunk lab and expanding the $LIVES ecosystem.",
      tags: ["Entrepreneurship", "Innovation", "Biotech", "Crypto"],
      link: "https://www.infinita.city/careers/entrepreneurial-positions"
    },
    {
      title: "Ambassador Program",
      company: "Infinita City",
      location: "Roatán, Honduras / Remote",
      type: "Half-time",
      salary: "Not specified",
      description: "Action-takers support the growth of Infinita’s $LIVES ecosystem through community outreach, content creation and onboarding vendors. Ambassadors are treated as partners and start with a 30-day trial period.",
      tags: ["Ambassador", "Community", "Marketing", "Part-time"],
      link: "https://www.infinita.city/careers/ambassador"
    },
    {
      title: "Employment Opportunities",
      company: "Liberland Marketplace",
      location: "Prague, Czechia / Remote",
      type: "Unspecified",
      salary: "Not specified",
      description: "Liberland Marketplace invites those interested in employment opportunities to email the team. There is no specific job listing; applicants should contact admin@market.ll.land.",
      tags: ["Marketplace", "Careers", "General"],
      link: "https://market.ll.land/contact-us/#careers"
    }
  ]
  
  

// Example helpers if we need filtering later
export const getJobsByTag = (tag: string) =>
  jobsDatabase.filter(j => j.tags.includes(tag));

export const getJobsByType = (type: Job["type"]) =>
  jobsDatabase.filter(j => j.type === type);


