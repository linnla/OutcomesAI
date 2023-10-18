from sqlalchemy import String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import mapped_column, relationship
from . import ModelBase
from .administration_route import AdministrationRoute
from .active_ingredient import ActiveIngredient
from .acquisition_source import AcquisitionSource
from .dosage_form import DosageForm
from .dosage_unit import DosageUnit


class Medication(ModelBase):
    __tablename__ = "medications"

    id = mapped_column(Integer, primary_key=True)
    generic_name = mapped_column(String(75), nullable=False)
    brand_name = mapped_column(String(75), nullable=False)
    administration_routes_id = mapped_column(
        Integer,
        ForeignKey("administration_routes.id"),
        primary_key=False,
        nullable=False,
    )
    active_ingredients_id = mapped_column(
        Integer, ForeignKey("active_ingredients.id"), primary_key=False, nullable=False
    )
    acquisition_sources_id = mapped_column(
        Integer,
        ForeignKey("acquisition_sources.id"),
        primary_key=False,
        nullable=False,
    )
    dosage_forms_id = mapped_column(
        Integer, ForeignKey("dosage_forms.id"), primary_key=False, nullable=False
    )
    dosage_units_id = mapped_column(
        Integer, ForeignKey("dosage_units.id"), primary_key=False, nullable=False
    )
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), nullable=False)

    # Define relationships
    administration_route = relationship(
        AdministrationRoute, foreign_keys=[administration_routes_id]
    )
    active_ingredient = relationship(
        ActiveIngredient, foreign_keys=[active_ingredients_id]
    )
    acquisition_source = relationship(
        AcquisitionSource, foreign_keys=[acquisition_sources_id]
    )
    dosage_form = relationship(DosageForm, foreign_keys=[dosage_forms_id])
    dosage_unit = relationship(DosageUnit, foreign_keys=[dosage_units_id])

    def to_dict(self):
        created = self.created_at.strftime("%Y-%m-%d %H:%M")
        updated = self.updated_at.strftime("%Y-%m-%d %H:%M")

        return {
            "id": self.id,
            "status": self.status,
            "created": created,
            "updated": updated,
        }

    select_required_params = []
    create_required_fields = []
    create_allowed_fields = []
    update_required_fields = [
        "id",
    ]
    update_allowed_fields = []
    delete_required_fields = ["id"]
