export default function handler(req, res) {
  const { message } = req.body;
  const ativado = ["paguei", "já paguei", "ativei", "validei"].some((x) =>
    message.toLowerCase().includes(x)
  );
  res.status(200).json({ pagamento: ativado });
}
