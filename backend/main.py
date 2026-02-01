from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from agent.graph import app_graph
from agent.state import AppState

app = FastAPI(title="JobSage AI Backend")

class QueryRequest(BaseModel):
    query: str

@app.get("/")
def read_root():
    return {"status": "ok", "message": "JobSage AI Backend is running"}

@app.post("/chat")
async def chat_endpoint(request: QueryRequest):
    """
    Process a user query through the LangGraph agent.
    """
    initial_state = AppState(
        query=request.query,
        job_urls=[],
        raw_jobs=[],
        structured_jobs=[],
        final_answer="",
        is_job_query=False
    )
    
    try:
        result = app_graph.invoke(initial_state)
        return {
            "response": result.get("final_answer"),
            "structured_jobs": result.get("structured_jobs", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
