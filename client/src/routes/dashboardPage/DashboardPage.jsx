import "./DashboardPage.css";
import apiClient from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const DashboardPage = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (text) => apiClient.post("/api/chats", { text }),
    onSuccess: (id) => {
      // Chat listesini yenile
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      // Yeni chat sayfasına yönlendir
      navigate(`/dashboard/chats/${id}`);
    },
    onError: (error) => {
      console.error("Chat oluşturma hatası:", error);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    mutation.mutate(text);

    // Formu temizle
    e.target.reset();
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

      <div className="UX">
        {mutation.isPending && <div className="loading">Creating chat...</div>}
        {mutation.isError && (
          <div className="error">Failed to create chat. Try again.</div>
        )}
      </div>

      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="text"
            placeholder="Ask me anything..."
            disabled={mutation.isPending}
          />
          <button disabled={mutation.isPending}>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
