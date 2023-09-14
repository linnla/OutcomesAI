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


class PatientBiomarker(Base):
    __tablename__ = "patient_biomarkers"

    patient_id = mapped_column(Integer, ForeignKey("patients.id"), primary_key=True)
    biomarker_id = mapped_column(Integer, ForeignKey("biomarkers.id"), primary_key=True)
    value = mapped_column(String(25), nullable=False)
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    # Define relationships
    patient = relationship("Patient", foreign_keys=[patient_id])
    biomarker = relationship("Biomarker", foreign_keys=[biomarker_id])

    def to_dict(self):
        patient = self.patient.to_dict()
        biomarker = self.biomarker.to_dict()
        full_name = f"{patient['first_name']} {patient['last_name']}"
        created = self.created_at.strftime("%Y-%m-%d")
        updated = self.updated_at.strftime("%Y-%m-%d")

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


class Biomarker(Base):
    __tablename__ = "biomarkers"

    id = mapped_column(Integer, primary_key=True)
    biomarker_type_id = mapped_column(Integer, nullable=False)
    acronym = mapped_column(String(12), nullable=False)
    name = mapped_column(String(85), nullable=False)
    biomarker_values = mapped_column(ARRAY(String), nullable=False)
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "biomarker_type_id": self.biomarker_type_id,
            "acronym": self.acronym,
            "name": self.name,
            "biomarker_values": self.biomarker_values,
        }
