const Groq = require("groq-sdk");

const groq = new Groq();

async function main() {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "Are you superfast chatgpt?",
      },
    ],
    model: "mixtral-8x7b-32768",
    temperature: 1,
    max_tokens: 1024,
    top_p: 1,
    stream: true,
    stop: null,
  });

  for await (const chunk of chatCompletion) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
}

main();
