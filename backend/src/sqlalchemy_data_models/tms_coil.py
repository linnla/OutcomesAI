from sqlalchemy import String, Integer, DateTime
from sqlalchemy.orm import mapped_column
from . import ModelBase


class TMSCoil(ModelBase):
    __tablename__ = "tms_coils"

    id = mapped_column(Integer, primary_key=True)
    manufacturer = mapped_column(String(55), nullable=False)
    model_number = mapped_column(String(55), nullable=True)
    name = mapped_column(String(75), nullable=False)
    year = mapped_column(Integer, nullable=True)

    description = mapped_column(String(255), nullable=True)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")

        return {
            "id": self.id,
            "manufacturer": self.manufacturer,
            "model_number": self.model_number,
            "name": self.name,
            "description": self.description,
            "status": self.status,
            "created": created,
            "updated": updated,
        }

    create_required_fields = ["manufacturer", "name"]
    create_allowed_fields = ["model_number", "year", "description"]
    update_required_fields = ["id"]
    update_allowed_fields = [
        "manufacturer",
        "model_number",
        "name",
        "description",
        "status",
    ]
    delete_required_fields = ["id"]
