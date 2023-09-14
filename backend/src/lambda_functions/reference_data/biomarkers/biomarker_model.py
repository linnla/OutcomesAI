from sqlalchemy import Column, String, Integer, DateTime, Date, Boolean, Numeric
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


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

    select_required_params = ["id"]
    create_required_fields = [
        "biomarker_type_id",
        "acronym",
        "name",
        "biomarker_values",
    ]
    create_allowed_fields = []
    update_required_fields = ["id"]
    update_allowed_fields = ["biomarker_type_id", "acronym", "name", "biomarker_values"]
    delete_required_fields = ["id"]
