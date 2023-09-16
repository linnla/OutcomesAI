from sqlalchemy import Column, String, Integer, DateTime, Date, Boolean, Numeric
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase
from datetime import datetime


class Base(DeclarativeBase):
    pass


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
        created = self.created_at.strftime("%Y-%m-%d")
        updated = self.updated_at.strftime("%Y-%m-%d")

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
            "created": created,
            "updated": updated,
        }

    all_params_select = True
    select_required_params = ["id"]
    create_required_fields = [
        "last_name",
        "first_name",
        "email",
        "postal_code",
        "city",
        "county",
        "state_code",
        "country_code",
        "birthdate",
        "gender",
    ]
    create_allowed_fields = ["user_id", "state"]

    update_required_fields = ["id"]
    update_allowed_fields = [
        "user_id",
        "last_name",
        "first_name",
        "email",
        "postal_code",
        "city",
        "county",
        "state_code",
        "state",
        "country_code",
        "birthdate",
        "gender",
    ]
    delete_required_fields = ["id"]
