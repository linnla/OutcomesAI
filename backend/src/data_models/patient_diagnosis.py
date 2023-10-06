from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from . import ModelBase
from .practice import Practice
from .patient import Patient
from .practitioner import Practitioner
from .office import Office
from .diagnosis_code import DiagnosisCode
from .patient_appointment import PatientAppointment


class PatientDiagnosis(ModelBase):
    __tablename__ = "patient_diagnosis"

    id = mapped_column(Integer, primary_key=True)
    practice_id = mapped_column(Integer, ForeignKey("practices.id"), nullable=False)
    patient_id = mapped_column(Integer, ForeignKey("patients.id"), nullable=False)
    practitioner_id = mapped_column(
        Integer, ForeignKey("practitioners.id"), nullable=False
    )
    office_id = mapped_column(Integer, ForeignKey("offices.id"), nullable=False)
    patient_appointment_id = mapped_column(
        Integer, ForeignKey("patient_appointments.id"), nullable=False
    )
    diagnosis_code_id = mapped_column(
        Integer, ForeignKey("diagnosis_codes.id"), nullable=False
    )

    code_order = mapped_column(Integer, nullable=False)

    year = mapped_column(Integer, nullable=True, default=None)
    month = mapped_column(Integer, nullable=True, default=None)
    day = mapped_column(Integer, nullable=True, default=None)
    day_of_week = mapped_column(Integer, nullable=True, default=None)
    quarter = mapped_column(Integer, nullable=True, default=None)

    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    # Define relationships
    practice = relationship(Practice, foreign_keys=[practice_id])
    patient = relationship(Patient, foreign_keys=[patient_id])
    practitioner = relationship(Practitioner, foreign_keys=[practitioner_id])
    office = relationship(Office, foreign_keys=[office_id])
    patient_appointment = relationship(
        PatientAppointment, foreign_keys=[patient_appointment_id]
    )
    diagnosis_code = relationship(DiagnosisCode, foreign_keys=[diagnosis_code_id])

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")

        practitioner = self.practitioner.to_dict()
        office = self.office.to_dict()
        diagnosis_code = self.office.to_dict()

        return {
            "practice_id": self.practice_id,
            "patient_id": self.patient_id,
            "practitioner_full_name": practitioner["full_name"],
            "office_name": office["name"],
            "diagnosis_code": diagnosis_code["description"],
            "primary": self.primary,
            "order": self.order,
            "year": self.year,
            "month": self.month,
            "day": self.day,
            "day_of_week": self.day_of_week,
            "quarter": self.quarter,
            "created": created,
            "updated": updated,
        }

    all_params_select = True
    select_required_params = ["practice_id", "patient_id"]
    create_required_fields = [
        "practice_id",
        "patient_id",
        "practitioner_id",
        "office_id",
        "patient_appointment_id",
        "diagnosis_code_id",
        "primary",
        "order",
    ]
    create_allowed_fields = [
        "year",
        "month",
        "day",
        "day_of_week",
        "quarter",
    ]
    update_required_fields = ["id"]
    update_allowed_fields = [
        "practitioner_id",
        "office_id",
        "patient_appointment_id",
        "diagnosis_code_id",
        "primary",
        "order",
        "year",
        "month",
        "day",
        "day_of_week",
        "quarter",
    ]
    delete_required_fields = ["id"]
