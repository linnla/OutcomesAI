from sqlalchemy_data_models.diagnosis_code import DiagnosisCode
from backend.src.lambda_libs.postgres.postgres_sqlalchemy_crud import (
    select_reference_table,
    create,
    update,
    delete,
)
from json import dumps
import logging

# Setup Logging
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s.%(msecs)03d %(levelname)s %(module)s - %(funcName)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger()

entity_class = DiagnosisCode


def lambda_handler(event, context):
    print(event)

    if event["httpMethod"] == "GET":
        return select_reference_table(event, entity_class)
    elif event["httpMethod"] == "POST":
        return create(
            event,
            entity_class,
            entity_class.create_required_fields,
            entity_class.create_allowed_fields,
        )
    elif event["httpMethod"] == "PUT":
        return update(
            event,
            entity_class,
            entity_class.update_required_fields,
            entity_class.update_allowed_fields,
            entity_class.create_required_fields,
        )
    elif event["httpMethod"] == "DELETE":
        return delete(event, entity_class, entity_class.delete_required_fields)
    else:
        method = event["httpMethod"]
        message = f"{method} method is not allowed"
        description = f"{message} on this resource"
        error = {
            "errorType": "InvalidHttpMethod",
            "errorMessage": message,
            "errorDescription": description,
        }
        response = {"statusCode": 405, "body": dumps(error)}
        return response
