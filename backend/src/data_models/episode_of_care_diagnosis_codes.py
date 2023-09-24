from sqlalchemy import (
    Integer,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from . import ModelBase
from .episode_of_care import EpisodeOfCare
from .diagnosis_code import DiagnosisCode


class EpisodeOfCareDiagnosisCode(ModelBase):
    __tablename__ = "episode_of_care_diagnosis_codes"

    episodes_of_care_id = mapped_column(
        Integer, ForeignKey("episodes_of_care.id"), primary_key=True
    )
    diagnosis_codes_id = mapped_column(
        Integer, ForeignKey("diagnosis_codes.id"), primary_key=True
    )
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    # Define relationships
    episodeOfCare = relationship(EpisodeOfCare, foreign_keys=[episodes_of_care_id])
    diagnosisCode = relationship(DiagnosisCode, foreign_keys=[diagnosis_codes_id])

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")
        practice = self.practice.to_dict()
        practitioner = self.practitioner.to_dict()
        full_name = f"{practitioner['prefix']} {practitioner['first_name']} {practitioner['last_name']} {practitioner['suffix']}"

        return {
            "episodes_of_care_id": self.episodes_of_care_id,
            "diagnosis_codes_id": self.diagnosis_codes_id,
            "status": self.status,
            "practice_name": practice["name"],
            "full_name": full_name,
            "last_name": practitioner["last_name"],
            "first_name": practitioner["first_name"],
            "prefix": practitioner["prefix"],
            "suffix": practitioner["suffix"],
            "email": practitioner["email"],
            "created": created,
            "updated": updated,
        }

    all_params_select = True
    select_required_params = ["practice_id"]
    create_required_fields = ["practice_id", "practitioner_id"]
    create_allowed_fields = []
    update_required_fields = ["practice_id", "practitioner_id"]
    update_allowed_fields = ["status"]
