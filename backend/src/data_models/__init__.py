# data_models/__init__.py

from sqlalchemy.ext.declarative import declarative_base

# Create a common base for your models
ModelBase = declarative_base()

from .acquisition_source import AcquisitionSource
from .active_ingredient import ActiveIngredient
from .administration_route import AdministrationRoute
from .appointment_type import AppointmentType
from .biomarker_type import BiomarkerType
from .biomarker import Biomarker
from .country import Country
from .diagnosis_code import DiagnosisCode
from .disorder import Disorder
from .dosage_form import DosageForm
from .dosage_unit import DosageUnit
from .episode_of_care import EpisodeOfCare
from .episode_of_care_diagnosis_codes import EpisodeOfCareDiagnosisCode
from .integration_type import IntegrationType
from .integration_vendor import IntegrationVendor
from .medication_type import MedicationType
from .office import Office
from .patient_biomarker import PatientBiomarker
from .patient import Patient
from .postal_code import PostalCode
from .practice_integration import PracticeIntegration
from .practice_medication import PracticeMedications
from .practice_patient import PracticePatient
from .practice_practitioner import PracticePractitioner
from .practice_tms_device import PracticeTMSDevice
from .practice_tms_protocol import PracticeTMSProtocol
from .practice_user import PracticeUser
from .practice import Practice
from .practitioner import Practitioner
from .procedure_category import ProcedureCategory
from .procedure_code import ProcedureCode
from .role import Role
from .tms_coil import TMSCoil
from .tms_device import TMSDevice
from .tms_frequency import TMSFrequency
from .tms_protocol import TMSProtocol
from .tms_pulse_type import TMSPulseType
from .tms_stimulation_site import TMSStimulationSite
from .user import User
