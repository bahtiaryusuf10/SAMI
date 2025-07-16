'use client';

import { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { X, MessageCircle, ArrowUp, Send } from 'lucide-react';
import { useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChat } from '@/contexts/ChatContext';
import { throttle } from 'lodash';

export default function BubbleChat() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, setMessages } = useChat();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const cardContentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [isOpen, messages]);

  const handleScroll = useCallback(() => {
    if (!cardContentRef.current) return;
    const el = cardContentRef.current;
    setShowScrollTop(el.scrollTop > 100);
  }, []);

  const throttledHandleScroll = useMemo(
    () => throttle(handleScroll, 200),
    [handleScroll]
  );

  useEffect(() => {
    const el = cardContentRef.current;
    if (!el) return;

    el.addEventListener('scroll', throttledHandleScroll);
    return () => {
      el.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [throttledHandleScroll]);

  useEffect(() => {
    return () => {
      throttledHandleScroll.cancel();
    };
  }, [throttledHandleScroll]);

  const scrollToTop = () => {
    if (!cardContentRef.current) return;
    cardContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (trimmedInput === '') return;
    if (trimmedInput.length > 1000) {
      alert('Pesan terlalu panjang, maksimal 1000 karakter.');
      return;
    }

    setMessages((prev) => [...prev, { role: 'user', content: trimmedInput }]);
    setInput('');
    setIsLoading(true);

    try {
      const newMessages = [
        ...messages,
        { role: 'user', content: trimmedInput },
      ];
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (data.message) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.message },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Gagal mendapatkan respons dari model.',
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Terjadi kesalahan saat memproses pesan.',
        },
      ]);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-7 right-6 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 p-0 shadow-lg bg-blue-300 hover:bg-blue-200"
        >
          <MessageCircle style={{ height: '22px', width: '22px' }} />
        </Button>
      ) : (
        <Card
          ref={cardRef}
          className="w-[90vw] sm:w-96 h-[80vh] sm:h-[32rem] shadow-xl flex flex-col gap-0 py-3"
        >
          {/* Header */}
          <CardHeader className="flex items-center justify-between px-4 pt-2 pb-3 mb-1 shadow-sm">
            <CardTitle className="text-base font-semibold truncate">
              Chat
            </CardTitle>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </CardHeader>

          {/* Content */}
          <CardContent
            ref={cardContentRef}
            onScroll={throttledHandleScroll}
            className="flex-1 overflow-y-auto p-0 px-4 space-y-2 text-sm bg-white"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-md max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-blue-100 text-blue-800 self-end ml-auto'
                    : 'bg-gray-100 text-gray-800 self-start mr-auto'
                }`}
              >
                <div className="prose prose-sm w-full max-w-none">
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto py-2 mb-4">
                          <table
                            className="min-w-[600px] table-auto border-collapse border border-gray-400"
                            {...props}
                          />
                        </div>
                      ),
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      th: ({ node, ...props }) => (
                        <th
                          className="border border-gray-400 bg-gray-200 px-4 py-2 text-left"
                          {...props}
                        />
                      ),
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      td: ({ node, ...props }) => (
                        <td
                          className="border border-gray-400 px-4 py-2"
                          {...props}
                        />
                      ),
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      h1: ({ node, ...props }) => (
                        <h1 className="text-xl font-bold my-2" {...props} />
                      ),
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      h2: ({ node, ...props }) => (
                        <h2 className="text-lg font-semibold my-2" {...props} />
                      ),
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      p: ({ node, ...props }) => (
                        <p className="my-2" {...props} />
                      ),
                    }}
                  >
                    {msg.content}
                  </Markdown>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="p-2 rounded-md bg-gray-200 text-gray-600 italic animate-pulse w-fit">
                Tunggu sesaat...
              </div>
            )}

            <div ref={messagesEndRef} />

            {showScrollTop && (
              <Button
                onClick={scrollToTop}
                className="absolute bottom-18 right-6 h-8 w-8 bg-gray-400 text-white opacity-30 px-3 py-1 rounded-2xl shadow-sm hover:opacity-20 transition flex items-center justify-center"
                aria-label="Scroll ke atas"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            )}
          </CardContent>

          {/* Footer */}
          <CardFooter className="px-4 pb-0 pt-3 mt-1 shadow-inner bg-gray-50">
            <div className="flex items-center gap-2 w-full">
              <input
                className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tulis pesan..."
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button
                className="h-9 bg-blue-300 hover:bg-blue-200 text-white text-sm"
                size="sm"
                onClick={handleSend}
              >
                <Send className="w-6 h-6" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
