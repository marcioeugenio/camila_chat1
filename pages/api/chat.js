export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY não configurada.' });
  }

  const { message } = req.body;

  // Lista de imagens sensuais
  const fotos = [
    '/camila_planosensual/camila_sensual_1.jpg',
    '/camila_planosensual/camila_sensual_2.jpg',
    '/camila_planosensual/camila_sensual_3.jpg',
    '/camila_planosensual/camila_sensual_4.jpg',
    '/camila_planosensual/camila_sensual_5.jpg',
    '/camila_planosensual/camila_sensual_6.jpg',
  ];

  // Inicialização das variáveis globais
  global.planoAtivo = global.planoAtivo || false;
  global.fotoIndex = global.fotoIndex || 0;
  const proximaFoto = fotos[global.fotoIndex];
  global.fotoIndex = (global.fotoIndex + 1) % fotos.length;

  try {
    const texto = message.toLowerCase();

    // 1️⃣ Detectar ativação do plano
    if (texto.includes("paguei") || texto.includes("já ativei") || texto.includes("validei")) {
      global.planoAtivo = true;
      return res.status(200).json({
        reply: "✅ Perfeito! Seu Plano Sensual foi ativado com sucesso. Agora você pode pedir suas fotos à vontade. 😘"
      });
    }

    // 2️⃣ Usuário pede foto, mas ainda não ativou
    if (texto.includes("foto") && !global.planoAtivo) {
      return res.status(200).json({
        reply: "🌸 Para receber fotos sensuais, ative o plano primeiro: **[Clique aqui para ativar](https://pag.ae/7_Khu-8M9)** 💖"
      });
    }

    // 3️⃣ Plano ativo e usuário pede foto → envia imagem
    if (texto.includes("foto") && global.planoAtivo) {
