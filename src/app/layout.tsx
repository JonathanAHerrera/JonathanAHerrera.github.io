import type { Metadata, Viewport } from "next";
import { fontVariableClassNames } from "@/zima-kit/fonts";
import { resume } from "@/content/resume";
import "./globals.css";

export const metadata: Metadata = {
  title: resume.name,
  description: `${resume.name}: software engineer.`,
};

/** Required on iOS so fixed fullscreen layers extend under the notch. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fontVariableClassNames} bg-white antialiased`}>
      <body className="min-h-dvh bg-white font-serif text-neutral-900">{children}</body>
    </html>
  );
}
