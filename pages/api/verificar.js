// ✅ BACKEND - pages/api/verificar.js

export default async function handler(req, res) {
  const { notificationCode } = req.body;

  if (!notificationCode) {
    return res.status(400).json({ error: "Código de notificação ausente." });
  }

  try {
    // Consulta à API do PagSeguro
    const resposta = await fetch(
      `https://ws.pagseguro.uol.com.br/v3/transactions/notifications/${notificationCode}?email=ideiasempresariais@hotmail.com&token=${process.env.PAGSEGURO_TOKEN}`
    );

    const texto = await resposta.text();

    // Verifica se houve erro
    if (!resposta.ok) {
      console.error("Erro ao consultar notificação do PagSeguro:", texto);
      return res.status(500).json({ error: "Erro ao consultar transação." });
    }

    // Converte XML para JSON simples (apenas com regex básica)
    const status = texto.match(/<status>(.*?)<\/status>/)?.[1];
    const email = texto.match(/<sender><email>(.*?)<\/email>/)?.[1];
    const valor = texto.match(/<grossAmount>(.*?)<\/grossAmount>/)?.[1];

    console.log("Transação confirmada:", { status, email, valor });

    if (status === "3") {
      // status 3 = pagamento aprovado
      return res.status(200).json({ planoLiberado: true });
    } else {
      return res.status(200).json({ planoLiberado: false });
    }
  } catch (err) {
    console.error("Erro geral ao verificar transação:", err);
    res.status(500).json({ error: "Erro inesperado." });
  }
}
