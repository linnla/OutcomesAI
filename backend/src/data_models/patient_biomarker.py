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
from .patient import Patient
from .biomarker import Biomarker


class PatientBiomarker(ModelBase):
    __tablename__ = "patient_biomarkers"

    patient_id = mapped_column(Integer, ForeignKey("patients.id"), primary_key=True)
    biomarker_id = mapped_column(Integer, ForeignKey("biomarkers.id"), primary_key=True)
    value = mapped_column(String(25), nullable=False)
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    # Define relationships
    patient = relationship(Patient, foreign_keys=[patient_id])
    biomarker = relationship(Biomarker, foreign_keys=[biomarker_id])

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")
        patient = self.patient.to_dict()
        biomarker = self.biomarker.to_dict()
        full_name = f"{patient['first_name']} {patient['last_name']}"

        return {
            "patient_id": self.patient_id,
            "full_name": full_name,
            "last_name": patient["last_name"],
            "first_name": patient["first_name"],
            "biomarker_id": self.biomarker_id,
            "biomarker_acronym": biomarker["acronym"],
            "biomarker_name": biomarker["name"],
            "value": self.value,
            "created": created,
            "updated": updated,
        }

    all_params_select = True
    select_required_params = ["patient_id"]
    create_required_fields = ["patient_id", "biomarker_id", "value"]
    create_allowed_fields = []
    update_required_fields = ["patient_id", "biomarker_id"]
    update_allowed_fields = ["biomarker_id", "value"]
    delete_required_fields = ["patient_id", "biomarker_id"]
