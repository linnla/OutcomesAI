import os
import boto3
import urllib3
from urllib3.exceptions import HTTPError, ConnectTimeoutError
import json
from json.decoder import JSONDecodeError
from botocore.exceptions import ClientError
from lambda_libs.error_handling import (
    AccessKeysError,
    AccessTokenError,
    SecretKeysError,
    DrChronoTokenAPIError,
    JSONError,
)


URL_DRCHRONO_TOKEN = "https://drchrono.com/o/token/"


def get_access_token(secret_name, region):
    try:
        api_keys = drchrono_api_keys(
            secret_name, region
        )  # Let the exception propagate up

        access_token_fields = {
            "refresh_token": api_keys["refresh_token"],
            "grant_type": "refresh_token",
            "client_id": api_keys["client_id"],
            "client_secret": api_keys["client_secret"],
        }

        http = urllib3.PoolManager()
        response = http.request("POST", URL_DRCHRONO_TOKEN, access_token_fields)

        if response.status != 200:
            raise AccessTokenError(
                f"Failed to retrieve drchrono access token at url {URL_DRCHRONO_TOKEN}."
            )

        response_json = json.loads(response.data.decode("utf-8"))
        return response_json["access_token"]

    except HTTPError as http_error:
        # print('secrets_manager get_access_token HTTPError:', http_error)
        error_message = str(http_error)
        raise DrChronoTokenAPIError(f"Access token error. Http Error {error_message}.")

    except JSONDecodeError as json_error:
        # print('secrets_manager get_access_token JSONDecodeError:', json_error)
        raise JSONError(str(json_error))

    except Exception as e:
        # print('secrets_manager get_access_token ConnectTimeoutError:', timeout_error)
        error_message = str(e)
        raise DrChronoTokenAPIError(
            f"Access token error. Unknown error {error_message}."
        )


def drchrono_api_keys(secret_name, region):
    try:
        if region is None or secret_name is None:
            print(
                f"secrets_manager.drchrono_api_keys() error. Region or secret name is None. (region = {region}, secret_name = {secret_name})."
            )
            raise SecretKeysError(
                "AWS Secret region or Secret name is missing or invalid."
            )

        session = boto3.session.Session()
        client = session.client(service_name="secretsmanager", region_name=region)
        secret_value = client.get_secret_value(SecretId=secret_name)
        secrets = json.loads(secret_value["SecretString"])
        client_id = secrets.get("client_id")
        client_secret = secrets.get("client_secret")
        refresh_token = secrets.get("refresh_token")

        if not client_id or not client_secret or not refresh_token:
            # print('secrets_manager.drchrono_api_keys() error, client_id, client_secret or refresh_token is missing.')
            raise AccessTokenError("client_id, client_secret or refresh_token missing.")

        # print('secret_value:', secret_value)
        return {
            "client_id": client_id,
            "client_secret": client_secret,
            "refresh_token": refresh_token,
        }
    except SecretKeysError as e:
        raise SecretKeysError(str(e))
    except AccessTokenError as e:
        raise AccessTokenError(str(e))
    except AccessKeysError as e:
        raise AccessKeysError("Unknown error obtaining drchrono access keys")
