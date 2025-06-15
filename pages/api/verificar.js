// ✅ BACKEND - pages/api/verificar.js (versão neutra, segura, sem PagSeguro)

export default async function handler(req, res) {
  // Esse endpoint é reservado para uso futuro, se desejar implementar webhook
  // No momento, seu sistema funciona com "paguei" digitado manualmente

  return res.status(200).json({
    planoLiberado: false,
    mensagem: "Verificação automática não está habilitada. Use 'paguei' no chat.",
  });
}
