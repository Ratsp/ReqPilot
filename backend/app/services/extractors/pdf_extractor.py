import fitz


def extract_pdf(file_bytes: bytes) -> str:
    text = ""

    pdf = fitz.open(stream=file_bytes, filetype="pdf")

    for page in pdf:
        text += page.get_text()

    return text