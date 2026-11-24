export type WorkScreenshot = {
  imageSrc: string;
  widthPx: number;
  heightPx: number;
  alternativeText: string;
  caption: string;
};

export const WORK_SCREENSHOTS_BY_WORK_PIECE_ID: Partial<Record<string, WorkScreenshot[]>> = {
  hopamine: [
    {
      imageSrc: "/work/hopamine/hopamine-home.webp",
      widthPx: 1600,
      heightPx: 1000,
      alternativeText:
        "Hopamine home page: a blue, dithered photograph of a dome under the headline “A community for eco-tech builders, founders & organizers.” and a Get started button.",
      caption: "Hopamine home page, hopamine.xyz",
    },
    {
      imageSrc: "/work/hopamine/zima-home.webp",
      widthPx: 1600,
      heightPx: 1000,
      alternativeText:
        "Zima home page: a pale blue globe with numbered clusters of builders, the headline “Where future builders in your city meet.” and a search field reading “Find builders near you”.",
      caption: "Zima, Hopamine’s builder search, zima.hopamine.xyz",
    },
  ],
  "vita-ai": [
    {
      imageSrc: "/work/vita-ai/vita-chat.webp",
      widthPx: 1170,
      heightPx: 2532,
      alternativeText:
        "The Vita chat tab in dark mode: the user says they like red Thai curry and asks what else to eat, Vita suggests Panang curry, Massaman curry and coconut lentil dal, then gives the calories and macros for a bowl of dal. A “Message Vita…” composer and the app’s bottom tab bar sit below.",
      caption: "Vita chat",
    },
    {
      imageSrc: "/work/vita-ai/vita-your-plan-ready.webp",
      widthPx: 1170,
      heightPx: 2532,
      alternativeText:
        "The Vita “Your Plan” tab: Vita asks about training days and meals per day, the user answers, and a card reads “Personalized nutrition plan ready! Tap to view details” beside Vita’s meditating turtle mascot. A “Vita’s Knowledge” button sits below the card.",
      caption: "Your Plan: building a nutrition plan through conversation",
    },
    {
      imageSrc: "/work/vita-ai/vita-plan-summary.webp",
      widthPx: 1170,
      heightPx: 2532,
      alternativeText:
        "The plan summary opened from the Your Plan card: a Lean Bulk goal going from 150 to 158 lbs over 16 weeks at 0.5 lbs per week, with Program Active and Update Goals buttons.",
      caption: "The generated plan summary",
    },
    {
      imageSrc: "/work/vita-ai/vita-knowledge.webp",
      widthPx: 1170,
      heightPx: 2532,
      alternativeText:
        "The Vita’s Knowledge panel over a blurred chat: facts Vita has learned from the conversation, grouped under Basic Info, Goals, Health and Lifestyle, such as age, height, weight, primary goal, a peanut allergy and a low-dairy diet.",
      caption: "Vita’s Knowledge: facts Vita keeps from the conversation",
    },
  ],
};
