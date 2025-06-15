// ✅ BACKEND - pages/api/chat.js (com plano e restrições cuidadosas)

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

// ✅ BACKEND - pages/api/verificar.js (mantendo lógica e segurança)

export async function handler(req, res) {
  const { notificationCode } = req.body;

  if (!notificationCode) {
    return res.status(400).json({ error: "Código de notificação ausente." });
  }

  try {
    const resposta = await fetch(
      `https://ws.pagseguro.uol.com.br/v3/transactions/notifications/${notificationCode}?email=ideiasempresariais@hotmail.com&token=${process.env.PAGSEGURO_TOKEN}`
    );

    const texto = await resposta.text();

    if (!resposta.ok) {
      console.error("Erro ao consultar notificação:", texto);
      return res.status(500).json({ error: "Erro ao consultar transação." });
    }

    const status = texto.match(/<status>(.*?)<\/status>/)?.[1];
    const email = texto.match(/<sender><email>(.*?)<\/email>/)?.[1];
    const valor = texto.match(/<grossAmount>(.*?)<\/grossAmount>/)?.[1];

    console.log("Verificado:", { status, email, valor });

    if (status === "3") {
      return res.status(200).json({ planoLiberado: true });
    } else {
      return res.status(200).json({ planoLiberado: false });
    }
  } catch (err) {
    console.error("Erro inesperado:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}
