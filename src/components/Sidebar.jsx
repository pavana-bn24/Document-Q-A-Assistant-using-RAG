import { useContext } from "react";
import { SourceContext } from "../context/SourceContext";

function Sidebar() {

  const { sources } =
    useContext(SourceContext);

  return (
    <div className="sidebar">

      <h2 className="logo">
        RAG Assistant
      </h2>

      <h3>📂 Sources</h3>

      {sources.length === 0 ? (
        <div className="menu-item">
          No PDFs Uploaded
        </div>
      ) : (
        sources.map((source, index) => (
          <div
            key={index}
            className="menu-item"
          >
            <div className="file-name">
              📄 {source}
            </div>
          </div>
        ))
      )}

      <h3
        style={{
          marginTop: "30px"
        }}
      >
        ⚙ Settings
      </h3>

      <div className="menu-item">
        Ollama: qwen2.5:3b
      </div>

    </div>
  );
}

export default Sidebar;