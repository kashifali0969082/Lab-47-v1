import {
  ArrowUpIcon,
  Code2,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Bot,
  User,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "../lib/utils";
import { AutoResizeTextarea } from "../Chunks/AutoResizeTextArea";
import { createNewChat } from "../../../../API-struct/Api";
import { MarkdownRenderer } from "../Chunks/markdown-render";
import { createMessage } from "../../../../API-struct/Api";
import { GetSpecificChat } from "../../../../API-struct/Api";
interface Message {
  id: number;
  content: string;
  role: "user" | "assistant";
}
interface ModelDataItem {
  model_id: string;
  model_name: string;
}
interface ChatInterfaceProps {
  sidebarCollapsed: boolean;
  conversationID: string;
  model?: any;
  modelData:Array<ModelDataItem>
  // NewChat: boolean;
}
const ChatInterface: React.FC<ChatInterfaceProps> = ({
  conversationID,
  modelData,
  model,
}) => {
  const [chat, setChat] = useState(true);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setmessages] = useState<Message[]>([]);
  const [mentionAdded, setMentionAdded] = useState<boolean>(false);
  const [Blocked, setBlocked] = useState(false);
  const [converationID, setConversationID] = useState("");
  const [showData, setShowData] = useState<boolean>(false);
console.log("MODEL",model);

  // const [models, setmodels] = useState("44444444-4444-4444-4444-444444444444");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setInput("");
      setBlocked(true);
      handlesubmit();
    }
  };

  const newChat = async () => {
    setChat(false);
  };
  const creatChat = async () => {
    try {
      if (converationID) {
        const { data } = await createMessage({
          conversation_id: converationID,
          content: input,
          model_id: model!,
        });
        return data[1].content;
      } else {
        const { data } = await createNewChat({
          user_id: "11111111-1111-1111-1111-111111111111",
          model_id: model!,
          initial_message: input,
        });
        setConversationID(data.conversation_id);
        return data.messages[1].content;
      }
    } catch (error) {
      console.error("error while Creating a chat", error);
    }
  };
  const handlesubmit = async () => {
    try {
      const newMessage: Message = {
        id: Date.now(),
        content: input,
        role: "user",
      };
      setmessages((prev) => [...prev, newMessage]);
      try {
        let data = await creatChat();
        let x = data;
        const newMessage: Message = {
          id: Date.now(),
          content: x,
          role: "assistant",
        };
        setmessages((prev) => [...prev, newMessage]);
      } catch (error) {
        console.log("error while setting response", error);
      }
    } catch (error) {
      console.log("error while setting user message ", error);
    }
    setBlocked(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, []);
  //Getting previous chats
  useEffect(() => {
    gettingPrevChats(conversationID);
  }, [conversationID]);
  const gettingPrevChats = async (id: string) => {
    try {
      let { data } = await GetSpecificChat(id);
      setChat(false);
      setmessages(data.messages);
      console.log("setting messages here", data);
    } catch (error) {
      console.log("error while fetching specific chat");
    }
  };
  const handleChange = (value: any) => {
    setInput(value);
    const checkAt = /^[\s]*@/;
    if (checkAt.test(value)) {
      setShowData(true);
      console.log("good");
    } else {
      // Set to false if it doesn't meet the condition
      setShowData(false);
    }
  };

  const header = (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-4">
      <h1 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
        Welcome to DSA GPTutor
      </h1>

      <p className="text-gray-600 text-center mb-8">
        Your AI-powered guide through Data Structures and Algorithms
      </p>

      <div className="w-full space-y-6">
        <div className="flex items-start space-x-4">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <MessageSquare size={20} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-900">
              Share Your Problem
            </h2>
            <p className="text-sm text-gray-500">
              Describe the DSA problem you're working on, or paste the problem
              statement
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Code2 size={20} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-900">
              Include Your Progress
            </h2>
            <p className="text-sm text-gray-500">
              Share any code you've written or approaches you've tried
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Lightbulb size={20} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-900">
              Get Stage-by-Stage Guidance
            </h2>
            <p className="text-sm text-gray-500">
              Receive structured help through understanding, planning, and
              implementation
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Sparkles size={20} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-900">
              Learn and Improve
            </h2>
            <p className="text-sm text-gray-500">
              Understand the concepts, patterns, and optimizations along the way
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <button
          onClick={newChat}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
        >
          <MessageSquare size={16} />
          Start New Chat
        </button>
      </div>
    </div>
  );

  return (
    <main className="mx-auto flex h-screen w-full max-w-[60rem] flex-col items-stretch">
      <div className="flex-1 overflow-y-auto p-4">
        {chat ? (
          header
        ) : (
          <>
            <div className="flex flex-col space-y-4 p-4">
              <div className="flex flex-col items-center justify-center text-center py-8">
                <h2 className="text-xl font-semibold mb-2 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  New Chat Started
                </h2>
                <p className="text-gray-600">
                  Start typing your DSA question below to begin the discussion
                </p>
              </div>
            </div>
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-full mb-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "flex items-start max-w-[80%] space-x-2",
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {message.role === "assistant" ? (
                    <>
                      <Bot className="w-6 h-6 mt-1 text-blue-500" />
                    </>
                  ) : (
                    <User className="w-6 h-6 mt-1 text-gray-500" />
                  )}
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2",
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    )}
                  >
                    {message.role === "assistant" ? (
                      <MarkdownRenderer content={message.content} />
                    ) : (
                      // {message.content}
                      <div style={{ whiteSpace: "pre-wrap" }}>
                        {message.content}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      {chat === false ? (
        <div className="mx-6 mb-6">
          {showData && (
            <div className="text-gray-600" >
             {modelData.map((item:any) => (
              <li
                key={item.model_id}
                // onClick={() => handleSelect(item)}
                className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
              >
                {item.model_name}
              </li>
            ))}
            </div>
          )}
          <form
            onSubmit={handlesubmit}
            className="relative flex items-center rounded-xl border bg-white px-3 py-1.5 pr-8 text-sm focus-within:ring-1 focus-within:ring-blue-200"
          >
            <AutoResizeTextarea
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={Blocked}
              placeholder="Type your message..."
              className="flex-1 bg-transparent py-1.5 focus-visible:outline-none focus:ring-0 border-none"
            />
            <button
              type="submit"
              disabled={Blocked}
              className="absolute bottom-2 right-2 rounded-full p-1 text-gray-400 hover:text-gray-600"
            >
              <ArrowUpIcon size={18} />
            </button>
          </form>
          <div className="text-xs text-gray-600 text-center pt-2">
            AI can make mistakes. Consider checking important information.
          </div>
        </div>
      ) : (
        <></>
      )}
    </main>
  );
};

export default ChatInterface;
