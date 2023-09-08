from sqlalchemy import Column, String, Integer, DateTime, Date, Boolean, Numeric
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class CptCode(Base):
    __tablename__ = "cpt_codes"

    id = mapped_column(Integer, primary_key=True)
    cpt_code = mapped_column(String(5), nullable=False)
    cpt_category_id = mapped_column(Integer, nullable=False)
    description = mapped_column(String(255), nullable=False)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "cpt_code": self.cpt_code,
            "cpt_category_id": self.cpt_category_id,
            "description": self.description,
            "status": self.status,
        }

    create_required_fields = ["cpt_code", "cpt_category_id", "description"]
    create_allowed_fields = []
    update_required_fields = ["id"]
    update_allowed_fields = ["cpt_code", "cpt_category_id", "description", "status"]
    delete_required_fields = ["id"]
