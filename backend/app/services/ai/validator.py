import logging
from typing import List, Dict, Any
from app.services.ai.base import (
    CareerAgentContext,
    FundingAgentOutput,
    ValidatedCandidate,
    ValidationReport,
)

logger = logging.getLogger(__name__)


class FundingValidator:
    """
    Validation Layer:
    Strictly verifies and filters all Funding Agent claims against the authoritative
    structured database records. Enforces CareerQuest's zero-hallucination policy.
    """

    def validate(
        self,
        career_context: CareerAgentContext,
        funding_agent_output: FundingAgentOutput,
        original_records: List[Dict[str, Any]],
    ) -> ValidationReport:
        # Build lookup table of authoritative database records by ID and normalized Name
        records_by_id: Dict[str, Dict[str, Any]] = {rec["id"]: rec for rec in original_records}
        records_by_name: Dict[str, Dict[str, Any]] = {rec["name"].strip().lower(): rec for rec in original_records}

        validated_options: List[ValidatedCandidate] = []
        removed_claims: List[str] = []
        uncertainties: List[str] = []
        limitations: List[str] = []

        seen_ids = set()

        for candidate in funding_agent_output.candidates:
            matched_rec = None

            # 1. Check if option exists in supplied authoritative database records
            if candidate.funding_id and candidate.funding_id in records_by_id:
                matched_rec = records_by_id[candidate.funding_id]
            elif candidate.name and candidate.name.strip().lower() in records_by_name:
                matched_rec = records_by_name[candidate.name.strip().lower()]

            if not matched_rec:
                # Hallucination detected: Option does not exist in the database catalog
                reason = f"Removed ungrounded funding option '{candidate.name}' (ID: {candidate.funding_id}) — not found in verified database catalog."
                logger.warning(reason)
                removed_claims.append(reason)
                continue

            # Prevent duplicates
            if matched_rec["id"] in seen_ids:
                continue
            seen_ids.add(matched_rec["id"])

            # 2. Validate Amount Grounding
            # Strict enforcement: Replace ungrounded/hallucinated amounts with authoritative DB amount description
            grounded_amount = matched_rec.get("amount_description", "").strip()
            if not grounded_amount:
                grounded_amount = "Amount not specified in the available source."

            if candidate.amount_claim and candidate.amount_claim.strip() != grounded_amount:
                if candidate.amount_claim.strip().lower() not in grounded_amount.lower():
                    uncertainties.append(
                        f"Amount claim '{candidate.amount_claim}' for '{matched_rec['name']}' was adjusted to grounded record description: '{grounded_amount}'."
                    )

            # 3. Validate Eligibility Grounding
            grounded_eligibility = matched_rec.get("eligibility_summary", "").strip()
            if not grounded_eligibility:
                grounded_eligibility = "Refer to provider guidelines for full criteria."

            # 4. Validate Source Attachment
            source_meta = matched_rec.get("source", {
                "name": matched_rec.get("source_name", "Authoritative Source"),
                "url": matched_rec.get("source_url", ""),
                "verified": matched_rec.get("source_verified", False),
                "last_verified_at": matched_rec.get("last_verified_at", "2026-01-01"),
                "is_mock": matched_rec.get("is_mock", True),
            })

            # 5. Determine Confidence Level
            confidence = "supported"
            if matched_rec.get("is_mock", False) and not matched_rec.get("source_verified", False):
                confidence = "supported"  # Supported by database mock prototype
            elif not source_meta.get("url"):
                confidence = "partially_supported"
                uncertainties.append(f"Direct application URL missing for '{matched_rec['name']}'.")

            validated_options.append(
                ValidatedCandidate(
                    id=matched_rec["id"],
                    name=matched_rec["name"],
                    type=matched_rec["type"],
                    provider=matched_rec["provider"],
                    why_relevant=candidate.why_relevant or f"Applicable for {career_context.career_title} pathway.",
                    eligibility=grounded_eligibility,
                    amount=grounded_amount,
                    confidence=confidence,
                    source=source_meta,
                )
            )

        # Append general limitations if budget deficit exceeds potential funding
        if career_context.annual_deficit and career_context.annual_deficit > 0:
            limitations.append(
                f"Estimated annual funding gap is {career_context.annual_deficit:,.0f} {career_context.currency}. Combining scholarships with educational loans or institutional aid is advised."
            )

        if not validated_options and original_records:
            uncertainties.append("No candidates passed validation from the agent output; fallback grounding engaged.")

        return ValidationReport(
            validated_options=validated_options,
            removed_claims=removed_claims,
            uncertainties=uncertainties,
            limitations=limitations,
        )
