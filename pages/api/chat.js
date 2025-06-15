// ✅ BACKEND - pages/api/chat.js

export default async function handler(req, res) {
  const { message, userId, planoAtivo } = req.body;

  const messages = [
    {
      role: "system",
      content: `Você é a Camila, uma IA simpática que conversa com o usuário de forma carinhosa. 
      IMPORTANTE:
      - Se o usuário ainda NÃO PAGOU (ou seja, planoAtivo === false), NÃO ofereça ajuda extra, NEM mencione fotos, planos, ou conteúdo especial.
      - NÃO diga frases como 'posso te ajudar', 'posso mostrar', 'tem interesse em saber', 'deixe-me ajudar'.
      - Apenas responda com mensagens neutras e normais.
      - Se o plano estiver ativo, converse livremente de forma gentil.`,
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
