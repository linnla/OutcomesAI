from sqlalchemy import String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class Biomarker(Base):
    __tablename__ = "biomarkers"

    id = mapped_column(Integer, primary_key=True)
    biomarker_type_id = mapped_column(
        Integer, ForeignKey("biomarker_types.id"), nullable=False
    )
    acronym = mapped_column(String(12), nullable=False)
    name = mapped_column(String(85), nullable=False)
    biomarker_values = mapped_column(ARRAY(String), nullable=False)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    # Define relationships
    biomarker_type = relationship("BiomarkerType", foreign_keys=[biomarker_type_id])

    def to_dict(self):
        biomarker_type = self.biomarker_type.to_dict()
        created = self.created_at.strftime("%Y-%m-%d")
        updated = self.updated_at.strftime("%Y-%m-%d")

        return {
            "id": self.id,
            "biomarker_type_id": self.biomarker_type_id,
            "biomarker_type_name": biomarker_type["name"],
            "acronym": self.acronym,
            "name": self.name,
            "biomarker_values": self.biomarker_values,
            "status": self.status,
        }

    select_required_params = ["id"]
    create_required_fields = [
        "biomarker_type_id",
        "acronym",
        "name",
        "biomarker_values",
    ]
    create_allowed_fields = ["status"]
    update_required_fields = ["id"]
    update_allowed_fields = [
        "biomarker_type_id",
        "acronym",
        "name",
        "biomarker_values",
        "status",
    ]
    delete_required_fields = ["id"]


class BiomarkerType(Base):
    __tablename__ = "biomarker_types"

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(75), nullable=False)
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