from sqlalchemy import String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from . import ModelBase
from .procedure_category import ProcedureCategory
from .tms_pulse_type import TMSPulseType
from .tms_stimulation_site import TMSStimulationSite
from .tms_frequency import TMSFrequency


class TMSProtocol(ModelBase):
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

    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    # Define relationships
    procedure_category = relationship(
        ProcedureCategory, foreign_keys=[procedure_category_id]
    )
    tms_pulse_type = relationship(TMSPulseType, foreign_keys=[pulse_type_id])
    tms_stimulation_site = relationship(
        TMSStimulationSite, foreign_keys=[stimulation_site_id]
    )
    tms_frequency = relationship(TMSFrequency, foreign_keys=[frequency_id])

    def to_dict(self):
        procedure_category = self.procedure_category.to_dict()
        tms_pulse_type = self.tms_pulse_type.to_dict()
        tms_stimulation_site = self.tms_stimulation_site.to_dict()
        tms_frequency = self.tms_frequency.to_dict()
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")

        return {
            "id": self.id,
            "name": self.name,
            "procedure_category_id": self.procedure_category_id,
            "procedure_category_name": procedure_category["name"],
            "pulse_type_id": self.pulse_type_id,
            "pulse_type_name": tms_pulse_type["name"],
            "stimulation_site_id": self.stimulation_site_id,
            "stimulation_site_name": tms_stimulation_site["name"],
            "frequency_id": self.frequency_id,
            "frequency_name": tms_frequency["name"],
            "train_time": self.train_time,
            "inter_train_time": self.inter_train_time,
            "status": self.status,
            "created": created,
            "updated": updated,
        }

    select_required_params = []
    create_required_fields = [
        "name",
        "procedure_category_id",
        "pulse_type_id",
        "stimulation_site_id",
        "frequency_id",
        "train_time",
        "inter_train_time",
        "status",
    ]
    create_allowed_fields = []
    update_required_fields = [
        "id",
        "name",
        "procedure_category_id",
        "pulse_type_id",
        "stimulation_site_id",
        "frequency_id",
        "train_time",
        "inter_train_time",
        "status",
    ]
    update_allowed_fields = []
    delete_required_fields = ["id"]
