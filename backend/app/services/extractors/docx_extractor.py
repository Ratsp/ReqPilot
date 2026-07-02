from io import BytesIO
from docx import Document


def extract_docx(file_bytes: bytes) -> str:
    doc = Document(BytesIO(file_bytes))

    text = []

    for para in doc.paragraphs:
        text.append(para.text)

    return "\n".join(text)