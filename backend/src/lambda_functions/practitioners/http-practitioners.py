from practitioner_model import Practitioner
from database_crud import select, create, update
from json import dumps
import logging


# Setup Logging
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s.%(msecs)03d %(levelname)s %(module)s - %(funcName)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger()

entity_class = Practitioner


def lambda_handler(event, context):
    print(event)

    if event["httpMethod"] == "GET":
        return select(
            event,
            entity_class,
            entity_class.select_required_params,
            entity_class.all_params_select,
        )
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
    else:
        method = event["httpMethod"]
        message = f"{method} method not allowed"
        error_message = {"error": message}
        response = {"statusCode": 405, "body": dumps(error_message)}
        return response
