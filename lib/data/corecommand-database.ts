import type { CoreCommandment } from '@/lib/types/corecommand';

// 15 example core commandments based on Balaji's moral innovations concept
export const coreCommandmentsDatabase: CoreCommandment[] = [
  {
    id: '1',
    title: 'Pseudonymity-by-Default Society',
    commandment: 'Identity is earned through reputation, not documents.',
    description: 'A society where individuals are known by their track record and contributions rather than government-issued identity documents. Your reputation precedes you.',
    upvotes: 42,
    downvotes: 3,
    voterNames: ['CryptoSeth', 'NetworkNomad', 'AnonAlice', 'Web3Warrior'],
    createdAt: new Date('2024-01-15'),
    netVotes: 39
  },
  {
    id: '2',
    title: 'The Long-Attention Society',
    commandment: 'Shallow outrage is replaced by slow, sourced argument.',
    description: 'A society that values depth over speed. Arguments must be sourced, thoughtful, and considered. Hot takes are replaced by deep analysis.',
    upvotes: 38,
    downvotes: 5,
    voterNames: ['DeepThinker', 'SlowNews', 'FactChecker', 'PatientZero'],
    createdAt: new Date('2024-01-16'),
    netVotes: 33
  },
  {
    id: '3',
    title: 'The Skill-over-Credential Society',
    commandment: 'Demonstrated competence beats paper credentials.',
    description: 'A society where what you can do matters more than degrees. Skills are proven through portfolios, tests, and real-world projects.',
    upvotes: 56,
    downvotes: 8,
    voterNames: ['SelfTaughtSam', 'BuilderBob', 'NoDegreeNeeded'],
    createdAt: new Date('2024-01-17'),
    netVotes: 48
  },
  {
    id: '4',
    title: 'The Exit-Option Society',
    commandment: 'The right to leave is the ultimate check on power.',
    description: 'A society where all governance structures are opt-in. You can always exit and choose a different community or start your own.',
    upvotes: 44,
    downvotes: 12,
    voterNames: ['VoluntaryistVic', 'FreeExit', 'ChooseYourOwn'],
    createdAt: new Date('2024-01-18'),
    netVotes: 32
  },
  {
    id: '5',
    title: 'The Transparent-Accountability Society',
    commandment: 'All power must be visible and verifiable on-chain.',
    description: 'A society where governance decisions, voting records, and financial flows are transparent and auditable by anyone.',
    upvotes: 51,
    downvotes: 7,
    voterNames: ['TransparentTammy', 'OnChainOracle', 'AuditEverything'],
    createdAt: new Date('2024-01-19'),
    netVotes: 44
  },
  {
    id: '6',
    title: 'The Merit-Based Migration Society',
    commandment: 'Citizenship is earned through contribution, not birth.',
    description: 'A society where anyone can earn citizenship through skills, community contribution, and alignment with values. Not based on geography of birth.',
    upvotes: 35,
    downvotes: 15,
    voterNames: ['MeritocratMike', 'OpenBorders', 'TalentAttracts'],
    createdAt: new Date('2024-01-20'),
    netVotes: 20
  },
  {
    id: '7',
    title: 'The Decentralized-Law Society',
    commandment: 'Laws are code, enforced by smart contracts, not people.',
    description: 'A society where rules are transparent, immutable code that applies equally to all. No human discretion in enforcement.',
    upvotes: 47,
    downvotes: 18,
    voterNames: ['CodeIsLaw', 'SmartContractSara', 'AutomatedJustice'],
    createdAt: new Date('2024-01-21'),
    netVotes: 29
  },
  {
    id: '8',
    title: 'The Data-Sovereignty Society',
    commandment: 'You own your data, rent it out, or revoke access.',
    description: 'A society where personal data is property. You control who accesses it and can monetize or revoke it at will.',
    upvotes: 39,
    downvotes: 6,
    voterNames: ['DataOwnerDan', 'PrivacyFirst', 'MyDataMyChoice'],
    createdAt: new Date('2024-01-22'),
    netVotes: 33
  },
  {
    id: '9',
    title: 'The Global-Local Society',
    commandment: 'Think globally, govern locally, cooperate digitally.',
    description: 'A society of network states that are globally connected but locally governed. Physical communities with digital cooperation.',
    upvotes: 43,
    downvotes: 9,
    voterNames: ['GlocalGary', 'NetworkStateNancy', 'LocalAndGlobal'],
    createdAt: new Date('2024-01-23'),
    netVotes: 34
  },
  {
    id: '10',
    title: 'The Algorithmic-Fairness Society',
    commandment: 'All algorithms must be open-source and auditable.',
    description: 'A society where any algorithm making decisions about people must be transparent, verifiable, and open to public scrutiny.',
    upvotes: 36,
    downvotes: 11,
    voterNames: ['OpenAlgo', 'TransparentTech', 'AuditTheAlgo'],
    createdAt: new Date('2024-01-24'),
    netVotes: 25
  },
  {
    id: '11',
    title: 'The Universal-Basic-Compute Society',
    commandment: 'Compute is a public good, distributed equitably.',
    description: 'A society where computational resources are treated as infrastructure, accessible to all for education, innovation, and participation.',
    upvotes: 28,
    downvotes: 14,
    voterNames: ['ComputeForAll', 'PublicInfra', 'EquitableAccess'],
    createdAt: new Date('2024-01-25'),
    netVotes: 14
  },
  {
    id: '12',
    title: 'The Direct-Democracy Society',
    commandment: 'Every law requires continuous, time-weighted consent.',
    description: 'A society where governance requires ongoing participation. Laws expire without renewed consent. Voting is continuous, not episodic.',
    upvotes: 32,
    downvotes: 19,
    voterNames: ['ContinuousConsent', 'DirectDem', 'AlwaysVoting'],
    createdAt: new Date('2024-01-26'),
    netVotes: 13
  },
  {
    id: '13',
    title: 'The Cryptographic-Property Society',
    commandment: 'Property rights are secured by cryptography, not courts.',
    description: 'A society where ownership is enforced by private keys and cryptographic proof. Self-sovereign assets that cannot be seized.',
    upvotes: 41,
    downvotes: 10,
    voterNames: ['NotYourKeys', 'SelfSovereignSue', 'CryptoProperty'],
    createdAt: new Date('2024-01-27'),
    netVotes: 31
  },
  {
    id: '14',
    title: 'The Reputation-Currency Society',
    commandment: 'Your reputation is your currency, spendable on influence.',
    description: 'A society where social capital is quantified and tradeable. Reputation can be staked on predictions, loaned for projects, or earned through deeds.',
    upvotes: 25,
    downvotes: 22,
    voterNames: ['RepCoin', 'StakeYourRep', 'SocialCapital'],
    createdAt: new Date('2024-01-28'),
    netVotes: 3
  },
  {
    id: '15',
    title: 'The Voluntary-Association Society',
    commandment: 'All association is consensual, all governance opt-in.',
    description: 'A society where no governance is imposed without consent. You choose which communities to join and which rules to follow.',
    upvotes: 48,
    downvotes: 4,
    voterNames: ['VoluntaryVince', 'ConsentCulture', 'OptInOnly'],
    createdAt: new Date('2024-01-29'),
    netVotes: 44
  }
];

// Helper functions
export const getCommandmentsByPopularity = (): CoreCommandment[] => {
  return [...coreCommandmentsDatabase].sort((a, b) => b.netVotes - a.netVotes);
};

export const getCommandmentsByRecency = (): CoreCommandment[] => {
  return [...coreCommandmentsDatabase].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getRandomCommandment = (): CoreCommandment => {
  return coreCommandmentsDatabase[Math.floor(Math.random() * coreCommandmentsDatabase.length)];
};

export const searchCommandments = (query: string): CoreCommandment[] => {
  const lowercaseQuery = query.toLowerCase();
  return coreCommandmentsDatabase.filter(cmd =>
    cmd.title.toLowerCase().includes(lowercaseQuery) ||
    cmd.commandment.toLowerCase().includes(lowercaseQuery) ||
    cmd.description.toLowerCase().includes(lowercaseQuery)
  );
};
