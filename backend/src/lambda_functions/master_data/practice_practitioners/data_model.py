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


class PracticePractitioner(Base):
    __tablename__ = "practice_practitioners"

    practice_id = mapped_column(Integer, ForeignKey("practices.id"), primary_key=True)
    practitioner_id = mapped_column(
        Integer, ForeignKey("practitioners.id"), primary_key=True
    )
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    # Define relationships
    practice = relationship("Practice", foreign_keys=[practice_id])
    practitioner = relationship("Practitioner", foreign_keys=[practitioner_id])

    def to_dict(self):
        practice = self.practice.to_dict()
        practitioner = self.practitioner.to_dict()
        full_name = f"{practitioner['prefix']} {practitioner['first_name']} {practitioner['last_name']} {practitioner['suffix']}"
        created = self.created_at.strftime("%Y-%m-%d")
        updated = self.updated_at.strftime("%Y-%m-%d")

        return {
            "practice_id": self.practice_id,
            "id": self.practitioner_id,
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
        return {
            "id": self.id,
            "user_id": self.user_id,
            "last_name": self.last_name,
            "first_name": self.first_name,
            "prefix": self.prefix,
            "suffix": self.suffix,
            "email": self.email,
        }
