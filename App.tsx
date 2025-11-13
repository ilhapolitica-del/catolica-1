import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { searchCatholicDoctrine } from './services/geminiService';
import { Message } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    // Add User Message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call Gemini with Grounding
      const result = await searchCatholicDoctrine(userText);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: result.text,
        groundingMetadata: result.groundingMetadata,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Ocorreu um erro ao buscar as informações. Por favor, tente novamente.",
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-stone-50">
      <Header />

      {/* Main Content / Chat Area */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto w-full min-h-full flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-stone-500 space-y-4 opacity-80 my-10">
              <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-yellow-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h2 className="text-2xl font-serif font-bold text-stone-700">Paz e Bem</h2>
              <p className="max-w-md">
                Digite sua dúvida sobre a fé, doutrina ou liturgia católica. 
                Utilizamos pesquisas em fontes confiáveis para lhe responder.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-8 w-full max-w-lg">
                <button onClick={() => { setInput("O que é a Eucaristia?"); }} className="p-3 bg-white border border-stone-200 rounded hover:border-yellow-500 hover:text-yellow-700 transition text-sm">
                  "O que é a Eucaristia?"
                </button>
                <button onClick={() => { setInput("Quais são os sacramentos?"); }} className="p-3 bg-white border border-stone-200 rounded hover:border-yellow-500 hover:text-yellow-700 transition text-sm">
                  "Quais são os sacramentos?"
                </button>
                <button onClick={() => { setInput("O que é o tempo do Advento?"); }} className="p-3 bg-white border border-stone-200 rounded hover:border-yellow-500 hover:text-yellow-700 transition text-sm">
                  "O que é o tempo do Advento?"
                </button>
                <button onClick={() => { setInput("Quem foi São Francisco de Assis?"); }} className="p-3 bg-white border border-stone-200 rounded hover:border-yellow-500 hover:text-yellow-700 transition text-sm">
                  "Quem foi São Francisco?"
                </button>
              </div>
            </div>
          ) : (
            <div className="py-4 pb-20">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-6 w-full">
                  <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <span className="text-xs text-stone-400 ml-2">Pesquisando fontes...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Footer / Input Area */}
      <footer className="bg-white border-t border-stone-200 p-4 sticky bottom-0 z-20">
        <div className="max-w-3xl mx-auto w-full">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre a doutrina católica..."
              disabled={isLoading}
              className="w-full pl-4 pr-12 py-4 bg-stone-50 border border-stone-300 text-stone-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-stone-400 shadow-sm transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Enviar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-stone-400 uppercase tracking-widest">Baseado em pesquisas do Google Search</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;