import psycopg
import json

from fastapi import APIRouter, Depends, HTTPException, status, Query

from fastapi import UploadFile, File
from typing import List

# from app.utils.text_extract import extract_text
from app.ai.extractor import extract_requirements
from app.services.file_processor import process_file



from app.database.queries import update_requirement_ai_result
from app.services.requirement_service import save_uploaded_requirement
from app.database.connection import get_connection

from app.database.queries import (
    create_requirement,
    delete_requirement,
    get_requirement,
    list_requirements,
    update_requirement,
    search_requirements,
)
from app.middleware.auth import get_current_user

from app.schemas.requirement import (
    RequirementCreate,
    RequirementUpdate,
    RequirementResponse,
    RequirementList,
    UploadResponse,
)
from app.schemas.requirement import WebpageRequest
from app.services.extractors.webpage_extractor import extract_webpage

from app.ai.gap_analyzer import analyze_requirement_gaps
from app.database.queries import update_gap_analysis

from app.ai.improver import improve_requirement
from app.database.queries import update_improved_requirements
from app.ai.rewriter import rewrite_requirement
from app.database.queries import update_rewritten_requirement

from app.ai.acceptance_generator import generate_acceptance_criteria
from app.database.queries import update_acceptance_criteria

from app.ai.user_story_generator import generate_user_story
from app.database.queries import update_user_stories


from app.database.queries import create_requirement_version

from app.database.queries import get_requirement_versions
from app.schemas.requirement import (
    RequirementVersionResponse,
    RequirementVersionList,
)

from app.services.ai_service import analyze_quality
from app.database.queries import save_quality_analysis

from app.database.queries import filter_requirements_by_status

from app.database.queries import sort_requirements

from app.database.queries import paginate_requirements

from fastapi.responses import StreamingResponse
from app.services.pdf_generator import generate_requirement_pdf


from app.schemas.requirement import (
    RequirementChatRequest,
    RequirementChatResponse,
)

from app.services.ai_service import (
    analyze_quality,
    ask_requirement_ai,
)

from app.services.ai_service import compare_requirements

from app.schemas.requirement import (
    CompareRequirementsRequest,
    CompareRequirementsResponse,
)

from app.services.ai_service import analyze_requirement_risk
from app.schemas.requirement import RiskAnalysisResponse

from app.database.queries import get_requirement_traceability
from app.schemas.requirement import TraceabilityResponse

from app.services.ai_service import generate_acceptance_criteria

router = APIRouter(prefix="/requirements", tags=["requirements"])


@router.post(
    "",
    response_model=RequirementResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    payload: RequirementCreate,
    current_user: dict = Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
) -> RequirementResponse:
    requirement = create_requirement(
        connection,
        str(current_user["id"]),
        payload.title,
        payload.description,
    )

    connection.commit()

    return RequirementResponse(**requirement)


@router.get("", response_model=RequirementList)
def list_all(
    current_user: dict = Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
) -> RequirementList:
    requirements = list_requirements(
        connection,
        str(current_user["id"]),
    )

    return RequirementList(requirements=requirements)


@router.get(
    "/search",
    response_model=RequirementList,
)
def search_requirement(
    keyword: str = Query(...),
    current_user: dict = Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
):
    requirements = search_requirements(
        connection=connection,
        user_id=str(current_user["id"]),
        keyword=keyword,
    )

    return {
        "requirements": requirements,
    }


@router.get(
    "/filter/status",
    response_model=RequirementList,
)
def filter_status(
    status: str,
    current_user: dict = Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
):
    requirements = filter_requirements_by_status(
        connection=connection,
        user_id=str(current_user["id"]),
        status=status,
    )

    return {
        "requirements": requirements,
    }



@router.get(
    "/sort",
    response_model=RequirementList,
)
def sort_requirement(
    sort_by: str = "created_at",
    current_user: dict = Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
):
    requirements = sort_requirements(
        connection=connection,
        user_id=str(current_user["id"]),
        sort_by=sort_by,
    )

    return {
        "requirements": requirements,
    }



@router.get(
    "/paginate",
    response_model=RequirementList,
)
def paginate_requirement(
    page: int = 1,
    limit: int = 10,
    current_user: dict = Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
):
    requirements = paginate_requirements(
        connection=connection,
        user_id=str(current_user["id"]),
        page=page,
        limit=limit,
    )

    return {
        "requirements": requirements,
    }




