import os
import json
import logging
from datetime import datetime, timedelta
import boto3
from lambda_libs.drchrono.drchrono_api import get_drchrono_data
from lambda_libs.aws.dynamodb import query_dynamodb_items, delete_items, save_items
from lambda_libs.day_parts import day_parts

from backend.src.lambda_libs.aws.error_handling import (
    handle_access_token_error,
    handle_drchrono_api_error,
    handle_drchrono_http_error,
    handle_drchrono_token_api_error,
    handle_dynamodb_delete_error,
    handle_dynamodb_query_error,
    handle_dynamodb_save_error,
    handle_json_error,
    handle_parameter_not_found_error,
    handle_query_string_parameter_error,
    handle_secret_not_found_error,
    handle_unexpected_error,
)
from backend.src.lambda_libs.aws.error_handling import (
    AccessTokenError,
    DrChronoAPIError,
    DrChronoHTTPError,
    DrChronoTokenAPIError,
    DynamodbDeleteError,
    DynamodbQueryError,
    DynamodbSaveError,
    JSONError,
    ParameterNotFoundError,
    QueryStringParameterError,
    SecretNotFoundError,
    UnExpectedError,
)


# Initialize logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.WARNING)

STAGE = "dev"
DYNAMODB_TABLE_NAME = f"outcomesai_drchrono_offices_{STAGE}"
URL_DRCHRONO_DATA = "https://drchrono.com/api/offices"

HEADERS = {"Access-Control-Allow-Origin": "*"}


def lambda_handler(event, context):
    print("Received event: %s", event)

    deleted_count = 0
    saved_count = 0
    drchrono_items = []
    transformed_items = []
    existing_dynamodb_items = []

    try:
        region = get_parameter(event, "region")
        ssm_parameter_name = get_parameter(event, "ssm_parameter_name")
        practice_id = get_parameter(event, "practice_id")
        delete_dynamodb_items = get_parameter(event, "delete_dynamodb_items")

        dynamodb_index = None
        print(f"Delete Dynamodb Items: {delete_dynamodb_items}")
        if delete_dynamodb_items:
            dynamodb_index = get_parameter(event, "dynamodb_index")

        drchrono_items = []
        drchrono_items = get_drchrono_data(
            url=URL_DRCHRONO_DATA,
            ssm_parameter_name=ssm_parameter_name,
            region=region,
        )

        # print('lambda_handler drchrono_items:', drchrono_items)
        if "statusCode" in drchrono_items:
            print(drchrono_items)
            return drchrono_items

        print(f"Found {len(drchrono_items)} items in DrChrono.")

        if drchrono_items and len(drchrono_items) > 0:
            transformed_items = transform_data(drchrono_items, practice_id)
            print(
                f"Transformed {len(transformed_items)} of {len(drchrono_items)} DrChrono items."
            )

            if delete_dynamodb_items:
                key = "practice_id"
                value = practice_id

                if not key or not value:
                    raise UnExpectedError(
                        "Dynamodb query error, patient or service_date is None"
                    )

                existing_dynamodb_items = query_dynamodb_items(
                    DYNAMODB_TABLE_NAME,
                    practice_id,
                    key,
                    value,
                    dynamodb_index,
                )
                print(
                    f"Found {len(existing_dynamodb_items)} items in DynamoDB for key: {key} value: {value}."
                )

                if existing_dynamodb_items and len(existing_dynamodb_items) > 0:
                    deleted_count = delete_items(
                        DYNAMODB_TABLE_NAME, existing_dynamodb_items, True, practice_id
                    )
                    print(
                        f"Deleted {deleted_count} existing items from DynamoDB for practice_id {practice_id}."
                    )

            if transformed_items and len(transformed_items) > 0:
                saved_count = save_items(DYNAMODB_TABLE_NAME, transformed_items)
                print(
                    f"Saved {saved_count} items in DynamoDB for practice_id {practice_id}."
                )

    except AccessTokenError as e:
        print("lambda_handler AccessTokenError:", e)
        return handle_access_token_error(e)

    except DrChronoAPIError as e:
        print("lambda_handler DrChronoAPIError:", e)
        return handle_drchrono_api_error(e)

    except DrChronoHTTPError as e:
        print("lambda_handler DrChronoHTTPError:", e)
        return handle_drchrono_http_error(e)

    except DrChronoTokenAPIError as e:
        print("lambda_handler DrChronoTokenAPIError:", e)
        return handle_drchrono_token_api_error(e)

    except DynamodbDeleteError as e:
        print("lambda_handler DynamodbDeleteError:", e)
        return handle_dynamodb_delete_error(e)

    except DynamodbQueryError as e:
        print("lambda_handler DynamodbQueryError:", e)
        return handle_dynamodb_query_error(e)

    except DynamodbSaveError as e:
        print("lambda_handler DynamodbSaveError:", e)
        return handle_dynamodb_save_error(e)

    except JSONError as e:
        print("lambda_handle JSONError:", e)
        return handle_json_error(e)

    except ParameterNotFoundError as e:
        print("lambda_handle ParameterNotFoundError:", e)
        return handle_parameter_not_found_error(e)

    except QueryStringParameterError as e:
        print("lambda_handle QueryStringParameterError:", e)
        return handle_query_string_parameter_error(e)

    except SecretNotFoundError as e:
        print("lambda_handler SecretNotFoundError:", e)
        return handle_secret_not_found_error(e)

    except UnExpectedError as e:
        print("lambda_handler UnExpectedError:", e)
        return handle_unexpected_error(e)

    except Exception as e:
        print("lambda_handler Exception:", e)
        return handle_unexpected_error(e)

    response_body = {
        "table": DYNAMODB_TABLE_NAME,
        "index": dynamodb_index,
        "url": URL_DRCHRONO_DATA,
        "practice_id": practice_id,
        "drchrono_items": len(drchrono_items),
        "transformed_items": len(transformed_items),
        "existing_items": len(existing_dynamodb_items),
        "deleted_count": deleted_count,
        "saved_count": saved_count,
    }

    response = {
        "statusCode": 200,
        "headers": HEADERS,
        "body": json.dumps(response_body),
    }

    print(response_body)
    return response


def get_parameter(event, parameter_name):
    if "queryStringParameters" not in event:
        raise QueryStringParameterError("querystring parameters not found in event")

    if parameter_name not in event["queryStringParameters"]:
        raise QueryStringParameterError(
            f"{parameter_name} not found in querystring parameters"
        )

    parameter_value = event["queryStringParameters"][parameter_name]
    if parameter_value is None:
        raise QueryStringParameterError(f"{parameter_name} is None")

    return parameter_value


def transform_data(items, practice_id):
    try:
        new_items = []
        created_at = datetime.now()
        created_at_str = created_at.strftime("%Y-%m-%d %H:%M:%S")

        for item in items:
            item["practice_id"] = practice_id
            item["created_at"] = created_at_str
            new_items.append(item)

        return new_items

    except Exception as e:
        print("transform_data Exception:", str(e))
        raise UnExpectedError(str(e))
