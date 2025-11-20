import { useEffect, useRef } from "react";
import "./NewPrompt.css";
import Upload from "../Upload/Upload.jsx";
import { useState } from "react";

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
