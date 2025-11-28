import "./ChatPage.css";
import NewPrompt from "../../components/NewPrompt/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../lib/api";
import { useLoaderData, useLocation } from "react-router-dom";
import Markdown from "react-markdown";

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => apiClient.get(`/api/chats/${chatId}`),
  });

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {isPending ? (
            <div className="loading">
              <img src="/loading.gif" alt="loading gif" />
            </div>
          ) : error ? (
            "Something went wrong!"
          ) : (
            data?.history?.map((message, index) => (
              <>
                {message.img && (
                  <img
                    src={
                      img.dbData.filePath.startsWith("http")
                        ? img.dbData.filePath
                        : `${import.meta.env.VITE_IMAGE_KIT_ENDPOINT}/${
                            img.dbData.filePath
                          }`
                    }
                    alt="uploaded"
                    height="300"
                    width="400"
                    transformation={[{ height: 300, width: 400 }]}
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                  />
                )}
                <div
                  className={
                    message.role === "user" ? "message user" : "message"
                  }
                  key={index}
                >
                  <Markdown>{message.parts[0].text}</Markdown>
                </div>
              </>
            ))
          )}

          <NewPrompt />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
