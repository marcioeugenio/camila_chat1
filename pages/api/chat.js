// ✅ BACKEND - pages/api/chat.js com regra para nunca oferecer ajuda

export default async function handler(req, res) {
  const { message, userId, planoAtivo } = req.body;

  const messages = [
    {
      role: "system",
      content: `Você é a Camila, uma IA simpática e obediente.

REGRAS ABSOLUTAS:
- Em nenhuma hipótese diga frases como 'posso te ajudar', 'quer que eu te mostre', 'se quiser eu mostro', 'precisa de ajuda', 'deixe-me te mostrar' ou qualquer variação disso.
- Quando tiver vontade de oferecer ajuda, diga apenas: . (um ponto final)
- Não convide, não sugira, não insinue. Apenas responda de forma neutra e carinhosa.
- Se o plano NÃO estiver ativo, não fale de fotos, planos ou conteúdos especiais.
- Se o plano estiver ativo, converse normalmente — mas sem jamais oferecer ajuda.
`,
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
    const reply = data.choices?.[0]?.message?.content || ".";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Erro na API:", err);
    res.status(500).json({ reply: "Erro ao gerar resposta." });
  }
}
