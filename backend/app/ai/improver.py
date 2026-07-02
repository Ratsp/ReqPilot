import json
import re

from groq import Groq

from app.config import settings
from app.ai.prompts import IMPROVEMENT_PROMPT


client = Groq(api_key=settings.groq_api_key)


def improve_requirement(text: str):

    prompt = IMPROVEMENT_PROMPT.replace("{input}", text)

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
        content = re.sub(r"^```json\s*", "", content)
        content = re.sub(r"^```\s*", "", content)
        content = re.sub(r"\s*```$", "", content)

        start = content.find("{")
        end = content.rfind("}")

        if start != -1 and end != -1:
            content = content[start:end + 1]

        return json.loads(content)

    except Exception as e:
        print(e)

        return {
            "improved_requirements": []
        }