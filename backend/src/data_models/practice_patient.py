from sqlalchemy import (
    String,
    Integer,
    DateTime,
    Date,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from . import ModelBase
from .practice import Practice
from .patient import Patient


class PracticePatient(ModelBase):
    __tablename__ = "practice_patients"

    practice_id = mapped_column(Integer, ForeignKey("practices.id"), primary_key=True)
    patient_id = mapped_column(Integer, ForeignKey("patients.id"), primary_key=True)
    ehr_id = mapped_column(Integer, nullable=False)
    chart_id = mapped_column(String(85), nullable=False)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    # Define relationships
    practice = relationship(Practice, foreign_keys=[practice_id])
    patient = relationship(Patient, foreign_keys=[patient_id])

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")
        practice = self.practice.to_dict()
        patient = self.patient.to_dict()
        full_name = f"{patient['first_name']} {patient['last_name']}"

        return {
            "practice_id": self.practice_id,
            "id": self.patient_id,
            "ehr_id": self.patient_ehr_id,
            "chart_id": self.chart_id,
            "status": self.status,
            "practice_name": practice["name"],
            "full_name": full_name,
            "last_name": patient["last_name"],
            "first_name": patient["first_name"],
            "email": patient["email"],
            "postal_code": patient["postal_code"],
            "city": patient["city"],
            "state": patient["state"],
            "country_code": patient["country_code"],
            "birthdate": patient["birthdate"],
            "gender": patient["gender"],
            "created": created,
            "updated": updated,
        }

    all_params_select = True
    select_required_params = ["practice_id"]
    create_required_fields = ["practice_id", "patient_id", "ehr_id", "chart_id"]
    create_allowed_fields = []
    update_required_fields = ["practice_id", "patient_id"]
    update_allowed_fields = ["ehr_id", "status"]
    delete_required_fields = ["practice_id", "patient_id"]
