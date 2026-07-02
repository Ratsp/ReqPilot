from typing import Any
from psycopg.types.json import Json
import psycopg


#----------------------
# USERS
#----------------------

def create_user(connection: psycopg.Connection, full_name: str, email: str, password_hash: str) -> dict[str, Any]:
    query = """
        insert into users (full_name, email, password_hash)
        values (%s, %s, %s)
        returning id, full_name, email, created_at, updated_at
    """
    with connection.cursor() as cursor:
        cursor.execute(query, (full_name, email.lower(), password_hash))
        return cursor.fetchone()


def find_user_by_email(connection: psycopg.Connection, email: str) -> dict[str, Any] | None:
    query = """
        select id, full_name, email, password_hash, created_at, updated_at
        from users
        where email = %s
    """
    with connection.cursor() as cursor:
        cursor.execute(query, (email.lower(),))
        return cursor.fetchone()


def find_user_by_id(connection: psycopg.Connection, user_id: str) -> dict[str, Any] | None:
    query = """
        select id, full_name, email, created_at, updated_at
        from users
        where id = %s
    """
    with connection.cursor() as cursor:
        cursor.execute(query, (user_id,))
        return cursor.fetchone()


# -------------------------
# REQUIREMENTS
# -------------------------

def create_requirement(
    connection: psycopg.Connection,
    user_id: str,
    title: str,
    description: str | None,
) -> dict[str, Any]:
    query = """
        INSERT INTO requirements (
            user_id,
            title,
            description,
            version_number
        )
        VALUES (%s, %s, %s, 1)
        RETURNING
            id,
            user_id,
            title,
            description,
            status,
            version_number,
            source_type,
            original_input,
            extracted_requirements,
            ai_summary,
            extraction_status,
            quality_analysis,
            created_at,
            updated_at;
    """

    with connection.cursor() as cursor:
        cursor.execute(query, (user_id, title, description))
        return cursor.fetchone()


def list_requirements(
    connection: psycopg.Connection,
    user_id: str,
) -> list[dict[str, Any]]:
    query = """
        SELECT
            id,
            user_id,
            title,
            description,
            status,
            version_number,

            source_type,
            original_input,
            extracted_requirements,
            ai_summary,
            extraction_status,
            quality_analysis,

            created_at,
            updated_at
        FROM requirements
        WHERE user_id = %s
        ORDER BY created_at DESC;
    """

    with connection.cursor() as cursor:
        cursor.execute(query, (user_id,))
        return cursor.fetchall()


def get_requirement(
    connection: psycopg.Connection,
    requirement_id: str,
    user_id: str,
) -> dict[str, Any] | None:

    query = """
        SELECT
            id,
            user_id,
            title,
            description,
            status,
            version_number,
            quality_analysis,

            source_type,
            original_input,
            extracted_requirements,
            ai_summary,
            extraction_status,

            created_at,
            updated_at
        FROM requirements
        WHERE id=%s
        AND user_id=%s;
    """

    with connection.cursor() as cursor:
        cursor.execute(query, (requirement_id, user_id))
        return cursor.fetchone()


def update_requirement(
    connection: psycopg.Connection,
    requirement_id: str,
    user_id: str,
    title: str,
    description: str | None,
    status: str,
) -> dict[str, Any] | None:
    query = """
        UPDATE requirements
        SET
            title = %s,
            description = %s,
            status = %s,
            version_number = version_number + 1,
            updated_at = now()
        WHERE
            id = %s
            AND user_id = %s
        RETURNING
            id,
            user_id,
            title,
            description,
            status,
            version_number,
            created_at,
            updated_at,
            source_type,
            original_input,
            extracted_requirements,
            ai_summary,
            extraction_status,
            quality_analysis;
    """

    with connection.cursor() as cursor:
        cursor.execute(
            query,
            (
                title,
                description,
                status,
                requirement_id,
                user_id,
            ),
        )
        return cursor.fetchone()


def delete_requirement(
    connection: psycopg.Connection,
    requirement_id: str,
    user_id: str,
) -> bool:
    query = """
        DELETE FROM requirements
        WHERE
            id = %s
            AND user_id = %s;
    """

    with connection.cursor() as cursor:
        cursor.execute(query, (requirement_id, user_id))
        return cursor.rowcount > 0



