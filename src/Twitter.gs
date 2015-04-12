function sendTweetToUser(user, reply_id, tweet) {
  service = getOAuthService();
  if(service.hasAccess()) {
    Logger.log("Sending tweet to user " + user);
    var status = "https://api.twitter.com/1.1/statuses/update.json";
    
    status = status + "?status=" + encodeString("@" + user + " " + tweet);
    status = status + "&in_reply_to_status_id=" + reply_id;
    
    try {
      var options = {
        "method": "post",
        "contentType": "application/x-www-form-urlencoded; charset=utf-8",
        "escaping": false,
      }
      var result = service.setMethod("post").fetch(status, options);
      setUserProperty("MAX_TWITTER_ID", reply_id);
      Logger.log(result.getContentText());    
    }  
    catch (e) {
      Logger.log(e.toString());
    }
    Logger.log("Finished sending tweet to user " + user);
  } else {
    var authorizationUrl = service.authorize();
    Logger.log('Please visit the following URL and then re-run the script: ' + authorizationUrl);
    throw('Please visit the following URL and then re-run the script: ' + authorizationUrl);
  }
}

function sendTweet(tweet) {
  service = getOAuthService();
  if(service.hasAccess()) {
    Logger.log("Posting Tweet \"" + tweet + "\"" );
    var status = "https://api.twitter.com/1.1/statuses/update.json";
    
    status = status + "?status=" + encodeString(tweet);
    
    try {
      var options = {
        "method": "post",
        "contentType": "application/x-www-form-urlencoded; charset=utf-8",
        "escaping": false,
      }
      var result = service.setMethod("post").fetch(status, options);
      Logger.log(result.getContentText());    
    }  
    catch (e) {
      Logger.log(e.toString());
    }
    Logger.log("Finished posting tweet \"" + tweet + "\"");
  } else {
    var authorizationUrl = service.authorize();
    Logger.log('Please visit the following URL and then re-run the script: ' + authorizationUrl);
    throw('Please visit the following URL and then re-run the script: ' + authorizationUrl);
  }
}

function fetchTweets() {
  service = getOAuthService();
  if(service.hasAccess()) {
    var twitter_handle = getUserProperty("TWITTER_HANDLE");
    var phrase = "to:" + twitter_handle;
    var search = "https://api.twitter.com/1.1/search/tweets.json?count=5&include_entities=false&result_type=recent&q="; 
    search = search + encodeString(phrase) + "&since_id=" + getUserProperty("MAX_TWITTER_ID");
    try {
      var result = service.setMethod("get").fetch(search);   
      Logger.log("Evaluating fetched tweets");
      if (result.getResponseCode() === 200) {
        
        var data = JSON.parse(result.getContentText());
        
        if (data) {
          var tweets = data.statuses;
          //Logger.log(tweets);
          for (var i=tweets.length-1; i>=0; i--) {
            Logger.log("Cycling through tweet " + i);
            Logger.log(tweets[i].text);
            var question = tweets[i].text.replace(new RegExp("\@" + twitter_handle, "ig"), "");
            switch (evalCommand(question)) {
              case 0:
                day = "Sunday";
                break;
              default:
                Logger.log("No command detected! Responding to User!");
                var answer = getResponse();
                sendTweetToUser(tweets[i].user.screen_name, tweets[i].id_str, answer); 
                break;
            }      
          }
        }
      } else {
        Logger.log("Response Code not 200! Response Code: " + result.getResponseCode());
      }
    } catch (e) {
      Logger.log(e.toString());
    }
  } else {
    var authorizationUrl = service.authorize();
    Logger.log('Please visit the following URL and then re-run the script: ' + authorizationUrl);
    throw('Please visit the following URL and then re-run the script: ' + authorizationUrl);
  }
}