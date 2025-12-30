import type { CoreCommandment } from '@/lib/types/corecommand';

// 16 example core commandments based on Balaji's moral innovations concept
export const coreCommandmentsDatabase: CoreCommandment[] = [
  {
    id: '1',
    title: 'Pseudonymity-by-Default Society',
    commandment: 'Identity is earned through reputation, not documents.',
    description: 'A society where individuals are known by their track record and contributions rather than government-issued identity documents. Your reputation precedes you.',
    upvotes: 87,
    downvotes: 5,
    voterNames: ['CryptoSeth', 'NetworkNomad', 'AnonAlice', 'Web3Warrior', 'SatoshiFan', 'ReputationFirst'],
    createdAt: new Date('2024-01-15'),
    netVotes: 82,
    proposedBy: 'satoshivitalik.eth'
  },
  {
    id: '2',
    title: 'The Merit-Based Migration Society',
    commandment: 'Citizenship is earned through contribution, not birth.',
    description: 'A society where anyone can earn citizenship through skills, community contribution, and alignment with values. Not based on geography of birth.',
    upvotes: 91,
    downvotes: 12,
    voterNames: ['MeritocratMike', 'OpenBorders', 'TalentAttracts', 'SkillOverBirth', 'GlobalCitizen', 'EarnYourPlace'],
    createdAt: new Date('2024-01-20'),
    netVotes: 79,
    proposedBy: 'balajis.eth'
  },
  {
    id: '3',
    title: 'The Reputation-Currency Society',
    commandment: 'Your reputation is your currency, spendable on influence.',
    description: 'A society where social capital is quantified and tradeable. Reputation can be staked on predictions, loaned for projects, or earned through deeds.',
    upvotes: 84,
    downvotes: 8,
    voterNames: ['RepCoin', 'StakeYourRep', 'SocialCapital', 'TrustEconomy', 'Reputable', 'CapitalInKind'],
    createdAt: new Date('2024-01-28'),
    netVotes: 76,
    proposedBy: 'vitalikbuterin.eth'
  },
  {
    id: '4',
    title: 'Renewal Culture: The Cancel-Proof Society',
    commandment: 'Cancellation without due process is bad.',
    description: 'A network union that provides guild membership and cancellation insurance. 99% "peacetime" activities: job finding, promotion, introductions. 1% "wartime": public response or quiet support for those under social attack. Internal due process determines if penalties fit the "crime".',
    upvotes: 72,
    downvotes: 15,
    voterNames: ['DueProcessDan', 'GuildMaster', 'SecondChances', 'ContextMatters', 'RenewalCulture'],
    createdAt: new Date('2024-02-01'),
    netVotes: 57,
    proposedBy: 'balajis.eth'
  },
  {
    id: '5',
    title: 'Keto Kosher: The Sugar-Free Society',
    commandment: 'Health is sovereign, sugar is controlled at the border.',
    description: 'A physical network archipelago that crowdfunds properties worldwide. Processed foods and sugar are banned at the border. Members organize around keto, low-carb, paleo, or carnivore diets. Bulk purchases of continuous glucose monitors and metformin for all.',
    upvotes: 68,
    downvotes: 18,
    voterNames: ['SugarFreeSara', 'KetoKosher', 'MetabolicHealth', 'FoodSovereignty', 'PaleoPeople'],
    createdAt: new Date('2024-02-02'),
    netVotes: 50,
    proposedBy: 'balajis.eth'
  },
  {
    id: '6',
    title: 'Digital Sabbath: The Partially Offline Society',
    commandment: 'Internet is good, but conscious disconnection is also good.',
    description: 'A network archipelago with physical footprint where internet is shut off 9pm-9am. Faraday cage rooms for offline work. Areas flagged as online/offline like smoking sections. Open-source ML tools help prioritize notifications and block distractions.',
    upvotes: 64,
    downvotes: 11,
    voterNames: ['DigitalDetox', 'OfflineFirst', 'ConsciousConnect', 'SabbathKeeper', 'FocusedWork'],
    createdAt: new Date('2024-02-03'),
    netVotes: 53,
    proposedBy: 'balajis.eth'
  },
  {
    id: '7',
    title: 'Your Body, Your Choice: The Post-FDA Society',
    commandment: 'Medical sovereignty is a fundamental right.',
    description: 'A network state with diplomatic recognition providing absolute right to buy/sell any medical product without third-party interference. Requires sanctuary state or international partnership. FDA-free zone for personal medical choice.',
    upvotes: 59,
    downvotes: 24,
    voterNames: ['MedicalFreedom', 'MyBodyMyChoice', 'FDABeGone', 'HealthSovereign', 'OpenMedicine'],
    createdAt: new Date('2024-02-04'),
    netVotes: 35,
    proposedBy: 'balajis.eth'
  },
  {
    id: '8',
    title: 'The Exit-Option Society',
    commandment: 'The right to leave is the ultimate check on power.',
    description: 'A society where all governance structures are opt-in. You can always exit and choose a different community or start your own.',
    upvotes: 54,
    downvotes: 9,
    voterNames: ['VoluntaryistVic', 'FreeExit', 'ChooseYourOwn', 'OptInGovernance'],
    createdAt: new Date('2024-01-18'),
    netVotes: 45,
    proposedBy: 'hitchens.eth'
  },
  {
    id: '9',
    title: 'The Voluntary-Association Society',
    commandment: 'All association is consensual, all governance opt-in.',
    description: 'A society where no governance is imposed without consent. You choose which communities to join and which rules to follow.',
    upvotes: 58,
    downvotes: 7,
    voterNames: ['VoluntaryVince', 'ConsentCulture', 'OptInOnly', 'ChooseYourRules'],
    createdAt: new Date('2024-01-29'),
    netVotes: 51,
    proposedBy: 'rothbard.eth'
  },
  {
    id: '10',
    title: 'The Transparent-Accountability Society',
    commandment: 'All power must be visible and verifiable on-chain.',
    description: 'A society where governance decisions, voting records, and financial flows are transparent and auditable by anyone.',
    upvotes: 61,
    downvotes: 13,
    voterNames: ['TransparentTammy', 'OnChainOracle', 'AuditEverything', 'VisibleGovernance'],
    createdAt: new Date('2024-01-19'),
    netVotes: 48,
    proposedBy: 'czsamoyeda.eth'
  },
  {
    id: '11',
    title: 'The Skill-over-Credential Society',
    commandment: 'Demonstrated competence beats paper credentials.',
    description: 'A society where what you can do matters more than degrees. Skills are proven through portfolios, tests, and real-world projects.',
    upvotes: 66,
    downvotes: 14,
    voterNames: ['SelfTaughtSam', 'BuilderBob', 'NoDegreeNeeded', 'SkillsOverPapers'],
    createdAt: new Date('2024-01-17'),
    netVotes: 52,
    proposedBy: 'naval.eth'
  },
  {
    id: '12',
    title: 'The Cryptographic-Property Society',
    commandment: 'Property rights are secured by cryptography, not courts.',
    description: 'A society where ownership is enforced by private keys and cryptographic proof. Self-sovereign assets that cannot be seized.',
    upvotes: 51,
    downvotes: 16,
    voterNames: ['NotYourKeys', 'SelfSovereignSue', 'CryptoProperty', 'KeysNotCourts'],
    createdAt: new Date('2024-01-27'),
    netVotes: 35,
    proposedBy: 'aantonop.eth'
  },
  {
    id: '13',
    title: 'The Decentralized-Law Society',
    commandment: 'Laws are code, enforced by smart contracts, not people.',
    description: 'A society where rules are transparent, immutable code that applies equally to all. No human discretion in enforcement.',
    upvotes: 57,
    downvotes: 21,
    voterNames: ['CodeIsLaw', 'SmartContractSara', 'AutomatedJustice', 'ImmutableRules'],
    createdAt: new Date('2024-01-21'),
    netVotes: 36,
    proposedBy: 'preethi.eth'
  },
  {
    id: '14',
    title: 'The Data-Sovereignty Society',
    commandment: 'You own your data, rent it out, or revoke access.',
    description: 'A society where personal data is property. You control who accesses it and can monetize or revoke it at will.',
    upvotes: 49,
    downvotes: 12,
    voterNames: ['DataOwnerDan', 'PrivacyFirst', 'MyDataMyChoice', 'DataProperty'],
    createdAt: new Date('2024-01-22'),
    netVotes: 37,
    proposedBy: 'zooko.eth'
  },
  {
    id: '15',
    title: 'The Long-Attention Society',
    commandment: 'Shallow outrage is replaced by slow, sourced argument.',
    description: 'A society that values depth over speed. Arguments must be sourced, thoughtful, and considered. Hot takes are replaced by deep analysis.',
    upvotes: 48,
    downvotes: 10,
    voterNames: ['DeepThinker', 'SlowNews', 'FactChecker', 'PatientZero', 'LongFormOnly'],
    createdAt: new Date('2024-01-16'),
    netVotes: 38,
    proposedBy: 'pg.eth'
  },
  {
    id: '16',
    title: 'The Global-Local Society',
    commandment: 'Think globally, govern locally, cooperate digitally.',
    description: 'A society of network states that are globally connected but locally governed. Physical communities with digital cooperation.',
    upvotes: 53,
    downvotes: 15,
    voterNames: ['GlocalGary', 'NetworkStateNancy', 'LocalAndGlobal', 'PhysicalDigital'],
    createdAt: new Date('2024-01-23'),
    netVotes: 38,
    proposedBy: 'diogenes.eth'
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
