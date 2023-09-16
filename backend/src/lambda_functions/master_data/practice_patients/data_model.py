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


class PracticePatient(Base):
    __tablename__ = "practice_patients"

    practice_id = mapped_column(Integer, ForeignKey("practices.id"), primary_key=True)
    patient_id = mapped_column(Integer, ForeignKey("patients.id"), primary_key=True)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    # Define relationships
    practice = relationship("Practice", foreign_keys=[practice_id])
    patient = relationship("Patient", foreign_keys=[patient_id])

    def to_dict(self):
        practice = self.practice.to_dict()
        patient = self.patient.to_dict()
        full_name = f"{patient['first_name']} {patient['last_name']}"
        created = self.created_at.strftime("%Y-%m-%d")
        updated = self.updated_at.strftime("%Y-%m-%d")

        return {
            "practice_id": self.practice_id,
            "id": self.patient_id,
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
    create_required_fields = ["practice_id", "patient_id"]
    create_allowed_fields = []
    update_required_fields = ["practice_id", "patient_id"]
    update_allowed_fields = ["status"]
    delete_required_fields = ["practice_id", "patient_id"]


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
