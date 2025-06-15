// ✅ FRONTEND - pages/index.js (versão cuidadosa, mantendo tudo que funciona)
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [mensagem, setMensagem] = useState("");
  const [chat, setChat] = useState([]);
  const [fotoIndex, setFotoIndex] = useState(1);
  const [planoAtivo, setPlanoAtivo] = useState(false);

  const chatRef = useRef(null);
  const userIdRef = useRef(
    typeof window !== "undefined"
      ? localStorage.getItem("userId") || crypto.randomUUID()
      : ""
  );

  useEffect(() => {
    const plano = localStorage.getItem("planoAtivo");
    if (plano === "true") setPlanoAtivo(true);
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  const enviar = async () => {
    if (!mensagem.trim()) return;

    const msg = mensagem.toLowerCase();
    setChat((prev) => [...prev, { remetente: "Você", texto: mensagem }]);

    if (msg === "paguei") {
      localStorage.setItem("planoAtivo", "true");
      setPlanoAtivo(true);
      setChat((prev) => [
        ...prev,
        {
          remetente: "Camila",
          texto: "Plano ativado com sucesso. Agora posso te mostrar tudo.",
        },
      ]);
      setMensagem("");
      return;
    }

    if (msg.includes("foto")) {
      if (!planoAtivo) {
        setChat((prev) => [
          ...prev,
          {
            remetente: "Camila",
            texto:
              "Para ver fotos, você precisa ativar o plano. Clique no botão abaixo para fazer o pagamento.",
            botao: true,
          },
        ]);
      } else {
        const novaFoto = `/camila_planosensual/camila_sensual_${fotoIndex}.jpg`;

        setChat((prev) => [
          ...prev,
          { remetente: "Camila", texto: "Aqui está:" },
          {
            remetente: "Camila",
            imagem: novaFoto,
          },
        ]);

        const proxima = fotoIndex >= 6 ? 1 : fotoIndex + 1;
        setFotoIndex(proxima);
      }
      setMensagem("");
      return;
    }

    const resposta = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: mensagem,
        userId: userIdRef.current,
        planoAtivo: planoAtivo,
      }),
    });

    const data = await resposta.json();
    setChat((prev) => [...prev, { remetente: "Camila", texto: data.reply }]);
    setMensagem("");
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          background: "#075E54",
          color: "white",
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <img
          src="/camila_perfil.jpg"
          alt="Camila"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "2px solid white",
          }}
        />
        <div>
          <strong>Camila</strong>
          <br />
          <small style={{ color: "#d0f0c0" }}>Online agora</small>
        </div>
      </div>

      <div
        ref={chatRef}
        style={{ flex: 1, overflowY: "auto", padding: "1rem", background: "#eee" }}
      >
        {chat.map((msg, i) => (
          <div key={i} style={{ marginBottom: "1rem" }}>
            <strong style={{ color: msg.remetente === "Camila" ? "#d63384" : "#0d6efd" }}>
              {msg.remetente}:
            </strong>
            {msg.texto && <div>{msg.texto}</div>}
            {msg.imagem && (
              <img
                src={msg.imagem}
                alt="Foto da Camila"
                style={{ maxWidth: "200px", borderRadius: "8px", marginTop: "0.5rem" }}
              />
            )}
            {msg.botao && (
              <div>
                {/* ⚠️ MANTIDO exatamente como estava no código anterior, link Mercado Pago */}
                <a
                  href="https://mpago.la/EXEMPLO_DO_SEU_LINK"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button style={{ marginTop: "0.5rem" }}>Ativar Plano Sensual</button>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ padding: "1rem", background: "#fff" }}>
        <input
          type="text"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder="Digite sua mensagem..."
          style={{ width: "80%", padding: "0.5rem" }}
        />
        <button onClick={enviar} style={{ padding: "0.5rem 1rem" }}>
          Enviar
        </button>
      </div>
    </div>
  );
}
