from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class CareerSummaryHeader(BaseModel):
    id: str
    slug: str
    title: str
    category: str
    tagline: str

    model_config = ConfigDict(from_attributes=True)


class DimensionValue(BaseModel):
    value: Optional[str] = None
    details: List[str] = Field(default_factory=list)
    data_available: bool = True
    metadata: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)


class ComparisonDimension(BaseModel):
    key: str
    label: str
    career_a: DimensionValue
    career_b: DimensionValue

    model_config = ConfigDict(from_attributes=True)


class TradeOffItem(BaseModel):
    dimension: str
    label: str
    summary: str

    model_config = ConfigDict(from_attributes=True)


class CareerComparisonResponse(BaseModel):
    career_a: CareerSummaryHeader
    career_b: CareerSummaryHeader
    dimensions: List[ComparisonDimension]
    trade_offs: List[TradeOffItem] = Field(default_factory=list)
    source: Dict[str, Any] = Field(
        default_factory=lambda: {
            "name": "CareerQuest Comprehensive Career Registry (Prototype Data)",
            "url": "https://demo.careerquest.org/sources/careers",
            "verified": False,
            "is_mock": True,
        }
    )
    disclaimer: str = (
        "Career comparison data is strictly informational and intended to highlight structured trade-offs. "
        "CareerQuest does not declare winners, compute suitability scores, or rank career paths."
    )

    model_config = ConfigDict(from_attributes=True)
