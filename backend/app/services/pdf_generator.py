from io import BytesIO
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph


def generate_requirement_pdf(requirement: dict) -> BytesIO:
    buffer = BytesIO()

    doc = SimpleDocTemplate(buffer)

    styles = getSampleStyleSheet()

    story = []

    story.append(Paragraph("<b>Requirement Details</b>", styles["Heading1"]))

    story.append(Paragraph(f"<b>Title:</b> {requirement['title']}", styles["BodyText"]))

    story.append(
        Paragraph(
            f"<b>Description:</b> {requirement['description'] or ''}",
            styles["BodyText"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Status:</b> {requirement['status']}",
            styles["BodyText"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Version:</b> {requirement['version_number']}",
            styles["BodyText"],
        )
    )

    doc.build(story)

    buffer.seek(0)

    return buffer