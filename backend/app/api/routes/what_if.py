from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.what_if_service import WhatIfService
from app.schemas.what_if import WhatIfRequest, WhatIfResponse

router = APIRouter(prefix="/careers", tags=["What-If Simulator"])


@router.post(
    "/{career_slug}/what-if",
    response_model=WhatIfResponse,
    status_code=status.HTTP_200_OK,
    summary="Simulate Career Pathway Trade-Offs (What-If)",
    description=(
        "Recalculates viable career pathways and financial trade-offs based on dynamic user constraints "
        "(budget, location, degree route, study abroad). Deterministic engine with zero AI hallucinations."
    ),
)
def simulate_what_if_pathways(
    career_slug: str,
    payload: WhatIfRequest,
    db: Session = Depends(get_db),
) -> WhatIfResponse:
    return WhatIfService.calculate_what_if(
        db=db,
        career_slug=career_slug,
        request=payload,
    )
