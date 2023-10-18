import boto3
import json
import urllib3
from urllib3.exceptions import HTTPError, ConnectTimeoutError
from json.decoder import JSONDecodeError
from lambda_libs.error_handling import (
    DrChronoAPIError,
    JSONError,
    UnExpectedError,
)
from . import secrets_manager

HEADERS = {"Access-Control-Allow-Origin": "*"}


def get_drchrono_data(url=None, fields=None, secret_name=None, region=None):
    http = urllib3.PoolManager()

    try:
        # Get the access token using the function
        access_token = secrets_manager.get_access_token(secret_name, region)
        # print('drchrono_api access_token:', access_token)

        drchrono_headers = {
            "Authorization": "Bearer %s" % access_token,
        }

        method = "GET"
        items = []
        results = []
        next_url = None

        # print('get_drchrono_data url:', url)
        # print('get_drchrono_data fields:', fields)
        # print('get_drchrono_data header:', drchrono_headers)

        if fields is None:
            raise ValueError("Fields are None")
        else:
            response = http.request(
                method, url, fields=fields, headers=drchrono_headers
            )

        if response.status != 200:
            print(response.status)
            print(response)
            raise DrChronoAPIError(
                f"DrChrono response status is not 200, {response.status}"
            )

        response_str = response.data.decode("utf-8")
        response_json = json.loads(response_str)
        if not isinstance(response_json, dict):
            print(response_str)
            raise DrChronoAPIError(response_str)

        # print('drchrono_api response_json:', response_json)

        if "results" in response_json:
            results = response_json["results"]
        elif "data" in response_json:
            results = response_json["data"]
        else:
            raise DrChronoAPIError(response_str)

        items.extend(results)
        next_url = response_json["next"]

        item_count = len(results)

        # For paginated results, on subsequent get requests, do not pass the field parameters
        while next_url:
            response = http.request(method, next_url, headers=drchrono_headers)

            if response.status != 200:
                print(response)
                raise DrChronoAPIError(response)

            response_json = json.loads(response.data.decode("utf-8"))
            if not isinstance(response_json, dict):
                print(response)
                raise DrChronoAPIError(response)

            results = response_json["results"]
            items.extend(results)
            next_url = response_json["next"]

            item_count = len(results)

        # print('drchrono_api items:', items)
        return items

    except HTTPError as http_error:
        print("drchrono_api HTTPError:", http_error)
        raise DrChronoAPIError(str(http_error))

    except DrChronoAPIError as e:
        print("drchrono_api HTTPErrorDrChrono:", str(e))
        raise DrChronoAPIError(f"DrChrono response is not a dict {response_json}")

    except JSONDecodeError as json_error:
        print("drchrono_api JSONDecodeError:", json_error)
        raise JSONError(str(json_error))

    except Exception as e:
        print("drchrono_api Exception:", str(e))
        raise UnExpectedError(str(e))
