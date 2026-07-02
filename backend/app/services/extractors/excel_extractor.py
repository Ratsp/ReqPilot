from io import BytesIO
import openpyxl


def extract_excel(file_bytes: bytes) -> str:

    workbook = openpyxl.load_workbook(BytesIO(file_bytes))

    text = ""

    for sheet in workbook.worksheets:

        text += f"\nSheet: {sheet.title}\n"

        for row in sheet.iter_rows(values_only=True):

            values = [str(v) for v in row if v is not None]

            text += " | ".join(values)

            text += "\n"

    return text