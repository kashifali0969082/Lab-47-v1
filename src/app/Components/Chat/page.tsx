"use client";
import { useEffect, useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatInterface from "./ChatInterface";
interface props {
  modelData: Array<ModelDataItem>;
}
interface ModelDataItem {
  model_id: string;
  model_name: string;
}

export default function DashboardPage({ modelData }: props) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [SingleChatID, SetSingleChatID] = useState("");
  const [models, setmodels] = useState<string>();
  const[newchat,setnewchat]=useState(false)
  const handleSingleId = (chatID: string) => {
    SetSingleChatID(chatID); // Set the value you want to pass
  };
  const handleSelectedModel = (model: string) => {
    setmodels(model);
  };
  console.log("new chat",newchat);
  

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ChatSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        modelData={modelData}
        onSingleID={handleSingleId}
        selectedModel={handleSelectedModel}
        Toggle={()=>setnewchat(true)}
      />
      <main className="flex-1">
        <ChatInterface
          model={models}
          modelData={modelData}
          sidebarCollapsed={isSidebarCollapsed}
          conversationID={SingleChatID}
          toggle={newchat}
          togsetter={()=>setnewchat(false)}
        />
      </main>
    </div>
  );
}
