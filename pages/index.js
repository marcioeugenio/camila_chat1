import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  const [messages, setMessages] = useState([
    { sender: 'camila', text: 'Oi, eu sou a Camila. Como é seu nome? 😊' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();
    const botReply = { sender: 'camila', text: data.reply || 'Erro ao responder.' };
    setMessages((prev) => [...prev, botReply]);
    setInput('');
  };

  return (
    <>
      <Head>
        <title>Camila - Sua Acompanhante Virtual</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css" />
      </Head>
      <main className="container">
        <div style={{ background: '#4CAF50', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', color: 'white' }}>
          <Image src="/camila_perfil.jpg" alt="Camila" width={80} height={80} style={{ borderRadius: '50%', border: '2px solid #d63384' }} />
          <h2>💬 Camila <small>Online agora</small></h2>
        </div>

        <div id="chat" style={{ maxHeight: '400px', overflowY: 'auto', background: 'white', border: '1px solid #ccc', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ color: msg.sender === 'camila' ? '#d63384' : '#0d6efd', marginBottom: '0.8rem' }}>
              <strong>{msg.sender === 'camila' ? 'Camila' : 'Você'}:</strong> <span dangerouslySetInnerHTML={{ __html: msg.text }} />
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="grid">
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <button type="submit">Enviar</button>
        </form>
      </main>
    </>
  );
}
