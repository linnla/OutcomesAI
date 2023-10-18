from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from . import ModelBase
from .practice import Practice
from .tms_protocol import TMSProtocol


class PracticeTMSProtocol(ModelBase):
    __tablename__ = "practice_tms_protocols"

    practice_id = mapped_column(Integer, ForeignKey("practices.id"), primary_key=True)
    tms_protocol_id = mapped_column(
        Integer, ForeignKey("tms_protocols.id"), primary_key=True
    )
    created_at = Column(DateTime(timezone=True), nullable=False)
    updated_at = Column(DateTime(timezone=True), nullable=False)

    # Define relationships
    practice = relationship(Practice, foreign_keys=[practice_id])
    tms_protocol = relationship(TMSProtocol, foreign_keys=[tms_protocol_id])

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")
        practice = self.practice.to_dict()
        tms_protocol = self.tms_protocol.to_dict()

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
            "created": created,
            "updated": updated,
        }

    all_params_select = False
    select_required_params = ["practice_id"]
    select_filters = []
    create_required_fields = ["practice_id", "tms_protocol_id"]
    create_allowed_fields = []
    update_required_fields = ["practice_id", "tms_protocol_id"]
    update_allowed_fields = []
    delete_required_fields = ["practice_id", "tms_protocol_id"]