def update_requirement_ai_result(
    connection: psycopg.Connection,
    requirement_id: str,
    user_id: str,
    original_input: str,
    ai_summary: str,
    extracted_requirements: str,
    extraction_status: str,
) -> dict[str, Any] | None:
    query = """
        UPDATE requirements
        SET
            original_input = %s,
            ai_summary = %s,
            extracted_requirements = %s,
            extraction_status = %s,
            updated_at = now()
        WHERE
            id = %s
            AND user_id = %s
        RETURNING
            *;
    """

    with connection.cursor() as cursor:
        cursor.execute(
            query,
            (
                original_input,
                ai_summary,
                extracted_requirements,
                extraction_status,
                requirement_id,
                user_id,
            ),
        )

        return cursor.fetchone()



import json


def create_uploaded_requirement(
    connection: psycopg.Connection,
    *,
    user_id: str,
    title: str,
    extracted_text: str,
    ai_result: dict,
) -> dict[str, Any]:

    query = """
    INSERT INTO requirements
    (
        user_id,
        title,
        description,
        status,
        version_number,
        source_type,
        original_input,
        extracted_requirements,
        ai_summary,
        extraction_status
    )
    VALUES
    (
        %s,%s,%s,
        'draft',
        1,
        'upload',
        %s,
        %s,
        %s,
        'completed'
    )
    RETURNING *;
    """

    with connection.cursor() as cursor:
        cursor.execute(
            query,
            (
                user_id,
                title,
                extracted_text,
                extracted_text,
                json.dumps(ai_result),
                ai_result.get("summary"),
            ),
        )

        return cursor.fetchone()


def update_gap_analysis(
    connection: psycopg.Connection,
    requirement_id: str,
    user_id: str,
    missing_information: str,
    clarification_questions: str,
):
    query = """
        UPDATE requirements
        SET
            missing_information = %s,
            clarification_questions = %s,
            updated_at = now()
        WHERE
            id = %s
            AND user_id = %s
        RETURNING *;
    """

    with connection.cursor() as cursor:
        cursor.execute(
            query,
            (
                missing_information,
                clarification_questions,
                requirement_id,
                user_id,
            ),
        )

        return cursor.fetchone()


def create_ai_requirement(
    connection,
    *,
    user_id: str,
    title: str,
    description: str,
    source_type: str,
    original_input: str,
    extracted_requirements: str,
    ai_summary: str,
    extraction_status: str,
):
    with connection.cursor() as cursor:

        cursor.execute(
            """
            INSERT INTO requirements
            (
                user_id,
                title,
                description,
                status,
                version_number,
                source_type,
                original_input,
                extracted_requirements,
                ai_summary,
                extraction_status
            )
            VALUES
                (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s
                )
            RETURNING *;
            """,
            (
                user_id,
                title,
                description,
                "draft",
                1,
                source_type,
                original_input,
                extracted_requirements,
                ai_summary,
                extraction_status,
            ),
        )

        row = cursor.fetchone()

    return row




def update_quality_analysis(
    connection,
    requirement_id: str,
    user_id: str,
    quality_analysis,
):
    query = """
        UPDATE requirements
        SET
            quality_analysis=%s,
            updated_at=NOW()
        WHERE
            id=%s
            AND user_id=%s
        RETURNING *;
    """

    with connection.cursor() as cursor:
        cursor.execute(
            query,
            (
                Json(quality_analysis),
                requirement_id,
                user_id,
            ),
        )
        return cursor.fetchone()



def save_quality_analysis(
    connection: psycopg.Connection,
    requirement_id: str,
    analysis: dict,
):
    query = """
        UPDATE requirements
        SET
            quality_analysis = %s,
            updated_at = NOW()
        WHERE id = %s;
    """

    with connection.cursor() as cursor:
        cursor.execute(
            query,
            (
                Json(analysis),
                requirement_id,
            ),
        )

def update_improved_requirements(
    connection: psycopg.Connection,
    requirement_id: str,
    user_id: str,
    improved_requirements: str,
):
    query = """
        UPDATE requirements
        SET
            improved_requirements = %s,
            updated_at = NOW()
        WHERE
            id = %s
            AND user_id = %s
        RETURNING *;
    """

    with connection.cursor() as cursor:
        cursor.execute(
            query,
            (
                improved_requirements,
                requirement_id,
                user_id,
            ),
        )

        return cursor.fetchone()



