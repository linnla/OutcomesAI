from sqlalchemy import String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class ProcedureCode(Base):
    __tablename__ = "procedure_codes"

    id = mapped_column(Integer, primary_key=True)
    source = mapped_column(String(55), nullable=False)
    procedure_category_id = mapped_column(
        Integer, ForeignKey("procedure_categories.id"), primary_key=False
    )
    code = mapped_column(String(25), nullable=False)
    description = mapped_column(String(255), nullable=False)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    # Define relationships
    procedure_category = relationship(
        "ProcedureCategory", foreign_keys=[procedure_category_id]
    )

    def to_dict(self):
        procedure_category = self.procedure_category.to_dict()
        created = self.created_at.strftime("%Y-%m-%d")
        updated = self.updated_at.strftime("%Y-%m-%d")

        return {
            "id": self.id,
            "source": self.source,
            "procedure_category_id": self.procedure_category_id,
            "procedure_category_name": procedure_category["name"],
            "code": self.code,
            "description": self.description,
            "status": self.status,
        }

    select_required_params = ["id"]
    create_required_fields = ["source", "proicedure_category_id", "code", "description"]
    create_allowed_fields = ["status"]
    update_required_fields = ["id"]
    update_allowed_fields = [
        "source",
        "procedure_category_id",
        "code",
        "description",
        "status",
    ]
    delete_required_fields = ["id"]


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
