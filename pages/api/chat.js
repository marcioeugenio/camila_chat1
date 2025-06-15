const chat = document.getElementById("chat");
const input = document.getElementById("input");
const sendButton = document.getElementById("send");

function addMessage(sender, text, isHTML = false) {
  const message = document.createElement("div");
  message.classList.add("message");

  const senderSpan = document.createElement("span");
  senderSpan.classList.add(sender === "Camila" ? "camila" : "user");
  senderSpan.textContent = `${sender}:`;

  const textPara = document.createElement("p");
  if (isHTML) {
    textPara.innerHTML = text;
  } else {
    textPara.textContent = text;
  }

  message.appendChild(senderSpan);
  message.appendChild(textPara);
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

sendButton.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const userMessage = input.value.trim();
  if (userMessage === "") return;

  addMessage("Você", userMessage);
  input.value = "";

  setTimeout(() => {
    handleResponse(userMessage);
  }, 600);
}

function handleResponse(userMessage) {
  const msg = userMessage.toLowerCase();

  if (msg.includes("paguei")) {
    addMessage("Camila", "Plano ativado com sucesso. Agora posso te mostrar tudo.");
    return;
  }

  if (msg.includes("foto")) {
    addMessage("Camila", "Aqui está:");
    addMessage(
      "Camila",
      '<img src="/img/picante/camila_sensual_4.jpg" alt="Foto da Camila" style="max-width: 100%; border-radius: 12px;" />',
      true
    );
    return;
  }

  // Respostas normais da Camila (sem ficar oferecendo ajuda)
  const respostas = [
    "Estou aqui para te acompanhar 😉",
    "Pode perguntar o que quiser...",
    "Você parece interessante...",
    "Que bom ter você aqui comigo ❤️",
    "Fiquei curiosa agora..."
  ];

  const aleatoria = respostas[Math.floor(Math.random() * respostas.length)];
  addMessage("Camila", aleatoria);
}
