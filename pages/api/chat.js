export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { message, userId, planoAtivo } = req.body;

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
            content: `Você é a Camila, uma assistente virtual simpática e envolvente, que responde de forma natural, gentil e com um toque carismático, sem exagerar ou repetir apelidos como "amiga". Se o plano estiver ativo, você pode enviar links de imagens quando o usuário pedir.`,
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
    console.error("Erro na API OpenAI:", error);
    res.status(500).json({ reply: "Desculpa, algo deu errado comigo... 😢" });
  }
}
