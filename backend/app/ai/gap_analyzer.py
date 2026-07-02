import json

from groq import Groq

from app.config import settings
from app.ai.prompts import GAP_ANALYSIS_PROMPT


client = Groq(api_key=settings.groq_api_key)


def analyze_requirement_gaps(text: str):

    prompt = GAP_ANALYSIS_PROMPT.replace("{input}", text)
    print("\n=========== PROMPT ===========")
    print(prompt)
    print("==============================\n")

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert software business analyst. "
                    "Always return ONLY valid JSON. "
                    "Do not include explanations, markdown, or extra text."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        response_format={"type": "json_object"},
        temperature=0,
    )

    content = response.choices[0].message.content.strip()
    print("\n===== RAW AI RESPONSE =====")
    print(content)
    print("===========================\n")

    try:
        if "```json" in content:
            content = (
                content
                .replace("```json", "")
                .replace("```", "")
                .strip()
            )

        return json.loads(content)

    except Exception as e:

        print("JSON Error:", e)
        print(content)
        
        return {
            "missing_information": [],
            "ambiguous_requirements": [],
            "clarification_questions": [],
        }