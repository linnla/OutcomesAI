import json
import boto3
from boto3.dynamodb.conditions import Key
from lambda_libs.aws.error_handling import (
    DynamodbDeleteError,
    DynamodbSaveError,
    DynamodbQueryError,
)
from decimal import Decimal


class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            # return str(o)
            return float(o)
        return super(DecimalEncoder, self).default(o)


def delete_items(table_name, items, id_is_string, practice_id):
    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table(table_name)
        deleted_count = 0

        for item in items:
            # Some drchrono API's have id as a string and some as an int
            item_id = None
            if id_is_string:
                item_id = item["id"]
            else:
                item_id = int(item["id"])

            table.delete_item(Key={"practice_id": practice_id, "id": item_id})
            deleted_count += 1

        return deleted_count

    except Exception as e:
        raise DynamodbDeleteError(str(e))


def save_items(table_name, items):
    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table(table_name)
        saved_count = 0

        for item in items:
            table.put_item(Item=item)
            saved_count += 1

        return saved_count

    except Exception as e:
        raise DynamodbSaveError(str(e))


def query_dynamodb_items(
    table_name, practice_id, key=None, value=None, index_name=None
):
    # print("Query Dynamodb")
    # print("table_name:", table_name)
    # print("IndexName:", index_name)
    # print("practice_id:", practice_id)
    # print("key:", key)
    # print("value:", value)

    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table(table_name)
        last_evaluated_key = None
        data_array = []

        while True:
            query_params = None

            if key and value:
                query_params = {
                    "KeyConditionExpression": Key("practice_id").eq(practice_id)
                    & Key(key).eq(value)
                }
            else:
                query_params = {
                    "KeyConditionExpression": Key("practice_id").eq(practice_id)
                }

            if index_name:
                query_params["IndexName"] = index_name

            if last_evaluated_key:
                query_params["ExclusiveStartKey"] = last_evaluated_key

            response = table.query(**query_params)
            # print('Query Response:', response)

            if "Items" in response:
                for dynamodb_item in response["Items"]:
                    item = json.dumps(dynamodb_item, cls=DecimalEncoder)
                    dict_item = json.loads(item)
                    data_array.append(dict_item)

            if "LastEvaluatedKey" in response:
                last_evaluated_key = response["LastEvaluatedKey"]

            else:
                break

        return data_array

    except Exception as e:
        raise DynamodbQueryError(str(e))
