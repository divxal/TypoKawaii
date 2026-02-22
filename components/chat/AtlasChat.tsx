import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';
import { ChatMessage } from '../../types';
import { useUser } from '../../contexts/UserContext';
import { generateAtlasResponse } from '../../services/geminiService';

const AtlasChat = () => {
  const { user } = useUser();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  if (!user) return null;

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const newMessage: ChatMessage = { role: 'user', text: chatInput };
    setChatHistory(prev => [...prev, newMessage]);
    setChatInput('');
    setIsChatLoading(true);

    const response = await generateAtlasResponse(newMessage.text, user, chatHistory);
    setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    setIsChatLoading(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-xl border-2 border-blue-100 dark:border-blue-900 hover:scale-110 transition flex items-center gap-2 group"
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
            <Star className="text-white w-6 h-6 fill-white" />
          </div>
          <span className="font-bold text-gray-600 dark:text-gray-300 pr-2 hidden group-hover:block transition-all">Atlas AI</span>
        </button>
      )}

      {isChatOpen && (
        <div className="bg-white dark:bg-slate-800 w-80 h-96 rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-slate-700 overflow-hidden animate-slide-up">
          <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-white" />
              <span className="font-bold">Atlas</span>
            </div>
            <button onClick={() => setIsChatOpen(false)}><X className="w-5 h-5" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-slate-900">
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-2 rounded-xl rounded-tl-none text-sm shadow-sm max-w-[85%] text-gray-700 dark:text-gray-200">
                ¡Hola {user.username}! Soy Atlas. ¿En qué puedo ayudarte hoy?
              </div>
            </div>
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 rounded-xl text-sm shadow-sm max-w-[85%] ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-slate-700 p-2 rounded-xl rounded-tl-none text-xs text-gray-500 dark:text-gray-400 animate-pulse">
                  Atlas está escribiendo...
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 flex gap-2">
            <input
              className="flex-1 bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 rounded-full px-3 py-1.5 text-sm outline-none focus:border-blue-400"
              placeholder="Pregunta algo..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
            />
            <button onClick={sendChatMessage} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtlasChat;
