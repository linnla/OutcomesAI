from sqlalchemy import String, Integer, DateTime, Date, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from . import ModelBase
from .practice import Practice
from .patient import Patient
from .practitioner import Practitioner
from .ehr_vendor import EHRVendor


class PatientMedication(ModelBase):
    __tablename__ = "patient_medications"

    id = mapped_column(Integer, primary_key=True)
    patient_id = mapped_column(Integer, ForeignKey("patients.id"), nullable=False)
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
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    # Define relationships
    practice = relationship(Practice, foreign_keys=[practice_id])
    patient = relationship(Patient, foreign_keys=[patient_id])
    practitioner = relationship(Practitioner, foreign_keys=[practitioner_id])
    ehr_vendor = relationship(EHRVendor, foreign_keys=[ehr_vendor_id])

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")
        practitioner = self.practitioner.to_dict()
        ehr_vendor = self.ehr_vendor.to_dict()
        full_name = ""
        if self.prefix and self.prefix.strip() != "":
            full_name += self.prefix + " "

        full_name += f"{self.first_name} {self.last_name}"

        if self.suffix and self.suffix.strip() != "":
            full_name += ", " + self.suffix

        return {
            "practice_id": self.practice_id,
            "patient_id": self.patient_id,
            "practitioner_full_name": full_name,
            "practitioner_last_name": practitioner["last_name"],
            "practitioner_first_name": practitioner["first_name"],
            "ehr_vendor_name": ehr_vendor["name"],
            "date_prescribed": self.date_prescribed,
            "date_stopped_taking": self.date_stopped_taking,
            "number_refills": self.number_refills,
            "dispense_quantity": self.dispense_quantity,
            "signature_note": self.signature_note,
            "name": self.name,
            "created": created,
            "updated": updated,
        }

    all_params_select = True
    select_required_params = ["practice_id", "patient_id"]
    create_required_fields = ["practice_id", "patient_id", "name"]
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
    ]
    update_required_fields = ["id"]
    update_allowed_fields = ["ehr_id", "chart_id", "status"]
    delete_required_fields = ["id"]
