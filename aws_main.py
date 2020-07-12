#!/usr/bin/env python3
import tweepy
import time
import logging.config       # Standard Module
import sys                  # Standard Module

# Logging
logging.config.fileConfig(fname='log.conf')

user_list = [
'VaveraRaja',
'Chinnat99575158',
'Valluvan2034',
'SManoha80571833',
'kongumannan',
'Muthusa85513703'
]

reply_list = [
'Aasdfds','Basdfsd','Casdfsd','Dasdfsd'
]

auth = tweepy.OAuthHandler('43NwWqf5jgn6s6UhUAPmRo2PZ','CqhOdiHugwJV9Hh2hjuwWq26tZorc94b6Jre1ynj8J0tWTR85J')
auth.set_access_token('927115269750759424-lWBoWmscNToTAAipruTR6ppZRbKVsX6','Z9z3MtSZhN6ZX7UDT5ieuOWjtr4dT2fMnHAIUOMySir9d')

api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)

def check_mentions(since_id):
    new_since_id = since_id

    for screen_name in user_list:
        try:
            user = api.get_user(screen_name=screen_name)
            logging.warning(f"id is {user.id}, screen_name is {screen_name}, since_id is {since_id}")

            for tweet in tweepy.Cursor(api.user_timeline,id=user.id,since_id=since_id).items(5):
                logging.warning(f"NEW TWEET!!! {tweet.text}")
                logging.warning(f"{tweet.user.name} - {tweet.user.screen_name} - {tweet.in_reply_to_status_id} - {tweet.id}")
                random = tweet.id % len(reply_list)
                logging.warning(f"random_list number is {random}")
                status = '@'+tweet.user.screen_name+' '+reply_list[random]
                logging.warning(f"status is ===> {status}")
                api.update_status(status = status, in_reply_to_status_id=tweet.id) #, auto_populate_reply_metadata=True)
                new_since_id = max(tweet.id, new_since_id)
                logging.warning("replied-------------------------------------")
        except Exception as e:
            logging.warning(f"exception is {e}")
        logging.warning("**************************************************")
    return new_since_id

def aws_lambda_main(event=None, context=None):
    main()

def main():
    since_id = 1282142020778078209
    logging.warning(since_id)
    while True:
        since_id = check_mentions(since_id)
        logging.warning(f"since_id is {since_id}")
        time.sleep(1800)

if __name__ == "__main__":
    main()
