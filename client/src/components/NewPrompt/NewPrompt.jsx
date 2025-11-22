import { useEffect, useRef } from "react";
import "./NewPrompt.css";
import Upload from "../Upload/Upload.jsx";
import { useState } from "react";
import model from "../../lib/gemini.js";
import Markdown from "react-markdown";

const NewPrompt = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [question, answer, img.dbData]);

  const add = async (text) => {
    // const listModels = async () => {
    //   const KEY = import.meta.env.VITE_GEMINI_PUBLIC_KEY; // senin public key
    //   const res = await fetch(
    //     `https://generativelanguage.googleapis.com/v1beta/models?key=${KEY}`
    //   );
    //   const data = await res.json();
    //   console.log("ListModels result:", data);
    // };
    // await listModels();

    setQuestion(text);

    const result = await model.generateContent(
      Object.entries(img.aiData).length ? [img.aiData, text] : [text]
    );
    const response = await result.response;
    setAnswer(response.text());
    setImg({
      isLoading: false,
      error: "",
      dbData: {},
      aiData: {},
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    add(text);
  };

  return (
    <>
      {/* ADD NEW CHAT */}
      {img.isLoading && <div>Loading...</div>}
      {img.dbData?.filePath && (
        <img
          src={
            img.dbData.filePath.startsWith("http")
              ? img.dbData.filePath
              : `${import.meta.env.VITE_IMAGE_KIT_ENDPOINT}/${
                  img.dbData.filePath
                }`
          }
          alt="uploaded"
          width="380"
        />
      )}

      {question && <div className="message user">{question}</div>}
      {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}

      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="Ask anything..." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
