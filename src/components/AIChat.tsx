import { useState, useRef, useEffect } from "react";
import { Send, X, Image, Loader2, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MessageContent {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}

interface Message {
  role: "user" | "assistant";
  content: string | MessageContent[];
  displayContent?: string;
  imagePreview?: string;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  isDemo?: boolean;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

const QUICK_PROMPTS = [
  { emoji: "🧘", label: "Stress tips" },
  { emoji: "📚", label: "Study help" },
  { emoji: "💤", label: "Sleep advice" },
];

export default function AIChat({ isOpen, onClose, isDemo = false }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFirstMessage = messages.length === 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClearChat = () => {
    setMessages([]);
    setInput("");
    setSelectedImage(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Image must be under 5MB", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setSelectedImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const sendMessage = async (overrideText?: string) => {
    const messageText = overrideText?.trim() || input.trim();
    const imageData = selectedImage;
    if (!messageText && !imageData) return;
    if (isLoading) return;

    let contentForAPI: string | MessageContent[];
    if (imageData) {
      contentForAPI = [];
      contentForAPI.push({ type: "text", text: messageText || "What do you see in this image?" });
      contentForAPI.push({ type: "image_url", image_url: { url: imageData } });
    } else {
      contentForAPI = messageText;
    }

    const userMessage: Message = {
      role: "user",
      content: contentForAPI,
      displayContent: messageText || "Shared an image",
      imagePreview: imageData || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    setIsLoading(true);

    let assistantContent = "";

    try {
      const apiMessages = [...messages, userMessage].map(m => ({ role: m.role, content: m.content }));
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      setMessages(prev => [...prev, { role: "assistant", content: "", displayContent: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                  displayContent: assistantContent,
                };
                return newMessages;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("AI chat error:", error);
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect to AI.",
        variant: "destructive",
      });
      if (!assistantContent) setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-28 right-8 z-50 w-80 md:w-96 animate-scale-in">
      <div className="rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/10 bg-card flex flex-col max-h-[80vh] h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-primary/15 via-secondary/10 to-primary/15 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-lg">🌟</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-card" />
            </div>
            <div>
              <h4 className="font-orbitron font-bold text-sm text-gradient">Aurora ✨</h4>
              <p className="text-[10px] text-muted-foreground">
                {isLoading ? "✍️ Typing..." : "● Your AI Guardian"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              title="Clear chat"
              className="p-2 rounded-lg hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Close chat"
              className="p-2 rounded-lg bg-red-500/15 hover:bg-red-500/30 border border-red-500/30 transition-colors"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {isFirstMessage ? (
            /* Welcome screen */
            <div className="flex flex-col items-center justify-center h-full text-center space-y-5 animate-fade-up">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-violet-500 to-secondary flex items-center justify-center shadow-xl shadow-primary/30 animate-pulse">
                  <span className="text-3xl">🌟</span>
                </div>
                <div className="absolute -top-1 -right-1 text-xs">✨</div>
                <div className="absolute -bottom-1 -left-1 text-xs">💫</div>
              </div>

              <div>
                <h3 className="text-xl font-orbitron font-bold text-gradient mb-2">
                  Hiii! I'm Aurora~ 💕
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">
                  I'm here to help with stress, studies, and anything you need! Share images too~ 📸
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center pt-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.label}
                    onClick={() => sendMessage(`Give me ${prompt.label.toLowerCase()}`)}
                    className="px-4 py-2 rounded-full text-xs font-medium border border-primary/30 bg-primary/5 hover:bg-primary/15 text-foreground hover:border-primary/60 transition-all duration-200 hover:scale-105"
                  >
                    {prompt.emoji} {prompt.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Chat messages */
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-primary/25 to-secondary/15 border border-primary/30 rounded-br-md"
                        : "bg-muted/20 border border-border/20 rounded-bl-md"
                    }`}
                  >
                    {msg.imagePreview && (
                      <img
                        src={msg.imagePreview}
                        alt="Shared"
                        className="max-w-full h-auto rounded-lg mb-2 max-h-32 object-cover"
                      />
                    )}
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {msg.displayContent || (typeof msg.content === "string" ? msg.content : "")}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex justify-start">
                  <div className="p-3 bg-muted/20 rounded-2xl rounded-bl-md border border-border/20">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-primary/60 animate-pulse"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Image Preview */}
        {selectedImage && (
          <div className="relative px-4 py-2 border-t border-border/20">
            <img src={selectedImage} alt="Preview" className="h-14 w-auto rounded-lg object-cover" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-1 right-3 p-1 bg-destructive/80 rounded-full hover:bg-destructive transition-colors"
            >
              <X className="w-3 h-3 text-destructive-foreground" />
            </button>
          </div>
        )}

        {/* Input area */}
        <div className="px-4 py-3 border-t border-border/20 bg-card/50">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-muted/20 text-muted-foreground hover:text-primary hover:bg-muted/40 transition-all disabled:opacity-50 border border-border/20"
              title="Attach image"
            >
              <Image className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Chat with Aurora~ ✨"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-muted/15 rounded-xl text-sm outline-none border border-border/30 focus:border-primary/50 transition-all disabled:opacity-50 placeholder:text-muted-foreground/50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className="p-2.5 rounded-xl bg-gradient-to-r from-primary/30 to-secondary/30 text-primary hover:from-primary/50 hover:to-secondary/50 transition-all disabled:opacity-30 border border-primary/30"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
