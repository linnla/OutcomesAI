from sqlalchemy import Column, String, Integer, DateTime, Date, Boolean, Numeric
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


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
        }

    all_params_select = False
    select_required_params = ["id", "practice_id"]
    create_required_fields = [
        "practice_id",
        "name",
        "virtual",
        "state_code",
        "country_code",
    ]
    create_allowed_fields = [
        "postal_code",
        "city",
        "county",
        "state_code",
        "state",
        "country_code",
    ]
    update_required_fields = ["id"]
    update_allowed_fields = [
        "name",
        "virtual",
        "postal_code",
        "city",
        "county",
        "state_code",
        "state",
        "country_code",
        "status",
    ]
