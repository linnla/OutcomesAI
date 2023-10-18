import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy_data_models.postal_code import PostalCode
from backend.src.lambda_libs.postgres_sqlalchemy import get_database_session

"""
ZIP CODE DATA SOURCE

    https://www.unitedstateszipcodes.org/zip-code-database/  (Use free version)
    
    Modify file in excel:
    1.  Delete decommissioned zip codes, value = 1
    2.  Delete decomissioned column
    3.  Add country column and value is "United States"

"""

state_dict = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "FL": "Florida",
    "GA": "Georgia",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PA": "Pennsylvania",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming",
    "PR": "Puerto_Rico",
    "AE": "Military",
    "AA": "Military",
}


def pad_string(str):
    if len(str) == 3:
        return "00" + str
    elif len(str) == 4:
        return "0" + str
    else:
        return str


def lambda_handler(event, context):
    df = pd.read_excel("./postal_codes_us_database.xlsx")

    session = get_database_session()

    postal_code_count = 0

    try:
        for _, row in df.iterrows():
            postal_code_count += 1

            if not isinstance(row["zip"], str):
                postal_code_str = str(row["zip"])
            else:
                postal_code_str = row["zip"]

            postal_code_str = pad_string(postal_code_str)

            if len(postal_code_str) > 5:
                print(f"len > 5, {postal_code_str}, row: {postal_code_count}")
                postal_code = postal_code_str[:5].strip()
            else:
                postal_code = postal_code_str

            if not isinstance(row["type"], str):
                postal_code_type = str(row["type"])
                if not isinstance(postal_code_type, str):
                    print("I'm not a str")
                else:
                    postal_code_type.rstrip()
            else:
                postal_code_type = row["type"].rstrip()

            if not isinstance(row["city"], str):
                city = str(row["city"])
                if not isinstance(city, str):
                    print("I'm not a str")
                else:
                    city.rstrip()
            else:
                city = row["city"].rstrip()

            if not isinstance(row["state_code"], str):
                state_code_str = str(row["state_code"])
            else:
                state_code_str = row["state_code"]

            if len(state_code_str) > 2:
                state_code = state_code_str[:2].strip()
                state_name = state_dict.get(state_code)
                print(
                    f"len > 2, {state_code_str}, {state_name}, row: {postal_code_count}"
                )
            else:
                state_code = state_code_str
                state_name = state_dict.get(state_code)

            if not isinstance(row["county"], str):
                county = str(row["county"])
                if not isinstance(county, str):
                    print("I'm not a str")
                else:
                    county.rstrip()
            else:
                county = row["county"].rstrip()

            if not isinstance(row["time_zone"], str):
                time_zone = str(row["time_zone"])
                if not isinstance(time_zone, str):
                    print("I'm not a str")
                else:
                    time_zone.rstrip()
            else:
                time_zone = row["time_zone"].rstrip()

            if not isinstance(row["country"], str):
                country = str(row["country"])
                if not isinstance(country, str):
                    print("I'm not a str")
                else:
                    country.rstrip()
            else:
                country = row["country"].rstrip()

            if not isinstance(row["country_code"], str):
                country_code_str = str(row["country_code"])
            else:
                country_code_str = row["country_code"]

            if len(country_code_str) > 2:
                print(
                    f"len > 2, {country_code_str}, {country}, row: {postal_code_count}"
                )
                country_code = country_code_str[:2].strip()
            else:
                country_code = country_code_str

            if not isinstance(row["latitude"], float):
                try:
                    latitude = float(row["latitude"])
                except ValueError:
                    print("Unable to convert the string to a float.")
                    latitude = 0.00
            else:
                latitude = row["latitude"]

            if not isinstance(row["longitude"], float):
                try:
                    longitude = float(row["longitude"])
                except ValueError:
                    print("Unable to convert the string to a float.")
                    longitude = 0.00
            else:
                longitude = row["longitude"]

            if not isinstance(row["irs_estimated_population"], int):
                try:
                    irs_estimated_population = int(row["irs_estimated_population"])
                except ValueError:
                    print("Unable to convert the string to a int.")
                    irs_estimated_population = 0
            else:
                irs_estimated_population = row["irs_estimated_population"]

            postal_code_instance = PostalCode(
                postal_code=postal_code,
                postal_code_type=postal_code_type,
                city=city,
                state_code=state_code,
                state=state_name,
                county=county,
                time_zone=time_zone,
                country=country,
                country_code=country_code,
                latitude=latitude,
                longitude=longitude,
                irs_estimated_population=irs_estimated_population,
            )
            session.add(postal_code_instance)

        session.commit()
        print("Postal Codes added:", postal_code_count)

    except Exception as e:
        error_message = str(e)
        print(error_message)
        raise Exception(error_message)

    finally:
        session.close()
