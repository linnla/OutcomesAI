import boto3
import json
from backend.src.lambda_libs.aws.error_handling import SecretNotFoundError


def get_secret(secret_name, region):
    # print('Secret Name:', secret_name)

    if region is None or secret_name is None:
        print(
            f"secrets_manager.drchrono_api_keys() error. Region or secret name is None. (region = {region}, secret_name = {secret_name})."
        )
        raise SecretNotFoundError(
            "AWS Secret region or Secret name is missing or invalid."
        )

    session = boto3.session.Session()
    client = session.client(service_name="secretsmanager", region_name=region)
    secret_value = client.get_secret_value(SecretId=secret_name)
    secrets = json.loads(secret_value["SecretString"])

    if secrets:
        # print("secrets:", secrets)
        return secrets
    else:
        raise SecretNotFoundError(f"Secret name {secret_name} not found")
