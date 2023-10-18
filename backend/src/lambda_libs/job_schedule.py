from datetime import datetime, timedelta


##### Covers yesterday and the past 93 days
##### Over the course of one day, creates a date that covers yesterday and the 92 dates that follow yesterday
##### Starts running for today by mid-afternoon PST


def past_93_days():
    current_time = datetime.now()
    current_hour = current_time.hour
    current_minute = current_time.minute

    time_interval = 1

    ##### Set schedule to run everyday at 15 minute intervals.  If you want to schedule more frequently,
    ##### this function won't work.  It compute the date based on the current hour and minute.
    ##### Over the course of a day, 24-hours, every 15 minutes, this job schedules for 1..93
    #### days from today.  In other words... all the previous days until 93 get reloaded everyday.

    ##### -> Day 1..23 days
    if current_minute >= 0 and current_minute <= 14:
        time_interval = current_hour
        # print('current_minute is >=1 and <= 14: ', current_minute)
        # print('current_hour is', current_hour, ', time_interval = current_hour -> ', 'time_interval:', time_interval)

    ##### -> Day 24..46
    elif current_minute >= 15 and current_minute <= 30:
        time_interval = current_hour + 23
        # print('current_minute is >=15 and <= 30: ', current_minute)
        # print('current_hour is', current_hour, ', time_interval = current_hour + 23 -> ', 'time_interval:', time_interval)

    ##### -> Day 47..69
    elif current_minute >= 31 and current_minute <= 45:
        time_interval = current_hour + 46
        # print('current_minute is >=31 and <= 45: ', current_minute)
        # print('current_hour is', current_hour, ', time_interval = current_hour + 46 -> ', 'time_interval:', time_interval)

    ##### -> Day 70..93
    elif current_minute >= 46 and current_minute <= 60:
        time_interval = current_hour + 69
        # print('current_minute is >=46 and <= 60: ', current_minute)
        # print('current_hour is', current_hour, ', time_interval = current_hour + 69 -> ', 'time_interval:', time_interval)

    else:
        print("Error computing the job schedule time_interval")
        time_interval = day

    past_date = datetime.now() - timedelta(days=time_interval)
    past_date_str = past_date.strftime("%Y-%m-%d")

    # print('service date:', past_date_str)

    return past_date_str
