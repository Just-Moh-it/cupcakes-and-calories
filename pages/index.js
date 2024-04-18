import { Rakkas } from "next/font/google";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { groq } from "@/lib/groq";
import { useState } from "react";

const rakkas = Rakkas({ subsets: ["latin"], weight: ["400"] });
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function  Home() {
  const [items, setItems] = useState([])
  function sayHello() {
    alert("Say hello!");
  }

  let totalCalories = 10;

  function setCalories(newCalories) {
    totalCalories = newCalories
  }

  return (
    <div className={cn(rakkas.className)}>
      <Header />
      <Hero setCalories={setCalories} calories={totalCalories} />
      <Total calories={totalCalories} />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <div className={cn(montserrat.className, "py-[20px] flex items-center justify-center font-semibold gap-3")}>
      <img src="/logo.svg" alt="logo" />
      Cupcakes and Calories
    </div>
  )
}

function Hero({ setCalories, calories }) {
  async function handleFormSubmit(e) {
    e.preventDefault()
    calories++;

    const request = e.target.food.value

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          "role": "system",
          "content": "You are a calories helper app. You can return the number of calories as an integer, without any text or prose around it. Just a numeric, parsable number\nreturn in the following json format:\n\n{items: {calories: number, serving: string, name: string}] }\n\nthe serving here could be '5 quantity' or '5 plates' or '10 servings'. name could be \"McDonalds McChicken\".\n\nHave different items as different meals. Return an empty items array if the query doesn't match to a meal or if its nonsense, or the user message is non food related. Always include items in your result"
        },
        {
          "role": "user",
          "content": request
        },
      ],
      "model": "gemma-7b-it",
      "temperature": 1,
      "max_tokens": 1024,
      "top_p": 1,
      "stream": false,
      "response_format": {
        "type": "json_object"
      },
      "stop": null
      });

      const item = JSON.parse(chatCompletion.choices[0].message.content).items?.[0]
      if (!item) return console.warn("No item")

    console.log("Chat", item?.name)
    alert(`Answer from groq`)
  }


  return (
    // linear gradient from EFE3F2 0%, FDEAF2 32%, FBE3F3 100%
    <form className="bg-gradient-to-b from-[#EFE3F2] to-[#FDEAF2] via-[#FBE3F3] flex items-center justify-center flex-col text-center py-[80px] gap-4" onSubmit={handleFormSubmit}>
      <h1 className="text-[64px]">Track your calories</h1>
      <p className={cn(montserrat.className, "text-black/50 max-w-[400px]")}>Use natural language to define what you eat. Remove all the friction from the process of logging your meals</p>
      <div className="flex items-center justify-center gap-4 w-full">
        {/* make it fully rounded */}
        <Input className={cn(montserrat.className, "rounded-full max-w-[460px] px-6 focus-within:ring-0")} name="food" placeholder="What did you eat?" />
        {/* Gradient top to bottom AE68FC and 683EBE */}
        <Button className={cn(montserrat.className, "bg-gradient-to-b from-[#AE68FC] to-[#683EBE] rounded-full px-8")}>Log meal</Button>
      </div>
    </form>
  )
}

function Total({ calories }) {
  // linear gradient from #EDEDED to #EBE9F2

  return <div className={cn("bg-gradient-to-b from-[#EDEDED] to-[#EBE9F2] flex items-center justify-center text-center py-[80px] gap-4 mt-[13px] flex flex-col gap-10 px-[30px]")}>
    <h3 className="text-[48px]">Meals tracked so far</h3>
    <div className="grid grid-cols-3 gap-[30px]">
      <Card />
      <Card />
      <Card />
    </div>

    <TotalCard calories={calories} />
  </div>
}

function Card() {
  return (<div className="text-left bg-white rounded-[20px] py-[50px] px-[38px] flex flex-col gap-10">
    <h3 className="text-[36px] leading-[100%]">Chipotle Sandwich</h3>

    <div className={cn(montserrat.className, "flex gap-[16px] flex-col")}>
      <p className="text-black/50">10 quantity</p>
      <p>50 calories</p>
    </div>
  </div>)
}

function TotalCard({ calories }) {
  return (
    <div className="text-left bg-white rounded-[20px] p-[38px] w-full flex mt-6 max-w-[1200px]">

      <div className={cn("text-left flex flex-col gap-4 flex-1")}>
        <h4 className="text-[64px] max-w-[300px] leading-[100%]">Daily Summary</h4>
      </div>

      <div className="text-left flex flex-col gap-4 flex-1 text-[36px] leading-[100%] flex flex-col gap-8">
        <p className="text-black/50">You had a total of</p>
        <p>{calories} Calories</p>
        <p className="text-black/50">which is equivalent to</p>
        <p>5.5 cupcakes</p>
      </div>
    </div>
  )
}

function Footer() {
  return <div className={cn(montserrat.className, "h-[140px] flex items-center justify-center")}>Made with {"<3"} by Rakkas</div>
}