from sqlalchemy import String, Integer, DateTime
from sqlalchemy.orm import mapped_column
from . import ModelBase


class AcquisitionSource(ModelBase):
    __tablename__ = "acquisition_sources"

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(75), nullable=False)
    description = mapped_column(String(255), nullable=False)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")

        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "status": self.status,
            "created": created,
            "updated": updated,
        }

    create_required_fields = ["name", "description"]
    create_allowed_fields = []
    update_required_fields = ["id"]
    update_allowed_fields = ["name", "description", "status"]
    delete_required_fields = ["id"]
