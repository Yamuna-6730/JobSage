from langgraph.graph import StateGraph, END
from agent.state import AppState
from agent.nodes import (
    router_node,
    search_jobs_node,
    scrape_jobs_node,
    structure_jobs_node,
    recommendation_node,
    normal_chat_node
)

def build_graph():
    workflow = StateGraph(AppState)

    # Add nodes
    workflow.add_node("router", router_node)
    workflow.add_node("search", search_jobs_node)
    workflow.add_node("scrape", scrape_jobs_node)
    workflow.add_node("structure", structure_jobs_node)
    workflow.add_node("recommend", recommendation_node)
    workflow.add_node("chat", normal_chat_node)

    # Define edges
    workflow.set_entry_point("router")

    def route_decision(state: AppState):
        if state.get("is_job_query"):
            return "search"
        return "chat"

    workflow.add_conditional_edges(
        "router",
        route_decision,
        {
            "search": "search",
            "chat": "chat"
        }
    )

    workflow.add_edge("search", "scrape")
    workflow.add_edge("scrape", "structure")
    workflow.add_edge("structure", "recommend")
    workflow.add_edge("recommend", END)
    workflow.add_edge("chat", END)

    return workflow.compile()

app_graph = build_graph()
