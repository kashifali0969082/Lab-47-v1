import { useState, useEffect } from "react";
import { getAllChats, UpdateTitle } from "../../../../API-struct/Api";
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Trash,
  Pencil,
} from "lucide-react";
import DropdownButton from "../Dropdown/ModelDropdown";
import "../../../../public/Custom.css";
import { DELChat } from "../../../../API-struct/Api";
interface Chat {
  id: string;
  title: string;
}
interface ModelDataItem {
  model_id: string;
  model_name: string;
}
interface ModelDataItem {
  model_id: string;
  model_name: string;
}

interface ChatSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onSingleID: (chatID: string) => void;
  selectedModel: (model: string) => void;
  modelData: Array<ModelDataItem>;
}

interface ChatItem {
  conversation_id: string;
  title: string;
}

export default function ChatSidebar({
  isCollapsed,
  onToggle,
  onSingleID,
  selectedModel,
  modelData,
}: ChatSidebarProps) {
  const [Titles, setTitles] = useState<ChatItem[]>([]);
  const [Limit, SetLimit] = useState<number>(20);
  const [OffSet, SetOffSet] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false); // To prevent multiple fetches at onc
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [Model, SetModel] = useState("");
  const [totalTitles, setTotalTitles] = useState();
  const [hasMoreData, setHasMoreData] = useState(true);

  const handleDelete = async (conversationId: string) => {
    try {
      await DELChat(conversationId);
      setTitles((prevTitles) =>
        prevTitles.filter((title) => title.conversation_id !== conversationId)
      );
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat. Please try again.");
    }
  };
  // Pagination
  // const GettingChats = async () => {
  //   try {
  //     setIsFetching(true);
  //     const { data } = await getAllChats(
  //       "11111111-1111-1111-1111-111111111111",
  //       Limit,
  //       OffSet
  //     );
  //     setTotalTitles(data.total_count);

  //     if (data.conversations.length < 20) {
  //       console.log("Last data has been fetched");
  //     }
  //     setTitles((prevTitles) => {
  //       const newTitles = data.conversations.filter(
  //         (newItem: any) =>
  //           !prevTitles.some(
  //             (prevItem) => prevItem.conversation_id === newItem.conversation_id
  //           )
  //       );
  //       return [...prevTitles, ...newTitles];
  //     });
  //   } catch (error) {
  //     console.error("Error fetching chats:", error);
  //   } finally {
  //     setIsFetching(false);
  //   }
  // };
  // useEffect(() => {
  //   const chatContainer = document.querySelector(".chat");

  //   const handleScroll = () => {
  //     if (!isFetching && chatContainer) {
  //       const isBottom =
  //         chatContainer.scrollTop + chatContainer.clientHeight >=
  //         chatContainer.scrollHeight;
  //       if (isBottom) {
  //         SetLimit((prevLimit) => prevLimit + 20);
  //         SetOffSet((prevOffSet) => prevOffSet + 20);
  //       }
  //     }
  //   };

  //   chatContainer?.addEventListener("scroll", handleScroll);

  //   return () => {
  //     chatContainer?.removeEventListener("scroll", handleScroll);
  //   };
  // }, [isFetching]);
  // useEffect(() => {
  //   GettingChats(); // Initial load
  // }, [Limit, OffSet]);
  const GettingChats = async () => {
    try {
      setIsFetching(true);
      const { data } = await getAllChats(
        "11111111-1111-1111-1111-111111111111",
        Limit,
        OffSet
      );
      setTotalTitles(data.total_count);
      console.log(data);
      
  
      if (data.conversations.length < 20 || data.conversations.length === 0) {
        console.log("Last data has been fetched");
        setHasMoreData(false); // Stop pagination
      }
  
      setTitles((prevTitles) => {
        const newTitles = data.conversations.filter(
          (newItem:any) =>
            !prevTitles.some(
              (prevItem) => prevItem.conversation_id === newItem.conversation_id
            )
        );
        return [...prevTitles, ...newTitles];
      });
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setIsFetching(false);
    }
  };
  
  useEffect(() => {
    const chatContainer = document.querySelector(".chat");
  
    const handleScroll = () => {
      if (!isFetching && hasMoreData && chatContainer) {
        const isBottom =
          chatContainer.scrollTop + chatContainer.clientHeight >=
          chatContainer.scrollHeight;
  
        if (isBottom) {
          SetLimit((prevLimit) => prevLimit + 20);
          SetOffSet((prevOffSet) => prevOffSet + 20);
        }
      }
    };
  
    chatContainer?.addEventListener("scroll", handleScroll);
  
    return () => {
      chatContainer?.removeEventListener("scroll", handleScroll);
    };
  }, [isFetching, hasMoreData]);
  
  useEffect(() => {
    if (hasMoreData) {
      GettingChats(); // Fetch data if there are more titles to fetch
    }
  }, [Limit, OffSet, hasMoreData]);
  
  useEffect(() => {
    GettingChats(); // Initial load
  }, []);
  
  //Update title
  const UpdateChats = async (id: string, value: string) => {
    const { data } = await UpdateTitle(id, {
      new_title: value,
    });
  };
  const startEditing = (id: string, title: string) => {
    setEditingChatId(id);
    setEditTitle(title);
  };
  const updateChatTitle = (chatId: string) => {
    if (!editTitle.trim()) {
      setEditingChatId(null);
      return;
    }

    setTitles((prevChats) =>
      prevChats.map((chat) =>
        chat.conversation_id === chatId
          ? { ...chat, title: editTitle.trim() }
          : chat
      )
    );
    UpdateChats(chatId, editTitle);
    setEditingChatId(null);
  };
  const cancelEditing = () => {
    setEditingChatId(null);
    setEditTitle("");
  };
  //model selection
  const selectModel = (m: string) => {
    SetModel(m);
  };
  useEffect(() => {
    selectedModel(Model);
  }, [Model]);
  return (
    <aside
      className={`relative border-r bg-white transition-all duration-300 flex flex-col h-screen ${
        isCollapsed ? "w-[40px]" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-3 z-10 rounded-full border bg-white p-1 hover:bg-gray-50 shadow-sm"
      >
        {isCollapsed ? (
          <ChevronRightIcon size={16} />
        ) : (
          <ChevronLeftIcon size={16} />
        )}
      </button>

      {/* Dropdown and New Chat */}
      <div
        className={`p-2 border-t w-full transition-opacity duration-300 mx-auto ${
          isCollapsed ? "opacity-0 invisible" : "opacity-100 visible"
        }`}
      >
        <div className="flex justify-center items-center text-gray-600 text-4xl font-bold">
          LAB 47
        </div>
        <div className="mb-2">
          <DropdownButton modelData={modelData} onselectedModel={selectModel} />
        </div>
        <div>
          <button
            // onClick={onChatOpen}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 p-2 text-sm text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
          >
            <PlusIcon size={16} />
            New Chat
          </button>
        </div>
      </div>

      {/* Chat Titles Section */}
      <div
        className={`flex-1 overflow-y-auto px-4 py-2 chat ${
          isCollapsed ? "hidden" : "block"
        }`}
      >
        {Titles.map((item) => (
          <div
            className="mb-2 p-2 rounded-lg bg-gray-100 shadow-sm hover:bg-gray-200 cursor-pointer text-gray-600"
            key={item.conversation_id}
          >
            {editingChatId === item.conversation_id ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => updateChatTitle(item.conversation_id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    updateChatTitle(item.conversation_id);
                  } else if (e.key === "Escape") {
                    cancelEditing();
                  }
                }}
                autoFocus
                style={{ padding: "5px", width: "100%" }}
              />
            ) : (
              <div className="flex flex-row justify-between items-center">
                <div
                  className="overflow-auto chat"
                  onClick={() => onSingleID(item.conversation_id)}
                >
                  {item.title}
                </div>
                <div className="flex flex-row gap-1">
                  <Trash
                    size={26}
                    className="hover:bg-gray-300 p-1 rounded-full"
                    onClick={() => handleDelete(item.conversation_id)}
                    aria-label="Delete chat"
                  />
                  <Pencil
                    // onClick={() => handleEditTitle(item.conversation_id, item.title)}
                    className="hover:bg-gray-300 p-1 rounded-full"
                    size={26}
                    // onClick={() => UpdateChats(item.conversation_id)}
                    onClick={() =>
                      startEditing(item.conversation_id, item.title)
                    }
                    aria-label="Edit chat"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
