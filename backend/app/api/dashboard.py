import psycopg

from fastapi import APIRouter, Depends

from app.database.connection import get_connection
from app.middleware.auth import get_current_user

from app.database.queries import get_dashboard_stats

from app.schemas.requirement import DashboardStatsResponse

from app.database.queries import get_recent_activities

from app.schemas.requirement import (
    RecentActivityList,
)

from app.database.queries import get_requirement_trends
from app.schemas.requirement import RequirementTrendList

from app.database.queries import get_quality_distribution
from app.schemas.requirement import QualityDistributionResponse

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "/stats",
    response_model=DashboardStatsResponse,
)
def dashboard_stats(
    current_user: dict = Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
):

    stats = get_dashboard_stats(
        connection,
        str(current_user["id"]),
    )

    return DashboardStatsResponse(**stats)


@router.get(
    "/recent-activities",
    response_model=RecentActivityList,
)
def recent_activities(
    current_user: dict = Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
):
    activities = get_recent_activities(
        connection,
        str(current_user["id"]),
    )

    return {
        "activities": activities,
    }

@router.get(
    "/trends",
    response_model=RequirementTrendList,
)
def requirement_trends(
    current_user: dict = Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
):
    trends = get_requirement_trends(
        connection,
        str(current_user["id"]),
    )

    return {
        "trends": trends,
    }


@router.get(
    "/quality-distribution",
    response_model=QualityDistributionResponse,
)
def quality_distribution(
    current_user: dict = Depends(get_current_user),
    connection: psycopg.Connection = Depends(get_connection),
):
    result = get_quality_distribution(
        connection,
        str(current_user["id"]),
    )

    return QualityDistributionResponse(
        **result,
    )