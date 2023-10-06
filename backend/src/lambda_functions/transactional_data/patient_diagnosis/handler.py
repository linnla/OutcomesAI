from data_models.patient_diagnosis import PatientDiagnosis
from lambda_libs.database_crud import select, create, update, delete
from json import dumps, loads
import logging

# Setup Logging
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s.%(msecs)03d %(levelname)s %(module)s - %(funcName)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger()


entity_class = PatientDiagnosis


def lambda_handler(event, context):
    print(event)

    headers = {"Access-Control-Allow-Origin": "*"}

    if event["httpMethod"] == "GET":
        response = select(
            event,
            entity_class,
            entity_class.select_required_params,
            entity_class.all_params_select,
        )
        print("response from lambda:", response)
        # if response.statusCode != 200:
        #    print("not equal to 200")
        #    return response

        body = response["body"]
        body_json = loads(body)
        if "data" not in body_json:
            return response

        history = body_json["data"]
        sorted_history = sortHistory(history)
        new_body = {
            "data": sorted_history,
        }
        return_response = {
            "statusCode": 200,
            "headers": headers,
            "body": dumps(new_body),
        }
        print(return_response)
        return return_response
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


def sortHistory(history):
    # Define a custom sorting key function
    def custom_sort_key(obj):
        # Sort by "date_prescribed" in descending order
        return obj["year"], obj["month"], obj["day"]

    # Sort the medication_history array using the custom sorting key
    sorted_history = sorted(history, key=custom_sort_key, reverse=True)

    return sorted_history
