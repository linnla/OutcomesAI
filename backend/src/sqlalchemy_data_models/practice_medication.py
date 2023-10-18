from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from . import ModelBase
from .practice import Practice
from .medication import Medication


class PracticeMedications(ModelBase):
    __tablename__ = "practice_medications"

    practice_id = mapped_column(Integer, ForeignKey("practices.id"), primary_key=True)
    medication_id = mapped_column(
        Integer, ForeignKey("medications.id"), primary_key=True
    )
    status = Column(String(8), nullable=False, default="Active")
    created_at = Column(DateTime(timezone=True), nullable=False)
    updated_at = Column(DateTime(timezone=True), nullable=False)

    # Define relationships
    practice = relationship(Practice, foreign_keys=[practice_id])
    medication = relationship(Medication, foreign_keys=[medication_id])

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")
        practice = self.practice.to_dict()
        medication = self.medication.to_dict()

        return {
            "practice_id": self.practice_id,
            "medication_id": self.medication_id,
            "status": self.status,
            "created": created,
            "updated": updated,
        }

    all_params_select = False
    select_required_params = ["practice_id"]
    select_filters = []
    create_required_fields = ["practice_id", "medication_id"]
    create_allowed_fields = []
    update_required_fields = ["practice_id", "medication_id"]
    update_allowed_fields = ["status"]
    update_required_fields = ["practice_id", "medication_id"]
    delete_required_fields = ["practice_id", "medication_id"]