@router.get("/{requirement_id}/export/pdf")
def export_requirement_pdf(
    requirement_id: str,
    current_user: dict = Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
):
    requirement = get_requirement(
        connection,
        requirement_id,
        str(current_user["id"]),
    )

    if requirement is None:
        raise HTTPException(
            status_code=404,
            detail="Requirement not found",
        )

    pdf = generate_requirement_pdf(requirement)

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="requirement_{requirement_id}.pdf"'
        },
    )



@router.post(
    "/{requirement_id}/chat",
    response_model=RequirementChatResponse,
)
def chat_requirement(
    requirement_id: str,
    request: RequirementChatRequest,
    current_user: dict = Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
):
    requirement = get_requirement(
        connection,
        requirement_id,
        str(current_user["id"]),
    )

    if requirement is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requirement not found",
        )

    answer = ask_requirement_ai(
        title=requirement["title"],
        description=requirement["description"],
        question=request.question,
    )

    return RequirementChatResponse(
        answer=answer,
    )

#-------------------------------------------------------------------------------------------------------


@router.get("/{requirement_id}", response_model=RequirementResponse)
def get_one(
    requirement_id: str,
    current_user: dict = Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
) -> RequirementResponse:

    requirement = get_requirement(
        connection,
        requirement_id,
        str(current_user["id"]),
    )

    if requirement is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requirement not found",
        )

    return RequirementResponse(**requirement)


@router.put("/{requirement_id}", response_model=RequirementResponse)
def update(
    requirement_id: str,
    payload: RequirementUpdate,
    current_user: dict = Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
) -> RequirementResponse:

    old_requirement = get_requirement(
        connection,
        requirement_id,
        str(current_user["id"]),
    )

    if old_requirement is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requirement not found",
        )

    # Save old version
    create_requirement_version(
        connection=connection,
        requirement_id=old_requirement["id"],
        version_number=old_requirement["version_number"],
        title=old_requirement["title"],
        description=old_requirement["description"],
    )

    requirement = update_requirement(
        connection,
        requirement_id,
        str(current_user["id"]),
        payload.title,
        payload.description,
        payload.status,
    )
    if requirement is None:
        connection.rollback()
        raise HTTPException(
            status_code=404,
            detail="Requirement not found",
        )

    connection.commit()

    return RequirementResponse(**requirement)


@router.delete("/{requirement_id}")
def delete(
    requirement_id: str,
    current_user: dict = Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
) -> dict[str, str]:

    deleted = delete_requirement(
        connection,
        requirement_id,
        str(current_user["id"]),
    )

    if not deleted:
        connection.rollback()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requirement not found",
        )

    connection.commit()

    return {"message": "Requirement deleted successfully"}




@router.post("/{requirement_id}/analyze")
def analyze_requirement(
    requirement_id: str,
    connection: psycopg.Connection = Depends(get_connection),
    current_user: dict = Depends(get_current_user),
):
    requirement = get_requirement(
        connection,
        requirement_id,
        str(current_user["id"]),
    )

    if requirement is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requirement not found",
        )

    input_text = f"""
Title:
{requirement["title"]}

Description:
{requirement["description"] or ""}
"""

    ai_result = extract_requirements(input_text)

    updated = update_requirement_ai_result(
        connection=connection,
        requirement_id=requirement_id,
        user_id=str(current_user["id"]),
        original_input=input_text,
        ai_summary=ai_result["summary"],
        extracted_requirements=json.dumps(ai_result),
        extraction_status="completed",
    )

    connection.commit()

    return {
        "message": "Requirement analyzed successfully.",
        "requirement": updated,
    }



@router.post("/upload", response_model=UploadResponse)
def upload_requirement(
    files: List[UploadFile] = File(...),
    current_user=Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
):
    combined_text = ""
    filenames = []

    for file in files:

        file_bytes = file.file.read()

        extracted_text = process_file(
            file.filename,
            file_bytes,
        )

        filenames.append(file.filename)

        combined_text += (
            f"\n\n========== {file.filename} ==========\n"
            + extracted_text
        )

    ai_result = extract_requirements(combined_text)

    saved_requirement = save_uploaded_requirement(
        connection=connection,
        user_id=str(current_user["id"]),
        extracted_text=combined_text,
        ai_result=ai_result,
    )

    connection.commit()

    return {
        "message": "Files processed successfully.",
        "requirement_id": str(saved_requirement["id"]),
        "filenames": filenames,
        "extracted_text": combined_text,
        "ai_result": ai_result,
    }


