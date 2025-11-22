import { useEffect, useRef } from "react";
import "./NewPrompt.css";
import Upload from "../Upload/Upload.jsx";
import { useState } from "react";
import model from "../../lib/gemini.js";

const NewPrompt = () => {
  const endRef = useRef(null);
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  const add = async () => {
    const prompt = "Write a story about an AI and magic ";

    // const listModels = async () => {
    //   const KEY = import.meta.env.VITE_GEMINI_PUBLIC_KEY; // senin public key
    //   const res = await fetch(
    //     `https://generativelanguage.googleapis.com/v1beta/models?key=${KEY}`
    //   );
    //   const data = await res.json();
    //   console.log("ListModels result:", data);
    // };
    // await listModels();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
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

      <button onClick={add}>TEST AI</button>
      <div className="endChat" ref={endRef}></div>
      <form className="newForm">
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" placeholder="Ask anything..." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
