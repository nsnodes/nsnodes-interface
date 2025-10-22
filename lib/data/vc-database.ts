export interface VCFirm {
  name: string;
  contact: string;
  contactX?: string;
  description: string;
  platforms: {
    website: string;
    x?: string;
  };
  topics: string[];
  investments: string[];
  checkSize: string;
}

export const vcDatabase: VCFirm[] = [
    {
      name: "Balaji Fund",
      contact: "Balaji Srinivasan",
      contactX: "https://x.com/balajis",
      description: "Early-stage crypto/Web3 fund with strong Network State focus.",
      platforms: {
        website: "https://venture.angellist.com/v/back/balaji-fund",
      },
      topics: ["Network States", "Crypto", "AI", "Frontier Tech"],
      investments: ["Zora", "Mirror", "Polymarket", "OpenAI", "early Network State experiments"],
      checkSize: "$100k–$1M"
    },
    {
      name: "Pronomos VC",
      contact: "Patri Friedman",
      contactX: "https://x.com/patrissimo",
      description: "Invests in startup societies and charter-city / special-zone governance with clear Network State interest.",
      platforms: {
        website: "https://www.pronomos.vc/",
      },
      topics: ["Charter Cities", "Governance", "Network States"],
      investments: ["Próspera", "Tipolis", "Free Private Cities Foundation"],
      checkSize: "$250k–$2M"
    },
    {
      name: "Tipolis",
      contact: "Titus Gebel",
      contactX: "https://x.com/titusgebel",
      description: "Civic platform focused on governance innovation and digital-native cities, thematically adjacent to Network State ideas.",
      platforms: {
        website: "https://tipolis.com/",
      },
      topics: ["Free Cities", "Governance", "Digital Nations"],
      investments: ["Collaboration with Pronomos", "Free Private Cities Foundation"],
      checkSize: "$100k–$1M"
    },
    {
      name: "Andreessen Horowitz (A16Z)",
      contact: "David George",
      contactX: "https://x.com/DavidGeorge83",
      description: "Top-tier venture firm investing in technology, crypto/Web3, and frontier governance overlap.",
      platforms: {
        website: "https://a16z.com/",
      },
      topics: ["Crypto", "DeFi", "Infrastructure", "Tech"],
      investments: ["Coinbase", "Uniswap", "Dapper Labs", "OpenSea", "Optimism", "Arbitrum", "Worldcoin"],
      checkSize: "$500k–$100M"
    },
    {
      name: "1517 Fund",
      contact: "",
      description: "Early-stage fund investing in frontier science, crypto, and blockchain protocol startups.",
      platforms: {
        website: "https://www.1517fund.com/",
      },
      topics: ["Science", "Crypto", "Frontier Innovation"],
      investments: ["Ethereum Foundation", "Lumina", "Vital Labs", "NuCypher"],
      checkSize: "$100k–$1.5M"
    },
    {
      name: "Network0 / Taureon",
      contact: "Tom Howard",
      contactX: "https://x.com/_TomHoward",
      description: "Web3-focused venture fund backing decentralised governance, token networks, and Network-State-aligned projects.",
      platforms: {
        website: "http://network0.vc/",
      },
      topics: ["Web3", "Governance", "Network States"],
      investments: ["HumanDAO", "CityDAO", "CabinDAO"],
      checkSize: "$250k–$2M"
    },
    {
      name: "Coinbase Ventures",
      contact: "",
      description: "Coinbase’s investment arm — invests in crypto infrastructure, protocols, and Web3 applications.",
      platforms: {
        website: "https://www.coinbase.com/ventures",
      },
      topics: ["Crypto", "Infrastructure", "Web3"],
      investments: ["Base", "LayerZero", "EigenLayer", "Optimism", "Zora", "Blockdaemon"],
      checkSize: "$100k–$5M"
    },
    {
      name: "Pointer Capital",
      contact: "Mike Lewandowski",
      description: "Blockchain & Web3 investor focusing on token-enabled networks and decentralised ecosystems.",
      platforms: {
        website: "https://www.pointer.capital/",
      },
      topics: ["DeFi", "Token Networks", "Web3"],
      investments: ["Web3 infrastructure startups", "Tipolis", "Nomad City"],
      checkSize: "$100k–$1M"
    },
    {
      name: "Draper Associates",
      contact: "Tim Draper",
      description: "Tim Draper’s VC firm investing in frontier tech, crypto, decentralisation, and alternative governance.",
      platforms: {
        website: "http://draper.vc/",
      },
      topics: ["Crypto", "Frontier Tech", "Governance"],
      investments: ["Tesla", "SpaceX", "Coinbase", "Robinhood", "Skype", "Tezos"],
      checkSize: "$1M–$20M+"
    },
    {
      name: "Multicoin Capital",
      contact: "John Robert Reed",
      contactX: "https://x.com/johnrobertreed",
      description: "Crypto asset manager investing in Web3 protocols, DAOs, and decentralised governance systems.",
      platforms: {
        website: "https://multicoin.capital/",
      },
      topics: ["Crypto", "DAOs", "DePIN", "Governance"],
      investments: ["Solana", "Helium", "Arweave", "Monad", "LayerZero"],
      checkSize: "$500k–$10M"
    },
    {
      name: "Pantera Capital",
      contact: "",
      description: "Blockchain and crypto investment firm focusing on infrastructure and tokenised networks.",
      platforms: {
        website: "https://panteracapital.com/",
      },
      topics: ["Blockchain", "DeFi", "Infrastructure"],
      investments: ["Bitstamp", "Circle", "1inch", "Polkadot", "Balancer"],
      checkSize: "$250k–$20M"
    },
    {
      name: "Paradigm",
      contact: "",
      description: "Crypto and Web3 venture fund focusing on decentralised finance, protocol infrastructure, and community-driven networks.",
      platforms: {
        website: "https://www.paradigm.xyz/",
      },
      topics: ["DeFi", "Protocols", "Web3"],
      investments: ["Uniswap", "Optimism", "Friend.tech", "Coinbase", "Flashbots"],
      checkSize: "$1M–$50M"
    },
    {
      name: "Founders Fund",
      contact: "Peter Thiel",
      description: "Peter Thiel’s venture fund investing in frontier tech, crypto, and governance innovation linked to Network State ideas.",
      platforms: {
        website: "https://foundersfund.com/",
      },
      topics: ["Frontier Tech", "Crypto", "Governance"],
      investments: ["Palantir", "SpaceX", "Stripe", "Asana", "Airbnb", "Helion Energy"],
      checkSize: "$1M–$100M+"
    },
    {
      name: "Initialized Capital",
      contact: "",
      description: "Early-stage venture fund investing in tech, crypto, and Web3 with broad focus on founder-led innovation.",
      platforms: {
        website: "https://initialized.com/",
      },
      topics: ["Web3", "Startups", "Crypto"],
      investments: ["Coinbase", "Instacart", "OpenSea", "Reddit", "Patreon"],
      checkSize: "$500k–$5M"
    },
    {
      name: "Cyber Fund",
      contact: "",
      description: "Web3 and crypto infrastructure fund investing in decentralised networks and token governance projects.",
      platforms: {
        website: "https://cyber.fund/",
      },
      topics: ["Crypto Infrastructure", "Governance", "Network States"],
      investments: ["Ethereum", "Cosmos", "Golem", "Polkadot"],
      checkSize: "$100k–$2M"
    },
    {
      name: "David Orban Ventures",
      contact: "David Orban",
      contactX: "https://x.com/davidorban",
      description: "David Orban's personal investment and advisory platform — decentralisation, Web3, and digital governance initiatives.",
      platforms: {
        website: "https://davidorban.com/",
      },
      topics: ["Decentralisation", "AI", "Governance"],
      investments: ["SingularityNET", "Ethereum", "Ocean Protocol", "decentralised AI projects"],
      checkSize: "$50k–$500k"
    },
    {
      name: "Key State Capital",
      contact: "",
      description: "Early-stage Web3 and token-native network investor aligned with network-driven communities.",
      platforms: {
        website: "http://keystate.capital/",
      },
      topics: ["Web3", "Digital Jurisdictions", "Governance"],
      investments: ["Early-stage DeFi", "Digital jurisdiction projects"],
      checkSize: "$250k–$1M"
    },
    {
      name: "NeWay Capital",
      contact: "Erick Brimen",
      contactX: "https://x.com/erickbrimen",
      description: "Invests in frontier tech, crypto, and decentralised governance models exploring alternative institutions.",
      platforms: {
        website: "https://www.newaycapital.com/",
      },
      topics: ["Governance", "Crypto", "Alternative Institutions"],
      investments: ["Web3 and crypto protocols (stealth portfolio)"],
      checkSize: "$250k–$2M"
    },
    {
      name: "Second Renaissance Fund",
      contact: "Thibault Serlet",
      contactX: "https://x.com/tserlet",
      description: "Invests in decentralised, open-source, and crypto systems — supporting networked digital communities.",
      platforms: {
        website: "https://secondrenaissance.com/",
      },
      topics: ["Decentralisation", "Open Source", "Digital Economies"],
      investments: ["Decentralised governance and digital economy projects"],
      checkSize: "$100k–$1M"
    },
    {
      name: "Unit Ventures",
      contact: "",
      description: "Web3 infrastructure & token-network investor with focus on decentralised governance.",
      platforms: {
        website: "https://unitventures.org/",
      },
      topics: ["DAOs", "Token Economy", "Web3"],
      investments: ["Unit Network", "DeFi", "token economy projects"],
      checkSize: "$100k–$500k"
    },
    {
      name: "80eight Ventures",
      contact: "",
      description: "Early-stage crypto & token-native fund investing in decentralised systems, base layers, and AI × crypto startups.",
      platforms: {
        website: "https://www.80eight.vc/",
      },
      topics: ["AI x Crypto", "Decentralised Systems", "Web3"],
      investments: ["Base layer", "AI x Crypto startups"],
      checkSize: "$250k–$2M"
    },
    {
      name: "Lightspeed Venture Partners",
      contact: "Hermant Mohapatra",
      contactX: "https://x.com/MohapatraHemant",
      description: "Global venture firm investing across tech, crypto, and decentralised infrastructure.",
      platforms: {
        website: "https://lsvp.com/",
      },
      topics: ["Tech", "Crypto", "Infrastructure"],
      investments: ["Snapchat", "Ripple", "Polygon", "Alchemy", "Blockchain.com"],
      checkSize: "$1M–$50M"
    },
    {
      name: "Viridis",
      contact: "",
      description: "Web3 and blockchain investor focused on decentralised networks, sustainability, and digital economies.",
      platforms: {
        website: "https://viridis.info/",
      },
      topics: ["ReFi", "Sustainability", "DAO", "Regenerative Finance"],
      investments: ["Tonomy", "Sustainable blockchain", "regen startups"],
      checkSize: "$100k–$1M"
    }
  ];
  

// Helper function to get database statistics
export const getVCDatabaseStats = () => {
  const total = vcDatabase.length;
  
  const topics = vcDatabase.reduce((acc, vc) => {
    vc.topics.forEach(topic => {
      acc[topic] = (acc[topic] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const checkSizes = vcDatabase.reduce((acc, vc) => {
    acc[vc.checkSize] = (acc[vc.checkSize] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    byTopics: topics,
    byCheckSize: checkSizes,
  };
};
