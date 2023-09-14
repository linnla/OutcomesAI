from sqlalchemy import Column, String, Integer, Numeric
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class PostalCodeUS(Base):
    __tablename__ = "postal_codes"

    postal_code = Column(String(5), primary_key=True)
    postal_code_type = Column(String(35))
    city = Column(String(55))
    state_code = Column(String(2))
    county = Column(String(55))
    time_zone = Column(String(55))
    country = Column(String(105))
    country_code = Column(String(2))
    latitude = Column(Numeric(precision=10, scale=8))
    longitude = Column(Numeric(precision=11, scale=8))
    state = Column(String(55))
    irs_estimated_population = Column(Integer)
