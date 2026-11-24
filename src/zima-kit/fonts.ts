import { Instrument_Serif, JetBrains_Mono, Roboto_Mono } from "next/font/google";

export const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

// Zima's own chrome (cards, prompt, wordmark) is set in JetBrains Mono, not the brand doc's Roboto Mono.
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const fontVariableClassNames = `${instrumentSerif.variable} ${robotoMono.variable} ${jetbrainsMono.variable}`;
