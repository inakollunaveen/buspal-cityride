import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Youtube, Loader2, BookOpen, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  youtubeLinks?: string[];
  searchQuery?: string;
}

const ChatBoard = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! 👋 I'm your study buddy! Ask me anything about your homework, projects, or topics you're learning. I'll help explain things clearly and suggest YouTube videos to help you learn more!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("student-chat", {
        body: { message: input },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.answer,
        youtubeLinks: data.youtubeLinks,
        searchQuery: data.searchQuery,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Oops! Something went wrong",
        description: error.message || "Please try asking your question again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-gradient-card border-2">
        <CardHeader className="bg-gradient-primary">
          <CardTitle className="flex items-center gap-3 text-primary-foreground">
            <div className="bg-primary-foreground/20 p-2 rounded-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                Student Study Helper
                <Sparkles className="h-4 w-4 animate-pulse" />
              </div>
              <p className="text-sm font-normal text-primary-foreground/80">
                Ask questions and get helpful YouTube videos!
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <ScrollArea ref={scrollRef} className="h-[500px] pr-4">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {msg.content}
                    </p>
                    {msg.youtubeLinks && msg.youtubeLinks.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-secondary-foreground/20">
                        <div className="flex items-center gap-2 mb-2 text-xs font-semibold">
                          <Youtube className="h-4 w-4 text-red-500" />
                          Helpful YouTube Videos:
                        </div>
                        <div className="space-y-2">
                          <a
                            href={msg.youtubeLinks[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-2 rounded bg-secondary-foreground/10 hover:bg-secondary-foreground/20 transition-colors"
                          >
                            <div className="flex items-center gap-2 text-xs">
                              <Youtube className="h-3 w-3 text-red-500 flex-shrink-0" />
                              <span className="line-clamp-1">
                                Search: {msg.searchQuery}
                              </span>
                            </div>
                          </a>
                          <a
                            href={msg.youtubeLinks[1]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-2 rounded bg-secondary-foreground/10 hover:bg-secondary-foreground/20 transition-colors"
                          >
                            <div className="flex items-center gap-2 text-xs">
                              <Youtube className="h-3 w-3 text-red-500 flex-shrink-0" />
                              <span className="line-clamp-1">
                                Tutorial: {msg.searchQuery}
                              </span>
                            </div>
                          </a>
                          <a
                            href={msg.youtubeLinks[2]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-2 rounded bg-secondary-foreground/10 hover:bg-secondary-foreground/20 transition-colors"
                          >
                            <div className="flex items-center gap-2 text-xs">
                              <Youtube className="h-3 w-3 text-red-500 flex-shrink-0" />
                              <span className="line-clamp-1">
                                Explained: {msg.searchQuery}
                              </span>
                            </div>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-secondary-foreground rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything! (Press Enter to send, Shift+Enter for new line)"
              className="resize-none min-h-[60px]"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              size="lg"
              className="px-6"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBoard;
