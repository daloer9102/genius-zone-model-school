/**
 * Multi-Turn Gemini AI Chatbot for Genius Zone Model School (GZMS)
 * Supports Role Personas, Models (gemini-3.8-flash, gemini-3.1-flash-lite, gemini-4-argon),
 * scrollable thread, and conversation history.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { ChatRole } from '../../server/gemini';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Cpu,
  GraduationCap,
  BookOpen,
  Shield,
  Minimize2,
  Maximize2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const GeminiChatbot: React.FC = () => {
  const { t } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<ChatRole>('ACADEMIC_COUNSELOR');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'model',
      text: 'আসসালামু আলাইকুম! আমি জিনিয়াস জোন মডেল স্কুল (GZMS)-এর এআই স্মার্ট সহকারী। ২০২৬ শিক্ষাবর্ষে ভর্তি, মাসিক ফি, স্মার্ট কিউআর হাজিরা, ফলাফল বা বিদ্যালয়ের যেকোনো তথ্যের ব্যাপারে কীভাবে আপনাকে সাহায্য করতে পারি?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Prepare history formatted for server-side Gemini API
      const historyPayload = newMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          role: selectedRole,
          model: selectedModel,
        }),
      });

      const data = await res.json();
      const replyText = data.text || data.error || 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি। পুনরায় চেষ্টা করুন।';

      const modelMsg: ChatMessage = {
        id: `msg-model-${Date.now()}`,
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : 'Network error';
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: 'model',
          text: `সার্ভার সংযোগ ত্রুটি: ${errorText}। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    '২০২৬ শিক্ষাবর্ষে ভর্তির নিয়ম ও প্রয়োজনীয় কাগজ কী কী?',
    'স্কুলের স্মার্ট কিউআর হাজিরা ও সকাল ৯:২০ এর এসএমএস সিস্টেম সম্পর্কে বলুন',
    'বিকাশে ফি দেওয়ার নিয়ম ও হেল্পলাইন নম্বর কত?',
    '৫ম শ্রেণীর গণিত ভগ্নাংশের নিয়ম সংক্ষেপে বুঝিয়ে দাও',
  ];

  const handleClearHistory = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'model',
        text: 'নতুন আলোচনা শুরু হয়েছে। জিনিয়াস জোন মডেল স্কুল সম্পর্কে আপনার যেকোনো প্রশ্ন করতে পারেন।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-blue-900 via-blue-800 to-indigo-900 text-white p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all border-2 border-amber-400 group flex items-center gap-2"
          aria-label="Open Gemini AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-amber-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <span className="font-bold text-xs pr-1 hidden sm:inline-block">
            {t('এআই স্কুল হেল্পডেস্ক', 'GZMS AI Assistant')}
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[90vh] bg-white rounded-3xl shadow-2xl border-2 border-blue-600 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 p-4 text-white flex justify-between items-center shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-white leading-none">
                    {t('জিনিয়াস জোন এআই চ্যাটবট', 'Genius Zone Gemini AI')}
                  </h3>
                  <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                    {selectedModel.includes('argon') ? 'ARGON' : selectedModel.includes('lite') ? 'LITE' : '3.8 FLASH'}
                  </span>
                </div>
                <p className="text-[10px] text-blue-200 mt-0.5">
                  Powered by Google Gemini • Multi-Turn Chat
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-blue-800/60"
                title="Clear conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-blue-800/60"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Model & Role Persona Selector Bar */}
          <div className="bg-slate-50 border-b border-slate-200 p-2.5 text-[11px] grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                {t('ভূমিকা (Role)', 'Persona Role')}
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as ChatRole)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-800"
              >
                <option value="ACADEMIC_COUNSELOR">{t('ভর্তি ও শিক্ষা পরামর্শক', 'Academic Counselor')}</option>
                <option value="STUDENT_TUTOR">{t('হোমওয়ার্ক ও বিষয় টিউটর', 'Student Homework Tutor')}</option>
                <option value="ADMIN_ASSISTANT">{t('স্কুল অ্যাডমিন সহকারী', 'School Admin Assistant')}</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                {t('মডেল (Model)', 'Gemini Model')}
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-800 font-mono text-[10px]"
              >
                <option value="gemini-3.8-flash">gemini-3.8-flash (General)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
                <option value="gemini-4-argon">gemini-4-argon (Complex)</option>
              </select>
            </div>
          </div>

          {/* Message Thread (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-blue-900 text-white'
                        : 'bg-amber-400 text-blue-950'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs leading-relaxed ${
                      isUser
                        ? 'bg-blue-900 text-white rounded-tr-xs'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`block text-[9px] mt-1 font-mono text-right ${
                        isUser ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 text-xs flex items-center gap-1.5 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-slate-500 text-[11px] font-medium ml-1">
                    {t('উত্তর তৈরি হচ্ছে...', 'Gemini is typing...')}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          {messages.length <= 2 && (
            <div className="px-3 py-1.5 bg-slate-100/70 border-t border-slate-200 flex gap-1.5 overflow-x-auto text-[10px]">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="bg-white hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-full shrink-0 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('আপনার প্রশ্ন লিখুন (বাংলা বা ইংরেজি)...', 'Ask anything in Bangla or English...')}
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900 bg-slate-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 text-white font-bold p-2 rounded-xl transition-all shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-amber-400" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