@router.post("/webpage")
def analyze_webpage(
    payload: WebpageRequest,
    current_user=Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
):
    extracted_text = extract_webpage(payload.url)

    ai_result = extract_requirements(extracted_text)

    saved_requirement = save_uploaded_requirement(
        connection=connection,
        user_id=str(current_user["id"]),
        extracted_text=extracted_text,
        ai_result=ai_result,
    )

    connection.commit()

    return {
        "message": "Web page analyzed successfully.",
        "requirement_id": str(saved_requirement["id"]),
        "url": payload.url,
        "extracted_text": extracted_text,
        "ai_result": ai_result,
    }


@router.post("/{requirement_id}/gap-analysis")
def gap_analysis(
    requirement_id: str,
    connection: psycopg.Connection = Depends(get_connection),
    current_user: dict = Depends(get_current_user),
):
    requirement = get_requirement(
        connection,
        requirement_id,
        str(current_user["id"]),
    )

    if requirement is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requirement not found",
        )

    text = f"""
Title:
{requirement["title"]}

Description:
{requirement["description"] or ""}
"""

    result = analyze_requirement_gaps(text)
    
    updated = update_gap_analysis(
        connection=connection,
        requirement_id=requirement_id,
        user_id=str(current_user["id"]),
        missing_information=json.dumps(
            result.get("missing_information", [])
        ),
        clarification_questions=json.dumps(
            result.get("clarification_questions", [])
        ),
    )

    connection.commit()

    return {
        "message": "Gap analysis completed successfully.",
        "requirement_id": requirement_id,
        "gap_analysis": result,
    }





@router.post("/{requirement_id}/quality-analysis")
def quality_analysis(
    requirement_id: str,
    current_user: dict = Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
):
    requirement = get_requirement(
        connection,
        requirement_id,
        str(current_user["id"]),
    )

    if requirement is None:
        raise HTTPException(
            status_code=404,
            detail="Requirement not found",
        )

    analysis = analyze_quality(
        requirement["title"],
        requirement["description"],
    )
        
    save_quality_analysis(
        connection=connection,
        requirement_id=requirement_id,
        analysis=analysis,
    )
        
    connection.commit()
    return analysis







@router.post("/{requirement_id}/improve")
def improve(
    requirement_id: str,
    connection: psycopg.Connection = Depends(get_connection),
    current_user: dict = Depends(get_current_user),
):
    requirement = get_requirement(
        connection,
        requirement_id,
        str(current_user["id"]),
    )

    if requirement is None:
        raise HTTPException(
            status_code=404,
            detail="Requirement not found",
        )

    text = f"""
Title:
{requirement["title"]}

Description:
{requirement["description"] or ""}
"""

    result = improve_requirement(text)

    updated = update_improved_requirements(
        connection=connection,
        requirement_id=requirement_id,
        user_id=str(current_user["id"]),
        improved_requirements=json.dumps(
            result["improved_requirements"]
        ),
    )

    connection.commit()

    return {
        "message": "Requirement improved successfully.",
        "requirement_id": requirement_id,
        "improved_requirements": result["improved_requirements"],
    }



@router.post("/{requirement_id}/rewrite")
def rewrite(
    requirement_id: str,
    connection: psycopg.Connection = Depends(get_connection),
    current_user: dict = Depends(get_current_user),
):
    requirement = get_requirement(
        connection,
        requirement_id,
        str(current_user["id"]),
    )

    if requirement is None:
        raise HTTPException(
            status_code=404,
            detail="Requirement not found",
        )

    text = f"""
Title:
{requirement["title"]}

Description:
{requirement["description"] or ""}
"""

    result = rewrite_requirement(text)

    updated = update_rewritten_requirement(
        connection=connection,
        requirement_id=requirement_id,
        user_id=str(current_user["id"]),
        rewritten_requirement=result["rewritten_requirement"],
    )

    connection.commit()

    return {
        "message": "Requirement rewritten successfully.",
        "requirement_id": requirement_id,
        "rewritten_requirement": result["rewritten_requirement"],
    }


