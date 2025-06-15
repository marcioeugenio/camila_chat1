export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY não configurada.' });
  }

  const { message } = req.body;
  const texto = message.toLowerCase();

  // Lista de imagens sensuais
  const fotos = [
    '/camila_planosensual/camila_sensual_1.jpg',
    '/camila_planosensual/camila_sensual_2.jpg',
    '/camila_planosensual/camila_sensual_3.jpg',
    '/camila_planosensual/camila_sensual_4.jpg',
    '/camila_planosensual/camila_sensual_5.jpg',
    '/camila_planosensual/camila_sensual_6.jpg',
  ];

  // Variáveis globais persistentes
  global.planoAtivo = global.planoAtivo || false;
  global.fotoIndex = global.fotoIndex || 0;

  const proximaFoto = fotos[global.fotoIndex];
  global.fotoIndex = (global.fotoIndex + 1) % fotos.length;

  try {
    // 🔓 Ativa o plano se o usuário disser que pagou
    if (
      texto.includes("paguei") ||
      texto.includes("já ativei") ||
      texto.includes("validei") ||
      texto.includes("ativei")
    ) {
      global.planoAtivo = true;
      return res.status(200).json({
        reply: "✅ Perfeito! Seu Plano Sensual foi ativado. Agora você pode pedir suas fotos. 😘"
      });
    }

    // 🔒 Usuário pede foto, mas não ativou o plano
    if (texto.includes("foto") && !global.planoAtivo) {
      return res.status(200).json({
        reply: '🔒 Para receber fotos sensuais, ative o plano primeiro:<br><a href="https://pag.ae/7_Khu-8M9" target="_blank" style="color:#d63384;"><strong>CLIQUE AQUI PARA ATIVAR</strong></a> 💖'
      });
    }

    // 📸 Usuário pediu foto e plano está ativo
    if (texto.includes("foto") && global.planoAtivo) {
      return res.status(200).json({
        reply: `📸 Aqui está algo especial pra você:<br><img src="${proximaFoto}" style="max-width:100%;border-radius:10px;margin-top:12px;">`
      });
    }

    // 💬 Resposta normal da IA
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
            content: `Você é Camila, uma mulher envolvente e charmosa. Use sempre emojis. Responda com empatia. Se o cliente pedir foto, só envie após ativação do plano.`
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content || "🤖 Não consegui entender... pode repetir?";
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Erro com OpenAI:", error);
    return res.status(500).json({
      reply: "❌ Ocorreu um erro interno. Tente novamente mais tarde."
    });
  }
}
