import logging
import os
import json
import boto3
import botocore.exceptions
import collections
from sqlalchemy import create_engine
from sqlalchemy import inspect
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
from sqlalchemy.exc import IntegrityError
from sqlalchemy.exc import DataError
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import StatementError
from psycopg2 import ProgrammingError


DBResponse = collections.namedtuple("DBResponse", "response_code body")

# Setup Logging
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s.%(msecs)03d %(levelname)s %(module)s - %(funcName)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger()


def exception_handling(exception):
    error_message = str(exception)

    if isinstance(exception, OperationalError):
        body = {
            "errorType": "OperationalError",
            "errorDescription": "Connection issues, transaction failures, or database server error",
            "errorMessage": error_message,
        }
        logger.critical(body)
        return DBResponse(response_code=503, body=json.dumps(body))

    if isinstance(exception, NoResultFound):
        body = {
            "errorType": "NoResultFound",
            "errorDescription": "A database result was required but none was found",
            "errorMessage": error_message,
        }
        response = DBResponse(response_code=404, body=json.dumps(body))

    elif isinstance(exception, IntegrityError):
        if "duplicate key" in error_message.lower():
            body = {
                "errorType": "DuplicateKeyError",
                "errorDescription": "Unique Constraint Error or Duplicate Key Violation. The record being inserted or updated already exists.",
                "errorMessage": error_message,
            }
            response = DBResponse(response_code=409, body=json.dumps(body))
        elif "foreign key" in error_message.lower():
            body = {
                "errorType": "ForeignKeyError",
                "errorDescription": "Foreign key integrity constraint was violated. The record being inserted or updated has a foreign key that does not exist in the referenced table's primary key column, or trying to delete a reference table record while records in other tables reference it",
                "errorMessage": error_message,
            }
            response = DBResponse(response_code=409, body=json.dumps(body))
        elif "checkviolation" in error_message.lower():
            body = {
                "errorType": "CheckViolation",
                "errorDescription": "Check constraint was violated. A Value being inserted or updated violates a specified condition",
                "errorMessage": error_message,
            }
            response = DBResponse(response_code=409, body=json.dumps(body))
        else:
            body = {
                "errorType": "IntegrityError",
                "errorDescription": "TBD",
                "errorMessage": error_message,
            }
            response = DBResponse(response_code=409, body=json.dumps(body))

    elif isinstance(exception, DataError):
        body = {
            "errorType": "DataError",
            "errorDescription": "Problem with the data being processed, invalid values or data type mismatch.",
            "errorMessage": error_message,
        }
        response = DBResponse(response_code=400, body=json.dumps(body))

    elif isinstance(exception, ProgrammingError):
        body = {
            "errorType": "ProgrammingError",
            "errorDescription": "Generic programming error related to the database operation, an incorrect method call or parameter usage",
            "errorMessage": error_message,
        }
        response = DBResponse(response_code=400, body=json.dumps(body))

    elif isinstance(exception, StatementError):
        body = {
            "errorType": "StatementError",
            "errorDescription": "Error in the SQL statement, syntax error or an invalid SQL query.",
            "errorMessage": error_message,
        }
        response = DBResponse(response_code=400, body=json.dumps(body))

    else:
        body = {
            "errorType": "Known",
            "errorDescription": "Unknown",
            "errorMessage": error_message,
        }
        response = DBResponse(response_code=500, body=json.dumps(body))

    logger.error(response)
    return response


def select_reference_entity(entity_class):
    try:
        with get_database_session() as session:
            query = session.query(entity_class)

            response = query.all()
            if not response:
                raise NoResultFound(f"No results found: {entity_class}")

            data = [entity.to_dict() for entity in response]
            body = {"data": data}
            return DBResponse(response_code=200, body=body)

    except (
        Exception,
        ProgrammingError,
        OperationalError,
        DataError,
        StatementError,
        NoResultFound,
    ) as error:
        return exception_handling(error)


def select_entity(entity_class, query_params):
    try:
        with get_database_session() as session:
            query = session.query(entity_class)

            if isinstance(query_params, dict):
                for param, value in query_params.items():
                    query = query.filter(getattr(entity_class, param) == value)
            elif isinstance(query_params, list):
                for param in query_params:
                    if param in entity_class.__table__.columns:
                        query = query.filter(
                            getattr(entity_class, param) == query_params[param]
                        )

            response = query.all()
            if not response:
                raise NoResultFound(f"No results found: {entity_class}, {query_params}")

            data = [entity.to_dict() for entity in response]
            body = {"data": data}
            return DBResponse(response_code=200, body=body)

    except (
        Exception,
        ProgrammingError,
        OperationalError,
        DataError,
        StatementError,
        NoResultFound,
    ) as error:
        return exception_handling(error)


