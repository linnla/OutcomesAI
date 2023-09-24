from sqlalchemy import String, Integer, DateTime, Date
from sqlalchemy.orm import mapped_column
from . import ModelBase


class Patient(ModelBase):
    __tablename__ = "patients"

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(Integer, nullable=True)
    last_name = mapped_column(String(85), nullable=False)
    first_name = mapped_column(String(85), nullable=False)
    birthdate = mapped_column(Date, nullable=False)
    gender_birth = mapped_column(String(1), nullable=False)
    gender_identity = mapped_column(String(85), nullable=False)
    race = mapped_column(String(85), nullable=False)
    ethnicity = mapped_column(String(85), nullable=False)
    email = mapped_column(String(85), nullable=False, unique=True)
    cell_phone = mapped_column(String(12), nullable=True)
    postal_code = mapped_column(String(12), nullable=False)
    city = mapped_column(String(85), nullable=True)
    county = mapped_column(String(85), nullable=True)
    state = mapped_column(String(85), nullable=True)
    state_code = mapped_column(String(2), nullable=True)
    country_code = mapped_column(String(2), nullable=False, default="US")

    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")

        return {
            "id": self.id,
            "user_id": self.user_id,
            "last_name": self.last_name,
            "first_name": self.first_name,
            "email": self.email,
            "postal_code": self.postal_code,
            "city": self.city,
            "county": self.county,
            "state": self.state,
            "state_code": self.state_code,
            "country_code": self.country_code,
            "birthdate": str(self.birthdate),
            "gender": self.gender,
            "created": created,
            "updated": updated,
        }

    all_params_select = True
    select_required_params = ["id"]
    create_required_fields = [
        "last_name",
        "first_name",
        "email",
        "postal_code",
        "city",
        "county",
        "state_code",
        "country_code",
        "birthdate",
        "gender",
    ]
    create_allowed_fields = ["user_id", "state"]

    update_required_fields = ["id"]
    update_allowed_fields = [
        "user_id",
        "last_name",
        "first_name",
        "email",
        "postal_code",
        "city",
        "county",
        "state_code",
        "state",
        "country_code",
        "birthdate",
        "gender",
    ]
    delete_required_fields = ["id"]
