from sqlalchemy import (
    String,
    Integer,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from . import ModelBase
from .practice import Practice
from .practitioner import Practitioner


class PracticePractitioner(ModelBase):
    __tablename__ = "practice_practitioners"

    practice_id = mapped_column(Integer, ForeignKey("practices.id"), primary_key=True)
    practitioner_id = mapped_column(
        Integer, ForeignKey("practitioners.id"), primary_key=True
    )
    ehr_id = mapped_column(Integer, nullable=True)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    # Define relationships
    practice = relationship(Practice, foreign_keys=[practice_id])
    practitioner = relationship(Practitioner, foreign_keys=[practitioner_id])

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")
        practice = self.practice.to_dict()
        practitioner = self.practitioner.to_dict()

        return {
            "practice_id": self.practice_id,
            "id": self.practitioner_id,
            "ehr_id": self.ehr_id,
            "status": self.status,
            "practice_name": practice["name"],
            "full_name": practitioner["full_name"],
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
    create_allowed_fields = ["ehr_id"]
    update_required_fields = [
        "practice_id",
        "practitioner_id",
    ]
    update_allowed_fields = ["ehr_id", "status"]
    delete_required_fields = ["practice_id", "practitioner_id"]
