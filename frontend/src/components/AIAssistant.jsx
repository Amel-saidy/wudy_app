import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { addToCart, cartItems } = useContext(CartContext);
    const navigate = useNavigate();

    // Initial greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ role: 'ai', text: "Hello! I'm WeydiBot, your personal styling assistant. How can I help you find the perfect outfit today?" }]);
        }
    }, [isOpen, messages.length]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        
        const newMessages = [...messages, { role: 'user', text: userMessage }];
        setMessages(newMessages);
        setLoading(true);

        try {
            const { data } = await axios.post('/api/ai/chat', {
                message: userMessage,
                history: newMessages.slice(0, -1)
            });

            setMessages(prev => [...prev, { 
                role: 'ai', 
                text: data.text, 
                products: data.products 
            }]);
        } catch (error) {
            console.error("AI Chat Error:", error);
            setMessages(prev => [...prev, { role: 'ai', text: "I'm sorry, I'm having trouble connecting right now. Please try again later!" }]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (product) => {
        addToCart(product, null, 'Ready-Made');
        
        // Calculate new total
        const currentTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newTotal = currentTotal + product.price;

        const confirmMessage = `I've just added the ${product.name} to my cart! Please acknowledge this and remind me my current cart total is now D ${newTotal.toLocaleString()}.`;
        
        setLoading(true);
        try {
            const { data } = await axios.post('/api/ai/chat', {
                message: confirmMessage,
                history: messages
            });

            setMessages(prev => [...prev, { 
                role: 'ai', 
                text: data.text 
            }]);
        } catch (error) {
            console.error("AI Cart Confirmation Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewProduct = (productId) => {
        setIsOpen(false);
        navigate(`/product/${productId}`);
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: 'var(--primary-color)',
                    color: 'var(--bg-main)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    fontSize: '24px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    zIndex: 9999,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                💬
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '350px',
            height: '500px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '15px',
                backgroundColor: 'var(--primary-color)',
                color: 'var(--bg-main)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>✨</span> WeydiBot
                </h3>
                <button 
                    onClick={() => setIsOpen(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--bg-main)', fontSize: '20px', cursor: 'pointer' }}
                >
                    ✕
                </button>
            </div>

            {/* Chat Area */}
            <div style={{
                flex: 1,
                padding: '15px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
            }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%'
                    }}>
                        <div style={{
                            backgroundColor: msg.role === 'user' ? 'var(--primary-color)' : 'var(--bg-input)',
                            color: msg.role === 'user' ? 'var(--bg-main)' : 'var(--text-main)',
                            padding: '10px 14px',
                            borderRadius: '16px',
                            borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                            borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '16px',
                            fontSize: '0.9rem',
                            lineHeight: '1.4'
                        }}>
                            {msg.text}
                        </div>
                        
                        {/* Display Products if AI returned any */}
                        {msg.products && msg.products.length > 0 && (
                            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {msg.products.map(product => (
                                    <div key={product._id} style={{
                                        backgroundColor: 'var(--bg-input)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '5px'
                                    }}>
                                        {(product.images?.[0] || product.colors?.[0]?.image) && (
                                            <img 
                                                src={getImageUrl(product.images?.[0] || product.colors?.[0]?.image)} 
                                                alt={product.name} 
                                                style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', marginBottom: '5px' }} 
                                            />
                                        )}
                                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main)' }}>{product.name}</div>
                                        <div style={{ color: 'var(--primary-color)', fontSize: '0.85rem' }}>D {product.price.toLocaleString()}</div>
                                        <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                                            <button 
                                                onClick={() => handleViewProduct(product.id || product._id)}
                                                style={{ flex: 1, padding: '5px', fontSize: '0.8rem', backgroundColor: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                View
                                            </button>
                                            <button 
                                                onClick={() => handleAddToCart(product)}
                                                style={{ flex: 1, padding: '5px', fontSize: '0.8rem', backgroundColor: 'var(--primary-color)', border: 'none', color: 'var(--bg-main)', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div style={{ alignSelf: 'flex-start', backgroundColor: 'var(--bg-input)', padding: '10px 14px', borderRadius: '16px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        Thinking...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{
                display: 'flex',
                padding: '15px',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)'
            }}>
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask WeydiBot..."
                    style={{
                        flex: 1,
                        padding: '10px 15px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '20px',
                        backgroundColor: 'var(--bg-input)',
                        color: 'var(--text-main)',
                        outline: 'none'
                    }}
                />
                <button 
                    type="submit"
                    disabled={!input.trim() || loading}
                    style={{
                        marginLeft: '10px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: input.trim() && !loading ? 'var(--primary-color)' : 'var(--light-gray)',
                        color: 'var(--bg-main)',
                        border: 'none',
                        cursor: input.trim() && !loading ? 'pointer' : 'default',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    ➤
                </button>
            </form>
        </div>
    );
};

export default AIAssistant;
