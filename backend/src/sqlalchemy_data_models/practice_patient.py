from sqlalchemy import String, Integer, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from . import ModelBase


class PracticePatient(ModelBase):
    __tablename__ = "practice_patients"

    id = mapped_column(Integer, primary_key=True)
    practice_id = mapped_column(Integer, ForeignKey("practices.id"))
    user_id = mapped_column(Integer, nullable=True)
    last_name = mapped_column(String(85), nullable=False)
    first_name = mapped_column(String(85), nullable=False)
    birthdate = mapped_column(Date, nullable=False)
    gender_birth = mapped_column(String(1), nullable=True)
    gender_identity = mapped_column(String(85), nullable=True)
    race = mapped_column(String(85), nullable=True)
    ethnicity = mapped_column(String(85), nullable=True)
    email = mapped_column(String(85), nullable=False, unique=True)
    cell_phone = mapped_column(String(12), nullable=True)
    postal_code = mapped_column(String(12), nullable=True)
    city = mapped_column(String(85), nullable=True)
    county = mapped_column(String(85), nullable=True)
    state = mapped_column(String(85), nullable=True)
    state_code = mapped_column(String(2), nullable=True)
    country_code = mapped_column(String(2), nullable=False, default="US")

    ehr_id = mapped_column(Integer, nullable=True)
    chart_id = mapped_column(String(85), nullable=True)
    date_first_appointment = created_at = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    status = mapped_column(String(8), nullable=False, default="Active")

    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    def to_dict(self):
        date_first_appt = self.date_first_appointment.strftime("%Y-%m-%d %H:%M")
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")

        return {
            "id": self.id,
            "practice_id": self.practice_id,
            "user_id": self.user_id,
            "last_name": self.last_name,
            "first_name": self.first_name,
            "birthdate": str(self.birthdate),
            "gender_birth": self.gender_birth,
            "gender_identity": self.gender_identity,
            "race": self.race,
            "ethnicity": self.ethnicity,
            "email": self.email,
            "cell_phone": self.cell_phone,
            "postal_code": self.postal_code,
            "city": self.city,
            "county": self.county,
            "state": self.state,
            "state_code": self.state_code,
            "country_code": self.country_code,
            "date_first_appointment": date_first_appt,
            "ehr_id": self.ehr_id,
            "chart_id": self.chart_id,
            "status": self.status,
            "created": created,
            "updated": updated,
        }

    all_params_select = True
    select_required_params = ["practice_id"]
    create_required_fields = [
        "practice_id",
        "last_name",
        "first_name",
        "birthdate",
    ]
    create_allowed_fields = [
        "user_id",
        "state",
        "email",
        "gender_birth",
        "gender_identity",
        "race",
        "ethnicity",
        "email",
        "cell_phone",
        "postal_code",
        "city",
        "county",
        "state_code",
        "state",
        "country_code",
        "ehr_id",
        "chart_id",
        "date_first_appointment",
        "status",
    ]

    update_required_fields = ["id"]
    update_allowed_fields = [
        "last_name",
        "first_name",
        "birthdate",
        "user_id",
        "state",
        "email",
        "gender_birth",
        "gender_identity",
        "race",
        "ethnicity",
        "email",
        "cell_phone",
        "postal_code",
        "city",
        "county",
        "state_code",
        "state",
        "country_code",
        "ehr_id",
        "chart_id",
        "date_first_appointment",
        "status",
    ]
    delete_required_fields = ["id"]
