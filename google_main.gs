/* 
1. maintain list of USER_LIST, STATUS_LIST at google sheets. 
2. copy paste this code into sheet script editor. 
3. schedule.
*/
function sendTweet(TweetText, IdInResponseTo, ImageAttachURL){
//////////////////////////Set Variables///////////////////////////////////////////////////////
  //var TweetText="kc sample test";
  var ss = SpreadsheetApp.getActiveSpreadsheet();                                           //spreadsheet  
  var logsheet = ss.getSheetByName("TweetLog");
  var lastRow = Math.max(logsheet.getLastRow(),1) + 1;
  var twitterKeys= {                                                                        //Twitter Authentication Tokens to pass through props
    TWITTER_CONSUMER_KEY: "43NwWqf5jgn6s6UhUAPmRo2PZ",
    TWITTER_CONSUMER_SECRET: "CqhOdiHugwJV9Hh2hjuwWq26tZorc94b6Jre1ynj8J0tWTR85J",
    TWITTER_ACCESS_TOKEN: "927115269750759424-lWBoWmscNToTAAipruTR6ppZRbKVsX6",
    TWITTER_ACCESS_SECRET: "Z9z3MtSZhN6ZX7UDT5ieuOWjtr4dT2fMnHAIUOMySir9d"    
  }
  var props = PropertiesService.getScriptProperties();                                      //New Properties Service
  props.setProperties(twitterKeys);                                                         //Pass Authentication through Service
  var params = new Array(0);                                                                //Array for params (reply, images, etc)
  var service = new Twitterlib.OAuth(props);                                                //Attempt Connection with Service
  console.log("sendTweet Initiated!");                                                      //log function start
  console.log("using params:"                                                               //log params passed through function
              + "|TweetText: " + TweetText                                        
              + "|IdInResponseTo: " + IdInResponseTo
              + "|ImageAttachURL: " + ImageAttachURL);  
//////////////////////////Authenticate////////////////////////////////////////////////////////  
  if (!service.hasAccess()) {                                                               //If credentials do NOT grant access...
    console.log("Authorization Failed");                                                    //log authentication failure 
  } else {                                                                                  //If credentials grant access...   
    console.log("Authentication Successful");                                               //log authentication success
  var status = TweetText;                                                                   //Tweet text 
//////////////////////////Reply/Thread////////////////////////////////////////////////////////
  if (IdInResponseTo == 0 || IdInResponseTo == null) {                                      //If no reply is provided...                                                             
    console.log("No reply ID provided.");                                                   //log no reply
  } else {                                                                                  //If Reply (or thread) is set up...
    var ReplyId = IdInResponseTo;                                                           //variable for replies, passed to .sendTweet
    console.log("In response to: " + ReplyId)                                               //log response to   
    //params.in_reply_to_status_id = ReplyId; 
    params.in_reply_to_status_id = ReplyId;
    //params.auto_populate_reply_metadata = true;                                             //auto-mentions previous user (for thread)
    params.auto_populate_reply_metadata = false;  
    console.log("params.in_reply_to_status_id2 to: " + params.in_reply_to_status_id)  
  }
//////////////////////////Upload Images///////////////////////////////////////////////////////
    if (ImageAttachURL == 0 || ImageAttachURL == null){                                     //If no image URLs are listed...                                                                            
      console.log("No images detected!");                                                   //Log no images detected  
    } else {                                                                                //If image URLs are listed...
      try{                                                                                  //Attempt to upload images from URLs
        var mediaId = new Array(0);                                                         //IDs for uploads, will be CSVs
        var imgs = ImageAttachURL.split(",");                                               //Split URL string into individual links
        console.log(imgs.length + " images detected!");                                     //Log number of images to upload
        for (i in imgs){                                                                    //For each image detected...
          console.log("processing upload: " + imgs[i]);                                     //Log the upload
          var blob = UrlFetchApp.fetch(imgs[i]).getBlob();                                  //Get URL and convert to Blob format
          var imageId = service.uploadMedia(blob);                                          //set imageID variable to pass through .uploadMedia
          if (imageId) {                                                                    //If imageId is valid...
            if (i == 0) {                                                                   //If it's the first image...
              mediaId = mediaId + imageId.media_id_string;                                  //get media ID (used to tweet image)
            } else if (i < 4) {                                                             //If it's the second, third, or fourth image
              mediaId = mediaId + "," + imageId.media_id_string;                            //get media ID
              console.log(imageId.media_id_string + " uploaded");                           //log media ID number
            } else {                                                                        //If 4 images have already been added to mediaId...
              console.log("Maximum Image (4) already attached! " + 
                       imageId.media_id_string + " NOT included");                          //Prevents tweet error for more than 4 images
            }
          } else {                                                                          //If imageId is not found...
            console.log("Image upload FAILED!");                                            //log failure
          }
        }                                                                                   //next image
        console.log("MEDIA ID(s): " + mediaId);                                             //Log number of successful uploads
        params.media_ids = mediaId;                                                         //set media_ids to string value containing uploaded IDs
      } catch (e) {                                                                         //If image upload fails (bad URL, etc)...  
        console.log("FAILURE! Error captured: " + e);                                       //Catch and log error             
      }            
  }                                                                                         //end of URL list parsing
//////////////////////////Send Tweet & Process Response///////////////////////////////////////    
    try{                                                                                    //attempt to send tweet
      console.log("params.in_reply_to_status_id3 to: " + params.in_reply_to_status_id)  
      var response = service.sendTweet(status, params);  
      if (response) {                                                                       //If response is detected... 
        console.log("Posted Tweet ID: " + response.id_str);                                 //log response
        try {                                                                               //attempt to log...
        logsheet.insertRowBefore(2);                                                        //insert row for logs
        logsheet.getRange(2,1).setValue(Date());                                            //timestamp
        logsheet.getRange(2,2).setValue(response.id_str);                                   //tweet id
        logsheet.getRange(2,3).setValue(response.text);                                     //tweet text
        logsheet.getRange(2,4).setValue(response.in_reply_to_status_id_str);                //reply to
        logsheet.getRange(2,5).setValue(ImageAttachURL);                                    //image urls
        } catch (err) {                                                                     //if unable to log (formula bar execution)...
          console.log("unable to update logs. Error thrown: " + err);                       //log error
        }
        return (response.id_str);                                                           //return tweet ID (useful for threads & logs)
      } else {                                                                              //if no response is detected...
       console.log("No Response");                                                          //log failure
      }
    } catch (e) {                                                                           //catch errors from Twitter resource library
      console.log("ON EXCEPTION Llllllllll");   
      console.log("Error: " + e);                                                           //log error messages
      return(response.id_str);
    }
  }                                                                                         //end access-required functions                                                                         
}

