"use client"

import { useState, useRef, useEffect } from "react"
import { Brain, X, Minimize2, Maximize2, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useChat } from "@ai-sdk/react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function WatchAIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, status, error } = useChat({
    api: "/api/chat",
    onResponse: (response) => {
      console.log("[v0] AI Response received:", response.status)
    },
    onError: (err) => {
      console.error("[v0] AI Error:", err)
    },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm W.A.T.C.H AI, your intelligent assistant. I can help you with conservation insights, general questions, or anything else you'd like to discuss!",
      },
    ],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen])

  // Focus input when chat opens
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

  return (
    <>
      {/* Floating button when closed */}
      {!isOpen && (
        <Button
          onClick={toggleOpen}
          className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 z-50"
          aria-label="Open W.A.T.C.H AI Assistant"
        >
          <Brain className="h-6 w-6" />
        </Button>
      )}

      {/* Chat interface when open */}
      {isOpen && (
        <Card
          className={cn(
            "fixed z-50 transition-all duration-300 shadow-xl border-emerald-200 dark:border-emerald-800",
            isMinimized ? "bottom-4 right-4 w-auto h-auto" : "bottom-4 right-4 w-80 md:w-96 h-[500px] max-h-[80vh]",
          )}
        >
          <CardHeader className="p-3 border-b flex flex-row items-center justify-between bg-emerald-50 dark:bg-emerald-950/30 rounded-t-lg">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-emerald-600">
                <Brain className="h-4 w-4 text-white" />
              </Avatar>
              {!isMinimized && <CardTitle className="text-sm font-medium">W.A.T.C.H AI Assistant</CardTitle>}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={toggleMinimize}
                aria-label={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleOpen} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="p-3 overflow-y-auto flex-1 h-[calc(500px-120px)]">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-3",
                          message.role === "user" ? "bg-emerald-600 text-white" : "bg-gray-100 dark:bg-gray-800",
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
                  {status !== "idle" && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin text-emerald-600" />
                        <span className="text-xs text-muted-foreground italic">
                          {status === "streaming" ? "W.A.T.C.H is thinking..." : "Connecting..."}
                        </span>
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="text-xs text-red-500 text-center p-2 bg-red-50 dark:bg-red-950/20 rounded">
                      Error: {error.message || "Failed to send message"}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <CardFooter className="p-3 pt-0 border-t-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (input?.trim() && status === "idle") {
                      handleSubmit(e)
                    }
                  }}
                  className="flex w-full gap-2"
                >
                  <Input
                    ref={inputRef}
                    placeholder="Ask W.A.T.C.H AI..."
                    value={input}
                    onChange={handleInputChange}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input?.trim() || status !== "idle"}
                    className="bg-emerald-600 hover:bg-emerald-700 h-9 w-9 shrink-0"
                  >
                    {status !== "idle" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
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