def update_rewritten_requirement(
    connection: psycopg.Connection,
    requirement_id: str,
    user_id: str,
    rewritten_requirement: str,
):
    query = """
        UPDATE requirements
        SET
            rewritten_requirement = %s,
            updated_at = NOW()
        WHERE
            id = %s
            AND user_id = %s
        RETURNING *;
    """

    with connection.cursor() as cursor:
        cursor.execute(
            query,
            (
                rewritten_requirement,
                requirement_id,
                user_id,
            ),
        )

        return cursor.fetchone()


def update_acceptance_criteria(
    connection: psycopg.Connection,
    requirement_id: str,
    user_id: str,
    acceptance_criteria: str,
):
    query = """
        UPDATE requirements
        SET
            acceptance_criteria = %s,
            updated_at = NOW()
        WHERE
            id = %s
            AND user_id = %s
        RETURNING *;
    """

    with connection.cursor() as cursor:
        cursor.execute(
            query,
            (
                acceptance_criteria,
                requirement_id,
                user_id,
            ),
        )

        return cursor.fetchone()


def update_user_stories(
    connection: psycopg.Connection,
    requirement_id: str,
    user_id: str,
    user_stories: str,
):
    query = """
        UPDATE requirements
        SET
            user_stories = %s,
            updated_at = NOW()
        WHERE
            id = %s
            AND user_id = %s
        RETURNING *;
    """

    with connection.cursor() as cursor:

        cursor.execute(
            query,
            (
                user_stories,
                requirement_id,
                user_id,
            ),
        )

        return cursor.fetchone()


def create_requirement_version(
    connection: psycopg.Connection,
    requirement_id: str,
    version_number: int,
    title: str,
    description: str,
):
    print("Saving version:", requirement_id, version_number)
    query = """
        INSERT INTO requirement_versions
        (
            requirement_id,
            version_number,
            title,
            description
        )
        VALUES (%s,%s,%s,%s);
    """

    with connection.cursor() as cursor:
        cursor.execute(
            query,
            (
                requirement_id,
                version_number,
                title,
                description,
            ),
        )
        print("Version inserted")


def list_requirement_versions(
    connection,
    requirement_id: str,
):
    query = """
    SELECT
        id,
        version_number,
        title,
        description,
        created_at
    FROM requirement_versions
    WHERE requirement_id=%s
    ORDER BY version_number;
    """

    with connection.cursor() as cursor:
        cursor.execute(query, (requirement_id,))
        return cursor.fetchall()


def get_requirement_version(
    connection,
    requirement_id: str,
    version_number: int,
):
    query = """
    SELECT *
    FROM requirement_versions
    WHERE requirement_id=%s
      AND version_number=%s;
    """

    with connection.cursor() as cursor:
        cursor.execute(
            query,
            (
                requirement_id,
                version_number,
            ),
        )
        return cursor.fetchone()

def get_requirement_versions(
    connection: psycopg.Connection,
    requirement_id: str,
):
    query = """
        SELECT
            id,
            requirement_id,
            title,
            description,
            version_number,
            created_at
        FROM requirement_versions
        WHERE requirement_id = %s
        ORDER BY version_number DESC;
    """

    with connection.cursor() as cursor:
        cursor.execute(
            query,
            (requirement_id,),
        )

        return cursor.fetchall()




def get_dashboard_stats(
    connection: psycopg.Connection,
    user_id: str,
) -> dict[str, Any]:

    query = """
        SELECT
            COUNT(*) AS total_requirements,

            COUNT(*) FILTER (WHERE status = 'draft') AS draft,

            COUNT(*) FILTER (WHERE status = 'pending') AS pending,
            
            COUNT(*) FILTER (WHERE status = 'approved') AS approved,
            
            COUNT(*) FILTER (WHERE status = 'completed') AS completed,

            COALESCE(
                AVG((quality_analysis->>'overall_score')::numeric),
                0
            ) AS average_quality_score,

            COALESCE(
                SUM(version_number),
                0
            ) AS total_versions

        FROM requirements
        WHERE user_id = %s;
    """

    with connection.cursor() as cursor:
        cursor.execute(query, (user_id,))
        return cursor.fetchone()


