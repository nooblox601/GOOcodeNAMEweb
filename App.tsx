
import React, { useState, useRef, useEffect } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { CodeState, TabType, ChatMessage } from './types';
import { generateAppContent } from './services/geminiService';
import { 
  Search, 
  Terminal, 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw, 
  Plus, 
  X, 
  ChevronDown, 
  Lock,
  Sparkles,
  Layout,
  MessageSquare,
  History,
  Settings,
  Monitor,
  Send,
  Code2,
  Layers
} from 'lucide-react';

const INITIAL_CODE: CodeState = {
  html: `<div class="os-welcome">
  <div class="glass-card">
    <div class="badge">AI BROWSER OS</div>
    <h1>O Futuro da Web é Gerativo</h1>
    <p>A barra de endereços agora é o seu terminal criativo.</p>
    <div class="actions">
      <button onclick="document.querySelector('input').focus()">Começar a Criar</button>
    </div>
  </div>
</div>`,
  css: `body { background: #0f172a; color: white; font-family: 'Inter', sans-serif; }
.os-welcome { height: 100vh; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at top right, #1e293b, #0f172a); }
.glass-card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px); padding: 3rem; border-radius: 2rem; border: 1px border rgba(255,255,255,0.1); text-align: center; max-width: 500px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
.badge { background: #3b82f6; color: white; font-size: 0.7rem; font-weight: 800; padding: 0.3rem 0.8rem; border-radius: 1rem; display: inline-block; margin-bottom: 1rem; letter-spacing: 0.1em; }
h1 { font-size: 2.5rem; font-weight: 800; margin: 0; background: linear-gradient(to right, #60a5fa, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
p { color: #94a3b8; margin-top: 1rem; font-size: 1.1rem; }
.actions { margin-top: 2rem; }
button { background: white; color: black; border: none; padding: 0.8rem 2rem; border-radius: 0.8rem; font-weight: 600; cursor: pointer; transition: transform 0.2s; }
button:hover { transform: scale(1.05); }`,
  js: `console.log("Kernel Iniciado...");`
};

const App: React.FC = () => {
  const [code, setCode] = useState<CodeState>(INITIAL_CODE);
  const [activeTab, setActiveTab] = useState<TabType>('html');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [url, setUrl] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await generateAppContent(url);
      setCode({ html: response.html, css: response.css, js: response.js });
      setMessages([{ role: 'assistant', content: response.explanation || `Aplicação "${url}" gerada com sucesso!` }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isGenerating) return;

    const userMsg = chatInput;
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    
    setIsGenerating(true);
    try {
      const response = await generateAppContent(userMsg, code, messages);
      setCode({ html: response.html, css: response.css, js: response.js });
      setMessages(prev => [...prev, { role: 'assistant', content: response.explanation || "Código atualizado!" }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Ops, ocorreu um erro ao processar seu pedido." }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-[#0f172a] text-slate-300 overflow-hidden font-sans border border-slate-800 rounded-lg">
      
      {/* Sidebar - AI Sidekick */}
      <aside className={`flex flex-col bg-[#1e293b] border-r border-slate-800 transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-0 opacity-0'}`}>
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-white text-sm">AI SIDEKICK</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-slate-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-10 opacity-30">
              <MessageSquare className="w-12 h-12 mx-auto mb-2" />
              <p className="text-xs">Inicie um projeto para conversar com a IA</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <form onSubmit={handleChat} className="p-4 bg-slate-900/50 border-t border-slate-800">
          <div className="relative">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Refinar página..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-3 pr-10 text-xs text-white outline-none focus:border-blue-500 transition-all"
            />
            <button className="absolute right-2 top-1.5 text-blue-500 hover:text-blue-400">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </aside>

      {/* Main Browser Window */}
      <div className="flex-1 flex flex-col relative">
        
        {/* Browser Tabs & Chrome */}
        <div className="bg-[#1e293b] pt-2">
          <div className="flex items-center px-4 space-x-2">
            <div className="flex items-center bg-[#0f172a] text-white px-4 py-2 rounded-t-lg text-xs space-x-3 w-64 shadow-lg border-t border-x border-slate-700">
              <Layout className="w-3 h-3 text-blue-400" />
              <span className="truncate flex-1">{url || 'Nova Criação'}</span>
              <X className="w-3 h-3 hover:bg-slate-700 rounded p-0.5 cursor-pointer" />
            </div>
            <button className="p-1.5 hover:bg-slate-700 rounded-full text-slate-500">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="h-14 bg-[#0f172a] flex items-center px-4 space-x-4 border-b border-slate-800">
            <div className="flex space-x-3 text-slate-500">
              <ArrowLeft className="w-4 h-4 hover:text-white cursor-pointer" />
              <ArrowRight className="w-4 h-4 hover:text-white cursor-pointer" />
              <RefreshCw className={`w-4 h-4 hover:text-white cursor-pointer ${isGenerating ? 'animate-spin text-blue-500' : ''}`} />
            </div>

            <form onSubmit={handleCreate} className="flex-1">
              <div className="relative flex items-center group">
                <div className="absolute left-4 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <input 
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="O que você quer criar hoje? Ex: Um app de tarefas futurista"
                  className="w-full bg-slate-900 border border-slate-800 rounded-full py-2 pl-12 pr-4 text-sm text-slate-200 outline-none focus:border-blue-500/50 focus:bg-slate-900 transition-all"
                />
                <div className="absolute right-4">
                  <Sparkles className={`w-4 h-4 ${isGenerating ? 'text-blue-500 animate-pulse' : 'text-slate-700'}`} />
                </div>
              </div>
            </form>

            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsEditorOpen(!isEditorOpen)}
                className={`p-2 rounded-lg transition-all ${isEditorOpen ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-500'}`}
              >
                <Terminal className="w-5 h-5" />
              </button>
              {!isSidebarOpen && (
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500">
                  <MessageSquare className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Viewport Content */}
        <div className="flex-1 relative bg-[#0f172a]">
          <Preview code={code} />
          
          {isGenerating && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-6 text-sm font-bold text-white tracking-[0.3em] uppercase animate-pulse">
                Sincronizando com a Rede Neural
              </p>
            </div>
          )}
        </div>

        {/* Floating DevTools Bar */}
        <div className="h-6 bg-[#1e293b] border-t border-slate-800 flex items-center justify-between px-4 text-[9px] font-bold text-slate-500 tracking-widest uppercase">
          <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-2">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
               <span>Electron Node: Active</span>
             </div>
             <div className="h-3 w-px bg-slate-700"></div>
             <span>GPU Acceleration: On</span>
          </div>
          <div className="flex space-x-4">
            <span>RAM: 124MB</span>
            <span>Uptime: 01:24:00</span>
          </div>
        </div>

        {/* Bottom Integrated Editor */}
        <div className={`absolute bottom-6 left-0 right-0 z-[60] transition-all duration-500 transform ${isEditorOpen ? 'translate-y-0 opacity-100 px-6' : 'translate-y-full opacity-0 pointer-events-none px-6'}`}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl h-[45vh] flex flex-col overflow-hidden">
            <div className="p-3 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between">
              <div className="flex space-x-2">
                {(['html', 'css', 'js'] as TabType[]).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button onClick={() => setIsEditorOpen(false)} className="text-slate-500 hover:text-white p-1">
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1">
              <Editor 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                code={code[activeTab]} 
                onChange={(val) => setCode(prev => ({...prev, [activeTab]: val}))}
                minimal
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
