import os
import json
import boto3
import botocore.exceptions
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import (
    SQLAlchemyError,
    NoResultFound,
    IntegrityError,
    OperationalError,
)
from sqlalchemy.exc import ProgrammingError, DataError, InvalidRequestError
from sqlalchemy.orm.exc import UnmappedInstanceError, UnmappedClassError
from psycopg2.errors import ForeignKeyViolation, CheckViolation, UniqueViolation


def select_reference_entity(entity_class):
    exception_handlers = {
        SQLAlchemyError: "Generic SQLAlchemy error: {error}",
        OperationalError: "Operational error: {error}",
        DataError: "Data error: {error}",
        ProgrammingError: "Programming error: {error}",
    }

    try:
        with get_database_session() as session:
            # Build the base query
            query = session.query(entity_class)

            # Execute the query and retrieve the results
            results = query.all()

            # Return the results
            return results

    except tuple(exception_handlers.keys()) as e:
        # Database-related errors
        error_message = str(e.orig) if hasattr(e, "orig") else str(e)
        exception_type = type(e)

        if exception_type in exception_handlers:
            handler = exception_handlers[exception_type]
            error_message = handler.format(error=error_message)

        raise Exception(error_message)

    except Exception as e:
        # Other exceptions
        error_message = str(e)
        raise Exception(error_message)


def select_entity(entity_class, query_params):
    exception_handlers = {
        SQLAlchemyError: "Generic SQLAlchemy error: {error}",
        OperationalError: "Operational error: {error}",
        DataError: "Data error: {error}",
        ProgrammingError: "Programming error: {error}",
    }

    try:
        with get_database_session() as session:
            # Build the base query
            query = session.query(entity_class)

            # Apply query parameters
            if isinstance(query_params, dict):
                for param, value in query_params.items():
                    query = query.filter(getattr(entity_class, param) == value)
            elif isinstance(query_params, list):
                for param in query_params:
                    if param in entity_class.__table__.columns:
                        query = query.filter(
                            getattr(entity_class, param) == query_params[param]
                        )

            # Execute the query and retrieve the results
            results = query.all()

            # Return the results
            return results

    except tuple(exception_handlers.keys()) as e:
        # Database-related errors
        error_message = str(e.orig) if hasattr(e, "orig") else str(e)
        exception_type = type(e)

        if exception_type in exception_handlers:
            handler = exception_handlers[exception_type]
            error_message = handler.format(error=error_message)

        raise Exception(error_message)

    except Exception as e:
        # Other exceptions
        error_message = str(e)
        raise Exception(error_message)


def create_entity(entity_class, data):
    exception_handlers = {
        ForeignKeyViolation: "Foreign key violation error: {error}",
        CheckViolation: "Check violation error: {error}",
        UniqueViolation: "Unique violation error: {error}",
        IntegrityError: "Integrity error: {error}",
        OperationalError: "Operational error: {error}",
        ProgrammingError: "Programming error: {error}",
        DataError: "Data error: {error}",
        InvalidRequestError: "Invalid request error: {error}",
        SQLAlchemyError: "Generic SQLAlchemy error: {error}",
    }

    try:
        with get_database_session() as session:
            # Create a new instance of the entity class using the provided data
            new_entity = entity_class(**data)

            # Add the new entity to the session
            session.add(new_entity)

            # Commit the transaction to persist the new entity
            session.commit()

            # Return the id of the newly created entity
            entity_id = new_entity.id

            # Return a success response with the entity_id
            return entity_id

    except tuple(exception_handlers.keys()) as e:
        # Database-related errors
        error_message = str(e.orig) if hasattr(e, "orig") else str(e)
        exception_type = type(e)

        if exception_type in exception_handlers:
            handler = exception_handlers[exception_type]
            error_message = handler.format(error=error_message)

        raise Exception(error_message)

    except Exception as e:
        # Other exceptions
        error_message = str(e)
        raise Exception(error_message)


