from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
import chromadb
import requests
import os
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ChromaDB
client = chromadb.PersistentClient(path="chroma_db")

collection = client.get_or_create_collection(
    name="documents"
)

# Embedding Model
model = SentenceTransformer("all-MiniLM-L6-v2")


def chunk_text(text, chunk_size=500):
    chunks = []

    for i in range(0, len(text), chunk_size):
        chunks.append(text[i:i + chunk_size])

    return chunks


def generate_answer(context, question):

    prompt = f"""
Use the following context to answer the question.

Context:
{context}

Question:
{question}

Answer:
"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "qwen2.5:3b",
            "prompt": prompt,
            "stream": False
        }
    )

    return response.json()["response"]


@app.get("/")
def home():
    return {
        "message": "RAG Backend Running"
    }


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    try:

        file_path = os.path.join(
            UPLOAD_FOLDER,
            file.filename
        )

        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        reader = PdfReader(file_path)

        text = ""

        for page in reader.pages:
            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

        chunks = chunk_text(text)

        chunks = [
            chunk.strip()
            for chunk in chunks
            if chunk and chunk.strip()
        ]

        if len(chunks) == 0:
            return {
                "error": "No readable text found in PDF"
            }

        print("TOTAL CHUNKS:", len(chunks))

        embeddings = model.encode(chunks).tolist()

        for i, chunk in enumerate(chunks):

            collection.add(
                ids=[str(uuid.uuid4())],
                documents=[chunk],
                embeddings=[embeddings[i]]
            )

        return {
            "filename": file.filename,
            "characters": len(text),
            "total_chunks": len(chunks),
            "message": "Stored in ChromaDB"
        }

    except Exception as e:

        print("UPLOAD ERROR:")
        print(e)

        return {
            "error": str(e)
        }


@app.get("/ask")
def ask_question(question: str):

    query_embedding = model.encode([question]).tolist()[0]

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=1
    )

    context = results["documents"][0][0]

    answer = generate_answer(
        context,
        question
    )

    return {
        "question": question,
        "answer": answer
    }