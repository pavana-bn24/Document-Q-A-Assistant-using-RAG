import Sidebar from "./components/Sidebar.jsx";
import UploadCard from "./components/UploadCard";
import ChatSection from "./components/ChatSection";

function App() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="top-bar">
          <input
            placeholder="Search sources..."
            className="search-bar"
          />
        </div>

        <h1 className="page-title">
          Source Management
        </h1>

        <p className="page-subtitle">
          Manage and index your knowledge base for AI analysis.
        </p>

        <UploadCard />

        <ChatSection />
      </main>
    </div>
  );
}

export default App;