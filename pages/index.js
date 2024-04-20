import { Rakkas } from "next/font/google";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";

const rakkas = Rakkas({ subsets: ["latin"], weight: ["400"] });
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function Home() {
  return (
    <div className={cn(rakkas.className)}>
      Hello world
      <p className={montserrat.className}>BOdy text</p>
    </div>
  );
}
