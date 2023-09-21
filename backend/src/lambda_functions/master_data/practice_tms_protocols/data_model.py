from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class PracticeTMSProtocol(Base):
    __tablename__ = "practice_tms_protocols"

    practice_id = mapped_column(Integer, ForeignKey("practices.id"), primary_key=True)
    tms_protocol_id = mapped_column(
        Integer, ForeignKey("tms_protocols.id"), primary_key=True
    )
    created_at = Column(DateTime(timezone=True), nullable=False)
    updated_at = Column(DateTime(timezone=True), nullable=False)

    # Define relationships
    practice = relationship("Practice", foreign_keys=[practice_id])
    tms_protocol = relationship("TMSProtocol", foreign_keys=[tms_protocol_id])

    def to_dict(self):
        practice = self.practice.to_dict()
        tms_protocol = self.tms_protocol.to_dict()
        created = self.created_at.strftime("%Y-%m-%d")
        updated = self.updated_at.strftime("%Y-%m-%d")

        return {
            "practice_id": self.practice_id,
            "tms_protocol_id": self.tms_protocol_id,
            "tms_protocol_name": tms_protocol["name"],
            "pulse_type_name": tms_protocol["pulse_type_name"],
            "stimulation_site_name": tms_protocol["stimulation_site_name"],
            "frequency_name": tms_protocol["frequency_name"],
            "train_time": tms_protocol["train_time"],
            "inter_train_time": tms_protocol["inter_train_time"],
            "status": tms_protocol["status"],
        }

    all_params_select = False
    select_required_params = ["practice_id"]
    select_filters = []
    create_required_fields = ["practice_id", "tms_protocol_id"]
    create_allowed_fields = []
    update_required_fields = ["practice_id", "tms_protocol_id"]
    update_allowed_fields = []
    delete_required_fields = ["practice_id", "tms_protocol_id"]


class Practice(Base):
    __tablename__ = "practices"

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(85), nullable=False)
    postal_code = mapped_column(String(10), nullable=False)
    city = mapped_column(String(85), nullable=False)
    county = mapped_column(String(85), nullable=False)
    state_code = mapped_column(String(2), nullable=False)
    state = mapped_column(String(85))
    country_code = mapped_column(String(2), nullable=False)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "postal_code": self.postal_code,
            "city": self.city,
            "county": self.county,
            "state_code": self.state_code,
            "state": self.state,
            "country_code": self.country_code,
            "status": self.status,
        }


class TMSProtocol(Base):
    __tablename__ = "tms_protocols"

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(75), nullable=False)

    procedure_category_id = mapped_column(
        Integer,
        ForeignKey("procedure_categories.id"),
        primary_key=False,
        nullable=False,
    )
    pulse_type_id = mapped_column(
        Integer, ForeignKey("tms_pulse_types.id"), primary_key=False, nullable=False
    )
    stimulation_site_id = mapped_column(
        Integer,
        ForeignKey("tms_stimulation_sites.id"),
        primary_key=False,
        nullable=False,
    )
    frequency_id = mapped_column(
        Integer, ForeignKey("tms_frequencies.id"), primary_key=False, nullable=False
    )

    status = mapped_column(String(8), nullable=False, default="Active")
    train_time = mapped_column(Integer, nullable=False)
    inter_train_time = mapped_column(Integer, nullable=False)

    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    # Define relationships
    procedure_category = relationship(
        "ProcedureCategory", foreign_keys=[procedure_category_id]
    )
    tms_pulse_type = relationship("TMSPulseType", foreign_keys=[pulse_type_id])
    tms_stimulation_site = relationship(
        "TMSStimulationSite", foreign_keys=[stimulation_site_id]
    )
    tms_frequency = relationship("TMSFrequency", foreign_keys=[frequency_id])

    def to_dict(self):
        id = self.id
        procedure_category_id = self.procedure_category_id
        pulse_type_id = self.pulse_type_id
        stimulation_site_id = self.stimulation_site_id
        frequency_id = self.frequency_id
        train_time = self.train_time
        inter_train_time = self.inter_train_time
        status = self.status

        procedure_category = self.procedure_category.to_dict()
        tms_pulse_type = self.tms_pulse_type.to_dict()
        tms_stimulation_site = self.tms_stimulation_site.to_dict()
        tms_frequency = self.tms_frequency.to_dict()

        created = self.created_at.strftime("%Y-%m-%d")
        updated = self.updated_at.strftime("%Y-%m-%d")

        return {
            "id": self.id,
            "name": self.name,
            "procedure_category_id": self.procedure_category_id,
            "pulse_type_id": self.pulse_type_id,
            "pulse_type_name": tms_pulse_type["name"],
            "stimulation_site_id": self.stimulation_site_id,
            "stimulation_site_name": tms_stimulation_site["name"],
            "frequency_id": self.frequency_id,
            "frequency_name": tms_frequency["name"],
            "train_time": self.train_time,
            "inter_train_time": self.inter_train_time,
            "status": self.status,
        }


class ProcedureCategory(Base):
    __tablename__ = "procedure_categories"

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(75), nullable=False)
    description = mapped_column(String(255), nullable=False)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "status": self.status,
        }


class TMSPulseType(Base):
    __tablename__ = "tms_pulse_types"

    id = mapped_column(Integer, primary_key=True)
    acronym = mapped_column(String(15), nullable=False)
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


class TMSFrequency(Base):
    __tablename__ = "tms_frequencies"

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(75), nullable=False)
    description = mapped_column(String(255), nullable=False)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "status": self.status,
        }
