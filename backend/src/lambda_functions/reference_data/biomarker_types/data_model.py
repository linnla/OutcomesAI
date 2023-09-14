from sqlalchemy import Column, String, Integer, DateTime, Date, Boolean, Numeric
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class BiomarkerType(Base):
    __tablename__ = "biomarker_types"

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(55), nullable=False)
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    def to_dict(self):
        return {"id": self.id, "name": self.name}

    create_required_fields = ["name"]
    create_allowed_fields = []
    update_required_fields = ["id"]
    update_allowed_fields = ["name"]
    delete_required_fields = ["id"]
