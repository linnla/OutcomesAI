import logging
from database import (
    select_entity,
    select_reference_entity,
    create_entity,
    update_entity,
    delete_entity,
)
from json import JSONDecodeError, dumps, loads

# Setup Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s.%(msecs)03d %(levelname)s %(module)s - %(funcName)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger()

headers = {"Access-Control-Allow-Origin": "*"}


def validate_request_body(request_body, required_fields, non_null_fields):
    if not isinstance(request_body, dict):
        return "InvalidJSONObject: Expected a JSON object in the request body."

    missing_required_fields = [
        field for field in required_fields if field not in request_body
    ]
    if missing_required_fields:
        return f"MissingRequiredField: Missing required field(s): {', '.join(missing_required_fields)}."

    empty_string_fields = [
        field
        for field in non_null_fields
        if field in request_body and request_body[field] == ""
    ]
    if empty_string_fields:
        return (
            f"Required field does not have a value: {', '.join(empty_string_fields)}."
        )

    return None


def create_error_response(error_message):
    error_description = "database_crud.py validation error"
    try:
        body = {
            "errorType": "Bad Request",
            "errorMessage": error_message,
            "errorDescription": error_description,
        }

    except Exception as e:
        error_description = str(e)
        body = {
            "errorType": "create_error_response",
            "errorMessage": "database_crud.py",
            "errorDescription": error_description,
        }

    response = {"statusCode": 400, "headers": headers, "body": dumps(body)}
    print(response)
    return response


def select_reference_table(event, entity_class):
    try:
        db_response = select_reference_entity(entity_class)
        response = {
            "statusCode": db_response.response_code,
            "headers": headers,
            "body": dumps(db_response.body),
        }
    except Exception as e:
        error_description = str(e)
        body = {
            "errorType": "select_reference_table exception",
            "errorMessage": "database_crud.py",
            "errorDescription": error_description,
        }
        response = {"statusCode": 500, "headers": headers, "body": dumps(body)}

    print(response)
    return response


def select(event, entity_class, required_params, all_params):
    query_params = event.get("queryStringParameters", {})

    if all_params == True:
        if not query_params or not all(
            param in query_params for param in required_params
        ):
            error_message = (
                f"Query parameters required: {' and '.join(required_params)}"
            )
            return create_error_response(error_message)
    else:
        if not query_params or not any(
            param in query_params for param in required_params
        ):
            error_message = f"Query parameters required: {' or '.join(required_params)}"
            return create_error_response(error_message)

    column_names = [column.name for column in entity_class.__table__.columns]

    # Create a dictionary with keys from query_params that are not in column_names
    # This is the data filter, select main tables keys and tables that are
    # joined are considered filters.  query_params for the main table, filters
    # for secondary tables.  All data is sent as query_params and then separated.
    extra_params = {k: v for k, v in query_params.items() if k not in column_names}

    # Remove these keys from query_params
    query_params = {k: v for k, v in query_params.items() if k in column_names}

    try:
        db_response = select_entity(entity_class, query_params)
        if extra_params:
            filtered_data = [
                item
                for item in db_response.body["data"]
                if all(item.get(k) == v for k, v in extra_params.items())
            ]

            db_response.body["data"] = filtered_data

        response = {
            "statusCode": db_response.response_code,
            "headers": headers,
            "body": dumps(db_response.body),
        }

    except Exception as e:
        error_description = str(e)
        body = {
            "errorType": "select exception",
            "errorMessage": "database_crud.py",
            "errorDescription": error_description,
        }
        response = {"statusCode": 500, "headers": headers, "body": dumps(body)}

    print(response)
    return response


def create(event, entity_class, required_fields, allowed_fields):
    try:
        request_body = loads(event["body"])
    except JSONDecodeError as e:
        error_message = f"InvalidJSON: {event['body']} is not valid JSON, {str(e)}."
        return create_error_response(error_message)
    except Exception as e:
        error_message = f"Unexpected error occurred: {str(e)}"
        return create_error_response(error_message)

    validation_error = validate_request_body(
        request_body, required_fields, required_fields
    )
    if validation_error:
        return create_error_response(validation_error)

    found_allowed_fields = [field for field in allowed_fields if field in request_body]

    if len(found_allowed_fields) > 0:
        insert_fields = required_fields + allowed_fields
    else:
        insert_fields = required_fields

    create_data = {field: request_body.get(field) for field in insert_fields}

    try:
        db_response = create_entity(entity_class, create_data)
        response = {
            "statusCode": db_response.response_code,
            "headers": headers,
            "body": dumps(db_response.body),
        }
    except Exception as e:
        error_description = str(e)
        body = {
            "errorType": "create exception",
            "errorMessage": "database_crud.py",
            "errorDescription": error_description,
        }
        response = {"statusCode": 500, "headers": headers, "body": dumps(body)}

    print(response)
    return response


def update(event, entity_class, required_fields, allowed_fields, non_null_fields):
    try:
        request_body = loads(event["body"])
        print(request_body)
    except JSONDecodeError as e:
        error_message = f"InvalidJSON: {event['body']} is not valid JSON, {str(e)}."
        return create_error_response(error_message)
    except Exception as e:
        error_message = f"Unexpected error occurred: {str(e)}"
        return create_error_response(error_message)

    validation_error = validate_request_body(
        request_body, required_fields, non_null_fields
    )
    if validation_error:
        return create_error_response(validation_error)

    found_update_fields = [field for field in allowed_fields if field in request_body]
    if not found_update_fields:
        error_message = (
            f"MissingUpdateField: No fields found in request body to update."
        )
        return create_error_response(error_message)

    fields = required_fields + found_update_fields
    update_data = {field: request_body.get(field) for field in fields}
    entity_instance = entity_class()

    for attr, value in update_data.items():
        setattr(entity_instance, attr, value)

    try:
        db_response = update_entity(entity_instance, update_data)
        response = {
            "statusCode": db_response.response_code,
            "headers": headers,
            "body": dumps(db_response.body),
        }
    except Exception as e:
        error_description = str(e)
        body = {
            "errorType": "update exception",
            "errorMessage": "database_crud.py",
            "errorDescription": error_description,
        }
        response = {"statusCode": 500, "headers": headers, "body": dumps(body)}

    print(response)
    return response


def delete(event, entity_class, required_fields):
    try:
        request_body = loads(event["body"])
        print(request_body)
    except JSONDecodeError as e:
        error_message = f"InvalidJSON: {event['body']} is not valid JSON, {str(e)}."
        return create_error_response(error_message)
    except Exception as e:
        error_message = f"Unexpected error occurred: {str(e)}"
        return create_error_response(error_message)

    if not isinstance(request_body, dict):
        error_message = (
            f"InvalidJSONObject: Expected a JSON object in the request body."
        )
        return create_error_response(error_message)

    missing_required_fields = [
        field for field in required_fields if field not in request_body
    ]
    if missing_required_fields:
        error_message = f"MissingRequiredField: Missing required field(s): {', '.join(missing_required_fields)}."
        return create_error_response(error_message)

    entity_instance = entity_class(**request_body)

    try:
        db_response = delete_entity(entity_instance)
        response = {
            "statusCode": db_response.response_code,
            "headers": headers,
            "body": dumps(db_response.body),
        }
    except Exception as e:
        error_description = str(e)
        body = {
            "errorType": "delete exception",
            "errorMessage": "database_crud.py",
            "errorDescription": error_description,
        }
        response = {"statusCode": 500, "headers": headers, "body": dumps(body)}

    print(response)
    return response


__all__ = ["select", "select_reference_table", "create", "update", "delete"]
