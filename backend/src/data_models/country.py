from sqlalchemy import String
from sqlalchemy.orm import mapped_column
from . import ModelBase


class Country(ModelBase):
    __tablename__ = "countries"

    country_code = mapped_column(String(2), primary_key=True)
    country = mapped_column(String(105))

    def to_dict(self):
        return {
            "country_code": self.country_code,
            "country": self.country,
        }

    all_params_select = True
    select_required_params = ["country_code"]
