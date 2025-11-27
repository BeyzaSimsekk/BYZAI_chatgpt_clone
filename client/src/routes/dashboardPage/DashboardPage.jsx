import "./DashboardPage.css";
import { useAuth } from "@clerk/clerk-react";
import apiClient from "../../lib/api";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    try {
      // Post request to create a new chat with apiClient
      const response = await apiClient.post("/api/chats", { text });
      console.log("Chat oluşturuldu:", response);

      // Formu temizle
      e.target.reset();

      navigate(`/dashboard/chats/${response}`);
    } catch (error) {
      console.error("Chat oluşturma hatası:", error);
    }
  };

  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="" />
          <h1>BYZAI</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="" />
            <span>Create a new Chat</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="" />
            <span>Analyze Images</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="" />
            <span>Help me with my Code</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder="Ask me anything..." />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
