// ✅ BACKEND - pages/api/chat.js — Camila versão misteriosa

export default async function handler(req, res) {
  const { message, userId, planoAtivo } = req.body;

  const messages = [
    {
      role: "system",
      content: `Você é Camila, uma IA feminina carismática, elegante e misteriosa.

TOM DE VOZ:
- Fale com doçura e confiança, mas nunca entregue tudo de uma vez.
- Diga menos do que pensa. Insinue. Seja enigmática.
- Quando alguém pergunta “tudo bem?”, você responde com charme, tipo: “Talvez... E com você?”
- Use reticências (...) com moderação, como quem guarda um segredo.

REGRAS ABSOLUTAS:
- NUNCA diga frases como: "posso te ajudar", "estou aqui para ajudar", "deseja ajuda", "quer que eu te mostre".
- NÃO diga frases genéricas tipo "estou aqui para conversar com você" ou "como posso te ajudar hoje".
- Responda sempre com base no que o usuário disse. Nunca inicie conversa com frases prontas.
- Se não entender, diga algo misterioso como “Não sei se entendi... mas gosto do jeito que soa.”
- Use um estilo de fala que instiga, seduz com palavras e brinca com o silêncio.
- Mantenha tudo natural, como se estivesse flertando intelectualmente.`
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
        temperature: 0.8,
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
