from sqlalchemy import String, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class PracticeTMSDevice(Base):
    __tablename__ = "practice_tms_devices"

    practice_id = mapped_column(Integer, ForeignKey("practices.id"), primary_key=True)
    office_id = mapped_column(Integer, ForeignKey("offices.id"), primary_key=True)
    tms_device_id = mapped_column(
        Integer, ForeignKey("tms_devices.id"), primary_key=True
    )
    tms_coil_id = mapped_column(Integer, ForeignKey("tms_coils.id"), primary_key=True)
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    # Define relationships
    practice = relationship("Practice", foreign_keys=[practice_id])
    office = relationship("Office", foreign_keys=[office_id])
    tms_device = relationship("TMSDevice", foreign_keys=[tms_device_id])
    tms_coil = relationship("TMSCoil", foreign_keys=[tms_coil_id])

    def to_dict(self):
        practice = self.practice.to_dict()
        office = self.office.to_dict()
        tms_device = self.tms_device.to_dict()
        tms_coil = self.tms_coil.to_dict()
        created = self.created_at.strftime("%Y-%m-%d")
        updated = self.updated_at.strftime("%Y-%m-%d")

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
        }

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


class Office(Base):
    __tablename__ = "offices"

    id = mapped_column(Integer, primary_key=True)
    practice_id = mapped_column(Integer, nullable=False)
    name = mapped_column(String(85), nullable=False)
    virtual = mapped_column(Boolean, nullable=False)
    postal_code = mapped_column(String(10))
    city = mapped_column(String(85))
    state = mapped_column(String(85))
    county = mapped_column(String(85))
    state_code = mapped_column(String(2), nullable=False)
    country_code = mapped_column(String(2), nullable=False, default="US")
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")

        return {
            "id": self.id,
            "practice_id": self.practice_id,
            "name": self.name,
            "virtual": self.virtual,
            "postal_code": self.postal_code,
            "city": self.city,
            "state": self.state,
            "state_code": self.state_code,
            "county": self.county,
            "country_code": self.country_code,
            "status": self.status,
            "created": created,
            "updated": updated,
        }


class TMSDevice(Base):
    __tablename__ = "tms_devices"

    id = mapped_column(Integer, primary_key=True)
    manufacturer = mapped_column(String(55), nullable=False)
    model_number = mapped_column(String(55), nullable=True)
    name = mapped_column(String(75), nullable=False)
    year = mapped_column(Integer, nullable=True)
    description = mapped_column(String(255), nullable=True)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "manufacturer": self.manufacturer,
            "model_number": self.model_number,
            "name": self.name,
            "description": self.description,
            "status": self.status,
        }


class TMSCoil(Base):
    __tablename__ = "tms_coils"

    id = mapped_column(Integer, primary_key=True)
    manufacturer = mapped_column(String(55), nullable=False)
    model_number = mapped_column(String(55), nullable=True)
    name = mapped_column(String(75), nullable=False)
    year = mapped_column(Integer, nullable=True)
    status = mapped_column(String(8), nullable=False, default="Active")
    description = mapped_column(String(255), nullable=True)
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "manufacturer": self.manufacturer,
            "model_number": self.model_number,
            "name": self.name,
            "description": self.description,
            "status": self.status,
        }
