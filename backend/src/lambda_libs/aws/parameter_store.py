import boto3
from lambda_libs.aws.error_handling import ParameterNotFoundError


def get_paramter_value(parameter_name):
    # print('Parameter Name:', parameter_name)

    # Initialize the AWS SSM client
    ssm = boto3.client("ssm")

    # Get the parameter value
    response = ssm.get_parameter(Name=parameter_name, WithDecryption=True)
    # print('Parameter Response:', response)

    # Extract the parameter value from the response
    parameter_value = response["Parameter"]["Value"]

    if parameter_value:
        return parameter_value
    else:
        raise ParameterNotFoundError(f"Parameter {parameter_name} not found")
