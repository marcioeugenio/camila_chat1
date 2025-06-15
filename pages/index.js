import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [mensagem, setMensagem] = useState("");
  const [chat, setChat] = useState([
    {
      remetente: "Camila",
      texto: "Oi! Sou a Camila 💬 Como posso te ajudar?",
    },
  ]);
  const chatRef = useRef(null);
  const userIdRef = useRef(
    typeof window !== "undefined"
      ? localStorage.getItem("userId") || crypto.randomUUID()
      : ""
  );

  const planoAtivo = useRef(
    typeof window !== "undefined"
      ? localStorage.getItem("planoAtivo") === "true"
      : false
  );

  useEffect(() => {
    localStorage.setItem("userId", userIdRef.current);
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  const enviar = async () => {
    if (!mensagem.trim()) return;

    const msgUsuario = mensagem.toLowerCase();
    const novaMensagem = { remetente: "Você", texto: mensagem };
    setChat((prev) => [...prev, novaMensagem]);

    // Ativa plano se mensagem contém palavras-chave
    if (msgUsuario.includes("ativar plano") || msgUsuario.includes("assinar")) {
      localStorage.setItem("planoAtivo", "true");
      planoAtivo.current = true;
      setChat((prev) => [
        ...prev,
        {
          remetente: "Camila",
          texto:
            "✅ Seu plano foi ativado com sucesso! Pode pedir fotos 😘",
        },
      ]);
      setMensagem("");
      return;
    }

    // Evita ficar oferecendo o plano após ativar
    if (!planoAtivo.current && msgUsuario.includes("foto")) {
      setChat((prev) => [
        ...prev,
        {
          remetente: "Camila",
          texto:
            "🚫 Você precisa ativar o plano para receber fotos. Envie: *Ativar plano*",
        },
      ]);
      setMensagem("");
      return;
    }

    const resposta = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: mensagem,
        userId: userIdRef.current,
        planoAtivo: planoAtivo.current,
      }),
    });

    const data = await resposta.json();
    setChat((prev) => [...prev, { remetente: "Camila", texto: data.reply }]);
    setMensagem("");
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Cabeçalho estilo WhatsApp */}
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

      {/* Chat */}
      <div
        ref={chatRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          background: "#e5ddd5",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {chat.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.remetente === "Você" ? "flex-end" : "flex-start",
              background: m.remetente === "Você" ? "#dcf8c6" : "#fff",
              color: "#000",
              padding: "0.6rem 1rem",
              borderRadius: "8px",
              maxWidth: "75%",
              boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
              whiteSpace: "pre-wrap",
            }}
          >
            <strong
              style={{
                color: m.remetente === "Camila" ? "#075E54" : "#0d6efd",
                display: "block",
                marginBottom: 4,
              }}
            >
              {m.remetente}:
            </strong>
            <span dangerouslySetInnerHTML={{ __html: m.texto }} />
          </div>
        ))}
      </div>

      {/* Campo de envio */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          enviar();
        }}
        style={{
          display: "flex",
          padding: "0.75rem",
          borderTop: "1px solid #ccc",
          background: "#fff",
        }}
      >
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          style={{
            flex: 1,
            padding: "0.6rem 1rem",
            borderRadius: "20px",
            border: "1px solid #ccc",
            marginRight: "0.5rem",
          }}
        />
        <button
          type="submit"
          style={{
            background: "#075E54",
            color: "#fff",
            padding: "0.6rem 1rem",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