function loadstatus(orig_tweet){
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var statuslist = sheet.getSheetByName("STATUS_LIST"); 
  var statuses = statuslist.getDataRange().getValues();
  
  return statuses[orig_tweet % statuses.length];
}

function replytweet(screen_name,since_id) {
  var new_since_id = since_id
  console.log("since_id is " + since_id);
  var options = {
   "headers" : {
     "Authorization" : "Bearer AAAAAAAAAAAAAAAAAAAAAJSBFwEAAAAAboSJDPE6hkd8duOh3BohJTJSBzE%3DaC02XHCIj12EYB6UesNlBmNdEVdbYk7nzSYUBogZ1f4v4AS1Z8"
   }
  };
  var jsondata = UrlFetchApp.fetch('https://api.twitter.com/1.1/statuses/user_timeline.json?include_entities=true&include_rts=false&screen_name=' + screen_name + '&count=5&since_id=' + since_id,options);
  //console.log("RAW OUTPUT " + jsondata);
  //var tweet = jsondata.getContentText();
  var tweet   = JSON.parse(jsondata.getContentText());
  for (const key in tweet) {
    var orig_tweet = tweet[key].id_str;
    var orig_screen_name = tweet[key].user.screen_name;
    
    var status = loadstatus(orig_tweet);
    status = "@" + orig_screen_name + " " + status;
    
    console.log("value of key is " + orig_tweet + "-" + orig_screen_name + "-" + tweet[key].text + "-" + status);
    new_since_id = sendTweet(status, orig_tweet,'');
    console.log("before MAX is " + new_since_id + "/" + orig_tweet);
    new_since_id = Math.max(orig_tweet,new_since_id);
    console.log("response after MAX is " + new_since_id);
  }
  return new_since_id;
}

function main() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  
  var userlist = sheet.getSheetByName("USER_LIST"); 
  var users = userlist.getDataRange().getValues();
  
  var statuslist = sheet.getSheetByName("STATUS_LIST"); 
  var statuses = statuslist.getDataRange().getValues();
  
  var since_id = statuslist.getRange('F2').getValues();
  var final_since_id = since_id;
  
  console.log ("since_id at 1 " + since_id); 
  
  users.forEach( function(row) {
    var screen_name = row[0];
    new_since_id = since_id;
    if (screen_name != "")
    {
      console.log ("Users are " + screen_name); // column index as 4
      console.log ("since_id at parent " + since_id); 
      new_since_id = replytweet(screen_name,since_id);
      console.log ("final_since_id before " + final_since_id); 
      final_since_id = Math.max(final_since_id,new_since_id);
      console.log("final_since_id after " + final_since_id);
      console.log ("USER " + screen_name + " END ======================>");
    }
  });

  console.log("UPDATING cell" + final_since_id);  
  statuslist.getRange('F2').setValue(final_since_id);
}
