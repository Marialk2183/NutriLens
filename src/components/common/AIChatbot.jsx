import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithGemini } from '../../utils/gemini';

export const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm NutriLens AI. Ask me anything about nutrition, recipes, or gut health! 😄" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userText = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userText }]);
        setIsLoading(true);

        try {
            const reply = await chatWithGemini(userText);
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Oops! I'm having trouble thinking right now. Could you check my API keys? 😅" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Chatbot Toggle Button */}
            <button 
                onClick={() => setIsOpen(true)}
                className={`fixed z-50 bottom-24 right-6 md:bottom-10 md:right-10 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 bg-gradient-to-tr from-sage to-coral text-white ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                style={{ boxShadow: '0 8px 32px rgba(0,229,255,0.4)' }}
            >
                <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                   <MessageCircle size={32} />
                </motion.div>
            </button>

            {/* Chat Modal Layer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.2 } }}
                        className="fixed z-[60] bottom-24 right-4 md:bottom-10 md:right-10 w-[calc(100vw-32px)] md:w-96 h-[500px] max-h-[80vh] glass-panel bg-white/90 shadow-2xl flex flex-col overflow-hidden border border-white/80"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-sage to-coral p-4 flex items-center justify-between text-white shadow-sm shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold">NutriLens AI</h3>
                                    <p className="text-[10px] uppercase tracking-widest opacity-80 font-bold">Online</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-medium" ref={scrollRef}>
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                                        msg.role === 'user' 
                                            ? 'bg-forest text-white rounded-br-sm' 
                                            : 'bg-white border border-gray-100 text-forest rounded-bl-sm'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="max-w-[85%] rounded-2xl p-4 bg-white border border-gray-100 rounded-bl-sm flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-sage animate-bounce"></div>
                                        <div className="w-2 h-2 rounded-full bg-coral animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 rounded-full bg-sunny animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-3 bg-white/50 border-t border-gray-100 backdrop-blur-md shrink-0 flex items-center gap-2">
                            <input 
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Ask about healthy eating..."
                                className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage shadow-inner"
                            />
                            <button 
                                type="submit" 
                                disabled={!input.trim()}
                                className="w-12 h-12 bg-forest text-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50 hover:-translate-y-1 transition-transform"
                            >
                                <Send size={18} className="-ml-1" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
