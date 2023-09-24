from data_models.episode_of_care_diagnosis_codes import EpisodeOfCareDiagnosisCode
from lambda_libs.database_crud import select, create, update, delete
from json import dumps
import logging

# Setup Logging
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s.%(msecs)03d %(levelname)s %(module)s - %(funcName)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger()


entity_class = EpisodeOfCareDiagnosisCode


def lambda_handler(event, context):
    print(event)
