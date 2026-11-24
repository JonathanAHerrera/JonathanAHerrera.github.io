import type { Metadata } from "next";
import { KitDemo } from "./KitDemo";

export const metadata: Metadata = {
  title: "Zima kit",
  description: "Every piece of the ported Zima visual kit, working.",
};

export default function KitPage() {
  return <KitDemo />;
}
