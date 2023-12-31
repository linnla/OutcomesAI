from sqlalchemy import String, Integer, DateTime
from sqlalchemy.orm import mapped_column
from . import ModelBase


class Practitioner(ModelBase):
    __tablename__ = "practitioners"

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(Integer)
    last_name = mapped_column(String(85), nullable=False)
    first_name = mapped_column(String(85), nullable=False)
    prefix = mapped_column(String(12), nullable=True)
    suffix = mapped_column(String(25), nullable=True)
    email = mapped_column(String(85), nullable=False)
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")

        full_name = ""
        if self.prefix and self.prefix.strip() != "":
            full_name += self.prefix + " "

        full_name += f"{self.first_name} {self.last_name}"

        if self.suffix and self.suffix.strip() != "":
            full_name += ", " + self.suffix

        return {
            "id": self.id,
            "user_id": self.user_id,
            "full_name": full_name,
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
