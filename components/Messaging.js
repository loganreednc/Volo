// components/Messaging.js
import { useState, useEffect } from "react";
import io from "socket.io-client";

let socket;

export default function Messaging({ candidateId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

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
    try {
      const res = await fetch(`/api/messages?candidateId=${candidateId}`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        setAudioBlob(audioBlob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const sendVoiceMessage = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append("audio", audioBlob, "voice-message.wav");
    formData.append("sender", candidateId);
    formData.append("receiver", "admin");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        socket.emit("sendMessage", { sender: candidateId, audioUrl: "/uploads/voice-message.wav" });
        setAudioBlob(null);
      }
    } catch (error) {
      console.error("Error sending voice message:", error);
    }
  };

  return (
    <div className="border p-3 rounded mt-4">
      <h2 className="text-lg font-semibold mb-2">Messages</h2>
      <div className="max-h-60 overflow-y-auto mb-2">
        {messages.map((msg, index) => (
          <div key={index} className="mb-1">
            {msg.audioUrl ? (
              <audio controls src={msg.audioUrl} />
            ) : (
              <span className="font-medium">{msg.sender === candidateId ? "You" : "Admin"}:</span> {msg.text}
            )}
          </div>
        ))}
      </div>

      {/* Text Message Input */}
      <textarea
        className="w-full p-2 border rounded mb-2"
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage} className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
        Send Message
      </button>

      {/* Voice Recorder */}
      <div className="mt-4">
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`py-1 px-3 rounded text-white ${recording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </button>
        
        {audioBlob && (
          <>
            <audio controls src={URL.createObjectURL(audioBlob)} className="mt-2" />
            <button
              onClick={sendVoiceMessage}
              className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 mt-2"
            >
              Send Voice Message
            </button>
          </>
        )}
      </div>
    </div>
  );
}
