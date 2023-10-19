import json
import urllib3
from urllib3.exceptions import HTTPError
from json.decoder import JSONDecodeError
from lambda_libs.aws.error_handling import (
    DrChronoAPIError,
    DrChronoHTTPError,
    JSONError,
    AccessTokenError,
    DrChronoTokenAPIError,
    JSONError,
)
from lambda_libs.aws.parameter_store import get_paramter_value
from lambda_libs.aws.secrets_manager import get_secret

HEADERS = {"Access-Control-Allow-Origin": "*"}

URL_DRCHRONO_TOKEN = "https://drchrono.com/o/token/"


def get_access_token(ssm_parameter_name, region):
    secret_name = get_paramter_value(ssm_parameter_name)
    secret = get_secret(secret_name, region)
    client_id = secret.get("client_id")
    client_secret = secret.get("client_secret")
    refresh_token = secret.get("refresh_token")

    access_token_fields = {
        "refresh_token": refresh_token,
        "grant_type": "refresh_token",
        "client_id": client_id,
        "client_secret": client_secret,
    }

    http = urllib3.PoolManager()

    try:
        response = http.request("POST", URL_DRCHRONO_TOKEN, access_token_fields)

        if response.status != 200:
            raise AccessTokenError(
                f"Failed to retrieve drchrono access token at url {URL_DRCHRONO_TOKEN} {response.status}."
            )

        response_json = json.loads(response.data.decode("utf-8"))
        print("Access Token:", response_json["access_token"])

        return response_json["access_token"]

    except HTTPError as http_error:
        # print('secrets_manager get_access_token HTTPError:', http_error)
        error_message = str(http_error)
        raise DrChronoTokenAPIError(f"Access token error. Http Error {error_message}.")

    except JSONDecodeError as json_error:
        # print('secrets_manager get_access_token JSONDecodeError:', json_error)
        raise JSONError(str(json_error))


def get_drchrono_data(url=None, fields=None, ssm_parameter_name=None, region=None):
    http = urllib3.PoolManager()

    try:
        # Get the access token using the function
        access_token = get_access_token(ssm_parameter_name, region)
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
            response = http.request(method, url, headers=drchrono_headers)
        else:
            response = http.request(
                method, url, fields=fields, headers=drchrono_headers
            )

        if response.status != 200:
            print(response.status)
            print(response)
            raise DrChronoHTTPError(
                f"DrChrono HTTP error, response state {response.status}"
            )

        response_str = response.data.decode("utf-8")
        response_json = json.loads(response_str)
        data_type = type(response_json)
        if not isinstance(response_json, dict):
            print(f"Data type of response_json: {data_type}")
            print("DrChrono data incorrect datatype. response_str = ", response_str)
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
        print("drchrono_api DrChronoAPIERROR:", str(e))
        raise DrChronoAPIError(f"DrChrono response is not a dict {response_json}")

    except DrChronoHTTPError as e:
        print("drchrono_api DrChronoHTTPError:", str(e))
        raise DrChronoHTTPError(f"DrChrono response is not 200 {str(e)}")

    except JSONDecodeError as json_error:
        print("drchrono_api JSONDecodeError:", json_error)
        raise JSONError(str(json_error))

    # except Exception as e:
    #    print("drchrono_api Exception:", str(e))
    #    raise UnExpectedError(str(e))
