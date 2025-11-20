import { useRef, useState } from "react";
import { ImageKitProvider, upload } from "@imagekit/react";

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

const getAuthParams = async () => {
  const response = await fetch("http://localhost:3000/api/upload");

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Request failed with status ${response.status}: ${errorText}`
    );
  }

  const data = await response.json();
  const { signature, expire, token } = data;

  return { signature, expire, token };
};
const Upload = ({ setImg }) => {
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const handleUploadStart = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImg((prev) => ({
        ...prev,
        isLoading: true,
        aiData: {
          inlineData: {
            data: reader.result.split(",")[1],
            mimeType: file.type,
          },
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // eski onUploadStart
    handleUploadStart(file);

    try {
      const { signature, expire, token } = await getAuthParams();

      const result = await upload({
        file,
        fileName: file.name,
        publicKey,
        signature,
        expire,
        token,
        useUniqueFileName: true,
        onProgress: (evt) => {
          const p = Math.round((evt.loaded / evt.total) * 100);
          console.log("Upload progress:", p, "%"); // console log
        },
      });

      // eski onSuccess
      setImg((prev) => ({
        ...prev,
        isLoading: false,
        dbData: result,
      }));

      console.log("Success", result);

      // Upload tamamlandıktan sonra barı gizlemek için resetle
      setTimeout(() => setProgress(0), 500);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <ImageKitProvider urlEndpoint={urlEndpoint} publicKey={publicKey}>
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleSelect}
      />

      {/* Tıklayınca dosya seçtiriyor → Eski <label onClick={ikUploadRef.current.click}> */}
      <label onClick={() => inputRef.current.click()}>
        <img src="/attachment.png" alt="" style={{ cursor: "pointer" }} />
      </label>
    </ImageKitProvider>
  );
};

export default Upload;
