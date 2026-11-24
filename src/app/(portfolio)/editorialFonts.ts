import { Instrument_Serif } from "next/font/google";

// The kit loads Instrument Serif roman only; without the real italic cut the browser fakes a slanted roman.
export const instrumentSerifItalic = Instrument_Serif({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  display: "swap",
});
