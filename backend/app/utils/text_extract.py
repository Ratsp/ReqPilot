import io
import os

import fitz  # PyMuPDF
import pandas as pd
import pytesseract
from docx import Document
from PIL import Image

# Windows only
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""

    pdf = fitz.open(stream=file_bytes, filetype="pdf")

    for page in pdf:
        text += page.get_text()

    return text.strip()


def extract_text_from_docx(file_bytes: bytes) -> str:
    document = Document(io.BytesIO(file_bytes))

    paragraphs = []

    for p in document.paragraphs:
        paragraphs.append(p.text)

    return "\n".join(paragraphs)


def extract_text_from_txt(file_bytes: bytes) -> str:
    return file_bytes.decode("utf-8", errors="ignore")


def extract_text_from_csv(file_bytes: bytes) -> str:
    df = pd.read_csv(io.BytesIO(file_bytes))

    return df.to_string(index=False)


def extract_text_from_excel(file_bytes: bytes) -> str:
    excel = pd.ExcelFile(io.BytesIO(file_bytes))

    output = []

    for sheet in excel.sheet_names:
        df = excel.parse(sheet)

        output.append(f"Sheet: {sheet}")

        output.append(df.to_string(index=False))

    return "\n".join(output)


def extract_text_from_image(file_bytes: bytes) -> str:
    image = Image.open(io.BytesIO(file_bytes))

    return pytesseract.image_to_string(image)


def extract_text(filename: str, file_bytes: bytes) -> str:
    extension = os.path.splitext(filename)[1].lower()

    if extension == ".pdf":
        return extract_text_from_pdf(file_bytes)

    elif extension == ".docx":
        return extract_text_from_docx(file_bytes)

    elif extension == ".txt":
        return extract_text_from_txt(file_bytes)

    elif extension == ".csv":
        return extract_text_from_csv(file_bytes)

    elif extension in [".xlsx", ".xls"]:
        return extract_text_from_excel(file_bytes)

    elif extension in [".png", ".jpg", ".jpeg"]:
        return extract_text_from_image(file_bytes)

    else:
        raise ValueError(f"Unsupported file type: {extension}")