from datetime import datetime
from uuid import UUID
from typing import Any

from pydantic import BaseModel
from datetime import date



class RequirementCreate(BaseModel):
    title: str
    description: str | None = None


class RequirementUpdate(BaseModel):
    title: str
    description: str | None = None
    status: str


class RequirementResponse(BaseModel):
    id: UUID
    user_id: UUID

    title: str
    description: str | None

    status: str
    version_number: int

    source_type: str | None = None
    original_input: str | None = None
    extracted_requirements: str | None = None
    ai_summary: str | None = None
    extraction_status: str | None = None

    quality_analysis: dict | None = None

    missing_information: str | None = None
    clarification_questions: str | None = None

    created_at: datetime
    updated_at: datetime


class UploadResponse(BaseModel):
    message: str
    requirement_id: str
    filenames: list[str]
    extracted_text: str
    ai_result: dict[str, Any]

class RequirementList(BaseModel):
    requirements: list[RequirementResponse]

class WebpageRequest(BaseModel):
    url: str


class RequirementVersionResponse(BaseModel):
    id: UUID
    requirement_id: UUID
    title: str
    description: str | None
    version_number: int
    created_at: datetime

class RequirementVersionList(BaseModel):
    versions: list[RequirementVersionResponse]


class DashboardStatsResponse(BaseModel):
    total_requirements: int
    draft: int
    pending: int
    approved: int
    completed: int
    average_quality_score: float
    total_versions: int



class RecentActivityResponse(BaseModel):
    id: UUID
    title: str
    status: str
    updated_at: datetime
    version_number: int


class RecentActivityList(BaseModel):
    activities: list[RecentActivityResponse]



class RequirementTrendResponse(BaseModel):
    date: date
    count: int


class RequirementTrendList(BaseModel):
    trends: list[RequirementTrendResponse]


class QualityDistributionResponse(BaseModel):
    high: int
    medium: int
    low: int


class RequirementChatRequest(BaseModel):
    question: str

class RequirementChatResponse(BaseModel):
    answer: str


class CompareRequirementsRequest(BaseModel):
    requirement_id_1: str
    requirement_id_2: str


class CompareRequirementsResponse(BaseModel):
    similarity_score: int
    similarities: list[str]
    differences: list[str]
    recommendation: str

class RiskAnalysisResponse(BaseModel):
    risk_level: str
    technical_risks: list[str]
    business_risks: list[str]
    dependencies: list[str]
    mitigation: list[str]

class TraceabilityResponse(BaseModel):
    id: UUID
    title: str
    status: str
    version_number: int
    created_at: datetime