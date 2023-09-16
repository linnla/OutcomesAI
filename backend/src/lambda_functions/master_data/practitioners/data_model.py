from sqlalchemy import Column, String, Integer, DateTime, Date, Boolean, Numeric
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase
from datetime import datetime


class Base(DeclarativeBase):
    pass


class Practitioner(Base):
    __tablename__ = "practitioners"

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(Integer)
    last_name = mapped_column(String(85), nullable=False)
    first_name = mapped_column(String(85), nullable=False)
    prefix = mapped_column(String(12))
    suffix = mapped_column(String(25))
    email = mapped_column(String(85), nullable=False)
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d")
        updated = self.updated_at.strftime("%Y-%m-%d")

        return {
            "id": self.id,
            "user_id": self.user_id,
            "last_name": self.last_name,
            "first_name": self.first_name,
            "prefix": self.prefix,
            "suffix": self.suffix,
            "email": self.email,
            "created": created,
            "updated": updated,
        }

    all_params_select = True
    select_required_params = ["id"]
    create_required_fields = ["last_name", "first_name", "email"]
    create_allowed_fields = ["prefix", "suffix", "user_id"]
    update_required_fields = ["id"]
    update_allowed_fields = ["last_name", "first_name", "prefix", "suffix", "email"]
    delete_required_fields = ["id"]