@router.post("/{requirement_id}/acceptance-criteria")
def acceptance_criteria(
    requirement_id: str,
    connection: psycopg.Connection = Depends(get_connection),
    current_user: dict = Depends(get_current_user),
):
    requirement = get_requirement(
        connection,
        requirement_id,
        str(current_user["id"]),
    )

    if requirement is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requirement not found",
        )

    text = f"""
Title:
{requirement["title"]}

Description:
{requirement["description"] or ""}
"""

    result = generate_acceptance_criteria(text)

    updated = update_acceptance_criteria(
        connection=connection,
        requirement_id=requirement_id,
        user_id=str(current_user["id"]),
        acceptance_criteria=json.dumps(
            result["acceptance_criteria"]
        ),
    )

    connection.commit()

    return {
        "message": "Acceptance criteria generated successfully.",
        "requirement_id": requirement_id,
        "acceptance_criteria": result["acceptance_criteria"],
    }


@router.post("/{requirement_id}/user-stories")
def user_stories(
    requirement_id: str,
    connection: psycopg.Connection = Depends(get_connection),
    current_user: dict = Depends(get_current_user),
):
    requirement = get_requirement(
        connection,
        requirement_id,
        str(current_user["id"]),
    )

    if requirement is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requirement not found",
        )

    text = f"""
Title:
{requirement["title"]}

Description:
{requirement["description"] or ""}
"""

    result = generate_user_story(text)

    updated = update_user_stories(
        connection=connection,
        requirement_id=requirement_id,
        user_id=str(current_user["id"]),
        user_stories=json.dumps(
            result["user_stories"]
        ),
    )

    connection.commit()

    return {
        "message": "User stories generated successfully.",
        "requirement_id": requirement_id,
        "user_stories": result["user_stories"],
    }

@router.get(
    "/{requirement_id}/versions",
    response_model=RequirementVersionList,
)
def version_history(
    requirement_id: str,
    current_user: dict = Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
):
    # Ensure requirement belongs to current user
    requirement = get_requirement(
        connection,
        requirement_id,
        str(current_user["id"]),
    )

    if requirement is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requirement not found",
        )

    versions = get_requirement_versions(
        connection,
        requirement_id,
    )

    return {
        "versions": versions,
    }


@router.post(
    "/compare",
    response_model=CompareRequirementsResponse,
)
def compare_two_requirements(
    request: CompareRequirementsRequest,
    current_user: dict = Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
):
    requirement1 = get_requirement(
        connection,
        request.requirement_id_1,
        str(current_user["id"]),
    )

    if requirement1 is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="First requirement not found",
        )

    requirement2 = get_requirement(
        connection,
        request.requirement_id_2,
        str(current_user["id"]),
    )

    if requirement2 is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Second requirement not found",
        )

    result = compare_requirements(
        title1=requirement1["title"],
        description1=requirement1["description"],
        title2=requirement2["title"],
        description2=requirement2["description"],
    )

    return CompareRequirementsResponse(**result)


@router.post(
    "/{requirement_id}/risk-analysis",
    response_model=RiskAnalysisResponse,
)
def risk_analysis(
    requirement_id: str,
    current_user: dict = Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
):
    requirement = get_requirement(
        connection,
        requirement_id,
        str(current_user["id"]),
    )

    if requirement is None:
        raise HTTPException(
            status_code=404,
            detail="Requirement not found",
        )

    result = analyze_requirement_risk(
        requirement["title"],
        requirement["description"],
    )

    return RiskAnalysisResponse(**result)


@router.get(
    "/{requirement_id}/traceability",
    response_model=TraceabilityResponse,
)
def traceability(
    requirement_id: str,
    current_user: dict = Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
):
    requirement = get_requirement(
        connection,
        requirement_id,
        str(current_user["id"]),
    )

    if requirement is None:
        raise HTTPException(
            status_code=404,
            detail="Requirement not found",
        )

    trace = get_requirement_traceability(
        connection,
        requirement_id,
    )

    return TraceabilityResponse(**trace)