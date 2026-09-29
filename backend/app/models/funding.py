from sqlalchemy import Column, String, Text, Boolean, JSON
from app.core.database import Base


class FundingOption(Base):
    __tablename__ = "funding_options"

    id = Column(String(100), primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    type = Column(String(50), nullable=False, index=True)  # scholarship, education_loan, institutional_aid, grant, other
    description = Column(Text, nullable=False)
    provider = Column(String(255), nullable=False)
    target_education_level = Column(String(100), nullable=False, default="all")  # bachelor, master, bootcamp, all
    target_career_categories = Column(JSON, nullable=False, default=list)  # ["Technology", "Engineering", "All"]
    location = Column(String(100), nullable=False, default="India")  # India, Abroad, Global
    amount_description = Column(String(255), nullable=False)  # "Up to ₹1,50,000 / year tuition coverage"
    eligibility_summary = Column(Text, nullable=False)
    requirements = Column(JSON, nullable=False, default=list)  # ["Minimum 75% in 12th standard", ...]
    application_information = Column(Text, nullable=False)
    source_url = Column(String(500), nullable=False)
    source_name = Column(String(255), nullable=False)
    source_verified = Column(Boolean, nullable=False, default=False)
    last_verified_at = Column(String(50), nullable=False)
    is_mock = Column(Boolean, nullable=False, default=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "description": self.description,
            "provider": self.provider,
            "target_education_level": self.target_education_level,
            "target_career_categories": self.target_career_categories,
            "location": self.location,
            "amount_description": self.amount_description,
            "eligibility_summary": self.eligibility_summary,
            "requirements": self.requirements,
            "application_information": self.application_information,
            "source": {
                "name": self.source_name,
                "url": self.source_url,
                "verified": self.source_verified,
                "last_verified_at": self.last_verified_at,
                "is_mock": self.is_mock,
            },
        }
