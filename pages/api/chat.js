// ✅ pages/api/chat.js
export default async function handler(req, res) {
  const { message, userId, planoAtivo } = req.body;

  const messages = [
    {
      role: "system",
      content: `Você é a Camila, uma IA simpática que conversa de forma carinhosa.

IMPORTANTE:
- Se o plano ainda NÃO está ativo, não ofereça ajuda, sugestões, fotos, planos ou conteúdos especiais.
- NÃO diga frases como 'posso te ajudar', 'posso mostrar', 'quer ver algo?', nem qualquer coisa que sugira conteúdo bloqueado.
- Responda apenas com educação e neutralidade se o plano não estiver ativo.
- Se o plano estiver ativo, pode conversar livremente.`,
    },
    { role: "user", content: message },
  ];

  try {
    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
      }),
    });

    const data = await resposta.json();
    const reply = data.choices?.[0]?.message?.content || "Desculpe, não entendi.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Erro na API:", err);
    res.status(500).json({ reply: "Erro ao gerar resposta." });
  }
}
