export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { message } = req.body;

  const texto = message.toLowerCase();

  const ativado =
    texto.includes("paguei") ||
    texto.includes("já ativei") ||
    texto.includes("validei") ||
    texto.includes("ativei o plano") ||
    texto.includes("plano ativo");

  if (ativado) {
    return res.status(200).json({ pagamento: true, msg: "Plano ativado com sucesso." });
  } else {
    return res.status(200).json({ pagamento: false, msg: "Plano ainda não foi ativado." });
  }
}
