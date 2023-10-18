from sqlalchemy import String, Integer, DateTime, Date, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from . import ModelBase
from .practice import Practice
from .practice_patient import PracticePatient
from .practitioner import Practitioner
from .ehr_vendor import EHRVendor


class PatientMedication(ModelBase):
    __tablename__ = "patient_medications"

    id = mapped_column(Integer, primary_key=True)
    practice_patient_id = mapped_column(
        Integer, ForeignKey("practice_patients.id"), nullable=False
    )
    practice_id = mapped_column(Integer, ForeignKey("practices.id"), nullable=False)
    practitioner_id = mapped_column(
        Integer, ForeignKey("practitioners.id"), nullable=True
    )
    ehr_vendor_id = mapped_column(
        Integer, ForeignKey("ehr_vendors.id"), nullable=True, default=None
    )
    ehr_id = mapped_column(Integer, nullable=True, default=None)
    ehr_practitioner_id = mapped_column(Integer, nullable=True, default=None)
    ehr_patient_id = mapped_column(Integer, nullable=True, default=None)
    ehr_appointment_id = mapped_column(Integer, nullable=True, default=None)
    date_prescribed = mapped_column(Date, nullable=True, default=None)
    date_started_taking = mapped_column(Date, nullable=True, default=None)
    date_stopped_taking = mapped_column(Date, nullable=True, default=None)
    notes = mapped_column(Text, nullable=True, default=None)
    order_status = mapped_column(String(85), nullable=True, default=None)
    number_refills = mapped_column(Integer, nullable=True, default=None)
    dispense_quantity = mapped_column(Integer, nullable=True, default=None)
    dosage_quantity = mapped_column(Integer, nullable=True, default=None)
    dosage_units = mapped_column(String(85), nullable=True, default=None)
    rxnorm = mapped_column(String(85), nullable=True, default=None)
    route = mapped_column(String(85), nullable=True, default=None)
    frequency = mapped_column(String(85), nullable=True, default=None)
    prn = mapped_column(Boolean, nullable=True, default=False)
    indication = mapped_column(String(85), nullable=True, default=None)
    signature_note = mapped_column(String(85), nullable=True, default=None)
    pharmacy_note = mapped_column(String(85), nullable=True, default=None)
    name = mapped_column(String(85), nullable=False)
    status = mapped_column(String(85), nullable=True, default=None)
    daw = mapped_column(Boolean, nullable=True, default=False)
    ndc = mapped_column(String(85), nullable=True, default=None)

    year = mapped_column(Integer, nullable=True, default=None)
    month = mapped_column(Integer, nullable=True, default=None)
    day = mapped_column(Integer, nullable=True, default=None)
    day_of_week = mapped_column(Integer, nullable=True, default=None)
    quarter = mapped_column(Integer, nullable=True, default=None)

    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    # Define relationships
    practice = relationship(Practice, foreign_keys=[practice_id])
    practice_patient = relationship(PracticePatient, foreign_keys=[practice_patient_id])
    practitioner = relationship(Practitioner, foreign_keys=[practitioner_id])
    ehr_vendor = relationship(EHRVendor, foreign_keys=[ehr_vendor_id])

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")

        full_name = ""
        if self.practitioner_id:
            practitioner = self.practitioner.to_dict()
            full_name = practitioner["full_name"]

        return {
            "practice_id": self.practice_id,
            "practice_patient_id": self.practice_patient_id,
            "practitioner_full_name": full_name,
            "date_prescribed": str(self.date_prescribed),
            "date_stopped_taking": str(self.date_stopped_taking),
            "number_refills": self.number_refills,
            "dispense_quantity": self.dispense_quantity,
            "signature_note": self.signature_note,
            "name": self.name,
            "year": self.year,
            "month": self.month,
            "day": self.day,
            "day_of_week": self.day_of_week,
            "quarter": self.quarter,
            "created": created,
            "updated": updated,
        }

    all_params_select = True
    select_required_params = ["practice_id", "practice_patient_id"]
    create_required_fields = ["practice_id", "practice_patient_id", "name"]
    create_allowed_fields = [
        "practitioner_id",
        "ehr_vendor_id",
        "ehr_id",
        "ehr_practitioner_id",
        "ehr_patient_id",
        "ehr_appointment_id",
        "date_prescribed",
        "date_started_taking",
        "date_stopped_taking",
        "notes",
        "order_status",
        "number_refills",
        "dispense_quantity",
        "dosage_quantity",
        "dosage_units",
        "rxnorm",
        "route",
        "frequency",
        "prn",
        "indication",
        "signature_note",
        "pharmacy_note",
        "status",
        "daw",
        "ndc",
        "year",
        "month",
        "day",
        "day_of_week",
        "quarter",
    ]
    update_required_fields = ["id"]
    update_allowed_fields = [
        "practitioner_id",
        "ehr_vendor_id",
        "ehr_id",
        "ehr_practitioner_id",
        "ehr_patient_id",
        "ehr_appointment_id",
        "date_prescribed",
        "date_started_taking",
        "date_stopped_taking",
        "notes",
        "order_status",
        "number_refills",
        "dispense_quantity",
        "dosage_quantity",
        "dosage_units",
        "rxnorm",
        "route",
        "frequency",
        "prn",
        "indication",
        "signature_note",
        "pharmacy_note",
        "status",
        "daw",
        "ndc",
        "year",
        "month",
        "day",
        "day_of_week",
        "quarter",
    ]
    delete_required_fields = ["id"]
