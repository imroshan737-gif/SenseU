import { useState, useRef, useEffect } from "react";
import { Send, X, Image, Loader2 } from "lucide-react";
import GlassCard from "./GlassCard";
import { toast } from "@/hooks/use-toast";

interface MessageContent {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}

interface Message {
  role: "user" | "assistant";
  content: string | MessageContent[];
  displayContent?: string; // For displaying in UI
  imagePreview?: string; // For showing image preview
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  isDemo?: boolean;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

export default function AIChat({ isOpen, onClose, isDemo = false }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: isDemo 
        ? "Welcome to the demo! I'm your AI Guardian. Ask me anything - I can help with stress, studies, or any topic! You can even share images for me to analyze."
        : "Hi there! I'm your AI Guardian. I can help with anything - stress management, homework, life advice, or just chat! You can also share images and I'll analyze them for you.",
      displayContent: isDemo 
        ? "Welcome to the demo! I'm your AI Guardian. Ask me anything - I can help with stress, studies, or any topic! You can even share images for me to analyze."
        : "Hi there! I'm your AI Guardian. I can help with anything - stress management, homework, life advice, or just chat! You can also share images and I'll analyze them for you."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const sendMessage = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const messageText = input.trim();
    const imageData = selectedImage;

    // Build content array for API
    let contentForAPI: string | MessageContent[];
    if (imageData) {
      contentForAPI = [];
      if (messageText) {
        contentForAPI.push({ type: "text", text: messageText });
      } else {
        contentForAPI.push({ type: "text", text: "What do you see in this image?" });
      }
      contentForAPI.push({ type: "image_url", image_url: { url: imageData } });
    } else {
      contentForAPI = messageText;
    }

    const userMessage: Message = { 
      role: "user", 
      content: contentForAPI,
      displayContent: messageText || "Shared an image",
      imagePreview: imageData || undefined
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    setIsLoading(true);

    let assistantContent = "";

    try {
      // Prepare messages for API - convert to format expected by API
      const apiMessages = [...messages, userMessage].map(m => ({ 
        role: m.role, 
        content: m.content 
      }));

      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
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
                  displayContent: assistantContent 
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
        description: error instanceof Error ? error.message : "Failed to connect to AI. Please try again.",
        variant: "destructive",
      });
      if (!assistantContent) {
        setMessages(prev => prev.slice(0, -1));
      }
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
      <GlassCard className="max-h-[500px] flex flex-col bg-card/95 before:opacity-0 border border-border/70 backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse" />
            <div>
              <h4 className="font-orbitron font-semibold text-sm text-gradient">Aurora</h4>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "Thinking..." : "Your AI Guardian 💫"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close chat"
            className="p-2 rounded-lg bg-muted/40 hover:bg-muted/60 border border-border/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 max-h-72">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl text-sm ${
                msg.role === "user"
                  ? "bg-primary/20 ml-8 border border-primary/30"
                  : "bg-muted/30 mr-8"
              }`}
            >
              {msg.imagePreview && (
                <img 
                  src={msg.imagePreview} 
                  alt="Shared" 
                  className="max-w-full h-auto rounded-lg mb-2 max-h-32 object-cover"
                />
              )}
              <p className="text-foreground whitespace-pre-wrap">{msg.displayContent || (typeof msg.content === 'string' ? msg.content : '')}</p>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="p-3 bg-muted/30 rounded-xl mr-8">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Image Preview */}
        {selectedImage && (
          <div className="relative px-2 py-2 border-t border-border/30">
            <img src={selectedImage} alt="Preview" className="h-16 w-auto rounded-lg object-cover" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-1 right-1 p-1 bg-destructive rounded-full"
            >
              <X className="w-3 h-3 text-destructive-foreground" />
            </button>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 pt-4 border-t border-border/30">
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
            className="p-2 bg-muted/30 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors disabled:opacity-50"
            title="Attach image"
          >
            <Image className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask anything..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 bg-muted/30 rounded-lg text-sm outline-none border border-border/30 focus:border-primary/50 transition-colors disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="p-2 bg-primary/20 rounded-lg text-primary hover:bg-primary/30 transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
