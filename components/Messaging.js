// components/Messaging.js
import { useState, useEffect } from 'react';

export default function Messaging({ candidateId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to fetch messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages?candidateId=${candidateId}`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (candidateId) {
      fetchMessages();
    }
  }, [candidateId]);

  // Function to send a new message
  const sendMessage = async () => {
    if (newMessage.trim() === '') return;
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'admin', // for admin messaging, sender is "admin"
          receiver: candidateId, // candidateId is the receiver
          text: newMessage
        })
      });
      if (res.ok) {
        setNewMessage('');
        fetchMessages(); // Refresh messages after sending
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="border p-3 rounded mt-4">
      <h2 className="text-lg font-semibold mb-2">Messages</h2>
      {loading ? (
        <p>Loading messages...</p>
      ) : (
        <div className="max-h-60 overflow-y-auto mb-2">
          {messages.map((msg) => (
            <div key={msg._id} className="mb-1">
              <span className="font-medium">
                {msg.sender === 'admin' ? 'You' : 'Candidate'}:
              </span>{' '}
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

