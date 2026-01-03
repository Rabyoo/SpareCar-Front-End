import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  X,
  Send,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { analyzeCarProblem } from "@/lib/aiService";
import { BiSolidCarMechanic } from "react-icons/bi";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
  timestamp: Date;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        'مرحباً بك! 👋 أنا مساعدك الذكي المتخصص في مشاكل السيارات.\n\n🔧 **يمكنني مساعدتك في:**\n• تشخيص أي مشكلة في سيارتك\n• الإجابة على أسئلتك حول الصيانة\n• تقديم نصائح احترافية\n• تحليل الصور للمشاكل\n\n💬 **اسألني أي سؤال يخطر ببالك!**\nمثل: "سيارتي تصدر صوت غريب"، "كيف أفحص الزيت؟"، "متى أغير الفرامل؟"\n\n📸 يمكنك أيضاً رفع صورة للمشكلة وسأساعدك في تشخيصها!',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [inputMessage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        toast.success("تم رفع الصورة بنجاح");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    const textToSend = inputMessage.trim();

    if (!textToSend && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend || "تم رفع صورة للتحليل",
      image: selectedImage || undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const aiResponse = await analyzeCarProblem(
        textToSend,
        selectedImage || undefined
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSelectedImage(null);
    } catch (error) {
      toast.error("حدث خطأ في معالجة الرسالة");
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          'مرحباً بك! 👋 أنا مساعدك الذكي المتخصص في مشاكل السيارات.\n\n🔧 **يمكنني مساعدتك في:**\n• تشخيص أي مشكلة في سيارتك\n• الإجابة على أسئلتك حول الصيانة\n• تقديم نصائح احترافية\n• تحليل الصور للمشاكل\n\n💬 **اسألني أي سؤال يخطر ببالك!**\nمثل: "سيارتي تصدر صوت غريب"، "كيف أفحص الزيت؟"، "متى أغير الفرامل؟"\n\n📸 يمكنك أيضاً رفع صورة للمشكلة وسأساعدك في تشخيصها!',
        timestamp: new Date(),
      },
    ]);
    setSelectedImage(null);
    toast.success("تم مسح المحادثة");
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-6 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-orange-600 to-orange-600  z-50 transition-all hover:scale-105"
          size="icon">
          <BiSolidCarMechanic className="!w-6 !h-6 text-gray-950" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
        </Button>
      )}

      {/* Chat Window - Fixed Size like ChatGPT */}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-[380px] h-[600px] shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-5 rounded-2xl overflow-hidden border-2 border-gray-200">
          {/* Header - Fixed */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-600 text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">مساعد السيارات الذكي</h3>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-xs text-white/90">متصل الآن</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={clearChat}
                className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                title="مسح المحادثة">
                <Trash2 className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area - Scrollable */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4"
            style={{
              scrollBehavior: "smooth",
              overflowY: "auto",
              maxHeight: "calc(600px - 140px)",
            }}>
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}>
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Uploaded"
                        className="rounded-lg mb-2 max-h-40 w-full object-cover"
                      />
                    )}
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>

                    <p
                      className={`text-xs mt-1.5 ${
                        message.role === "user"
                          ? "text-white/70"
                          : "text-gray-500"
                      }`}>
                      {message.timestamp.toLocaleTimeString("ar-EG", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">
                      جاري التحليل والإجابة...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area - Fixed at Bottom */}
          <div className="border-t bg-white p-3 shrink-0">
            {/* Image Preview */}
            {selectedImage && (
              <div className="mb-2">
                <div className="relative inline-block">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="h-20 rounded-lg border-2 border-blue-200"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full shadow-lg"
                    onClick={() => setSelectedImage(null)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-2 items-end">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="shrink-0 hover:bg-blue-50 border-blue-200 h-10 w-10">
                <ImageIcon className="h-5 w-5 text-blue-600" />
              </Button>

              <textarea
                ref={textareaRef}
                placeholder="اسأل أي سؤال عن سيارتك..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                rows={1}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-[120px] text-sm"
                style={{ minHeight: "40px" }}
              />

              <Button
                onClick={() => handleSendMessage()}
                disabled={isLoading || (!inputMessage.trim() && !selectedImage)}
                className="shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-10 w-10 p-0">
                <Send className="h-5 w-5" />
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-2 text-center">
              اضغط Enter للإرسال • Shift+Enter لسطر جديد
            </p>
          </div>
        </Card>
      )}

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 640px) {
          .fixed.bottom-4.right-4 {
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
            width: calc(100vw - 2rem) !important;
            max-width: none;
          }
        }
      `}</style>
    </>
  );
}
