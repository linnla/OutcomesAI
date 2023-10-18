from sqlalchemy import String, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column
from . import ModelBase


class User(ModelBase):
    __tablename__ = "users"

    id = mapped_column(Integer, primary_key=True)
    cognito_id = mapped_column(UUID(as_uuid=True), nullable=False)
    last_name = mapped_column(String(85), nullable=False)
    first_name = mapped_column(String(85), nullable=False)
    email = mapped_column(String(85), nullable=False)
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")

        return {
            "id": self.id,
            "cognito_id": str(self.cognito_id),
            "last_name": self.last_name,
            "first_name": self.first_name,
            "email": self.email,
            "created": created,
            "updated": updated,
        }

    all_params_select = False
    select_required_params = ["id", "email", "cognito_id"]
    create_required_fields = ["email", "cognito_id", "last_name", "first_name"]
    create_allowed_fields = []
    update_required_fields = ["id"]
    update_allowed_fields = ["email", "last_name", "first_name"]
    delete_required_fields = ["id"]
