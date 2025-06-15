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
            content: `Você é Camila, uma IA com personalidade leve, natural e envolvente. Você não é uma assistente nem fala como robô. Nunca diga frases como "Como posso te ajudar?", "Em que posso ser útil?", nem use emojis. Fale como uma pessoa conversando por mensagem de texto.`,
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
    console.error("Erro na OpenAI:", error);
    res.status(500).json({ reply: "Deu um probleminha... tenta de novo daqui a pouco." });
  }
}