def create_entity(entity_class, data):
    try:
        with get_database_session() as session:
            new_entity = entity_class(**data)
            session.add(new_entity)
            session.commit()

            mapper = inspect(new_entity.__class__)
            primary_key_names = [column.name for column in mapper.primary_key]

            body = {}
            for key in primary_key_names:
                value = getattr(new_entity, key)
                body[key] = value

            body["created"] = True
            return DBResponse(response_code=201, body=json.dumps(body))

    except (
        Exception,
        IntegrityError,
        ProgrammingError,
        OperationalError,
        DataError,
        StatementError,
    ) as error:
        session.rollback()
        session.close()
        return exception_handling(error)


def update_entity(entity_instance, updated_data):
    try:
        with get_database_session() as session:
            primary_key_values = [
                getattr(entity_instance, key)
                for key in entity_instance.__table__.primary_key.columns.keys()
            ]
            existing_entity = session.query(type(entity_instance)).get(
                tuple(primary_key_values)
            )

            if existing_entity is None:
                raise NoResultFound(
                    f"No results found: {type(entity_instance)}, {primary_key_values}"
                )

            for attr, value in updated_data.items():
                setattr(entity_instance, attr, value)

            session.merge(entity_instance)
            session.commit()

            mapper = inspect(entity_instance.__class__)
            primary_key_names = [column.key for column in mapper.primary_key]

            body = {}
            for key in primary_key_names:
                value = getattr(entity_instance, key)
                body[key] = value

            body["updated"] = True
            return DBResponse(response_code=200, body=json.dumps(body))

    except (
        Exception,
        IntegrityError,
        ProgrammingError,
        OperationalError,
        DataError,
        StatementError,
        NoResultFound,
    ) as error:
        session.rollback()
        session.close()
        return exception_handling(error)


def delete_entity(entity_instance):
    try:
        with get_database_session() as session:
            primary_key_values = [
                getattr(entity_instance, key)
                for key in entity_instance.__table__.primary_key.columns.keys()
            ]
            existing_entity = session.query(type(entity_instance)).get(
                tuple(primary_key_values)
            )

            if existing_entity is None:
                raise NoResultFound(
                    f"No results found: {type(entity_instance)}, {entity_instance.id}"
                )

            session.delete(existing_entity)
            session.commit()

            mapper = inspect(existing_entity.__class__)
            primary_key_names = [column.name for column in mapper.primary_key]

            body = {}
            for key in primary_key_names:
                value = getattr(existing_entity, key)
                body[key] = value

            body["deleted"] = True
            return DBResponse(response_code=201, body=json.dumps(body))
    except (
        Exception,
        IntegrityError,
        ProgrammingError,
        OperationalError,
        DataError,
        StatementError,
        NoResultFound,
    ) as error:
        session.rollback()
        session.close()
        return exception_handling(error)


def get_secret_value(secret_name, region_name):
    try:
        session = boto3.session.Session()
        client = session.client(service_name="secretsmanager", region_name=region_name)
        response = client.get_secret_value(SecretId=secret_name)
        secret_value = json.loads(response["SecretString"])
        return secret_value

    except botocore.exceptions.ClientError as e:
        error_message = str(e)
        raise Exception(error_message)


def create_database_connection():
    region_name = os.environ.get("REGION")
    secret_name = os.environ.get("SECRET")
    host = os.environ.get("HOST")
    database = os.environ.get("DATABASE")
    secret_value = get_secret_value(secret_name, region_name)
    username = secret_value["username"]
    password = secret_value["password"]

    connection_url = f"postgresql://{username}:{password}@{host}/{database}"
    engine = create_engine(connection_url, execution_options={"raiseerr": True})
    return engine


def get_database_session():
    engine = create_database_connection()
    Session = sessionmaker(bind=engine)
    return Session()


__all__ = [
    "select_entity",
    "select_reference_entity",
    "create_entity",
    "update_entity",
    "delete_entity",
]
