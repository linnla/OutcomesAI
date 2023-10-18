from datetime import datetime
from datetime import date


def day_parts(date_string, date_format):
    day_parts = {}

    year = datetime.strptime(date_string, date_format).year
    day_parts["year"] = year

    month = datetime.strptime(date_string, date_format).month
    day_parts["month"] = month

    year_month = f"{year}-{month:02}"
    day_parts["year_month"] = year_month

    day_parts["day"] = datetime.strptime(date_string, date_format).day
    day_parts["week"] = datetime.strptime(date_string, date_format).isocalendar()[1]

    qtr = ""
    if day_parts["month"] <= 3:
        qtr = "Q1"
    elif day_parts["month"] <= 6:
        qtr = "Q2"
    elif day_parts["month"] <= 9:
        qtr = "Q3"
    else:
        qtr = "Q4"

    day_parts["quarter"] = qtr

    return day_parts


def day_time_parts(date_string, date_format):
    day_parts = {}

    year = datetime.strptime(date_string, date_format).year
    day_parts["year"] = year

    month = datetime.strptime(date_string, date_format).month
    day_parts["month"] = month

    year_month = f"{year}-{month:02}"
    day_parts["year_month"] = year_month

    day_parts["day"] = datetime.strptime(date_string, date_format).day
    day_parts["hour"] = datetime.strptime(date_string, date_format).hour
    day_parts["minute"] = datetime.strptime(date_string, date_format).minute
    day_parts["week"] = datetime.strptime(date_string, date_format).isocalendar()[1]

    qtr = ""
    if day_parts["month"] <= 3:
        qtr = "Q1"
    elif day_parts["month"] <= 6:
        qtr = "Q2"
    elif day_parts["month"] <= 9:
        qtr = "Q3"
    else:
        qtr = "Q4"

    day_parts["quarter"] = qtr

    return day_parts


def appointment_dos_to_obj(date_time_str):
    date_format = "%Y-%m-%dT%H:%M:%S"
    datetime_obj = datetime.strptime(date_time_str, date_format)
    date_obj = rem_time_obj(datetime_obj)
    return date_obj


def rem_time_obj(d):
    s = date(d.year, d.month, d.day)
    return s


def date_obj_to_str(d):
    s = d.strftime("%Y-%m-%d")
    return s
