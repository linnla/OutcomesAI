from sqlalchemy import (
    ForeignKey,
    String,
    Integer,
    DateTime,
)
from sqlalchemy.orm import relationship
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
    cpt_category_id = mapped_column(
        Integer, ForeignKey("cpt_categories.id"), primary_key=False
    )
    description = mapped_column(String(255), nullable=False)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    # Define relationships
    cptCategory = relationship("CptCategory", foreign_keys=[cpt_category_id])

    def to_dict(self):
        cptCategory = self.cptCategory.to_dict()
        created = self.created_at.strftime("%Y-%m-%d")
        updated = self.updated_at.strftime("%Y-%m-%d")

        return {
            "id": self.id,
            "cpt_code": self.cpt_code,
            "cpt_category_id": self.cpt_category_id,
            "cpt_category_name": cptCategory["name"],
            "cpt_category_description": cptCategory["description"],
            "cpt_category_status": cptCategory["status"],
            "description": self.description,
            "created": created,
            "updated": updated,
            "status": self.status,
        }

    create_required_fields = ["cpt_code", "cpt_category_id", "description"]
    create_allowed_fields = []
    update_required_fields = ["id"]
    update_allowed_fields = ["cpt_code", "cpt_category_id", "description", "status"]
    delete_required_fields = ["id"]


class CptCategory(Base):
    __tablename__ = "cpt_categories"

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(55), nullable=False)
    description = mapped_column(String(255), nullable=False)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "status": self.status,
        }

    create_required_fields = ["name", "description"]
    create_allowed_fields = []
    update_required_fields = ["id"]
    update_allowed_fields = ["name", "description", "status"]
    delete_required_fields = ["id"]
