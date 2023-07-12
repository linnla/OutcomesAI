from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
    Date,
    Boolean,
    Numeric,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class PracticeUser(Base):
    __tablename__ = "practice_users"

    practice_id = mapped_column(Integer, ForeignKey("practices.id"), primary_key=True)
    user_id = mapped_column(Integer, ForeignKey("users.id"), primary_key=True)
    role_id = mapped_column(Integer, ForeignKey("roles.id"))
    status = Column(String(8), nullable=False, default="Active")
    created_at = Column(DateTime(timezone=True), nullable=False)
    updated_at = Column(DateTime(timezone=True), nullable=False)

    # Define relationships
    user = relationship("User", foreign_keys=[user_id])
    practice = relationship("Practice", foreign_keys=[practice_id])
    role = relationship("Role", foreign_keys=[role_id])

    def to_dict(self):
        user = self.user.to_dict()
        practice = self.practice.to_dict()
        role = self.role.to_dict()
        full_name = f"{user['first_name']} {user['last_name']}"

        return {
            "practice_id": self.practice_id,
            "user_id": self.user_id,
            "role_id": self.role_id,
            "status": self.status,
            "practice_name": practice["name"],
            "practice_city": practice["city"],
            "practice_state": practice["state"],
            "practice_postal_code": practice["postal_code"],
            "practice_country_code": practice["country_code"],
            "practice_status": practice["status"],
            "full_name": full_name,
            "last_name": user["last_name"],
            "first_name": user["first_name"],
            "email": user["email"],
            "role": role["name"],
        }

    all_params_select = False
    select_required_params = ["practice_id", "user_id"]
    select_filters = ["last_name", "first_name"]
    create_required_fields = ["practice_id", "user_id", "role_id"]
    create_allowed_fields = []
    update_required_fields = ["practice_id", "user_id"]
    update_allowed_fields = ["status", "role_id"]


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


class Practice(Base):
    __tablename__ = "practices"

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(85), nullable=False)
    postal_code = mapped_column(String(10), nullable=False)
    city = mapped_column(String(85), nullable=False)
    county = mapped_column(String(85), nullable=False)
    state_code = mapped_column(String(2), nullable=False)
    state = mapped_column(String(85))
    country_code = mapped_column(String(2), nullable=False)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "postal_code": self.postal_code,
            "city": self.city,
            "county": self.county,
            "state_code": self.state_code,
            "state": self.state,
            "country_code": self.country_code,
            "status": self.status,
        }


class Role(Base):
    __tablename__ = "roles"

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(55), nullable=False)
    description = mapped_column(String(255), nullable=False)
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "description": self.description}
