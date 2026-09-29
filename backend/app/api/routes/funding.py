from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.funding import (
    FundingListResponse,
    FundingOptionPublicSchema,
    FundingAnalyzeRequest,
    FundingAnalysisResponse,
)
from app.services.funding_service import FundingService

router = APIRouter(prefix="/funding", tags=["Funding Intelligence"])
funding_service = FundingService()


@router.get(
    "",
    response_model=FundingListResponse,
    status_code=status.HTTP_200_OK,
    summary="Search & Filter Funding Records",
    description="Retrieve structured funding options (scholarships, education loans, institutional aid) with filters.",
)
def get_funding_options(
    career_category: Optional[str] = Query(None, description="Filter by career category (e.g. Technology, Engineering)"),
    education_level: Optional[str] = Query(None, description="Filter by education level (e.g. bachelor, master, bootcamp, all)"),
    location: Optional[str] = Query(None, description="Filter by location (e.g. India, Abroad, Global)"),
    type: Optional[str] = Query(None, description="Filter by type (scholarship, education_loan, institutional_aid, grant, other)"),
    db: Session = Depends(get_db),
):
    options = funding_service.get_funding_options(
        db=db,
        career_category=career_category,
        education_level=education_level,
        location=location,
        type=type,
    )

    items = [FundingOptionPublicSchema.model_validate(opt.to_dict()) for opt in options]
    return FundingListResponse(items=items, total=len(items))


@router.get(
    "/{option_id}",
    response_model=FundingOptionPublicSchema,
    status_code=status.HTTP_200_OK,
    summary="Get Single Funding Record",
    description="Retrieve full structured details and source metadata for a specific funding option.",
)
def get_funding_option_by_id(
    option_id: str,
    db: Session = Depends(get_db),
):
    option = funding_service.get_funding_option_by_id(db=db, option_id=option_id)
    if not option:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Funding option with ID '{option_id}' not found.",
        )
    return FundingOptionPublicSchema.model_validate(option.to_dict())


@router.post(
    "/analyze",
    response_model=FundingAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="AI Funding Pathway Analysis",
    description="Multi-agent funding pipeline validating scholarships, loans, and aid against verified database records.",
)
async def analyze_funding(
    request: FundingAnalyzeRequest,
    db: Session = Depends(get_db),
):
    result = await funding_service.analyze_funding(db=db, request=request)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Career with slug '{request.career_slug}' not found.",
        )
    return result
