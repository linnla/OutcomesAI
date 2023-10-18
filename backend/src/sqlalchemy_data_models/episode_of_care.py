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
from .practice_patient import PracticePatient
from .office import Office
from .practitioner import Practitioner


class EpisodeOfCare(ModelBase):
    __tablename__ = "episodes_of_care"

    id = mapped_column(Integer, primary_key=True)
    practice_id = mapped_column(Integer, ForeignKey("practices.id"), primary_key=False)
    practice_patient_id = mapped_column(
        Integer, ForeignKey("practice_patients.id"), primary_key=False
    )
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
    practice_patient = relationship(PracticePatient, foreign_keys=[practice_patient_id])
    office = relationship(Office, foreign_keys=[office_id])
    practitioner = relationship(Practitioner, foreign_keys=[practitioner_id])

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")
        practice = self.practice.to_dict()
        practice_patient = self.practice_patient.to_dict()
        patient_full_name = (
            f"{practice_patient['first_name']} {practice_patient['last_name']}"
        )
        office = self.office.to_dict()
        practitioner = self.practitioner.to_dict()
        start_date = self.start_date.strftime("%Y-%m-%d")
        if self.end_date is not None:
            end_date = self.end_date.strftime("%Y-%m-%d")
        else:
            end_date = ""

        return {
            "practice_id": self.practice_id,
            "practice_name": practice["name"],
            "practice_patient_id": self.practice_patient_id,
            "full_name": patient_full_name,
            "last_name": practice_patient["last_name"],
            "first_name": practice_patient["first_name"],
            "office_id": self.office_id,
            "office_name": office["name"],
            "practitioner_id": self.practitioner_id,
            "practitioner_full_name": practitioner["full_name"],
            "care_status": self.care_status,
            "start_date": start_date,
            "end_date": end_date,
            "email": practice_patient["email"],
            "postal_code": practice_patient["postal_code"],
            "city": practice_patient["city"],
            "birthdate": practice_patient["birthdate"],
            "gender": practice_patient["gender"],
            "created": created,
            "updated": updated,
        }

    all_params_select = False
    select_required_params = [
        "practice_id",
        "practice_patient_id",
        "practitioner_id",
        "office_id",
    ]
    create_required_fields = [
        "practice_id",
        "practice_patient_id",
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
