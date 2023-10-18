from sqlalchemy import Integer, DateTime, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from . import ModelBase
from .practice import Practice
from .integration_type import IntegrationType
from .integration_vendor import IntegrationVendor


class PracticeIntegration(ModelBase):
    __tablename__ = "practice_integrations"

    practice_id = mapped_column(Integer, ForeignKey("practices.id"), primary_key=True)
    integration_type_id = mapped_column(
        Integer, ForeignKey("integration_types.id"), primary_key=True
    )
    integration_vendor_id = mapped_column(
        Integer, ForeignKey("integration_vendors.id"), primary_key=True
    )
    client_id = mapped_column(String(75), nullable=False)
    client_secret = mapped_column(String(75), nullable=False)
    refresh_token = mapped_column(String(75), nullable=True)
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    # Define relationships
    practice = relationship(Practice, foreign_keys=[practice_id])
    integration_type = relationship(IntegrationType, foreign_keys=[integration_type_id])
    integration_vendor = relationship(
        IntegrationVendor, foreign_keys=[integration_vendor_id]
    )

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")
        practice = self.practice.to_dict()
        integration_vendor = self.integration_vendor.to_dict()
        integration_type = self.integration_type.to_dict()

        return {
            "practice_id": self.practice_id,
            "integration_vendor_id": self.integration_vendor_id,
            "integration_vendor_name": integration_vendor["name"],
            "integration_type_id": self.integration_type_id,
            "integration_type_name": integration_type["name"],
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "refresh_token": self.refresh_token,
            "created": created,
            "updated": updated,
        }

    all_params_select = True
    select_required_params = ["practice_id"]
    create_required_fields = [
        "practice_id",
        "integration_vendor_id",
        "integration_type_id",
        "client_id",
        "client_secret",
        "refresh_token",
    ]
    create_allowed_fields = []
    update_required_fields = [
        "practice_id",
        "integration_vendor_id",
        "integration_type_id",
    ]
    update_allowed_fields = [
        "client_id",
        "client_secret",
        "refresh_token",
    ]
    delete_required_fields = [
        "practice_id",
        "integration_vendor_id",
        "integration_type_id",
    ]
