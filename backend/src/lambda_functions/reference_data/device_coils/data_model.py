from sqlalchemy import String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class DeviceCoil(Base):
    __tablename__ = "device_coils"

    id = mapped_column(Integer, primary_key=True)
    device_id = mapped_column(Integer, ForeignKey("devices.id"), primary_key=False)
    name = mapped_column(String(65), nullable=False)
    model_number = mapped_column(String(65), nullable=True)
    year = mapped_column(Integer, nullable=True)
    description = mapped_column(String(255), nullable=True)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    # Define relationships
    device = relationship("Device", foreign_keys=[device_id])

    def to_dict(self):
        device = self.device.to_dict()
        created = self.created_at.strftime("%Y-%m-%d")
        updated = self.updated_at.strftime("%Y-%m-%d")

        return {
            "id": self.id,
            "device_id": self.device_id,
            "device_name": device["name"],
            "name": self.name,
            "model_number": self.model_number,
            "year": self.year,
            "description": self.description,
            "status": self.status,
        }

    select_required_params = ["id"]
    create_required_fields = ["device_id", "name"]
    create_allowed_fields = ["model_number", "year", "status", "description"]
    update_required_fields = ["id"]
    update_allowed_fields = [
        "name",
        "device_id",
        "model_number",
        "year",
        "description",
        "status",
    ]
    delete_required_fields = ["id"]


class Device(Base):
    __tablename__ = "devices"

    id = mapped_column(Integer, primary_key=True)
    manufacturer = mapped_column(String(55), nullable=False)
    model_number = mapped_column(String(55), nullable=False)
    name = mapped_column(String(75), nullable=False)
    year = mapped_column(Integer, nullable=True)

    description = mapped_column(String(255), nullable=True)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "manufacturer": self.manufacturer,
            "model_number": self.model_number,
            "name": self.name,
            "description": self.description,
            "status": self.status,
        }
