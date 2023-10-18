# error_handling.py

import json


HEADERS = {"Access-Control-Allow-Origin": "*"}


class AccessKeysError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


class AccessTokenError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


class DrChronoAPIError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


class DrChronoTokenAPIError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


class DynamodbDeleteError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


class DynamodbQueryError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


class DynamodbSaveError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


class JSONError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


class QueryStringParameterError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


class SecretKeysError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


class UnExpectedError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


def handle_access_key_error(error):
    status_code = 501
    error_message = "Access Key Error"
    error_description = str(error)
    return error_response(status_code, error_message, error_description)


def handle_access_token_error(error):
    status_code = 502
    error_message = "Access Token Error"
    error_description = str(error)
    return error_response(status_code, error_message, error_description)


def handle_drchrono_api_error(error):
    status_code = 503
    error_message = "DrChrono HTTP Error"
    error_description = str(error)
    return error_response(status_code, error_message, error_description)


def handle_drchrono_token_api_error(error):
    status_code = 504
    error_message = "DrChrono Token HTTP Error"
    error_description = str(error)
    return error_response(status_code, error_message, error_description)


def handle_drchrono_http_error(error):
    status_code = 505
    error_message = "DrChrono HTTP Error"
    error_description = str(error)
    return error_response(status_code, error_message, error_description)


def handle_dynamodb_delete_error(error):
    status_code = 506
    error_message = "Dynamodb Delete Error"
    error_description = str(error)
    return error_response(status_code, error_message, error_description)


def handle_dynamodb_query_error(error):
    status_code = 507
    error_message = "Dynamodb Query Error"
    error_description = str(error)
    return error_response(status_code, error_message, error_description)


def handle_dynamodb_save_error(error):
    status_code = 508
    error_message = "Dynamodb Save Error"
    error_description = str(error)
    return error_response(status_code, error_message, error_description)


def handle_json_error(error):
    status_code = 509
    error_message = "JSON Decode Error"
    error_description = str(error)
    return error_response(status_code, error_message, error_description)


def handle_query_string_parameter_error(error):
    status_code = 510
    error_message = "Query String Parameter Error"
    error_description = str(error)
    return error_response(status_code, error_message, error_description)


def handle_secrets_error(error):
    status_code = 511
    error_message = "Secrets Error"
    error_description = str(error)
    return error_response(status_code, error_message, error_description)


def handle_unexpected_error(e):
    status_code = 512
    error_message = "Unexpected Error"
    error_description = str(e)
    return error_response(status_code, error_message, error_description)


def error_response(status_code, error_message, error_description=None):
    return {
        "statusCode": status_code,
        "headers": HEADERS,
        "body": json.dumps(
            {
                "errorType": "DrChrono API Error",
                "errorMessage": error_message,
                "errorDescription": error_description,
            }
        ),
    }
