"use client"

import { useState, useRef, useEffect } from "react"
import { Brain, X, Minimize2, Maximize2, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt?: string
}

export function WatchAIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm W.A.T.C.H AI, your intelligent assistant. I can help you with conservation insights, general questions, or anything else you'd like to discuss!",
      createdAt: new Date().toISOString()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // send history as API format expects
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })) 
        })
      });

      if (!response.ok) {
        let errMessage = "Failed to communicate with W.A.T.C.H AI";
        try { errMessage = await response.text() } catch {}
        throw new Error(errMessage);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const assistantMessageId = (Date.now() + 1).toString();
      let assistantContent = "";

      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString()
      }]);

      let done = false;
      while (!done) {
        const { value, done: isDone } = await reader.read();
        done = isDone;
        if (value) {
          assistantContent += decoder.decode(value, { stream: true });
          
          setMessages(prev => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            if (newMessages[lastIndex].id === assistantMessageId) {
              newMessages[lastIndex].content = assistantContent;
            }
            return newMessages;
          });
        }
      }
    } catch (err: any) {
      console.error("[v0] AI Chat error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button when closed */}
      {!isOpen && (
        <Button
          onClick={toggleOpen}
          className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50 animate-glow"
          aria-label="Open W.A.T.C.H AI Assistant"
        >
          <Brain className="h-6 w-6 text-primary-foreground" />
        </Button>
      )}

      {/* Chat interface when open */}
      {isOpen && (
        <Card
          className={cn(
            "fixed z-50 transition-all duration-300 shadow-xl border border-border bg-card",
            isMinimized ? "bottom-4 right-4 w-auto h-auto" : "bottom-4 right-4 w-80 md:w-96 h-[500px] max-h-[80vh]",
          )}
        >
          <CardHeader className="p-3 border-b border-border flex flex-row items-center justify-between bg-card rounded-t-lg">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-primary">
                <Brain className="h-4 w-4 text-primary-foreground" />
              </Avatar>
              {!isMinimized && <CardTitle className="text-sm font-medium text-card-foreground">W.A.T.C.H AI Assistant</CardTitle>}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-card-hover"
                onClick={toggleMinimize}
                aria-label={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-card-hover" onClick={toggleOpen} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="p-3 overflow-y-auto flex-1 h-[calc(500px-120px)] bg-card">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-3",
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card-hover text-card-foreground border border-border",
                        )}
                      >
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        {message.createdAt && (
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-card rounded-lg p-3 flex items-center gap-2 border border-border">
                        <Loader2 className="h-3 w-3 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground italic">
                          W.A.T.C.H is thinking...
                        </span>
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="text-xs text-red-500 text-center p-2 bg-red-50 dark:bg-red-950/20 rounded">
                      Error: {error}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <CardFooter className="p-3 pt-0 border-t-0 bg-card">
                <form
                  onSubmit={handleSubmit}
                  className="flex w-full gap-2"
                >
                  <Input
                    ref={inputRef}
                    placeholder="Ask W.A.T.C.H AI..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="flex-1 bg-background text-foreground border-border placeholder:text-muted-foreground"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input?.trim() || isLoading}
                    className="bg-primary hover:bg-primary-hover text-primary-foreground h-9 w-9 shrink-0"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </>
  )
}
