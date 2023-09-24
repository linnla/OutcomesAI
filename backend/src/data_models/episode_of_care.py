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
from .office import Office
from .practitioner import Practitioner


class EpisodeOfCare(ModelBase):
    __tablename__ = "episodes_of_care"

    id = mapped_column(Integer, primary_key=True)
    practice_id = mapped_column(Integer, ForeignKey("practices.id"), primary_key=False)
    patient_id = mapped_column(Integer, ForeignKey("patients.id"), primary_key=False)
    office_id = mapped_column(Integer, ForeignKey("offices.id"), primary_key=False)
    practitioner_id = mapped_column(
        Integer, ForeignKey("practitioners.id"), primary_key=False
    )
    start_date = mapped_column(Date, nullable=False)
    end_date = mapped_column(Date, nullable=True)
    care_status = mapped_column(String(25), nullable=False, default="In Progress")
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    # Define relationships
    practice = relationship(Practice, foreign_keys=[practice_id])
    patient = relationship(Patient, foreign_keys=[patient_id])
    office = relationship(Office, foreign_keys=[office_id])
    practitioner = relationship(Practitioner, foreign_keys=[practitioner_id])

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")
        practice = self.practice.to_dict()
        patient = self.patient.to_dict()
        patient_full_name = f"{patient['first_name']} {patient['last_name']}"
        office = self.office.to_dict()
        practitioner = self.practitioner.to_dict()
        practitioner_full_name = ""
        if practitioner["prefix"] is not None:
            practitioner_full_name += practitioner["prefix"] + " "
        practitioner_full_name += (
            practitioner["first_name"] + " " + practitioner["last_name"]
        )
        if practitioner["suffix"] is not None:
            practitioner_full_name += ", " + practitioner["suffix"]
        start_date = self.start_date.strftime("%Y-%m-%d")
        if self.end_date is not None:
            end_date = self.end_date.strftime("%Y-%m-%d")
        else:
            end_date = ""

        return {
            "practice_id": self.practice_id,
            "practice_name": practice["name"],
            "patient_id": self.patient_id,
            "full_name": patient_full_name,
            "last_name": patient["last_name"],
            "first_name": patient["first_name"],
            "office_id": self.office_id,
            "office_name": office["name"],
            "practitioner_id": self.practitioner_id,
            "practitioner_full_name": practitioner_full_name,
            "care_status": self.care_status,
            "start_date": start_date,
            "end_date": end_date,
            "email": patient["email"],
            "postal_code": patient["postal_code"],
            "city": patient["city"],
            "birthdate": patient["birthdate"],
            "gender": patient["gender"],
            "created": created,
            "updated": updated,
        }

    all_params_select = False
    select_required_params = [
        "practice_id",
        "patient_id",
        "practitioner_id",
        "office_id",
    ]
    create_required_fields = [
        "practice_id",
        "patient_id",
        "office_id",
        "practitioner_id",
        "start_date",
    ]
    create_allowed_fields = ["care_status"]
    update_required_fields = ["id"]
    update_allowed_fields = [
        "office_id",
        "practitioner_id",
        "start_date",
        "care_status",
    ]
    delete_required_fields = ["id"]
