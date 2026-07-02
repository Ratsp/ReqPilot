import json

from groq import Groq

from app.config import settings


client = Groq(api_key=settings.groq_api_key)


USER_STORY_PROMPT = """
You are an Agile Business Analyst.

Generate Agile User Stories from the requirement.

Rules:

- Generate between 3 and 6 user stories.
- Follow the format:
  "As a <role>, I want <goal> so that <benefit>."
- Do not invent unrelated functionality.
- Return ONLY valid JSON.
- Do not use markdown.

Format:

{
    "user_stories":[
        "...",
        "...",
        "..."
    ]
}

Requirement:

{input}
"""


def generate_user_story(text: str):

    prompt = USER_STORY_PROMPT.replace("{input}", text)

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

    content = response.choices[0].message.content.strip()

    print("\n===== RAW AI RESPONSE =====")
    print(content)
    print("===========================\n")

    content = content.replace("```json", "")
    content = content.replace("```", "")
    content = content.strip()

    try:
        return json.loads(content)

    except Exception:
        return {
            "user_stories": []
        }