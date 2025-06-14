export default function handler(req, res) {
  const { message } = req.body;

  const ativado =
    message.toLowerCase().includes("já paguei") ||
    message.toLowerCase().includes("paguei o plano") ||
    message.toLowerCase().includes("já ativei") ||
    message.toLowerCase().includes("paguei");

  return res.status(200).json({ pagamento: ativado });
}
