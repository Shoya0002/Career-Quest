from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.career_service import CareerService
from app.services.comparison_service import ComparisonService
from app.schemas.career import (
    CareerListPaginationResponse,
    CareerDetailResponse,
    CareerPathwayResponse,
)
from app.schemas.comparison import CareerComparisonResponse

router = APIRouter(prefix="/careers", tags=["Careers"])



@router.get(
    "",
    response_model=CareerListPaginationResponse,
    status_code=status.HTTP_200_OK,
    summary="List Careers for Explorer",
    description="Retrieve a paginated list of career cards with optional keyword search and category filtering.",
)
def list_careers(
    search: Optional[str] = Query(
        None,
        min_length=1,
        max_length=100,
        description="Search query matching career title, category, tagline, or required skills",
    ),
    category: Optional[str] = Query(
        None,
        min_length=1,
        max_length=64,
        description="Filter by career category / industry vertical (e.g. Technology, Healthcare, Law, Finance)",
    ),
    page: int = Query(
        1,
        ge=1,
        description="Page number (1-indexed)",
    ),
    limit: int = Query(
        10,
        ge=1,
        le=100,
        description="Number of items per page",
    ),
    db: Session = Depends(get_db),
) -> CareerListPaginationResponse:
    try:
        return CareerService.get_careers(
            db=db,
            search=search,
            category=category,
            page=page,
            limit=limit,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to process career search request: {str(e)}",
        )


@router.get(
    "/compare",
    response_model=CareerComparisonResponse,
    status_code=status.HTTP_200_OK,
    summary="Compare Two Careers (Decision Matrix)",
    description="Compare two distinct careers side-by-side across 12 structured dimensions without ranking or scoring.",
)
def compare_careers(
    career_a: str = Query(..., min_length=1, description="First career slug (e.g. software-engineer)"),
    career_b: str = Query(..., min_length=1, description="Second career slug (e.g. lawyer)"),
    dimensions: Optional[str] = Query(None, description="Optional comma-separated list of dimension keys to filter"),
    db: Session = Depends(get_db),
) -> CareerComparisonResponse:
    slug_a = career_a.strip().lower()
    slug_b = career_b.strip().lower()

    if slug_a == slug_b:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot compare a career with itself. Please select two distinct careers.",
        )

    # Check existence of career_a
    career_a_obj = CareerService.get_career_by_slug(db=db, career_slug=slug_a)
    if not career_a_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Career '{slug_a}' was not found in the catalog.",
        )

    # Check existence of career_b
    career_b_obj = CareerService.get_career_by_slug(db=db, career_slug=slug_b)
    if not career_b_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Career '{slug_b}' was not found in the catalog.",
        )

    dim_list = [d.strip().lower() for d in dimensions.split(",") if d.strip()] if dimensions else None
    service = ComparisonService()
    comparison = service.compare_careers(
        db=db,
        career_a_slug=slug_a,
        career_b_slug=slug_b,
        dimension_filter=dim_list,
    )

    if not comparison:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Failed to generate career comparison.",
        )

    return comparison



@router.get(
    "/{career_slug}",
    response_model=CareerDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Detailed Career Profile",
    description="Retrieve comprehensive structured information for a specific career including education, skills, progression, and financials.",
)
def get_career_details(
    career_slug: str,
    db: Session = Depends(get_db),
) -> CareerDetailResponse:
    career = CareerService.get_career_by_slug(db=db, career_slug=career_slug)
    if not career:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Career '{career_slug}' was not found in the catalog.",
        )
    return career


@router.get(
    "/{career_slug}/pathway",
    response_model=CareerPathwayResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Career Pathway",
    description="Retrieve structured education and milestone pathway graph for React Flow visualization.",
)
def get_career_pathway(
    career_slug: str,
    db: Session = Depends(get_db),
) -> CareerPathwayResponse:
    pathway = CareerService.get_career_pathway(db=db, career_slug=career_slug)
    if not pathway:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pathway for career '{career_slug}' was not found.",
        )
    return pathway
