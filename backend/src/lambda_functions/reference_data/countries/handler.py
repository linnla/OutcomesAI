from sqlalchemy_data_models.country import Country
from backend.src.lambda_libs.postgres.postgres_sqlalchemy_crud import (
    select,
    select_reference_table,
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

entity_class = Country


def lambda_handler(event, context):
    print(event)

    if event["httpMethod"] == "GET":
        query_params = event.get("queryStringParameters", {})
        if query_params:
            return select(
                event,
                entity_class,
                entity_class.select_required_params,
                entity_class.all_params_select,
            )
        else:
            return select_reference_table(event, entity_class)
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
