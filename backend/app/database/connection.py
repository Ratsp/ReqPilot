from collections.abc import Generator

import psycopg
from fastapi import HTTPException, status
from psycopg.rows import dict_row

from app.config import settings


def get_connection() -> Generator[psycopg.Connection, None, None]:
    if not settings.database_url:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="DATABASE_URL is not configured",
        )

    with psycopg.connect(settings.database_url, row_factory=dict_row) as connection:
        yield connection
