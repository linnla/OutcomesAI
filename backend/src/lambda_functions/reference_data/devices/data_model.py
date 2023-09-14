from sqlalchemy import String, Integer, DateTime
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class Device(Base):
    __tablename__ = "devices"

    id = mapped_column(Integer, primary_key=True)
    manufacturer = mapped_column(String(55), nullable=False)
    model_number = mapped_column(String(55), nullable=False)
    year = mapped_column(Integer, nullable=True)

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

    create_required_fields = ["name", "description"]
    create_allowed_fields = []
    update_required_fields = ["id"]
    update_allowed_fields = ["name", "description", "status"]
    delete_required_fields = ["id"]
