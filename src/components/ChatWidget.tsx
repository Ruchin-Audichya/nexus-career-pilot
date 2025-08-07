import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatWidgetProps {
  profile: {
    name: string;
    college: string;
    branch: string;
    year: string;
    skills: string[];
    interests: string[];
  };
}

export const ChatWidget = ({ profile }: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi ${profile.name}! I'm your AI career assistant. I can help you with career advice, skill development, and internship guidance. What would you like to know?`,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Replace this with actual AI API call
  // You can use Gemini API, OpenAI GPT-4, or Claude here
  // Example: https://ai.google.dev/gemini-api/docs
  const sendMessageToAI = async (message: string) => {
    setIsLoading(true);
    
    try {
      // PLACEHOLDER: Add your AI API integration here
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     message,
      //     profile,
      //     context: messages
      //   })
      // });
      
      // Mock response for now - replace with actual AI response
      const mockResponses = [
        "Based on your skills in Python and C++, I'd recommend focusing on backend development roles. Consider learning frameworks like Django or Flask for Python.",
        "For AI/ML internships, I suggest building projects with TensorFlow or PyTorch. This will make your profile stand out to recruiters.",
        "Given your CSE background at JECRC University, consider applying to companies like TCS, Infosys, or startups in Jaipur for internships.",
        "To improve your Git skills, try contributing to open source projects on GitHub. This will also showcase your coding abilities to potential employers."
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI API Error:', error);
      // Error handling - you can customize this
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Send to AI
    await sendMessageToAI(inputText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Widget */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-2xl z-40 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-secondary/10">
            <h3 className="font-semibold text-foreground">Career AI Assistant</h3>
            <p className="text-sm text-muted-foreground">Ask me about internships, skills, or career advice</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about internships, skills, or career advice..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};