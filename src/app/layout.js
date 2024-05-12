import createInitialWallet from "@/actions/Authenticate";
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import {
  sigmar_One,
  ysabeau,
  fraunces,
  rubik,
  fraunces_bold,
  fraunces_semibold,
  fraunces_600,
} from "@/fonts.config";
import { cn } from "@/lib/utils";
export const metadata = {
  title: "Smart Home",
  description: "Smart Home with HLF",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={cn(
          ysabeau.className,
          sigmar_One.variable,
          ` ${fraunces_600.variable} ${fraunces_bold.variable} ${fraunces_semibold.variable} ${rubik.variable} ${fraunces.variable}`
        )}
      >
        {/* <Header /> */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
