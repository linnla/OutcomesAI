from sqlalchemy import String, Integer, DateTime, Boolean
from sqlalchemy.orm import mapped_column
from . import ModelBase


class Office(ModelBase):
    __tablename__ = "offices"

    id = mapped_column(Integer, primary_key=True)
    ehr_id = mapped_column(Integer, nullable=True)
    practice_id = mapped_column(Integer, nullable=False)
    name = mapped_column(String(85), nullable=False)
    virtual = mapped_column(Boolean, nullable=False)
    postal_code = mapped_column(String(10), nullable=True)
    city = mapped_column(String(85), nullable=True)
    state = mapped_column(String(85), nullable=True)
    county = mapped_column(String(85), nullable=True)
    state_code = mapped_column(String(2), nullable=True)
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
            "practice_id": self.practice_id,
            "name": self.name,
            "virtual": self.virtual,
            "postal_code": self.postal_code,
            "city": self.city,
            "state": self.state,
            "state_code": self.state_code,
            "county": self.county,
            "country_code": self.country_code,
            "status": self.status,
            "created": created,
            "updated": updated,
        }

    all_params_select = False
    select_required_params = ["id", "practice_id"]
    create_required_fields = [
        "practice_id",
        "name",
        "virtual",
    ]
    create_allowed_fields = [
        "ehr_id",
        "postal_code",
        "city",
        "state",
        "state_code",
        "county",
        "country_code",
    ]
    update_required_fields = ["id"]
    update_allowed_fields = [
        "ehr_id",
        "name",
        "virtual",
        "postal_code",
        "city",
        "state",
        "state_code",
        "county",
        "country_code",
        "status",
    ]
    delete_required_fields = ["id"]
