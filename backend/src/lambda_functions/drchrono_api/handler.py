import json
import logging
import urllib3

logger = logging.getLogger(__name__)

URL_PROBLEMS = "https://app.drchrono.com/api/problems"
URL_PROCEDURES = "https://app.drchrono.com/api/procedures"
URL_APPOINTMENTS = "https://app.drchrono.com/api/appointments"
URL_MEDICATIONS = "https://app.drchrono.com/api/medications"
URL_PATIENT = "https://app.drchrono.com/api/patients"

URL_TOKEN = "https://drchrono.com/o/token/"
HEADERS = {"Access-Control-Allow-Origin": "*"}


def lambda_handler(event, context):
    print("event:", event)

    event_body = event.get("body", None)
    if event_body is None:
        # Handle the case where the 'body' field is missing or empty
        return create_response(400, {"message": "Missing or empty request body"})

    body_json = json.loads(event_body)
    print("body:", body_json)

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

        fields = body_json.get("fields")
        print("fields:", fields)

        api = body_json.get("api")
        print("api:", api)

        url_body = body_json.get("url")
        print("url_body:", url_body)

        if fields is None and url_body is None:
            return create_response(
                400, {"message": "Missing query parameter fields or url"}
            )
        if api is None:
            return create_response(400, {"message": "Missing query parameter api"})

        api_url = ""
        if url_body is None:
            if api == "Patient":
                api_url = URL_PATIENT
            elif api == "Medications":
                api_url = URL_MEDICATIONS
            elif api == "Appointments":
                api_url = URL_APPOINTMENTS
            elif api == "Procedures":
                api_url = URL_PROCEDURES
            elif api == "Problems":
                api_url = URL_PROBLEMS
            else:
                return create_response(
                    400, {"message": "Missing or invalid api in request body"}
                )
        else:
            api_url = url_body

        print("api_url:", api_url)

        if fields is None:
            response = http.request("GET", api_url, headers=headers)
        else:
            response = http.request("GET", api_url, fields=fields, headers=headers)

        items = []
        if response.status == 200:
            response_json = json.loads(response.data.decode("utf-8"))
            # results = response_json["results"]
            # return create_response(200, results)

            if "results" in response_json:
                results = response_json["results"]
            elif "data" in response_json:
                results = response_json["data"]

            # print("results:", results)
            items.extend(results)
            url = response_json["next"]

            while url:
                response = http.request("GET", url, headers=headers)
                response_json = json.loads(response.data.decode("utf-8"))
                results = response_json["results"]
                # print("results:", results)
                items.extend(results)
                url = response_json["next"]
                # print("url next:", url)

            return create_response(200, items)
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
