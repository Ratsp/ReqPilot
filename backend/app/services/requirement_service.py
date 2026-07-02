
import json
import psycopg

from app.database.queries import create_ai_requirement


def save_uploaded_requirement(
    *,
    connection: psycopg.Connection,
    user_id: str,
    extracted_text: str,
    ai_result: dict,
    source_type: str = "text",
):
    requirement = create_ai_requirement(
        connection=connection,
        user_id=user_id,
        title=ai_result.get("summary", "AI Generated Requirement")[:100],
        description=extracted_text,
        source_type=source_type,
        original_input=extracted_text,
        extracted_requirements=json.dumps(ai_result),
        ai_summary=ai_result.get("summary"),
        extraction_status="completed",
    )

    return requirement

