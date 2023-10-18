from sqlalchemy import String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from . import ModelBase
from .disorder import Disorder


class DiagnosisCode(ModelBase):
    __tablename__ = "diagnosis_codes"

    id = mapped_column(Integer, primary_key=True)
    classification_system = mapped_column(String(12), nullable=False)
    disorder_id = mapped_column(Integer, ForeignKey("disorders.id"), primary_key=False)
    code = mapped_column(String(35), nullable=False)
    description = mapped_column(String(255), nullable=False)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    # Define relationships
    disorder = relationship(Disorder, foreign_keys=[disorder_id])

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")
        disorder = self.disorder.to_dict()

        return {
            "id": self.id,
            "classification_system": self.classification_system,
            "disorder_id": self.disorder_id,
            "disorder_name": disorder["name"],
            "code": self.code,
            "description": self.description,
            "status": self.status,
            "created": created,
            "updated": updated,
        }

    select_required_params = ["id"]
    create_required_fields = [
        "classification_system",
        "disorder_id",
        "code",
        "description",
    ]
    create_allowed_fields = ["status"]
    update_required_fields = ["id"]
    update_allowed_fields = [
        "classification_system",
        "disorder_id",
        "code",
        "description",
        "status",
    ]
    delete_required_fields = ["id"]
