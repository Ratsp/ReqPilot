from app.services.extractors.pdf_extractor import extract_pdf
from app.services.extractors.docx_extractor import extract_docx
from app.services.extractors.excel_extractor import extract_excel
from app.services.extractors.image_extractor import extract_image
from app.services.extractors.text_extractor import extract_text_file


def process_file(filename: str, file_bytes: bytes):

    extension = filename.lower().split(".")[-1]

    if extension == "pdf":
        return extract_pdf(file_bytes)

    elif extension == "docx":
        return extract_docx(file_bytes)

    elif extension in ["xlsx", "xls"]:
        return extract_excel(file_bytes)

    elif extension in ["png", "jpg", "jpeg"]:
        return extract_image(file_bytes)

    elif extension in ["txt", "md"]:
        return extract_text_file(file_bytes)

    else:
        raise ValueError(f"Unsupported file format: {extension}")