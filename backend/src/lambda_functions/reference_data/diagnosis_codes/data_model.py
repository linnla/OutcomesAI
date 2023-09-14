from sqlalchemy import String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class DiagnosisCode(Base):
    __tablename__ = "diagnosis_codes"

    id = mapped_column(Integer, primary_key=True)
    classification_system = mapped_column(String(12), nullable=False)
    disorder_id = mapped_column(Integer, ForeignKey("disorders.id"), primary_key=False)
    code = mapped_column(String(35), nullable=False)
    description = mapped_column(String(255), nullable=False)
    status = mapped_column(String(8), nullable=False, default="Active")
    created_at = mapped_column(DateTime, nullable=False)
    updated_at = mapped_column(DateTime, nullable=False)

    # Define relationships
    disorder = relationship("Disorder", foreign_keys=[disorder_id])

    def to_dict(self):
        disorder = self.disorder.to_dict()
        created = self.created_at.strftime("%Y-%m-%d")
        updated = self.updated_at.strftime("%Y-%m-%d")

        return {
            "id": self.id,
            "classification_system": self.classification_system,
            "disorder_id": self.disorder_id,
            "disorder_name": disorder["name"],
            "code": self.code,
            "description": self.description,
            "status": self.status,
        }

    select_required_params = ["id"]
    create_required_fields = [
        "classification_system",
        "disorder_id",
        "code",
        "description",
    ]
    create_allowed_fields = ["status"]
    update_required_fields = ["id"]
    update_allowed_fields = [
        "classification_system",
        "disorder_id",
        "code",
        "description",
        "status",
    ]
    delete_required_fields = ["id"]


class Disorder(Base):
    __tablename__ = "disorders"

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
