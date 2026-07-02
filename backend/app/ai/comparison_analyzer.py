import json

from groq import Groq

from app.config import settings

client = Groq(api_key=settings.groq_api_key)

COMPARE_PROMPT = """
Compare the following two software requirements.

Requirement A:

{old}

Requirement B:

{new}

Return ONLY valid JSON.

{
    "added": [],
    "removed": [],
    "changed": [],
    "impact": []
}
"""


def compare_requirements(
    old_text: str,
    new_text: str,
):
    prompt = (
        COMPARE_PROMPT
        .replace("{old}", old_text)
        .replace("{new}", new_text)
    )

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature=0.2,
    )

    content = (
        response
        .choices[0]
        .message
        .content
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    return json.loads(content)