def update_entity(entity_instance, updated_data):
    exception_handlers = {
        ForeignKeyViolation: "Foreign key violation error: {error}",
        UniqueViolation: "Unique constraint violation: {error}",
        CheckViolation: "Check constraint violation: {error}",
        IntegrityError: "Integrity error: {error}",
        OperationalError: "Operational error: {error}",
        ProgrammingError: "Programming error: {error}",
        DataError: "Data error: {error}",
        InvalidRequestError: "Invalid request error: {error}",
        NoResultFound: "Entity {error} not found.",
        SQLAlchemyError: "Generic SQLAlchemy error: {error}",
        UnmappedInstanceError: "Unmapped instance error: {error}",
    }

    try:
        with get_database_session() as session:
            # Retrieve the existing entity from the database using its ID
            existing_entity = session.query(type(entity_instance)).get(
                entity_instance.id
            )

            # If the entity doesn't exist, raise a NoResultFound exception
            if existing_entity is None:
                raise NoResultFound(entity_instance.id)

            # Update the desired attributes of the entity instance
            for attr, value in updated_data.items():
                setattr(entity_instance, attr, value)

            # Merge the updated entity into the session
            session.merge(entity_instance)
            session.commit()

            # Return the ID of the updated entity
            return entity_instance.id

    except tuple(exception_handlers.keys()) as e:
        # Database-related errors
        exception_type = type(e)
        error_message = str(e)

        if exception_type in exception_handlers:
            handler = exception_handlers[exception_type]
            error_message = handler.format(error=error_message)

        raise Exception(error_message)

    except Exception as e:
        # Other exceptions
        error_message = str(e)
        raise Exception(error_message)


def delete_entity(entity_instance):
    exception_handlers = {
        ForeignKeyViolation: "Foreign key violation error: {error}",
        UniqueViolation: "Unique constraint violation: {error}",
        CheckViolation: "Check constraint violation: {error}",
        IntegrityError: "Integrity error: {error}",
        OperationalError: "Operational error: {error}",
        ProgrammingError: "Programming error: {error}",
        DataError: "Data error: {error}",
        InvalidRequestError: "Invalid request error: {error}",
        NoResultFound: "Entity {error} not found.",
        SQLAlchemyError: "Generic SQLAlchemy error: {error}",
        UnmappedInstanceError: "Unmapped instance error: {error}",
    }

    try:
        with get_database_session() as session:
            # Retrieve the existing entity from the database using its ID
            existing_entity = session.query(type(entity_instance)).get(
                entity_instance.id
            )

            # If the entity doesn't exist, raise a NoResultFound exception
            if existing_entity is None:
                raise NoResultFound(entity_instance.id)

            # Delete the entity from the session
            session.delete(existing_entity)
            session.commit()

    except tuple(exception_handlers.keys()) as e:
        # Database-related errors
        exception_type = type(e)
        error_message = str(e)

        if exception_type in exception_handlers:
            handler = exception_handlers[exception_type]
            error_message = handler.format(error=error_message)

        raise Exception(error_message)

    except Exception as e:
        # Other exceptions
        error_message = str(e)
        raise Exception(error_message)


def get_secret_value(secret_name, region_name):
    exception_handlers = {
        botocore.exceptions.ParamValidationError: "Parameter validation error: {error}",
        botocore.exceptions.NoCredentialsError: "No valid AWS credentials found: {error}",
        botocore.exceptions.PartialCredentialsError: "Partial AWS credentials found: {error}",
        botocore.exceptions.WaiterError: "Waiter error: {error}",
    }

    try:
        session = boto3.session.Session()
        client = session.client(service_name="secretsmanager", region_name=region_name)
        response = client.get_secret_value(SecretId=secret_name)
        secret_value = json.loads(response["SecretString"])
        return secret_value

    except Exception as e:
        exception_type = type(e)
        error_message = str(e)

        # Check if there's a specific handler for the exception type
        if exception_type in exception_handlers:
            handler = exception_handlers[exception_type]
            error_message = handler.format(error=error_message)

        raise Exception(error_message)


def create_database_connection():
    exception_handlers = {
        OperationalError: "Failed to connect to the database: {error}",
        SQLAlchemyError: "Failed to create connection URL: {error}",
    }

    try:
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

    except Exception as e:
        exception_type = type(e)
        error_message = str(e)

        # Check if there's a specific handler for the exception type
        if exception_type in exception_handlers:
            handler = exception_handlers[exception_type]
            error_message = handler.format(error=error_message)

        raise Exception(error_message)


def get_database_session():
    try:
        engine = create_database_connection()
        Session = sessionmaker(bind=engine)
        return Session()
    except Exception as e:
        error_message = f"Failed to get database session: {str(e)}"
        raise Exception(error_message)


__all__ = [
    "select_entity",
    "select_reference_entity",
    "create_entity",
    "update_entity",
    "delete_entity",
]
