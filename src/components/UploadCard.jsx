import { useState, useContext } from "react";
import axios from "axios";
import { SourceContext } from "../context/SourceContext";

function UploadCard() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const { setSources } =
    useContext(SourceContext);

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData
      );

      setStatus(res.data.message);

      setSources(prev => [
        ...prev,
        file.name
      ]);

    } catch (err) {

  console.error("UPLOAD ERROR:", err);

  if (err.response) {
    console.log("DATA:", err.response.data);
    console.log("STATUS:", err.response.status);
  }

  setStatus(
    err.message || "Upload Failed"
  );

}
  };

  return (
    <div className="upload-card">

      <div className="upload-icon">
        ☁️
      </div>

      <h2>Upload New Source</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      <br />

      <button
        className="ask-btn"
        onClick={uploadFile}
      >
        Upload PDF
      </button>

      <p>{status}</p>

    </div>
  );
}

export default UploadCard;