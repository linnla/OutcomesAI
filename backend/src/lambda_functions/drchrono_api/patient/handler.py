import json
import logging
import urllib3

logger = logging.getLogger(__name__)

URL = "https://app.drchrono.com/api/patients"
HEADERS = {"Access-Control-Allow-Origin": "*"}


def lambda_handler(event, context):
    event_body = event.get("body", None)

    if event_body is None:
        # Handle the case where the 'body' field is missing or empty
        return create_response(400, {"message": "Missing or empty request body"})

    try:
        fields = json.loads(event_body)
        data = get_drchrono_data(URL, fields)
        return create_response(200, data)

    except json.JSONDecodeError:
        # Handle the case where the 'body' does not contain valid JSON
        return create_response(400, {"message": "Invalid JSON data"})
    except Exception as e:
        # Log the error message and return an error response
        logger.error(f"An error occurred: {str(e)}")
        return create_response(500, {"error_message": str(e)})


def get_drchrono_data(url, fields):
    try:
        access_token = get_access_token()  # Get the access token here
        headers = {
            "Authorization": "Bearer %s" % access_token,
        }
        method = "GET"
        http = urllib3.PoolManager(timeout=15)

        if fields is None:
            response = http.request(method, url, headers=headers)
        else:
            response = http.request(method, url, fields=fields, headers=headers)

        if response.status == 200:
            response_json = json.loads(response.data.decode("utf-8"))

            if "results" in response_json:
                results = response_json["results"]
            elif "data" in response_json:
                results = response_json["data"]

            return results

        # Handle other response status codes if needed
        return {
            "error_message": f"HTTP request failed with status code {response.status}"
        }

    except Exception as e:
        # Log the error message and return an error response
        logger.error(f"An error occurred: {str(e)}")
        return {"error_message": str(e)}


# Helper function to create a consistent response format
def create_response(status_code, body):
    response = {
        "statusCode": status_code,
        "body": json.dumps(body),
        "headers": HEADERS,  # Add headers to the response
    }
    return response


### Put code in here to get these from a secure and encrypted data store
def get_refresh_token():
    return "pUtwtFAoHM9OfVxNKZ5JTFgKx15dHB"


def get_client_secret():
    return "Ji9lvSd2Asz5zcj719luYGLEAn3nCZ3rjA8bCFnGgoMAElpLHowowYEUX5jrFBhGDLJa3tiKhvArVjmASCFOl46lCWYeMGlRe5FW17EP6VOgQcfTzQPAlQBrV6VGRn7V"


def get_client_id():
    return "bQWG7dyDDqYh3WB3sU6DyYAoZzzw7fo3laSwWdu8"


def get_access_token():
    refresh_token = get_refresh_token()
    client_id = get_client_id()
    client_secret = get_client_secret()

    fields = {
        "refresh_token": refresh_token,
        "grant_type": "refresh_token",
        "client_id": client_id,
        "client_secret": client_secret,
    }

    # print("access token fields:", fields)

    url = "https://drchrono.com/o/token/"
    method = "POST"

    http = urllib3.PoolManager()
    response = http.request(method, url, fields)
    print(response)
    response_status = response.status

    if response_status != 200:
        logger.error(f"status code {response_status} returned for {url}")
        return None
    else:
        response_json = json.loads(response.data.decode("utf-8"))
        access_token = response_json["access_token"]
        return access_token
