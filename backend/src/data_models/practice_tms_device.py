from sqlalchemy import Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from . import ModelBase
from .practice import Practice
from .office import Office
from .tms_device import TMSDevice
from .tms_coil import TMSCoil


class PracticeTMSDevice(ModelBase):
    __tablename__ = "practice_tms_devices"

    practice_id = mapped_column(Integer, ForeignKey("practices.id"), primary_key=True)
    office_id = mapped_column(Integer, ForeignKey("offices.id"), primary_key=True)
    tms_device_id = mapped_column(
        Integer, ForeignKey("tms_devices.id"), primary_key=True
    )
    tms_coil_id = mapped_column(Integer, ForeignKey("tms_coils.id"), primary_key=True)
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    # Define relationships
    practice = relationship(Practice, foreign_keys=[practice_id])
    office = relationship(Office, foreign_keys=[office_id])
    tms_device = relationship(TMSDevice, foreign_keys=[tms_device_id])
    tms_coil = relationship(TMSCoil, foreign_keys=[tms_coil_id])

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")
        practice = self.practice.to_dict()
        office = self.office.to_dict()
        tms_device = self.tms_device.to_dict()
        tms_coil = self.tms_coil.to_dict()

        return {
            "practice_id": self.practice_id,
            "office_id": self.office_id,
            "office_name": office["name"],
            "device_id": self.tms_device_id,
            "device_mfg": tms_device["manufacturer"],
            "device_name": tms_device["name"],
            "device_status": tms_device["status"],
            "coil_id": self.tms_coil_id,
            "coil_mfg": tms_coil["manufacturer"],
            "coil_name": tms_coil["name"],
            "coil_status": tms_coil["status"],
            "created": created,
            "updated": updated,
        }

    all_params_select = True
    select_required_params = ["practice_id"]
    create_required_fields = [
        "practice_id",
        "office_id",
        "tms_device_id",
        "tms_coil_id",
    ]
    create_allowed_fields = []
    update_required_fields = [
        "practice_id",
        "office_id",
        "tms_device_id",
        "tms_coil_id",
    ]
    update_allowed_fields = []
    delete_required_fields = [
        "practice_id",
        "office_id",
        "tms_device_id",
        "tms_coil_id",
    ]
