import json

from groq import Groq

from app.config import settings


client = Groq(api_key=settings.groq_api_key)


PROMPT = """
You are an expert Software Business Analyst.

Generate acceptance criteria in Given-When-Then format.

Rules:

- Return 3-6 acceptance criteria.
- Use BDD format.
- Do not invent unrelated functionality.
- Return ONLY valid JSON.

Format:

{
    "acceptance_criteria":[
        "...",
        "...",
        "..."
    ]
}

Requirement:

{input}
"""


def generate_acceptance_criteria(text: str):

    prompt = PROMPT.replace("{input}", text)

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

    content = content.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(content)
    except Exception:
        return {
            "acceptance_criteria": []
        }