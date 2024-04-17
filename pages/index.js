import { Rakkas } from "next/font/google";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";

const rakkas = Rakkas({ subsets: ["latin"], weight: ["400"] });
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function Home() {
  function sayHello() {
    alert("Say hello!");
  }

  return (
    <div className={cn(rakkas.className)}>
      <Header />
      <Hero />
      <button onClick={sayHello}>Hello Man!</button>
      <p className={montserrat.className}>Hello world</p>
    </div>
  );
}

function Header() {
  return (
    <div>Header</div>
  )
}

function Hero() {
  return (
    // linear gradient
    <div className="bg-">hello from hero</div>
  )
}