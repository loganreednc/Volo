// components/Messaging.js
import { useState, useEffect } from "react";
import io from "socket.io-client";

let socket;

export default function Messaging({ candidateId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!candidateId) return;

    socket = io();

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    fetchMessages();

    return () => {
      socket.disconnect();
    };
  }, [candidateId]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages?candidateId=${candidateId}`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      sender: candidateId,
      receiver: "admin",
      text: newMessage,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      if (res.ok) {
        socket.emit("sendMessage", messageData);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="border p-3 rounded mt-4">
      <h2 className="text-lg font-semibold mb-2">Messages</h2>
      {loading ? (
        <p>Loading messages...</p>
      ) : (
        <div className="max-h-60 overflow-y-auto mb-2">
          {messages.map((msg, index) => (
            <div key={index} className="mb-1">
              <span className="font-medium">{msg.sender === candidateId ? "You" : "Admin"}:</span>{" "}
              {msg.text}
            </div>
          ))}
        </div>
      )}
      <textarea
        className="w-full p-2 border rounded mb-2"
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
      >
        Send Message
      </button>
    </div>
  );
}



