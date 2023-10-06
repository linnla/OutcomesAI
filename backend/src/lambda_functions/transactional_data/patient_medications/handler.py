from data_models.patient_medication import PatientMedication
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


entity_class = PatientMedication


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

        medication_history = body_json["data"]
        sorted_medication_history = sortMedicationHistory(medication_history)
        summaryByMedication = summarizeByMedication(medication_history)
        summaryByDate = summarizeByPrescriptionDate(medication_history)
        data = {
            "detail": sorted_medication_history,
            "summary_by_item": summaryByMedication,
            "summary_by_date": summaryByDate,
        }
        # The app expects information wrapped in data attribute
        new_body = {"data": data}
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


def sortMedicationHistory(medication_history):
    # Define a custom sorting key function
    def custom_sort_key(obj):
        # Sort by "date_prescribed" in descending order
        return obj["date_prescribed"], obj["name"]

    # Sort the medication_history array using the custom sorting key
    sorted_history = sorted(medication_history, key=custom_sort_key, reverse=True)

    return sorted_history


def summarizeByMedication(medication_history):
    unique_values_set = set()
    for obj in medication_history:
        newAttribute = obj["name"] + "|||" + obj["signature_note"]
        obj["newAttribute"] = newAttribute
        unique_values_set.add(newAttribute)  # Add newAttribute to the set

    # print("unique values set:", unique_values_set)

    medicationSummary = []
    for uniqueKey in unique_values_set:
        # Split the unique value back into name and signature_note
        name, signature_note = uniqueKey.split("|||")
        # print(name, signature_note)

        prescriptions = []
        for medication in medication_history:
            if uniqueKey == medication["name"] + "|||" + medication["signature_note"]:
                dispense_details = {
                    "dispense_quantity": medication["dispense_quantity"],
                    "number_refills": medication["number_refills"],
                    "date_prescribed": medication["date_prescribed"],
                    "date_stopped_taking": medication["date_stopped_taking"],
                }
                prescriptions.append(dispense_details)

        # Sort the prescriptions list by "date_prescribed" in descending order
        prescriptions.sort(key=lambda x: x["date_prescribed"], reverse=True)

        medicationDetail = {
            "name": name,
            "signature_note": signature_note,
            "dispense_details": prescriptions,  # Use the prescriptions list here
        }
        medicationSummary.append(medicationDetail)

    # Sort the medicationSummary list by "name" in ascending order
    medicationSummary.sort(key=lambda x: x["name"])
    # print("medicationSummary:", medicationSummary)
    return medicationSummary


def summarizeByPrescriptionDate(medication_history):
    unique_values_set = set()
    for obj in medication_history:
        unique_values_set.add(obj["date_prescribed"])  # Add newAttribute to the set

    medicationSummary = []
    for uniqueKey in unique_values_set:
        prescriptions = []
        for medication in medication_history:
            if uniqueKey == medication["date_prescribed"]:
                dispense_details = {
                    "name": medication["name"],
                    "signature_note": medication["signature_note"],
                    "dispense_quantity": medication["dispense_quantity"],
                    "number_refills": medication["number_refills"],
                    "date_prescribed": medication["date_prescribed"],
                    "date_stopped_taking": medication["date_stopped_taking"],
                }
                prescriptions.append(dispense_details)

        medicationDetail = {
            "date_prescription": uniqueKey,
            "dispense_details": prescriptions,  # Use the prescriptions list here
        }
        medicationSummary.append(medicationDetail)

    # Sort the medicationSummary list by "name" in ascending order
    medicationSummary.sort(key=lambda x: x["dispense_details"][0]["name"])

    # Sort the medicationSummary list by "date_prescription" in descending order
    medicationSummary.sort(key=lambda x: x["date_prescription"], reverse=True)

    # print("medicationSummary:", medicationSummary)
    return medicationSummary
