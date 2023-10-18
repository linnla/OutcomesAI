import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy_data_models.country import Country
from backend.src.lambda_libs.postgres_sqlalchemy import get_database_session


def lambda_handler(event, context):
    df = pd.read_excel("./countries.xlsx")

    country_code_count = 0

    try:
        session = get_database_session()

        for _, row in df.iterrows():
            country_code_count += 1

            if not isinstance(row["country"], str):
                country_name = str(row["country"])
            else:
                country_name = row["country"]
            country = country_name.strip()

            if not isinstance(row["country_code"], str):
                country_code_str = str(row["country_code"])
            else:
                country_code_str = row["country_code"]

            if len(country_code_str) > 2:
                print(
                    f"len > 2, {country_code_str}, {country}, row: {country_code_count}"
                )
                country_code = country_code_str[:2].strip()
            else:
                country_code = country_code_str

            country_instance = Country(
                country=country,
                country_code=country_code,
            )
            session.add(country_instance)

        session.commit()
        print("Countries added:", country_code_count)

    except Exception as e:
        error_message = str(e)
        print(error_message)
        raise Exception(error_message)

    finally:
        session.close()