def get_recent_activities(
    connection: psycopg.Connection,
    user_id: str,
):
    query = """
    SELECT
        id,
        title,
        status,
        updated_at,
        version_number
    FROM requirements
    WHERE user_id=%s
    ORDER BY updated_at DESC
    LIMIT 10;
    """

    with connection.cursor() as cursor:
        cursor.execute(
            query,
            (user_id,),
        )

        return cursor.fetchall()


def get_requirement_trends(
    connection: psycopg.Connection,
    user_id: str,
):
    query = """
    SELECT
        DATE(created_at) AS date,
        COUNT(*) AS count
    FROM requirements
    WHERE user_id = %s
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at);
    """

    with connection.cursor() as cursor:
        cursor.execute(
            query,
            (user_id,),
        )

        return cursor.fetchall()

def get_quality_distribution(
    connection: psycopg.Connection,
    user_id: str,
):
    query = """
    SELECT
        COUNT(*) FILTER (
            WHERE (quality_analysis->>'overall_score')::float >= 8
        ) AS high,

        COUNT(*) FILTER (
            WHERE (quality_analysis->>'overall_score')::float >= 5
              AND (quality_analysis->>'overall_score')::float < 8
        ) AS medium,

        COUNT(*) FILTER (
            WHERE (quality_analysis->>'overall_score')::float < 5
        ) AS low

    FROM requirements
    WHERE
        user_id = %s
        AND quality_analysis IS NOT NULL;
    """

    with connection.cursor() as cursor:
        cursor.execute(
            query,
            (user_id,),
        )

        return cursor.fetchone()


def search_requirements(
    connection: psycopg.Connection,
    user_id: str,
    keyword: str,
):
    query = """
    SELECT
        id,
        user_id,
        title,
        description,
        status,
        created_at,
        updated_at,
        source_type,
        version_number
    FROM requirements
    WHERE
        user_id = %s
        AND (
            title ILIKE %s
            OR description ILIKE %s
        )
    ORDER BY updated_at DESC;
    """

    search = f"%{keyword}%"

    with connection.cursor() as cursor:
        cursor.execute(
            query,
            (
                user_id,
                search,
                search,
            ),
        )

        return cursor.fetchall()


def filter_requirements_by_status(
    connection: psycopg.Connection,
    user_id: str,
    status: str,
):
    query = """
    SELECT *
    FROM requirements
    WHERE
        user_id = %s
        AND status = %s
    ORDER BY created_at DESC;
    """

    with connection.cursor(row_factory=psycopg.rows.dict_row) as cursor:
        cursor.execute(
            query,
            (
                user_id,
                status,
            ),
        )
        return cursor.fetchall()



def sort_requirements(
    connection: psycopg.Connection,
    user_id: str,
    sort_by: str,
):
    allowed_columns = {
        "created_at",
        "updated_at",
        "title",
        "status",
    }

    if sort_by not in allowed_columns:
        sort_by = "created_at"

    query = f"""
    SELECT *
    FROM requirements
    WHERE user_id = %s
    ORDER BY {sort_by} DESC;
    """

    with connection.cursor(row_factory=psycopg.rows.dict_row) as cursor:
        cursor.execute(
            query,
            (user_id,),
        )
        return cursor.fetchall()


def paginate_requirements(
    connection: psycopg.Connection,
    user_id: str,
    page: int,
    limit: int,
):
    offset = (page - 1) * limit

    query = """
    SELECT *
    FROM requirements
    WHERE user_id = %s
    ORDER BY created_at DESC
    LIMIT %s OFFSET %s;
    """

    with connection.cursor(row_factory=psycopg.rows.dict_row) as cursor:
        cursor.execute(
            query,
            (
                user_id,
                limit,
                offset,
            ),
        )
        return cursor.fetchall()


def get_requirement_traceability(
    connection,
    requirement_id: str,
):
    query = """
    SELECT
        id,
        title,
        status,
        version_number,
        created_at
    FROM requirements
    WHERE id = %s;
    """

    with connection.cursor() as cursor:
        cursor.execute(query, (requirement_id,))
        return cursor.fetchone()