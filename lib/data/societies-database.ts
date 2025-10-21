// Comprehensive Network State Societies Database
// This file contains all society information and application data for Network State societies

export interface SocietyDatabase {
  name: string;
  url: string;
  type: string;
  tier: number;
  x: string;
  discord: string;
  mission: string;
  application: string;
  location?: string;
}

export const societiesDatabase: SocietyDatabase[] = [
  // ----- Tier 1 -----
  {
    name: "4seas",
    url: "https://www.4seas.xyz/",
    type: "Popup",
    tier: 1,
    x: "https://x.com/4seasdesoc",
    discord: "",
    mission:
      "To create a crypto nomad start-up society that integrates crypto technology and innovative societal practices.",
    application: "https://www.newnationproject.org/",
    location: "Thailand",
  },
  {
    name: "Atlas Island",
    url: "https://atlasisland.org/",
    type: "Physical",
    tier: 1,
    x: "https://x.com/AtlasIsland_",
    discord: "",
    mission:
      "To create a floating city-state that upholds individual sovereignty and the non-aggression principle.",
    application: "https://atlasisland.org/join.php",
    location: "Global",
  },
  {
    name: "build_republic",
    url: "https://www.buildcities.network/",
    type: "Decentralized",
    tier: 1,
    x: "https://x.com/buildcities",
    discord: "",
    mission: "Building a protocol for startup cities.",
    application: "https://app.buildcities.network/",
    location: "Global",
  },
  {
    name: "Cryptocity",
    url: "https://cryptocity.land/",
    type: "Physical",
    tier: 1,
    x: "https://x.com/CryptoCityVE",
    discord: "",
    mission:
      "To build a community of entrepreneurs using blockchain technology on Margarita Island, Venezuela.",
    application: "https://cryptocity.land/reservations/",
    location: "Venezuela",
  },
  {
    name: "Don't Die",
    url: "https://dontdie.com/",
    type: "Decentralized",
    tier: 1,
    x: "https://x.com/bryan_johnson",
    discord: "https://discord.gg/bryanjohnson",
    mission:
      "To defeat all causes of human and planetary death, promoting prosperity and longevity.",
    application: "https://citizenship.dontdie.com/",
    location: "USA,Global",
  },
  {
    name: "Edge City",
    url: "http://edgecity.live/",
    type: "Popup",
    tier: 1,
    x: "https://x.com/JoinEdgeCity",
    discord: "",
    mission:
      "A month-long gathering for people building a brighter future.",
    application: "https://edgecity.simplefi.tech/auth",
    location: "USA,Global",
  },
  {
    name: "Edge Esmeralda",
    url: "https://www.edgeesmeralda.com/",
    type: "Popup",
    tier: 1,
    x: "https://x.com/EdgeEsmeralda",
    discord: "",
    mission:
      "A month-long gathering for people building a brighter future.",
    application: "https://edgecity.simplefi.tech/auth",
    location: "USA,Global",
  },
  {
    name: "Forma City",
    url: "https://forma.city",
    type: "Physical",
    tier: 1,
    x: "https://x.com/formacity",
    discord: "",
    mission:
      "To build Solana Economic Zones (SEZs) around the world, bridging web3 economy with national economies.",
    application: "https://forma.city/apply",
    location: "Global",
  },
  {
    name: "Freeth'm",
    url: "https://www.freethm.com/",
    type: "Physical",
    tier: 1,
    x: "https://x.com/Freethmtowns/",
    discord: "",
    mission:
      "To create decentralized, self-sufficient towns for individuals seeking freedom and privacy.",
    application: "https://www.freethm.com/contact-customers-form",
    location: "Portugal,Spain,Global",
  },
  {
    name: "Infinita",
    url: "https://infinita.city",
    type: "Popup",
    tier: 1,
    x: "https://x.com/InfinitaCity",
    discord: "",
    mission:
      "To accelerate life extension technologies through a decentralized city model.",
    application: "https://lu.ma/infinita-roatan-2025?tk=QuY3dV",
    location: "Honduras",
  },
  {
    name: "Ipê City",
    url: "https://ipe.city/",
    type: "Popup",
    tier: 1,
    x: "https://x.com/ipecity",
    discord: "https://discord.gg/QKwh8deMPx",
    mission:
      "Build network societies as a community of techno-optimists.",
    application:
      "https://docs.google.com/forms/d/e/1FAIpQLSfvWxhzOXadlutDYnz1Kzkmi4NlCofVFXVXBLI4b_YZDyZtqg/viewform",
    location: "Brazil,Global",
  },
  {
    name: "Liberland",
    url: "https://liberland.org/",
    type: "Physical",
    tier: 1,
    x: "https://x.com/liberland_org",
    discord: "",
    mission:
      "To create a new libertarian country based on personal and economic freedom.",
    application: "https://sso.liberland.org/signup",
    location: "Croatia,Serbia",
  },
  {
    name: "Logos",
    url: "https://logos.co/",
    type: "Online",
    tier: 1,
    x: "https://x.com/logos_network",
    discord: "https://discord.gg/logosnetwork",
    mission:
      "To create a self-sovereign, privacy-preserving, decentralized network state.",
    application: "https://logos.co/participate",
    location: "Global",
  },
  {
    name: "Montelibero",
    url: "https://montelibero.org/",
    type: "Physical",
    tier: 1,
    x: "https://x.com/MonteliberoFSPE",
    discord: "",
    mission:
      "To build a libertarian society in Europe, starting with Montenegro, focused on freedom and minimal state intervention.",
    application:
      "https://montelibero.org/2024/02/25/faq_how-to-participate-in-montelibero-remotely/",
    location: "Montenegro",
  },
  {
    name: "Próspera",
    url: "https://prospera.co",
    type: "Physical",
    tier: 1,
    x: "https://x.com/prosperaglobal",
    discord: "https://discord.gg/6qaEDm4SBN",
    mission:
      "Building a startup city on Honduras' Roatan Island.",
    application: "https://www.prospera.co/en/visit",
    location: "Honduras,Global",
  },
  {
    name: "Sealand",
    url: "https://sealandgov.org/en-as",
    type: "Physical",
    tier: 1,
    x: "https://x.com/sealandgov",
    discord: "",
    mission:
      "Establish and maintain Sealand as an independent, sovereign state with a focus on freedom.",
    application:
      "https://sealandgov.org/en-as/pages/sealand-e-citizenship",
    location: "UK,Global",
  },
  {
    name: "sovs.xyz",
    url: "http://sovs.xyz/",
    type: "Online",
    tier: 1,
    x: "",
    discord: "",
    mission: "Enable individuals to declare personal sovereignty on-chain.",
    application: "http://sovs.xyz/",
    location: "Global",
  },
  {
    name: "The Network School",
    url: "https://ns.com/",
    type: "Physical",
    tier: 1,
    x: "https://x.com/balajis",
    discord: "",
    mission:
      "A startup society for tech founders, AI creators, and remote workers.",
    application: "https://ns.com/apply",
    location: "Malaysia",
  },
  {
    name: "VDAO",
    url: "https://manifesto.vdao.io/manifesto",
    type: "Decentralized",
    tier: 1,
    x: "https://x.com/joinvdao",
    discord: "",
    mission:
      "To create a decentralized, community-driven venture capital fund that democratizes access to investment opportunities.",
    application: "https://manifesto.vdao.io/manifesto",
    location: "Global",
  },
  {
    name: "Zuzalu",
    url: "https://www.zuzalu.city/",
    type: "Physical",
    tier: 1,
    x: "https://x.com/Zuzalu_city",
    discord: "",
    mission:
      "To create a pop-up city that fosters innovation and cultural exchange.",
    application:
      "https://zuzalu.gitbook.io/zuzalu-beta-docs/integration/join-for-integration-collaboration-research-and-development",
    location: "Montenegro",
  },
    // ----- Tier 2 -----
    {
      name: "Afropolitan",
      url: "https://afropolitan.io/",
      type: "Decentralized",
      tier: 2,
      x: "https://twitter.com/afropolitan",
      discord: "https://discord.gg/NhJctu3m",
      mission: "Building a pan-African digital nation.",
      application:
        "https://2diidsvpe0l.typeform.com/to/FxdsdaMB?typeform-source=t.co",
      location: "Africa,Brazil,USA",
    },
    {
      name: "Aleph Citadel",
      url: "https://alephcitadel.com/",
      type: "Physical",
      tier: 2,
      x: "https://x.com/AlephCitadel",
      discord: "",
      mission:
        "To create a decentralized society and innovation hub.",
      application: "https://alephcitadel.com/",
      location: "Argentina",
    },
    {
      name: "Auravana",
      url: "https://auravana.org/",
      type: "Physical",
      tier: 2,
      x: "https://x.com/TrvsGrant",
      discord: "",
      mission:
        "To design a new social system based on sustainability and resource management.",
      application:
        "https://auravana.org/what-we-do/contribution-procedures/",
      location: "Global",
    },
    {
      name: "Black Sky Society",
      url: "https://blacksky.network/",
      type: "Online",
      tier: 2,
      x: "https://x.com/BlackSkySociety",
      discord: "",
      mission: "Hack the matrix of subquantum reality.",
      application:
        "https://postweb.nexus/raw/rad:z2fNbaEJvctMicPrHGryuRkXH37sz/head/get-involved.html",
      location: "Global",
    },
    {
      name: "Catawba (CDEZ)",
      url: "https://catawbadigital.zone/",
      type: "Physical",
      tier: 2,
      x: "https://x.com/CatawbaDEZ",
      discord: "",
      mission:
        "To create a regulatory framework that supports digital entrepreneurs and innovation in emerging technologies.",
      application: "https://app.catawbadigital.zone/",
      location: "United States",
    },
    {
      name: "City of Telosa",
      url: "https://cityoftelosa.com/",
      type: "Physical",
      tier: 2,
      x: "https://twitter.com/CityofTelosa",
      discord: "",
      mission:
        "Creating an economic system in which citizens have a stake in the city's land.",
      application: "https://cityoftelosa.com/contact-us/",
      location: "USA,Canada,Global",
    },
    {
      name: "Culdesac",
      url: "https://culdesac.com/",
      type: "Physical",
      tier: 2,
      x: "https://twitter.com/culdesac",
      discord: "",
      mission: "Building a car-free neighborhood.",
      application: "https://culdesac.com/join-us/",
      location: "USA,Canada,Global",
    },
    {
      name: "Elenarda",
      url: "https://elenarda.substack.com/",
      type: "Online",
      tier: 2,
      x: "https://x.com/i/communities/1861081486495002979",
      discord: "https://discord.gg/ZfvAWseyQz",
      mission:
        "Elenarda is the Space Nation. Our people will steward mankind to the farthest star and beyond.",
      application: "https://discord.gg/ZfvAWseyQz",
    },
    {
      name: "Eleutheria",
      url: "https://www.newnationproject.org/",
      type: "Online",
      tier: 2,
      x: "https://x.com/real_eleutheria",
      discord: "",
      mission:
        "Establish a free nation with limited government, free markets, and Judeo-Christian values, in Bir Tawil or by seasteading.",
      application: "https://www.newnationproject.org/",
    },
    {
      name: "Free Gallaecia",
      url: "https://freegallaecia.org/",
      type: "Physical",
      tier: 2,
      x: "",
      discord: "",
      mission:
        "Provide a safe, affordable, and libertarian-friendly haven in Northwest Iberia for those seeking freedom.",
      application: "https://freegallaecia.org/",
    },
    {
      name: "FREE Madeira",
      url: "https://www.freemadeira.com/",
      type: "Physical",
      tier: 2,
      x: "https://x.com/FREEMadeiraOrg",
      discord: "",
      mission:
        "Promote Madeira as a hub for Bitcoin and blockchain innovation.",
      application: "https://www.freemadeira.com/contact",
    },
    {
      name: "Free Republic of Verdis",
      url: "https://verdisgov.org/",
      type: "Physical",
      tier: 2,
      x: "https://x.com/verdisgov",
      discord: "",
      mission:
        "To establish a sovereign state with democratic values, environmental consciousness, and ethnic reconciliation.",
      application: "https://verdisgov.org/services/e-residency/",
    },
    {
      name: "Freedom Haven",
      url: "https://freedomhaven.org/",
      type: "Physical",
      tier: 2,
      x: "https://x.com/haven_freedom",
      discord: "",
      mission:
        "Bring prosperity of free markets to liberty immigrants.",
      application: "https://freedomhaven.org/",
    },
    {
      name: "Illuminated DAO",
      url: "https://linktr.ee/Illuminateddao",
      type: "Online",
      tier: 2,
      x: "https://twitter.com/IlluminatedDAO",
      discord: "",
      mission: "To bring the power of web3 to governments.",
      application: "https://linktr.ee/Illuminateddao",
    },
    {
      name: "Isla de LOBOS",
      url: "https://isladelobos.xyz/",
      type: "Physical",
      tier: 2,
      x: "https://x.com/isladelobos",
      discord: "",
      mission:
        "To establish a decentralized and 100% sustainable community through the L.O.B.O.S. DAO.",
      application: "https://isladelobos.xyz/#about",
    },
    {
      name: "Metastate",
      url: "https://www.metastate.is/",
      type: "Online",
      tier: 2,
      x: "https://x.com/metastate_union",
      discord: "",
      mission:
        "To advance blockchain technology through research and development, focusing on protocol architecture and cryptography.",
      application: "https://www.metastate.is/",
    },
    {
      name: "MoonDAO",
      url: "https://www.moondao.com/",
      type: "Online",
      tier: 2,
      x: "https://x.com/OfficialMoonDAO",
      discord: "",
      mission:
        "To fund, collaborate, and compete on challenges that get us closer to a lunar settlement.",
      application: "https://moondao.com/citizen",
    },
    {
      name: "Network State Genesis",
      url: "https://genesis.re/",
      type: "Online",
      tier: 2,
      x: "https://x.com/genesisdotre",
      discord: "",
      mission:
        "Establish a network state with a multiplanetary focus.",
      application: "https://planetarycouncil.org/",
    },
    {
      name: "Our World",
      url: "https://www.ourworldthegame.com/",
      type: "Online",
      tier: 2,
      x: "https://x.com/OurWorldTheGame",
      discord: "",
      mission:
        "To create an immersive, educational, and entertaining platform.",
      application: "https://www.ourworldthegame.com/",
    },
    {
      name: "Palestra",
      url: "https://www.palestrasociety.com/",
      type: "Popup",
      tier: 2,
      x: "https://x.com/PalestraSociety",
      discord: "",
      mission:
        "To curate digital inputs and transform them into physical outcomes that shape the future through model governance.",
      application: "https://www.palestrasociety.com/join",
    },
    {
      name: "Praxis",
      url: "https://praxissociety.com/",
      type: "Online",
      tier: 2,
      x: "https://twitter.com/PraxisSociety",
      discord: "https://discord.gg/praxis",
      mission:
        "Building a new city that enables us to live more vital lives.",
      application: "https://www.praxissociety.com/apply",
    },
    {
      name: "Principato di Seborga",
      url: "https://www.principatodiseborga.com/en",
      type: "Physical",
      tier: 2,
      x: "https://x.com/PrincSeborga",
      discord: "",
      mission:
        "Maintain and protect Seborga’s cultural identity, sovereignty, and independence.",
      application:
        "https://www.principatodiseborga.com/en",
    },
    {
      name: "Sri Lanka Startup Zone",
      url: "https://investinginsrilanka.com/",
      type: "Physical",
      tier: 2,
      x: "",
      discord: "",
      mission:
        "Unlock the potential of Sri Lanka for human flourishing.",
      application: "https://form.fillout.com/t/w5D5rYy1Y4us",
    },
    {
      name: "The Anthem Initiative",
      url: "https://anthemism.org/",
      type: "Online",
      tier: 2,
      x: "https://x.com/Anthemism_PR",
      discord: "",
      mission:
        "Found a new sovereign capitalist state based on Ayn Rand’s philosophy.",
      application: "https://anthemism.org/",
    },
    {
      name: "Tonomy",
      url: "https://tonomy.io/",
      type: "Online",
      tier: 2,
      x: "https://x.com/TonomyF",
      discord: "https://discord.com/invite/8zDf8AF3ja",
      mission:
        "To establish the Pangea Virtual Nation — a global, sovereign digital community powered by decentralized governance, AI, and self-sovereign identity.",
      application: "",
    },
    {
      name: "Užupis",
      url: "http://www.uzupiorespublika.com/en/home/",
      type: "Physical",
      tier: 2,
      x: "https://x.com/uzupis",
      discord: "",
      mission:
        "To create a space for freedom, creativity, and self-expression.",
      application: "https://www.uzupiorespublika.com/en/citizenship/",
    },
    {
      name: "Vibe Camp",
      url: "https://vibe.camp/",
      type: "Popup",
      tier: 2,
      x: "https://x.com/vibecamp_",
      discord: "https://discord.gg/uRFTfbFt8U",
      mission:
        "To foster friendships and perpetuate play in a world that systemically squashes both.",
      application: "https://vibe.camp/events/",
    },
    {
      name: "Viva City",
      url: "https://viva.city/",
      type: "Physical",
      tier: 2,
      x: "https://x.com/JoinVivaCity",
      discord: "",
      mission:
        "To build a city focused on longevity and advanced medicine.",
      application: "https://join.cityofviva.com/",
    },
    {
      name: "WERA Global",
      url: "https://www.wera.global/",
      type: "Physical",
      tier: 2,
      x: "https://x.com/wera_global",
      discord: "",
      mission:
        "To unite cultures and networks through human-centric AI while upholding human rights.",
      application: "https://www.wera.global/virtual-visa",
    },
    {
      name: "World Community Network",
      url: "https://worldcommunitynetwork.org/",
      type: "Online",
      tier: 2,
      x: "https://x.com/brentnhunter",
      discord: "",
      mission:
        "To create a blueprint for a new world of harmony and abundance through collective action and global connectivity.",
      application: "https://worldcommunitynetwork.org/",
    },
    {
      name: "Zeta House",
      url: "https://zeta.house",
      type: "Physical",
      tier: 2,
      x: "",
      discord: "https://discord.gg/uyPSXfNSyB",
      mission:
        "Zeta House is a dynamic coliving and coworking community in Austin Texas.",
      application: "https://zeta.house/apply",
    },
    {
      name: "Zu-Grama",
      url: "https://zugrama.org/",
      type: "Physical",
      tier: 2,
      x: "https://x.com/ZuGramaIndia",
      discord: "",
      mission:
        "To catapult India’s innovation ecosystem by connecting local talent with international experts and investors.",
      application:
        "https://docs.google.com/forms/d/e/1FAIpQLSc_3i_wopy0YxWLqn58C8I-0iKLPrXRF5l0c_t6r1cHLV7lCw/viewform",
    },
    {
      name: "Zuitzerland",
      url: "https://zuitzerland.ch/",
      type: "Physical",
      tier: 2,
      x: "https://x.com/zuitzerland",
      discord: "",
      mission:
        "To develop decentralized leadership models, create an integrated network society, and apply defensive accelerationism principles.",
      application:
        "https://blocksurvey.io/zuitzerland-2025-application-form-Zs7vnCSsQwSyG1qAGRNVWw?v=o",
    },
    // ----- Tier 3 -----
    {
      name: "Aleph 3",
      url: "https://www.aleph.crecimiento.build/",
      type: "Popup",
      tier: 3,
      x: "https://x.com/intent/user?screen_name=crecimientoar",
      discord: "",
      mission:
        "To catalyze crypto-enabled solutions addressing economic challenges and fuel innovation in Argentina.",
      application:
        "https://airtable.com/appENuebGSKMB5sia/pagvzrYUDDQAxMN43/form",
    },
    {
      name: "AnotherNation",
      url: "https://www.anothernation.xyz/",
      type: "Online",
      tier: 3,
      x: "https://x.com/another__nation",
      discord: "",
      mission:
        "To create global, unique physical spaces (embassies).",
      application: "https://www.anothernation.xyz/",
    },
    {
      name: "Asgardia",
      url: "https://asgardia.space/en/",
      type: "Online",
      tier: 3,
      x: "https://x.com/AsgardiaSpace",
      discord: "",
      mission:
        "Establish a peaceful, independent nation in space for the benefit of all humanity.",
      application: "https://asgardia.space/en/page/resident-card",
    },
    {
      name: "Avalon",
      url: "https://modelhof.com/index.html",
      type: "Physical",
      tier: 3,
      x: "",
      discord: "",
      mission:
        "Foster personal development, independence, and freedom from societal constraints.",
      application: "https://modelhof.com/index.html",
    },
    {
      name: "Bloom City",
      url: "https://www.jellyfishdao.org/bloom-city",
      type: "Online",
      tier: 3,
      x: "https://x.com/JellyfishDAO",
      discord: "",
      mission:
        "To establish positive entertainment and organic collaboration to transform societal perceptions of aging.",
      application: "https://form.jotform.com/242383937439064",
    },
    {
      name: "Blue Frontier",
      url: "https://www.seasteading.org/blue-frontiers-an-independent-for-profit-seasteading-venture/",
      type: "Physical",
      tier: 3,
      x: "https://x.com/seasteading",
      discord: "",
      mission:
        "To build the first seastead, creating a floating city with innovative governance and sustainable living.",
      application: "https://www.seasteading.org/get-involved/",
    },
    {
      name: "City of Atlantus",
      url: "https://www.coa.build/",
      type: "Online",
      tier: 3,
      x: "https://x.com/OloSears",
      discord: "",
      mission:
        "To create a virtual and real city that integrates industry and community.",
      application: "https://app.coa.build/",
    },
    {
      name: "Ciudad Morazan",
      url: "https://www.morazan.city/",
      type: "Physical",
      tier: 3,
      x: "https://x.com/ciudadmorazan1",
      discord: "",
      mission:
        "To create a safe, self-sustaining, and business-friendly community offering industrial, residential, and commercial spaces.",
      application: "https://www.morazan.city/contact/",
    },
    {
      name: "Closer",
      url: "https://closer.earth/",
      type: "Online",
      tier: 3,
      x: "https://x.com/closerearth",
      discord: "",
      mission:
        "Pioneer the future of regenerative living through technology.",
      application: "team@closer.earth",
    },
    {
      name: "Draper Nation",
      url: "https://drapernation.com/",
      type: "Online",
      tier: 3,
      x: "https://x.com/DraperNationHQ",
      discord: "",
      mission:
        "Create a digital nation, citizen-governed, with freedom of movement and a seamless, borderless life.",
      application: "https://app.drapernation.com/",
    },
    {
      name: "Figment",
      url: "https://www.figment.live/",
      type: "Physical",
      tier: 3,
      x: "https://x.com/livefigment",
      discord: "https://discord.gg/PFvN2rFwbr",
      mission: "Building a club in the metaverse.",
      application: "https://www.figment.live/",
    },
    {
      name: "Fractally",
      url: "https://fractally.com/",
      type: "Online",
      tier: 3,
      x: "https://x.com/gofractally",
      discord: "",
      mission:
        "To create decentralized governance models and tools.",
      application: "https://fractally.com/",
    },
    {
      name: "Gelephu Mindfulness City",
      url: "https://gmc.bt/",
      type: "Physical",
      tier: 3,
      x: "https://x.com/gelephumindcity",
      discord: "",
      mission:
        "Integrate economic growth with mindfulness and sustainability.",
      application: "https://gmc.bt/engage/",
    },
    {
      name: "Immortalis",
      url: "https://joinimmortalis.com/",
      type: "Decentralized",
      tier: 3,
      x: "https://x.com/realmarkhamiltn",
      discord: "",
      mission:
        "To build a new society governed by the Prime Law.",
      application:
        "https://immortalis.mn.co/sign_up?from=https%3A%2F%2Fimmortalis.mn.co%2F%3Fautojoin%3D1&space_id=17126770",
    },
    {
      name: "Joseon",
      url: "https://www.joseon.com/l/en-US/",
      type: "Physical",
      tier: 3,
      x: "https://x.com/joseon_empire",
      discord: "",
      mission:
        "Introduce a sovereign cyber nation with a legal framework for personal interest corporations (Denizens).",
      application: "https://www.joseon.com/l/en-US/login",
    },
    {
      name: "Kleros",
      url: "https://kleros.io/",
      type: "Online",
      tier: 3,
      x: "https://x.com/kleros_io?",
      discord: "https://discord.gg/MhXQGCyHd9",
      mission:
        "To democratize access to justice using cutting-edge technologies.",
      application: "https://court.kleros.io/",
    },
    {
      name: "KONG Land",
      url: "https://www.kong.land/#/",
      type: "Decentralized",
      tier: 3,
      x: "https://x.com/kongiscash",
      discord: "https://discord.gg/dypeg4JfTX",
      mission:
        "To establish a blockchain-based ecosystem for digital identity, authentication, and transaction verification.",
      application:
        "https://app.uniswap.org/swap?exactField=output&exactAmount=1&outputCurrency=0x77F0cc420dEa0aE726Db6Bef1460A4B69176A8Ea&chain=mainnet",
    },
    {
      name: "League of Free Cities",
      url: "https://lofc.io/",
      type: "Online",
      tier: 3,
      x: "",
      discord: "",
      mission:
        "Support localized autonomy of present and aspiring Free Cities.",
      application: "https://form.fillout.com/t/gPJBTGq98Aus",
    },
    {
      name: "Liberstad",
      url: "https://www.liberstad.com/",
      type: "Physical",
      tier: 3,
      x: "https://x.com/liberstad",
      discord: "",
      mission:
        "To build a free city based on voluntary interactions, freedom, and mutual respect.",
      application: "https://www.liberstad.com/",
    },
    {
      name: "Loci",
      url: "https://lociproperty.com/",
      type: "Physical",
      tier: 3,
      x: "https://x.com/LociBrand",
      discord: "",
      mission: "To create a network of micro-communities.",
      application:
        "https://locilife.com/product/limited-edition-membership-enrollment/",
    },
    {
      name: "Lumina",
      url: "https://lumina.earth/",
      type: "Online",
      tier: 3,
      x: "https://x.com/luminagov",
      discord: "",
      mission:
        "To build a city grounded in direct democracy, empowering residents to participate in decision-making.",
      application: "https://lumina.earth/citizenship",
    },
    {
      name: "Metropolis Global",
      url: "https://metropolisglobal.com",
      type: "Online",
      tier: 3,
      x: "https://x.com/metropolishub",
      discord: "",
      mission:
        "Connect global citizens with international government services.",
      application: "https://www.youtube.com/watch?v=3fpbR_q6Ukw",
    },
    {
      name: "Netx State",
      url: "https://bento.me/netxstate",
      type: "Decentralized",
      tier: 3,
      x: "https://x.com/NetxState",
      discord: "",
      mission:
        "To create a network of regenerative nodes across all bioregions of Argentina.",
      application: "https://www.netxstate.com/en/contact",
    },
    {
      name: "Nomad Nation",
      url: "https://nomadnation.co/",
      type: "Decentralized",
      tier: 3,
      x: "https://x.com/NOMADcoliving",
      discord: "",
      mission:
        "To create decentralized living spaces for digital nomads, providing flexibility and freedom in accommodation.",
      application: "https://nomadnation.co/black-1",
    },
    {
      name: "Oceanix",
      url: "https://oceanixcity.com/",
      type: "Physical",
      tier: 3,
      x: "https://twitter.com/OceanixCity",
      discord: "",
      mission:
        "Creating new land for the coastal city of Busan, Korea.",
      application: "https://oceanixcity.com/contact-us/",
    },
    {
      name: "Panarmenian",
      url: "https://networkstate.io/",
      type: "Online",
      tier: 3,
      x: "https://x.com/ArmNetworkState",
      discord: "",
      mission:
        "To unite Armenians worldwide to build a prosperous and free Armenia.",
      application: "https://networkstate.io/join-us/",
    },
    {
      name: "Plumia",
      url: "https://plumia.org/",
      type: "Decentralized",
      tier: 3,
      x: "https://twitter.com/PlumiaCountry",
      discord: "",
      mission:
        "Building a borderless society for digital nomads.",
      application: "https://plumia.org/get-involved/",
    },
    {
      name: "Porta Norte",
      url: "http://www.portanorte.com/",
      type: "Physical",
      tier: 3,
      x: "https://twitter.com/portanortepa?lang=en",
      discord: "",
      mission:
        "Building a European-style town integrated with nature.",
      application:
        "https://docs.google.com/forms/d/e/1FAIpQLSdz0PeGE7lMo3q97xDuahbON1HQhTyaGMch21svpi54CXcZFg/viewform",
    },
    {
      name: "Proof of Humanity",
      url: "https://www.proofofhumanity.org/",
      type: "Online",
      tier: 3,
      x: "https://twitter.com/pohdao",
      discord: "https://discord.gg/eQGnF6aW6p",
      mission:
        "Building decentralized democracy using social verification.",
      application: "https://www.proofofhumanity.org/",
    },
    {
      name: "RNS.ID",
      url: "https://rns.id/",
      type: "Physical",
      tier: 3,
      x: "https://twitter.com/RNS_global",
      discord: "https://discord.gg/rns",
      mission:
        "Digital identity backed by the sovereign state of Palau.",
      application: "https://rns.id/",
    },
    {
      name: "Spectra",
      url: "https://www.spectracities.com/",
      type: "Online",
      tier: 3,
      x: "https://x.com/spectracities",
      discord: "https://discord.gg/V7fg7h47sR",
      mission:
        "To create sustainable, human-centered, and technologically progressive urbanization by combining physical and virtual world-building.",
      application: "https://www.spectracities.com/",
    },
    {
      name: "Tamera",
      url: "https://www.tamera.org/",
      type: "Physical",
      tier: 3,
      x: "https://x.com/TameraGlobal",
      discord: "",
      mission:
        "To empower people worldwide to build a regenerative, nonviolent culture.",
      application: "https://www.tamera.org/engage-donate/",
    },
    {
      name: "The Spacers Guild",
      url: "https://www.spacersguild.org/",
      type: "Decentralized",
      tier: 3,
      x: "https://x.com/SpacersGuild",
      discord: "",
      mission:
        "To grow public consensus around the imperatives of outer space settlements.",
      application: "https://www.spacersguild.org/take-action",
    },
    {
      name: "Urbit",
      url: "https://urbit.org/",
      type: "Online",
      tier: 3,
      x: "https://x.com/urbit",
      discord: "",
      mission:
        "To create a new decentralized computing platform where users own their data, identities, and services.",
      application: "https://urbit.org/get-started",
    },
    {
      name: "Vitalist Bay",
      url: "https://vitalistbay.com/",
      type: "Popup",
      tier: 3,
      x: "https://x.com/VitalistBay",
      discord: "",
      mission:
        "To bring together the world's leading minds to extend human healthspan and address aging.",
      application: "https://apply.vitalistbay.com/",
    },  
];

// Helper functions for working with the database
export const getSocietiesByType = (type: SocietyDatabase['type']) => {
  return societiesDatabase.filter(society => society.type === type);
};

export const getSocietiesByTier = (tier: SocietyDatabase['tier']) => {
  return societiesDatabase.filter(society => society.tier === tier);
};

export const searchSocieties = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return societiesDatabase.filter(society => 
    society.name.toLowerCase().includes(lowercaseQuery) ||
    society.mission.toLowerCase().includes(lowercaseQuery) ||
    society.url.toLowerCase().includes(lowercaseQuery)
  );
};

export const getDatabaseStats = () => {
  const total = societiesDatabase.length;
  const byType = societiesDatabase.reduce((acc, society) => {
    acc[society.type] = (acc[society.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byTier = societiesDatabase.reduce((acc, society) => {
    acc[`Tier ${society.tier}`] = (acc[`Tier ${society.tier}`] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    byType,
    byTier,
  };
};
