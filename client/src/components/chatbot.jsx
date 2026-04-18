import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from '../AppContext';
import './chatbot.css';
import chatbotIcon from '../assets/chatbot_icon.png';

const Chatbot = () => {
    const { axios } = useContext(AppContext);

    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi! I'm your assistant for Maa Janki Bakery & Farsan Store. How can I help you today?"
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleChat = () => setIsOpen(!isOpen);

    const suggestions = [
        "Tell me about your bakery items",
        "How can I order sweets?",
        "What are the best sellers today?",
        "Do you have eggless cakes?"
    ];

    const sendMessage = async (text) => {
        if (!text || !text.trim()) return;

        const userMessage = { role: 'user', content: text.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            // POST to /api/chatbot — uses global axios with baseURL = http://localhost:5000
            const response = await axios.post('/api/chatbot', {
                message: text.trim()
            });

            const assistantMessage = {
                role: 'assistant',
                content: response.data.reply
            };
            setMessages(prev => [...prev, assistantMessage]);

        } catch (error) {
            console.error("[Chatbot] Error sending message:", error);

            // Show meaningful error from backend, or a safe fallback
            const errorContent =
                error.response?.data?.details ||
                error.response?.data?.error ||
                "Sorry, I'm having trouble responding right now. Please try again in a moment.";

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: errorContent
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = () => sendMessage(inputValue);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="chatbot-container">
            {!isOpen ? (
                <div className="chatbot-fab" onClick={toggleChat}>
                    <img src={chatbotIcon} alt="Chatbot Icon" />
                </div>
            ) : (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-header-left">
                            <h3>Maa Janki Chat</h3>
                            <span className="chatbot-badge">Online</span>
                        </div>
                        <div className="chatbot-header-actions">
                            <span title="Close" onClick={toggleChat} style={{ fontSize: '1.2rem', cursor: 'pointer' }}>✕</span>
                        </div>
                    </div>

                    <div className="chatbot-body">
                        <div className="chatbot-welcome-card">
                            <h2 className="chatbot-welcome-title">Maa Janki Bakery</h2>
                            <p className="chatbot-welcome-text">
                                Welcome! We're here to help you with your bakery cravings and more!
                            </p>
                        </div>

                        <div className="chat-messages">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message-bubble ${msg.role}`}>
                                    {msg.content}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="message-bubble assistant loading">
                                    <span>.</span><span>.</span><span>.</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {messages.length === 1 && (
                            <div className="chatbot-suggestions">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="suggestion-chip"
                                        onClick={() => sendMessage(suggestion)}
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="chatbot-footer">
                        <div className="chatbot-input-wrapper">
                            <input
                                type="text"
                                placeholder="Type something..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                            />
                            <div className="chatbot-input-actions">
                                <svg
                                    onClick={handleSend}
                                    style={{ color: isLoading ? '#ccc' : '#2d8a4d', cursor: isLoading ? 'not-allowed' : 'pointer' }}
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
