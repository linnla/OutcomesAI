from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from . import ModelBase
from .practice import Practice
from .patient import Patient
from .practitioner import Practitioner
from .office import Office
from .patient_diagnosis import PatientDiagnosis


class PatientAppointment(ModelBase):
    __tablename__ = "patient_appointments"

    id = mapped_column(Integer, primary_key=True)
    ehr_id = mapped_column(Integer, nullable=False)
    scheduled_time = mapped_column(DateTime(timezone=True), nullable=False)
    deleted_flag = mapped_column(Boolean, nullable=False)
    status = mapped_column(String(85), nullable=False)
    reason = mapped_column(Text, nullable=True, default=None)

    practice_id = mapped_column(Integer, ForeignKey("practices.id"), nullable=False)
    ehr_patient_id = mapped_column(Integer, nullable=False)
    patient_id = mapped_column(Integer, ForeignKey("patients.id"), nullable=False)

    ehr_supervising_practitioner_id = mapped_column(
        Integer, nullable=True, default=None
    )
    supervising_practitioner_id = mapped_column(
        Integer, ForeignKey("practitioners.id"), nullable=True
    )
    ehr_billing_practitioner_id = mapped_column(Integer, nullable=True, default=None)
    billing_practitioner_id = mapped_column(
        Integer, ForeignKey("practitioners.id"), nullable=True
    )
    ehr_practitioner_id = mapped_column(Integer, nullable=False)
    practitioner_id = mapped_column(
        Integer, ForeignKey("practitioners.id"), nullable=True
    )

    ehr_office_id = mapped_column(Integer, nullable=False)
    office_id = mapped_column(
        Integer, ForeignKey("offices.id"), nullable=True, default=None
    )

    icd10_codes = mapped_column(ARRAY(String), nullable=True)
    is_telehealth = mapped_column(Boolean, nullable=True, default=False)
    exam_room = mapped_column(Integer, nullable=True, default=None)
    duration = mapped_column(Integer, nullable=True, default=None)
    payment_profile = mapped_column(String(85), nullable=True, default=None)
    primary_insurer_name = mapped_column(String(85), nullable=True, default=None)
    primary_insurer_id = mapped_column(String(85), nullable=True, default=None)
    first_billed_date = mapped_column(DateTime(timezone=True), nullable=False)
    billing_status = mapped_column(String(85), nullable=True, default=None)
    create_date = mapped_column(DateTime(timezone=True), nullable=False)
    update_date = mapped_column(DateTime(timezone=True), nullable=False)

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
    billing_practitioner = relationship(
        Practitioner, foreign_keys=[billing_practitioner_id]
    )
    supervising_practitioner = relationship(
        Practitioner, foreign_keys=[supervising_practitioner_id]
    )
    office = relationship(Office, foreign_keys=[office_id])

    # Define the one-to-many relationship with PatientDiagnosis
    patient_diagnosis = relationship(
        "PatientDiagnosis",  # Name of the related model
        backref="appointment",  # Name of the reverse relationship in PatientDiagnosis
        lazy="dynamic",  # Specify the loading strategy (you can change this)
    )

    def to_dict(self):
        # Filter out appointments that are marked for deletion
        if self.deleted_flag:
            return None

        # Filter out cancelled, no shows and rescheduled appointments
        if self.status in ["Cancelled", "No Show", "Rescheduled"]:
            return None

        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")

        full_name = ""
        if self.practitioner_id:
            practitioner = self.practitioner.to_dict()
            full_name = practitioner["full_name"]
        if self.billing_practitioner_id:
            billing_practitioner = self.billing_practitioner.to_dict()
            billing_full_name = billing_practitioner["full_name"]
        if self.supervising_practitioner_id:
            supervising_practitioner = self.billing_practitioner.to_dict()
            supervising_full_name = supervising_practitioner["full_name"]

            # Include diagnosis information by querying for associated PatientDiagnosis records

        diagnosis = []
        for patient_diagnosis in self.patient_diagnoses:
            diagnosis.append(
                {
                    "diagnosis_id": patient_diagnosis.id,
                    "diagnosis_description": patient_diagnosis.description,
                    # Add other diagnosis attributes you want to include
                }
            )

        return {
            "practice_id": self.practice_id,
            "patient_id": self.patient_id,
            "practitioner_full_name": full_name,
            "billing_practitioner_full_name": billing_full_name,
            "supervising_practitioner_full_name": supervising_full_name,
            "create_date": str(self.create_date),
            "scheduled_time": str(self.scheduled_time),
            "duration": self.duration,
            "is_telehealth": self.is_telehealth,
            "diagnoses": diagnosis_info,
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
        "ehr_id",
        "scheduled_time",
        "deleted_flag",
        "status",
        "practice_id",
        "ehr_patient_id",
        "patient_id",
        "ehr_practitioner_id",
        "ehr_office_id",
        "create_date",
        "update_date",
    ]
    create_allowed_fields = [
        "reason",
        "ehr_supervising_practitioner_id",
        "supervising_practitioner_id",
        "ehr_billing_practitioner_id",
        "billing_practitioner_id",
        "practitioner_id",
        "office_id",
        "is_telehealth",
        "exam_room",
        "duration",
        "payment_profile",
        "primary_insurer_name",
        "primary_insurer_id",
        "first_billed_date",
        "billing_status",
        "year",
        "month",
        "day",
        "day_of_week",
        "quarter",
    ]
    update_required_fields = ["id"]
    update_allowed_fields = [
        "scheduled_time",
        "deleted_flag",
        "status",
        "ehr_practitioner_id",
        "ehr_office_id",
        "update_date",
        "reason",
        "ehr_supervising_practitioner_id",
        "supervising_practitioner_id",
        "ehr_billing_practitioner_id",
        "billing_practitioner_id",
        "practitioner_id",
        "office_id",
        "is_telehealth",
        "exam_room",
        "duration",
        "payment_profile",
        "primary_insurer_name",
        "primary_insurer_id",
        "first_billed_date",
        "billing_status",
        "year",
        "month",
        "day",
        "day_of_week",
        "quarter",
    ]
    delete_required_fields = ["id"]
