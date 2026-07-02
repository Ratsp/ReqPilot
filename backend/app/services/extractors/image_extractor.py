from io import BytesIO

from PIL import Image
import pytesseract

# Tell pytesseract where Tesseract is installed
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


def extract_image(file_bytes: bytes) -> str:
    image = Image.open(BytesIO(file_bytes))

    text = pytesseract.image_to_string(image)

    return text