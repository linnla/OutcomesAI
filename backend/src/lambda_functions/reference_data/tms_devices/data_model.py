from sqlalchemy import String, Integer, DateTime
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class TMSDevice(Base):
    __tablename__ = "tms_devices"

    id = mapped_column(Integer, primary_key=True)
    manufacturer = mapped_column(String(55), nullable=False)
    model_number = mapped_column(String(55), nullable=True)
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
