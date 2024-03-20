import { Inter, Ysabeau, Sigmar_One } from "next/font/google";

export const sigmar_One = Sigmar_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--sigmar_one",
});
export const ysabeau = Ysabeau({ subsets: ["latin"], weight: "500" });
import { Fraunces, Rubik, Satisfy } from "next/font/google";

export const fraunces = Fraunces({
  variable: "--Fraunces",
  weight: "400",
  subsets: ["latin"],
});
export const fraunces_bold = Fraunces({
  variable: "--Frauncesbold",
  weight: "700",
  subsets: ["latin"],
});
export const fraunces_semibold = Fraunces({
  variable: "--FrauncesSemibold",
  weight: "500",
  subsets: ["latin"],
});
export const fraunces_600 = Fraunces({
  variable: "--Fraunces600",
  weight: "600",
  subsets: ["latin"],
});
export const rubik = Rubik({ variable: "--Rubik", subsets: ["latin"] });
export const satisfy = Satisfy({
  variable: "--Satisfy",
  subsets: ["latin"],
  weight: "400",
});
