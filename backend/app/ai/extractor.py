import json

from groq import Groq

from app.ai.prompts import SYSTEM_PROMPT, build_prompt
from app.config import settings


client = Groq(api_key=settings.groq_api_key)


def extract_requirements(text: str) -> dict:
    """
    Sends project description to Groq
    and returns structured requirements.
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        temperature=0.2,
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": build_prompt(text),
            },
        ],
    )

    content = response.choices[0].message.content.strip()

    try:
        return json.loads(content)

    except json.JSONDecodeError:
        return {
            "summary": "Unable to parse AI response.",
            "functional_requirements": [],
            "non_functional_requirements": [],
        }