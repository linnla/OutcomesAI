from sqlalchemy import String, Integer, DateTime
from sqlalchemy.orm import mapped_column
from . import ModelBase


class IntegrationVendor(ModelBase):
    __tablename__ = "integration_vendors"

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(55), nullable=False)
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")

        return {
            "id": self.id,
            "name": self.name,
            "created": created,
            "updated": updated,
        }

    create_required_fields = ["name"]
    create_allowed_fields = []
    update_required_fields = ["id"]
    update_allowed_fields = ["name"]
    delete_required_fields = ["id"]
