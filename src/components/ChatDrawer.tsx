import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Heart, 
  Reply, 
  ShieldCheck, 
  Phone, 
  Store, 
  Check, 
  CheckCheck,
  Smile
} from 'lucide-react';
import { ChatMessage, User } from '../types';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shopId: string;
  shopName: string;
  shopPhone: string;
  currentUser: User;
  messages: ChatMessage[];
  onSendMessage: (text: string, replyTo?: ChatMessage) => void;
  onLikeMessage: (messageId: string) => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  shopId,
  shopName,
  shopPhone,
  currentUser,
  messages,
  onSendMessage,
  onLikeMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [isMerchantTyping, setIsMerchantTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const conversationMessages = messages.filter(
    m => m.conversationId === `${shopId}_${currentUser.id}` || m.recipientId === shopId || m.senderId === shopId
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');
    const replyTarget = replyingTo || undefined;
    setReplyingTo(null);

    onSendMessage(textToSend, replyTarget);

    // Simulate realistic instant merchant typing and reply
    setIsMerchantTyping(true);
    setTimeout(() => {
      setIsMerchantTyping(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold truncate max-w-[170px]">{shopName}</h3>
                <span className="text-[10px] bg-emerald-400/20 text-emerald-100 border border-emerald-300/30 px-1.5 py-0.2 rounded-full font-bold">
                  Online
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-blue-200">
                <a href={`tel:${shopPhone}`} className="hover:underline flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{shopPhone}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* End-to-End Encryption Badge */}
        <div className="bg-blue-50/90 border-b border-blue-200/80 px-4 py-1.5 flex items-center justify-center gap-1.5 text-[11px] text-blue-800 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>End-to-End Encrypted Customer & Merchant Channel</span>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/50">
          
          {conversationMessages.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
                <Store className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-neutral-600">
                Start a live inquiry with {shopName}
              </p>
              <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
                Ask about current stock, bulk wholesale orders, custom Chitenge sizing, or direct delivery in Zambia.
              </p>
            </div>
          ) : (
            conversationMessages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} group`}
                >
                  {/* Sender Name */}
                  <span className="text-[10px] text-neutral-400 font-medium px-1 mb-0.5">
                    {isMine ? 'You' : msg.senderName}
                  </span>

                  {/* Message Bubble Container */}
                  <div className="relative max-w-[82%]">
                    {/* Reply To Reference Bubble */}
                    {msg.replyToText && (
                      <div className="mb-1 p-1.5 bg-black/10 rounded-lg text-[10px] text-neutral-600 border-l-2 border-amber-600 italic line-clamp-1">
                        Replying: "{msg.replyToText}"
                      </div>
                    )}

                    <div
                      className={`p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-2xs relative ${
                        isMine
                          ? 'bg-blue-600 text-white rounded-br-xs'
                          : 'bg-white text-neutral-900 border border-neutral-200 rounded-bl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                      
                      {/* Bottom Time & Liked Heart Badge */}
                      <div className={`mt-1 flex items-center justify-end gap-1 text-[9px] ${
                        isMine ? 'text-blue-200' : 'text-neutral-400'
                      }`}>
                        <span>{timeStr}</span>
                        {isMine && <CheckCheck className="w-3 h-3 text-blue-200" />}
                      </div>

                      {/* Liked Heart Floating Badge */}
                      {msg.isLiked && (
                        <div className="absolute -bottom-2 -right-1 bg-white border border-red-200 rounded-full p-0.5 shadow-xs">
                          <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                        </div>
                      )}
                    </div>

                    {/* Quick Hover Message Actions: Reply & Like */}
                    <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                      isMine ? '-left-14' : '-right-14'
                    }`}>
                      <button
                        type="button"
                        onClick={() => onLikeMessage(msg.id)}
                        className="p-1 rounded-full bg-white text-neutral-500 hover:text-red-500 shadow-xs border border-neutral-200"
                        title="Like message"
                      >
                        <Heart className={`w-3 h-3 ${msg.isLiked ? 'text-red-500 fill-red-500' : ''}`} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setReplyingTo(msg)}
                        className="p-1 rounded-full bg-white text-neutral-500 hover:text-blue-600 shadow-xs border border-neutral-200"
                        title="Reply to message"
                      >
                        <Reply className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {isMerchantTyping && (
            <div className="flex items-center gap-2 text-xs text-neutral-400 italic animate-pulse">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>{shopName} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-neutral-200">
          
          {/* Active Reply Banner */}
          {replyingTo && (
            <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
              <div className="flex items-center gap-2 truncate">
                <Reply className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span className="truncate">Replying to {replyingTo.senderName}: "{replyingTo.text}"</span>
              </div>
              <button onClick={() => setReplyingTo(null)} className="text-blue-500 hover:text-blue-800">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${shopName}...`}
              className="flex-1 px-3.5 py-2.5 bg-neutral-100 focus:bg-white text-xs rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-hidden text-neutral-800"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl shadow-xs transition-all active:scale-95 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
