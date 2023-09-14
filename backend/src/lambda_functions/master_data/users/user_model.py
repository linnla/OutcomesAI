from sqlalchemy import Column, String, Integer, DateTime, Date, Boolean, Numeric
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id = mapped_column(Integer, primary_key=True)
    cognito_id = mapped_column(UUID(as_uuid=True), nullable=False)
    last_name = mapped_column(String(85), nullable=False)
    first_name = mapped_column(String(85), nullable=False)
    email = mapped_column(String(85), nullable=False)
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "cognito_id": str(self.cognito_id),
            "last_name": self.last_name,
            "first_name": self.first_name,
            "email": self.email,
        }

    all_params_select = False
    select_required_params = ["id", "email", "cognito_id"]
    create_required_fields = ["email", "cognito_id", "last_name", "first_name"]
    create_allowed_fields = []
    update_required_fields = ["id"]
    update_allowed_fields = ["email", "last_name", "first_name"]
