import { invokeget } from "./Invoke";
import { invokepost } from "./Invoke";
import { BackendBaseUrl } from "./config";
import { invokeheaderpost } from "./Invoke";
interface chatData {
  user_id: string;
  model_id: string;
  initial_message: string;
}
interface chatMSG {
  conversation_id: string;
  content: string;
  model_id: string;
}
//   interface getChat{
//        chatId:string

//   }
export const GettingAllData = () => {
  return invokeget({
    method: "GET",
    baseURL: BackendBaseUrl,
    route: "api/models/",
  });
};

export const createNewChat = (data: chatData) => {
  return invokepost({
    method: "POST",
    data: data,
    baseURL: BackendBaseUrl,
    route: "api/chats/",
  });
};

export const createMessage = (data: chatMSG) => {
  return invokepost({
    method: "POST",
    data: data,
    baseURL: BackendBaseUrl,
    route: "api/chats/message/",
  });
};
export const getAllChats = (chatId: string,Limit:number,offset:number) => {
  return invokeheaderpost({
    method: "GET",
    baseURL: BackendBaseUrl,
    route: `api/chats/titles/${chatId}/?limit=${Limit}&offset=${offset}`,
  });
};


export const DELChat = (chatId: string) => {
    return invokeheaderpost({
      method: "DELETE",
      baseURL: BackendBaseUrl,
      route: `api/chats/${chatId}/`,
    });
  };
  
  export const UpdateTitle = (chatId:string,data:object) => {
    return invokepost({
      method: "PUT",
      baseURL: BackendBaseUrl,
      data: data,
      route: `api/chats/title/${chatId}/`,
      
    });
  };

  export const GetSpecificChat = (chatId: string) => {
    return invokeheaderpost({
      method: "GET",
      baseURL: BackendBaseUrl,
      route: `api/chats/${chatId}`,
    });
  };