import json
import logging
import urllib3

logger = logging.getLogger(__name__)

URL = "https://app.drchrono.com/api/patients"
URL_TOKEN = "https://drchrono.com/o/token/"
HEADERS = {"Access-Control-Allow-Origin": "*"}


def lambda_handler(event, context):
    event_body = event.get("body", None)

    if event_body is None:
        # Handle the case where the 'body' field is missing or empty
        return create_response(400, {"message": "Missing or empty request body"})

    try:
        refresh_token = get_refresh_token()
        client_id = get_client_id()
        client_secret = get_client_secret()

        token_fields = {
            "refresh_token": refresh_token,
            "grant_type": "refresh_token",
            "client_id": client_id,
            "client_secret": client_secret,
        }

        http = urllib3.PoolManager(timeout=20)

        token_response = http.request("POST", URL_TOKEN, token_fields)
        if token_response.status != 200:
            logger.error(
                f"status code {token_response.status} returned for {URL_TOKEN}"
            )
            error_message = token_response.data.decode("utf-8")
            return create_response(token_response.status, error_message)
        else:
            response_json = json.loads(token_response.data.decode("utf-8"))
            access_token = response_json["access_token"]

        headers = {
            "Authorization": "Bearer %s" % access_token,
        }

        fields = json.loads(event_body)
        if fields is None:
            response = http.request("GET", URL, headers=headers)
        else:
            response = http.request("GET", URL, fields=fields, headers=headers)

        if response.status == 200:
            response_json = json.loads(response.data.decode("utf-8"))

            if "results" in response_json:
                results = response_json["results"]
            elif "data" in response_json:
                results = response_json["data"]

            return create_response(200, results)
        else:
            error_message = response.data.decode("utf-8")
            return create_response(response.status, error_message)

    except json.JSONDecodeError:
        # Handle the case where the 'body' does not contain valid JSON
        return create_response(400, {"message": "Invalid JSON data"})
    except Exception as e:
        # Log the error message and return an error response
        logger.error(f"An error occurred: {str(e)}")
        return create_response(500, {"error_message": str(e)})


# Helper function to create a consistent response format
def create_response(status_code, body):
    response = {
        "statusCode": status_code,
        "body": json.dumps(body),
        "headers": HEADERS,  # Add headers to the response
    }
    print(response)
    return response


### Put code in here to get these from a secure and encrypted data store
def get_refresh_token():
    return "pUtwtFAoHM9OfVxNKZ5JTFgKx15dHB"


def get_client_secret():
    return "Ji9lvSd2Asz5zcj719luYGLEAn3nCZ3rjA8bCFnGgoMAElpLHowowYEUX5jrFBhGDLJa3tiKhvArVjmASCFOl46lCWYeMGlRe5FW17EP6VOgQcfTzQPAlQBrV6VGRn7V"


def get_client_id():
    return "bQWG7dyDDqYh3WB3sU6DyYAoZzzw7fo3laSwWdu8"
