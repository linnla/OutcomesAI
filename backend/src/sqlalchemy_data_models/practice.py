from sqlalchemy import String, Integer, DateTime
from sqlalchemy.orm import mapped_column
from . import ModelBase


class Practice(ModelBase):
    __tablename__ = "practices"

    id = mapped_column(Integer, primary_key=True)
    ehr_id = mapped_column(Integer, nullable=True)
    name = mapped_column(String(85), nullable=False)
    postal_code = mapped_column(String(10), nullable=False)
    city = mapped_column(String(85), nullable=True)
    county = mapped_column(String(85), nullable=True)
    state_code = mapped_column(String(2), nullable=True)
    state = mapped_column(String(85), nullable=True)
    country_code = mapped_column(String(2), nullable=False, default="US")
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")

        return {
            "id": self.id,
            "ehr_id": self.ehr_id,
            "name": self.name,
            "postal_code": self.postal_code,
            "city": self.city,
            "county": self.county,
            "state_code": self.state_code,
            "state": self.state,
            "country_code": self.country_code,
            "status": self.status,
            "created": created,
            "updated": updated,
        }

    all_params_select = True
    select_required_params = ["id"]
    create_required_fields = ["id", "name", "postal_code", "country_code"]
    create_allowed_fields = [
        "ehr_id",
        "city",
        "county",
        "state_code",
        "state",
        "status",
    ]
    update_required_fields = ["id"]
    update_allowed_fields = [
        "name",
        "ehr_id",
        "postal_code",
        "city",
        "county",
        "state_code",
        "state",
        "country_code",
        "status",
    ]
