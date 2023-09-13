from sqlalchemy import Column, String, Integer, DateTime, Date, Boolean, Numeric
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class PostalCode(Base):
    __tablename__ = "postal_codes"

    postal_code = mapped_column(String(5), primary_key=True)
    postal_code_type = mapped_column(String(35))
    city = mapped_column(String(55))
    state_code = mapped_column(String(2))
    county = mapped_column(String(55))
    time_zone = mapped_column(String(55))
    country = mapped_column(String(105))
    country_code = mapped_column(String(2))
    latitude = mapped_column(Numeric(precision=10, scale=8))
    longitude = mapped_column(Numeric(precision=11, scale=8))
    state = mapped_column(String(55))
    irs_estimated_population = mapped_column(Integer)

    def to_dict(self):
        return {
            "postal_code": self.postal_code,
            "postal_code_type": self.postal_code_type,
            "city": self.city,
            "state_code": self.state_code,
            "state": self.state,
            "county": self.county,
            "time_zone": self.time_zone,
            "country": self.country,
            "country_code": self.country_code,
            "latitude": float(self.latitude),
            "longitude": float(self.longitude),
            "irs_estimated_population": self.irs_estimated_population,
        }

    all_params_select = True
    select_required_params = ["postal_code"]
