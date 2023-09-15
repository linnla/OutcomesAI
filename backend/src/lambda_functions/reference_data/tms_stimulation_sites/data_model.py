from sqlalchemy import String, Integer, DateTime
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class TMSStimulationSite(Base):
    __tablename__ = "tms_stimulation_sites"

    id = mapped_column(Integer, primary_key=True)
    acronym = mapped_column(String(12), nullable=False)
    name = mapped_column(String(75), nullable=False)
    description = mapped_column(String(255), nullable=False)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "acronym": self.acronym,
            "name": self.name,
            "description": self.description,
            "status": self.status,
        }

    create_required_fields = ["acronym", "name", "description"]
    create_allowed_fields = []
    update_required_fields = ["id"]
    update_allowed_fields = ["acronym", "name", "description", "status"]
    delete_required_fields = ["id"]
