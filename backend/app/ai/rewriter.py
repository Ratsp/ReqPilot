import json

from groq import Groq

from app.config import settings


client = Groq(api_key=settings.groq_api_key)


REWRITE_PROMPT = """
You are an expert Software Business Analyst.

Rewrite the following requirement using professional IEEE-style language.

Rules:

- Preserve the original meaning.
- Do NOT add new features.
- Do NOT remove important information.
- Rewrite only.
- Use concise and professional wording.
- Begin with "The system shall..." whenever appropriate.

Return ONLY valid JSON.

Format:

{
    "rewritten_requirement":"..."
}

Requirement:

{input}
"""


def rewrite_requirement(text: str):

    prompt = REWRITE_PROMPT.replace("{input}", text)

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

    except Exception as e:
        print(e)

        return {
            "rewritten_requirement": ""
        }