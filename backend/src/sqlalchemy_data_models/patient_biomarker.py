from sqlalchemy import (
    String,
    Integer,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import mapped_column
from . import ModelBase
from .practice_patient import PracticePatient
from .biomarker import Biomarker


class PatientBiomarker(ModelBase):
    __tablename__ = "patient_biomarkers"

    practice_patient_id = mapped_column(
        Integer, ForeignKey("practice_patients.id"), nullable=False
    )
    biomarker_id = mapped_column(Integer, ForeignKey("biomarkers.id"), primary_key=True)
    value = mapped_column(String(25), nullable=False)
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    # Define relationships
    practice_patient = relationship(PracticePatient, foreign_keys=[practice_patient_id])
    biomarker = relationship(Biomarker, foreign_keys=[biomarker_id])

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")
        practice_patient = self.practice_patient.to_dict()
        biomarker = self.biomarker.to_dict()
        full_name = f"{practice_patient['first_name']} {practice_patient['last_name']}"

        return {
            "practice_patient_id": self.practice_patient_id,
            "full_name": full_name,
            "last_name": practice_patient["last_name"],
            "first_name": practice_patient["first_name"],
            "biomarker_id": self.biomarker_id,
            "biomarker_acronym": biomarker["acronym"],
            "biomarker_name": biomarker["name"],
            "value": self.value,
            "created": created,
            "updated": updated,
        }

    all_params_select = True
    select_required_params = ["practice_patient_id"]
    create_required_fields = ["practice_patient_id", "biomarker_id", "value"]
    create_allowed_fields = []
    update_required_fields = ["practice_patient_id", "biomarker_id"]
    update_allowed_fields = ["biomarker_id", "value"]
    delete_required_fields = ["practice_patient_id", "biomarker_id"]
