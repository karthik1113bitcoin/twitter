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
'கேனப்புண்ட. நீ என்ன இங்க சுடலைக்கு ஊம்பி இருக்கியா. மூடிட்டு போடா',
'சுன்னி இல்லாத சின்ன கூதி எதுக்கு டா உங்கொம்மாவ ஊர்மேய விட்ருக்கியா பேக்கூதி.',
'வாடா ஊம்பி. இன்னும் நிறைய பாக்க வேண்டி இருக்கு. ஒம்மா புண்ட. ஸ்டாலின் சுன்னிய போய் ஊம்புடா. இங்க என்ன உங்கொம்மா புண்டய விரிச்சி போட்டு ஆடுராலா. ஓத்து ஒழுக விட்டுறுவேன் தேவடியா புண்டா மவனே.்',
'ஒம்மா!!! தேவடியா பயலே!!! நியாய புண்டைலாம் பேசாத டா. சிப்பு சிப்பா வருது.',
'தேவடியா மவனே. உன்ன பெத்த உங்கொம்மா புண்டய தெரிக்கவிட்டவன் டா நான். அவட்ட கேளுடா என்ன பத்தி சொல்லுவா. வந்து 4 ஊம்பு ஊம்பிட்டு போடா தேவடியா மவனே',
'ஒக்காவ ஓக்கவிட்டு பொழப்பு நடத்துற சின்னக்கூதி நீ. கனி புண்டய தான் ஊரே ஓக்குதேடா. அங்க போய் அவளுக்கு வாய் போட வேண்டிய தானே. உங்கொக்காளுக்கே தான் வந்து பூல காட்டுவியா.',
'தேவடியா க்கு பொறந்த பச்சப்பொறுக்கி தேவடியா பயலே. உங்கொம்மா புண்டய சிதைச்சுபுட்டேன். வந்து 4 ஊம்பு ஊம்பிட்டு தூக்கிட்டு போ.',
'திமுக கொத்தடிமை நீ பேசுற. புண்ட போய் இன்பநிதி சுன்னிய சப்புடா. நீயெல்லாம் அதுக்கு தான் சரியா வருவ. இல்ல உங்கொம்மாவ என்ட அனுப்பு. நல்லா ஓத்து ஒழுகவிட்டு அனுப்புறேன்.',
'புண்டாமவனே. வந்து ஊம்புறியா. சுன்னி உங்கொம்மாக்காக தான் காத்துட்டு இருக்கு. பரவாயில்ல. அவள நாளைக்கு ஓத்துக்குறேன். நீ வந்து ஊம்பு.'
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
