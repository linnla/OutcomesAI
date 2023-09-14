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

    all_params_select = True
    select_required_params = ["practice_id", "patient_id"]
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


class Practice(Base):
    __tablename__ = "practices"

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(85), nullable=False)
    postal_code = mapped_column(String(10), nullable=False)
    city = mapped_column(String(85), nullable=False)
    county = mapped_column(String(85), nullable=False)
    state_code = mapped_column(String(2), nullable=False)
    state = mapped_column(String(85))
    country_code = mapped_column(String(2), nullable=False)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "postal_code": self.postal_code,
            "city": self.city,
            "county": self.county,
            "state_code": self.state_code,
            "state": self.state,
            "country_code": self.country_code,
            "status": self.status,
        }


class Patient(Base):
    __tablename__ = "patients"

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(Integer)
    last_name = mapped_column(String(85), nullable=False)
    first_name = mapped_column(String(85), nullable=False)
    email = mapped_column(String(85), nullable=False, unique=True)
    postal_code = mapped_column(String(10), nullable=False)
    city = mapped_column(String(85), nullable=False)
    county = mapped_column(String(85), nullable=False)
    state = mapped_column(String(85))
    state_code = mapped_column(String(2), nullable=False)
    country_code = mapped_column(String(2), nullable=False)
    birthdate = mapped_column(Date, nullable=False)
    gender = mapped_column(String(1), nullable=False)
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "last_name": self.last_name,
            "first_name": self.first_name,
            "email": self.email,
            "postal_code": self.postal_code,
            "city": self.city,
            "county": self.county,
            "state": self.state,
            "state_code": self.state_code,
            "country_code": self.country_code,
            "birthdate": str(self.birthdate),
            "gender": self.gender,
        }


class Office(Base):
    __tablename__ = "offices"

    id = mapped_column(Integer, primary_key=True)
    practice_id = mapped_column(Integer, nullable=False)
    name = mapped_column(String(85), nullable=False)
    virtual = mapped_column(Boolean, nullable=False)
    postal_code = mapped_column(String(10))
    city = mapped_column(String(85))
    state = mapped_column(String(85))
    county = mapped_column(String(85))
    state_code = mapped_column(String(2), nullable=False)
    country_code = mapped_column(String(2), nullable=False, default="US")
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")

        return {
            "id": self.id,
            "practice_id": self.practice_id,
            "name": self.name,
            "virtual": self.virtual,
            "postal_code": self.postal_code,
            "city": self.city,
            "state": self.state,
            "state_code": self.state_code,
            "county": self.county,
            "country_code": self.country_code,
            "status": self.status,
            "created": created,
            "updated": updated,
        }


class Practitioner(Base):
    __tablename__ = "practitioners"

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(Integer)
    last_name = mapped_column(String(85), nullable=False)
    first_name = mapped_column(String(85), nullable=False)
    prefix = mapped_column(String(12))
    suffix = mapped_column(String(25))
    email = mapped_column(String(85), nullable=False)
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d")
        updated = self.updated_at.strftime("%Y-%m-%d")

        return {
            "id": self.id,
            "user_id": self.user_id,
            "last_name": self.last_name,
            "first_name": self.first_name,
            "prefix": self.prefix,
            "suffix": self.suffix,
            "email": self.email,
            "created": created,
            "updated": updated,
        }
