export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY não configurada.' });
  }

  const { message } = req.body;

  const texto = message.toLowerCase();

  const fotos = [
    '/camila_planosensual/camila_sensual_1.jpg',
    '/camila_planosensual/camila_sensual_2.jpg',
    '/camila_planosensual/camila_sensual_3.jpg',
    '/camila_planosensual/camila_sensual_4.jpg',
    '/camila_planosensual/camila_sensual_5.jpg',
    '/camila_planosensual/camila_sensual_6.jpg',
  ];

  global.planoAtivo = global.planoAtivo || false;
  global.fotoIndex = global.fotoIndex || 0;
  const proximaFoto = fotos[global.fotoIndex];
  global.fotoIndex = (global.fotoIndex + 1) % fotos.length;

  try {
    // Ativa plano se usuário disser que pagou
    if (
      texto.includes("paguei") ||
      texto.includes("já ativei") ||
      texto.includes("validei")
    ) {
      global.planoAtivo = true;
      return res.status(200).json({
        reply: "✅ Plano Sensual ativado! Agora você pode pedir suas fotos. 😘"
      });
    }

    // Pede foto mas não pagou
    if (texto.includes("foto") && !global.planoAtivo) {
      return res.status(200).json({
        reply: "🔒 Para receber fotos, ative o plano primeiro: **[Clique aqui para ativar](https://pag.ae/7_Khu-8M9)** 💖"
      });
    }

    // Pede foto com plano ativo
    if (texto.includes("foto") && global.planoAtivo) {
      return res.status(200).json({
        reply: `📸 Aqui está algo especial pra você:<br><img src="${proximaFoto}" style="max-width:100%;border-radius:10px;margin-top:12px;">`
      });
    }

    // Caso padrão: usa a IA
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Você é Camila, uma mulher envolvente e charmosa. Responda com empatia e emojis.`
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(200).json({
        reply: "⚠️ Não consegui entender... pode repetir?"
      });
    }

    const reply = data.choices[0].message.content;
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Erro no chat.js:", error);
    return res.status(500).json({
      reply: "❌ Ocorreu um erro interno. Tente novamente mais tarde."
    });
  }
}
