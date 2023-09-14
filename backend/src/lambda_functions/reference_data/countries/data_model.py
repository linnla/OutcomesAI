from sqlalchemy import Column, String, Integer, DateTime, Date, Boolean, Numeric, Float
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class Country(Base):
    __tablename__ = "countries"

    country_code = mapped_column(String(2), primary_key=True)
    country = mapped_column(String(105))

    def to_dict(self):
        return {
            "country_code": self.country_code,
            "country": self.country,
        }

    all_params_select = True
    select_required_params = [country_code]
