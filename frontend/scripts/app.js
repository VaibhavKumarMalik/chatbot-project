document.addEventListener("DOMContentLoaded", () => {
  // Generate a random user ID if one doesn't exist
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = `user_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("userId", userId);
  }

  // Connect to Socket.io
  const socket = io(process.env.SERVER_URL || "http://localhost:5000");
  socket.emit("join", userId);

  // DOM elements
  const chatInterface = document.getElementById("chat-interface");
  const analyticsDashboard = document.getElementById("analytics-dashboard");
  const chatTab = document.getElementById("chat-tab");
  const analyticsTab = document.getElementById("analytics-tab");
  const messageForm = document.getElementById("message-form");
  const messageInput = document.getElementById("message-input");
  const chatMessages = document.getElementById("chat-messages");
  const recentChats = document.getElementById("recent-chats");

  // Tab switching
  chatTab.addEventListener("click", () => {
    chatInterface.classList.remove("hidden");
    analyticsDashboard.classList.add("hidden");
    chatTab.classList.add("bg-blue-500", "text-white");
    chatTab.classList.remove("bg-gray-300");
    analyticsTab.classList.add("bg-gray-300");
    analyticsTab.classList.remove("bg-blue-500", "text-white");
  });

  analyticsTab.addEventListener("click", () => {
    chatInterface.classList.add("hidden");
    analyticsDashboard.classList.remove("hidden");
    analyticsTab.classList.add("bg-blue-500", "text-white");
    analyticsTab.classList.remove("bg-gray-300");
    chatTab.classList.add("bg-gray-300");
    chatTab.classList.remove("bg-blue-500", "text-white");
    loadAnalytics();
  });

  // Message form submission
  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
      // Emit message to server
      socket.emit("send_message", {
        userId,
        message,
      });

      // Add message to UI immediately
      addMessageToUI({
        userId,
        message,
        isUser: true,
        timestamp: new Date(),
      });

      messageInput.value = "";
    }
  });

  // Receive messages from server
  socket.on("receive_message", (message) => {
    addMessageToUI(message);
  });

  // Add message to chat UI
  function addMessageToUI(message) {
    const messageElement = document.createElement("div");
    messageElement.className = message.isUser ? "text-right" : "text-left";

    const bubble = document.createElement("div");
    bubble.className = message.isUser
      ? "inline-block bg-blue-500 text-white px-4 py-2 rounded-lg rounded-tr-none max-w-xs"
      : "inline-block bg-gray-200 px-4 py-2 rounded-lg rounded-tl-none max-w-xs";
    bubble.textContent = message.message;

    const meta = document.createElement("div");
    meta.className = "text-xs mt-1 text-gray-500";

    const time = new Date(message.timestamp).toLocaleTimeString();
    meta.textContent = time;

    if (!message.isUser) {
      const intentSpan = document.createElement("span");
      intentSpan.className = "ml-2 italic";
      intentSpan.textContent = `${message.intent} (${Math.round(
        message.confidence * 100
      )}%)`;
      meta.appendChild(intentSpan);
    }

    messageElement.appendChild(bubble);
    messageElement.appendChild(meta);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Load analytics data
  async function loadAnalytics() {
    try {
      const response = await fetch(`/api/analytics/${userId}`);
      const data = await response.json();

      // Render charts
      renderCharts(data.intents, data.sentiments);

      // Render recent chats
      recentChats.innerHTML = "";
      if (data.recentChats && data.recentChats.length > 0) {
        data.recentChats.forEach((chat) => {
          const chatElement = document.createElement("div");
          chatElement.className = "bg-white p-3 rounded shadow-sm";

          const message = document.createElement("p");
          message.className = "font-medium";
          message.textContent = chat.message;

          const meta = document.createElement("div");
          meta.className = "text-xs text-gray-500 mt-1";

          const time = new Date(chat.timestamp).toLocaleString();
          meta.textContent = `${time} • ${chat.isUser ? "User" : "Bot"}`;

          if (!chat.isUser) {
            const intent = document.createElement("span");
            intent.className = "ml-2 italic";
            intent.textContent = `${chat.intent} (${Math.round(
              chat.confidence * 100
            )}%)`;
            meta.appendChild(intent);
          }

          chatElement.appendChild(message);
          chatElement.appendChild(meta);
          recentChats.appendChild(chatElement);
        });
      } else {
        recentChats.innerHTML =
          '<p class="text-gray-500">No recent chats found</p>';
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
  }

  // Render charts
  function renderCharts(intents, sentiments) {
    // Intent chart
    const intentCtx = document.getElementById("intent-chart").getContext("2d");
    new Chart(intentCtx, {
      type: "pie",
      data: {
        labels: Object.keys(intents || {}),
        datasets: [
          {
            data: Object.values(intents || {}),
            backgroundColor: [
              "#3B82F6",
              "#10B981",
              "#F59E0B",
              "#EF4444",
              "#8B5CF6",
            ],
          },
        ],
      },
    });

    // Sentiment chart
    const sentimentCtx = document
      .getElementById("sentiment-chart")
      .getContext("2d");
    new Chart(sentimentCtx, {
      type: "bar",
      data: {
        labels: Object.keys(sentiments || {}),
        datasets: [
          {
            label: "Count",
            data: Object.values(sentiments || {}),
            backgroundColor: [
              "#10B981", // positive - green
              "#3B82F6", // neutral - blue
              "#EF4444", // negative - red
            ],
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Load initial chat history
  fetch(`/api/chat/${userId}`)
    .then((res) => res.json())
    .then((chats) => {
      chats.forEach((chat) => addMessageToUI(chat));
    })
    .catch((err) => console.error("Error loading chat history:", err));
});
