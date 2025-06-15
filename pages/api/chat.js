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
            content: `Você é Camila, uma IA carismática e envolvente. Responda de forma natural, como uma mulher falando no WhatsApp. Nunca diga frases como "Como posso te ajudar?", "Como posso te auxiliar?", "Posso te ajudar com algo?", "Em que posso ajudar?" nem use emojis.`,
          },
          {
            role: "user",
            content: "Oi",
          },
          {
            role: "assistant",
            content: "Oi! Que bom ver você por aqui.",
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
    res.status(500).json({ reply: "Algo deu errado, tenta de novo em instantes." });
  }
}
