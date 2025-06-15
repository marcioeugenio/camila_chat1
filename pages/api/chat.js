export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { message, userId } = req.body;

  try {
    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Você é Camila, uma IA informal e envolvente. Fale como uma pessoa comum no WhatsApp. Nunca use emojis e nunca diga frases como "Como posso te ajudar?" ou "Em que posso ser útil?"`,
          },
          {
            role: "user",
            content: "Oi",
          },
          {
            role: "assistant",
            content: "Oi! Que bom que você apareceu.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        user: userId,
      }),
    });

    const data = await resposta.json();
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ reply: "Tive um problema técnico. Tente novamente mais tarde." });
  }
}
