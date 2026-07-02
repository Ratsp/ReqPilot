import json
import re

from groq import Groq
from app.config import settings

client = Groq(api_key=settings.groq_api_key)


QUALITY_PROMPT = """
You are an expert Software Business Analyst.

Evaluate the following software requirement.

Return ONLY valid JSON.

{
    "overall_score": 0,
    "clarity": 0,
    "completeness": 0,
    "consistency": 0,
    "testability": 0,
    "security": 0,
    "feedback":[
        "...",
        "...",
        "..."
    ]
}

Scores must be between 0 and 100.

Requirement:

{input}
"""

def analyze_requirement_quality(text: str):

    prompt = QUALITY_PROMPT.replace("{input}", text)

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

    try:
        # Remove markdown code fences if present
        content = re.sub(r"^```json\s*", "", content)
        content = re.sub(r"^```\s*", "", content)
        content = re.sub(r"\s*```$", "", content)

        # Extract the JSON object
        start = content.find("{")
        end = content.rfind("}")

        if start != -1 and end != -1:
            content = content[start:end + 1]

        return json.loads(content)

    except Exception as e:
        print("\nJSON Parse Error:")
        print(e)

        return {
            "overall_score": 0,
            "clarity": 0,
            "completeness": 0,
            "consistency": 0,
            "testability": 0,
            "security": 0,
            "feedback": [],
        }