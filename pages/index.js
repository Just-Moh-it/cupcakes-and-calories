import { Rakkas } from "next/font/google";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { groq } from "@/lib/groq";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useState } from "react";

const rakkas = Rakkas({ subsets: ["latin"], weight: ["400"] });
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function Home() {
  return (
    <div className={cn(rakkas.className)}>
      <Header />
      <Hero />
      <App />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <div
      className={cn(
        montserrat.className,
        "py-[20px] flex items-center justify-center font-semibold gap-3"
      )}
    >
      <img src="/logo.svg" alt="logo" />
      Cupcakes and Calories
    </div>
  );
}

function Hero() {
  return (
    <div className="bg-gradient-to-b from-[#EFE3F2] to-[#FDEAF2] via-[#FBE3F3] flex items-center justify-center flex-col text-center py-[80px] gap-4">
      <h1 className="text-[64px]">Track your calories</h1>
      <p className={cn(montserrat.className, "text-black/50 max-w-[400px]")}>
        Use natural language to define what you eat. Remove all the friction
        from the process of logging your meals
      </p>
      <div className="flex items-center justify-center gap-4 w-full"></div>
    </div>
  );
}

function App() {
  const [items, setItems] = useLocalStorage([]);

  function addItem(newItem) {
    setItems([...items, newItem]);
  }

  const calories = items.reduce((total, item) => total + item.calories, 0);

  return (
    <>
      <Total calories={calories} addItem={addItem} items={items} />
    </>
  );
}

function Total({ calories, addItem, items }) {
  return (
    <div
      className={cn(
        "bg-gradient-to-b from-[#EDEDED] to-[#EBE9F2] flex items-center justify-center text-center py-[80px] mt-[13px] flex-col gap-10 px-[30px]"
      )}
    >
      <h3 className="text-[48px]">Meals tracked so far</h3>
      <div className="flex gap-10 w-full max-w-[1200px]">
        <div className="flex flex-col gap-6 flex-[5]">
          {items && items.length > 0 ? (
            items.map((item) => {
              return <Card item={item} key={item.name} />;
            })
          ) : (
            <div className="flex rounded-[20px] items-center justify-center bg-white p-10 min-h-[600px] flex-col gap-6">
              <img src="/not-found.svg" />

              <h4 className="text-4xl">No meals logged</h4>
              <p className={cn(montserrat.className, "text-black/50")}>
                Log meals from the side
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sticky top-4 items-stretch h-min gap-10">
          <InputForm addItem={addItem} />
          <TotalCard calories={calories} />
        </div>
      </div>
    </div>
  );
}

function Card({ item }) {
  return (
    <div className="text-left bg-white rounded-[20px] py-[50px] px-[38px] flex gap-10 justify-between items-center">
      <h3 className="text-[36px] leading-[100%]">{item.name}</h3>

      <div className={cn(montserrat.className, "flex gap-[16px] flex-col")}>
        <p className="text-black/50">{item.serving}</p>
        <p>{item.calories} calories</p>
      </div>
    </div>
  );
}

function TotalCard({ calories }) {
  return (
    <div className="text-left bg-white rounded-[20px] p-[38px] w-full flex max-w-[1200px] flex-[1] flex-col gap-10 h-min">
      <h4 className="text-[64px] max-w-[300px] leading-[100%]">
        Daily Summary
      </h4>

      <div className="text-left flex flex-col gap-4 flex-1 text-[36px] leading-[100%]">
        <p className="text-black/50 text-lg">You had a total of</p>
        <p>{calories} Calories</p>
        <p className="text-black/50 text-lg">which is equivalent to</p>
        <p>{Math.round(calories / 200)} cupcakes</p>
      </div>
    </div>
  );
}

function InputForm({ addItem }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleFormSubmit(e) {
    e.preventDefault();

    const request = e.target.food.value;

    setIsLoading(true);
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a calories helper app. You can return the number of calories as an integer, without any text or prose around it. Just a numeric, parsable number\nreturn in the following json format:\n\n{calories: number, serving: string, name: string}\n\nthe serving here could be '5 quantity' or '5 plates' or '10 servings'. name could be \"McDonalds McChicken\".\n\nHave different items as different meals. Return an empty items array if the query doesn't match to a meal or if its nonsense, or the user message is non food related. Always include items in your result",
        },
        {
          role: "user",
          content: request,
        },
      ],
      model: "gemma-7b-it",
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      response_format: {
        type: "json_object",
      },
      stop: null,
    });

    setIsLoading(false);

    const item = JSON.parse(chatCompletion.choices[0].message.content);
    console.log(item);
    if (!item) {
      return console.warn("No item");
    }

    if (item.name) addItem(item);
    else alert("No item received");
  }

  return (
    <form
      className="bg-white rounded-[20px] p-10 flex flex-col items-stretch gap-4 text-left"
      onSubmit={handleFormSubmit}
    >
      <h4 className="text-2xl">Log a new meal</h4>
      <label className={montserrat.className}>What did you have today?</label>
      <Input
        className={cn(
          montserrat.className,
          "rounded-full max-w-[460px] px-6 focus-within:ring-0"
        )}
        name="food"
        placeholder="What did you eat?"
      />
      <Button
        className={cn(
          montserrat.className,
          "bg-gradient-to-b from-[#AE68FC] to-[#683EBE] rounded-full px-8"
        )}
        disabled={isLoading}
      >
        {isLoading ? "Logging..." : "Log meal"}
      </Button>
    </form>
  );
}

function Footer() {
  return (
    <div
      className={cn(
        montserrat.className,
        "h-[140px] flex items-center justify-center"
      )}
    >
      Made with {"<3"} by Mohit
    </div>
  );
}
