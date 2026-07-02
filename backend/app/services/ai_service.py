import json
import re

from groq import Groq

from app.config import settings


client = Groq(api_key=settings.groq_api_key)


def clean_json_response(content: str | None) -> dict:
    """
    Safely converts Groq's response into a Python dictionary.
    Removes markdown code fences and extracts the JSON object.
    """
    content = (content or "").strip()

    print("\n===== RAW AI RESPONSE =====")
    print(repr(content))
    print("===========================\n")

    content = re.sub(r"^```json\s*", "", content, flags=re.IGNORECASE)
    content = re.sub(r"^```\s*", "", content)
    content = re.sub(r"\s*```$", "", content)
    content = content.strip()

    start = content.find("{")
    end = content.rfind("}")

    if not content or start == -1 or end == -1:
        raise ValueError("AI did not return a valid JSON object.")

    return json.loads(content[start:end + 1])


def analyze_quality(title: str, description: str | None) -> dict:
    prompt = f"""
You are an expert Software Business Analyst.

Analyze the following software requirement.

Title:
{title}

Description:
{description or ""}

Evaluate the requirement on these criteria from 0 to 10:
1. Clarity
2. Completeness
3. Consistency
4. Ambiguity
5. Testability

Return ONLY valid JSON in exactly this format:
{{
    "clarity": 8,
    "completeness": 7,
    "consistency": 9,
    "ambiguity": 3,
    "testability": 8,
    "overall_score": 78,
    "strengths": ["..."],
    "weaknesses": ["..."],
    "recommendations": ["..."]
}}

Rules:
- overall_score must be an integer from 0 to 100.
- Do not return markdown or code fences.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a senior Software Requirements Quality Analyst. Return only valid JSON.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.2,
        )

        result = clean_json_response(response.choices[0].message.content)

        return {
            "clarity": result.get("clarity", 0),
            "completeness": result.get("completeness", 0),
            "consistency": result.get("consistency", 0),
            "ambiguity": result.get("ambiguity", 0),
            "testability": result.get("testability", 0),
            "overall_score": result.get("overall_score", 0),
            "strengths": result.get("strengths", []),
            "weaknesses": result.get("weaknesses", []),
            "recommendations": result.get("recommendations", []),
        }

    except Exception as error:
        print("QUALITY AI ERROR:", error)

        return {
            "clarity": 0,
            "completeness": 0,
            "consistency": 0,
            "ambiguity": 0,
            "testability": 0,
            "overall_score": 0,
            "strengths": [],
            "weaknesses": [],
            "recommendations": [
                "Quality analysis could not be generated right now."
            ],
            "error": str(error),
        }


def ask_requirement_ai(
    title: str,
    description: str | None,
    question: str,
) -> str:
    prompt = f"""
You are an expert Business Analyst.

Requirement Title:
{title}

Requirement Description:
{description or ""}

Answer only based on this requirement.

User Question:
{question}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a Senior Software Requirements Engineer.",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0,
    )

    return (response.choices[0].message.content or "").strip()


def compare_requirements(
    title1: str,
    description1: str | None,
    title2: str,
    description2: str | None,
) -> dict:
    prompt = f"""
You are an expert Business Analyst.

Compare these two software requirements.

Requirement 1
Title: {title1}
Description: {description1 or ""}

Requirement 2
Title: {title2}
Description: {description2 or ""}

Return ONLY valid JSON in exactly this format:
{{
    "similarity_score": 0,
    "similarities": [],
    "differences": [],
    "recommendation": ""
}}

Rules:
- similarity_score must be an integer from 0 to 100.
- similarities and differences must be arrays of strings.
- recommendation must be a string.
- Do not return markdown or code fences.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a Senior Business Analyst. Return only valid JSON.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0,
        )

        result = clean_json_response(response.choices[0].message.content)

        return {
            "similarity_score": int(result.get("similarity_score", 0)),
            "similarities": result.get("similarities", []),
            "differences": result.get("differences", []),
            "recommendation": result.get(
                "recommendation",
                "Please review both requirements manually.",
            ),
        }

    except Exception as error:
        print("COMPARE AI ERROR:", error)

        return {
            "similarity_score": 0,
            "similarities": [],
            "differences": [],
            "recommendation": (
                "AI comparison could not be generated right now. "
                "Please review both requirements manually."
            ),
            "error": str(error),
        }


def analyze_requirement_risk(
    title: str,
    description: str | None,
) -> dict:
    prompt = f"""
You are a Senior Software Architect.

Analyze the implementation risks of this software requirement.

Title:
{title}

Description:
{description or ""}

Return ONLY valid JSON in exactly this format:
{{
    "risk_level": "Low",
    "technical_risks": [],
    "business_risks": [],
    "dependencies": [],
    "mitigation": []
}}

Rules:
- risk_level must be Low, Medium, or High.
- All other fields must be arrays of strings.
- Do not return markdown or code fences.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a Senior Software Architect. Return only valid JSON.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0,
        )

        result = clean_json_response(response.choices[0].message.content)

        return {
            "risk_level": result.get("risk_level", "Low"),
            "technical_risks": result.get("technical_risks", []),
            "business_risks": result.get("business_risks", []),
            "dependencies": result.get("dependencies", []),
            "mitigation": result.get("mitigation", []),
        }

    except Exception as error:
        print("RISK AI ERROR:", error)

        return {
            "risk_level": "Unknown",
            "technical_risks": [],
            "business_risks": [],
            "dependencies": [],
            "mitigation": [
                "Risk analysis could not be generated right now."
            ],
            "error": str(error),
        }


def generate_acceptance_criteria(text: str) -> dict:
    prompt = f"""
You are a Senior Business Analyst.

Generate clear, testable acceptance criteria for this software requirement:

{text}

Return ONLY one valid JSON object in exactly this structure:
{{
    "acceptance_criteria": [
        "Given ... When ... Then ...",
        "Given ... When ... Then ..."
    ]
}}

Rules:
- Generate 4 to 7 acceptance criteria.
- Every criterion must be specific and testable.
- Use Given / When / Then format.
- Do not return markdown.
- Do not use code fences.
- Do not include any text before or after the JSON.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a Senior Business Analyst. "
                        "Return only valid JSON."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0,
        )

        content = (response.choices[0].message.content or "").strip()

        print("\n===== RAW ACCEPTANCE CRITERIA RESPONSE =====")
        print(repr(content))
        print("============================================\n")

        content = re.sub(r"^```json\s*", "", content, flags=re.IGNORECASE)
        content = re.sub(r"^```\s*", "", content)
        content = re.sub(r"\s*```$", "", content).strip()

        start = content.find("{")
        end = content.rfind("}")

        if not content or start == -1 or end == -1:
            raise ValueError("AI did not return a valid JSON object.")

        result = json.loads(content[start:end + 1])

        criteria = result.get("acceptance_criteria", [])

        if not isinstance(criteria, list):
            raise ValueError("acceptance_criteria is not a list.")

        return {
            "acceptance_criteria": criteria,
        }

    except Exception as error:
        print("\n===== ACCEPTANCE CRITERIA ERROR =====")
        print(error)
        print("=====================================\n")

        return {
            "acceptance_criteria": [],
            "error": str(error),
        }
