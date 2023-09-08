from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
    Date,
    Boolean,
    Numeric,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase
from datetime import datetime


class Base(DeclarativeBase):
    pass


class EpisodeOfCareDiagnosisCode(Base):
    __tablename__ = "episodes_of_care"

    episodes_of_care_id = mapped_column(
        Integer, ForeignKey("episodes_of_care.id"), primary_key=True
    )
    diagnosis_codes_id = mapped_column(
        Integer, ForeignKey("diagnosis_codes.id"), primary_key=True
    )
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    # Define relationships
    episodeOfCare = relationship("EpisodeOfCare", foreign_keys=[episodes_of_care_id])
    diagnosisCode = relationship("DiagnosisCode", foreign_keys=[diagnosis_codes_id])

    def to_dict(self):
        practice = self.practice.to_dict()
        practitioner = self.practitioner.to_dict()
        full_name = f"{practitioner['prefix']} {practitioner['first_name']} {practitioner['last_name']} {practitioner['suffix']}"
        created = self.created_at.strftime("%Y-%m-%d")
        updated = self.updated_at.strftime("%Y-%m-%d")

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


class EpisodeOfCare(Base):
    __tablename__ = "episodes_of_care"

    id = mapped_column(Integer, primary_key=True)
    practice_id = mapped_column(Integer, ForeignKey("practices.id"), primary_key=False)
    patient_id = mapped_column(Integer, ForeignKey("patients.id"), primary_key=False)
    office_id = mapped_column(Integer, ForeignKey("offices.id"), primary_key=False)
    practitioner_id = mapped_column(
        Integer, ForeignKey("practitioners.id"), primary_key=False
    )
    start_date = mapped_column(DateTime, nullable=False)
    end_date = mapped_column(DateTime, nullable=True)
    care_status = mapped_column(String(25), nullable=False, default="In Progress")
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    # Define relationships
    practice = relationship("Practice", foreign_keys=[practice_id])
    patient = relationship("Patient", foreign_keys=[patient_id])
    office = relationship("Office", foreign_keys=[office_id])
    practitioner = relationship("Practitioner", foreign_keys=[practitioner_id])

    def to_dict(self):
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

        created = self.created_at.strftime("%Y-%m-%d")
        updated = self.updated_at.strftime("%Y-%m-%d")

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


class DiagnosisCode(Base):
    __tablename__ = "diagnosis_codes"

    id = mapped_column(Integer, primary_key=True)
    classification_system = mapped_column(String(12), nullable=False)
    disorder_id = mapped_column(Integer, nullable=False)
    code = mapped_column(String(35), nullable=False)
    description = mapped_column(String(255), nullable=False)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "classification_system": self.classification_system,
            "disorder_id": self.disorder_id,
            "code": self.code,
            "description": self.description,
            "status": self.status,
        }
