from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from . import ModelBase
from .practice import Practice
from .user import User
from .role import Role


class PracticeUser(ModelBase):
    __tablename__ = "practice_users"

    practice_id = mapped_column(Integer, ForeignKey("practices.id"), primary_key=True)
    user_id = mapped_column(Integer, ForeignKey("users.id"), primary_key=True)
    role_id = mapped_column(Integer, ForeignKey("roles.id"))
    status = Column(String(8), nullable=False, default="Active")
    created_at = Column(DateTime(timezone=True), nullable=False)
    updated_at = Column(DateTime(timezone=True), nullable=False)

    # Define relationships
    user = relationship(User, foreign_keys=[user_id])
    practice = relationship(Practice, foreign_keys=[practice_id])
    role = relationship(Role, foreign_keys=[role_id])

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")
        user = self.user.to_dict()
        practice = self.practice.to_dict()
        role = self.role.to_dict()
        full_name = f"{user['first_name']} {user['last_name']}"

        return {
            "id": self.user_id,
            "practice_id": practice["id"],
            "user_id": self.user_id,
            "role_id": self.role_id,
            "role_name": role["name"],
            "status": self.status,
            "cognito_id": user["cognito_id"],
            "full_name": full_name,
            "last_name": user["last_name"],
            "first_name": user["first_name"],
            "email": user["email"],
            "created": created,
            "updated": updated,
        }

    all_params_select = False
    select_required_params = ["practice_id", "user_id", "email"]
    select_filters = ["last_name", "first_name"]
    create_required_fields = ["practice_id", "user_id", "role_id"]
    create_allowed_fields = []
    update_required_fields = ["practice_id", "user_id"]
    update_allowed_fields = ["status", "role_id"]
    delete_required_fields = ["practice_id", "user_id"]
