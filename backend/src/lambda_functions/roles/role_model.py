from sqlalchemy import Column, String, Integer, DateTime, Date, Boolean, Numeric
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class Role(Base):
    __tablename__ = "roles"

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(55), nullable=False)
    description = mapped_column(String(255), nullable=False)
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "description": self.description}

    create_required_fields = ["name", "description"]
    create_allowed_fields = []
    update_required_fields = ["id"]
    update_allowed_fields = ["name", "description"]
    delete_required_fields = ["id"]
