#!/usr/bin/env python3
import tweepy
import time

auth = tweepy.OAuthHandler('43NwWqf5jgn6s6UhUAPmRo2PZ','CqhOdiHugwJV9Hh2hjuwWq26tZorc94b6Jre1ynj8J0tWTR85J')
auth.set_access_token('927115269750759424-lWBoWmscNToTAAipruTR6ppZRbKVsX6','Z9z3MtSZhN6ZX7UDT5ieuOWjtr4dT2fMnHAIUOMySir9d')

api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)

def check_mentions(since_id):
    new_since_id = since_id

    user = api.get_user(screen_name='heyramsilence')
    print(user.id)

    for tweet in tweepy.Cursor(api.user_timeline,id=user.id,since_id=since_id).items(1):
        try:
            print(f"NEW TWEET!!! {tweet.text}")
            print(f"{tweet.user.name} - {tweet.user.screen_name} - {tweet.in_reply_to_status_id} - {tweet.id}")
            api.update_status(status = '@heyramsilence your reply20', in_reply_to_status_id=tweet.id) #, auto_populate_reply_metadata=True)
            new_since_id = max(tweet.id, new_since_id)
            print("replied")
        except:
            print("exception")
    return new_since_id

def aws_lambda_main(event=None, context=None):
    main()

def main():
    since_id = 1
    #while True:
    since_id = check_mentions(since_id)
    print(f"since_id is {since_id}")
    #time.sleep(15)

if __name__ == "__main__":
    main()
