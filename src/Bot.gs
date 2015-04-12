// Start the bot
// Auto Tweeting is every hour by default, checking for new replies every 5 minutes
// Change it in the lines 31&32 (ScriptApp.newTrigger)
function startup() {
  Settings();
  if (!propsSet()) {
    Logger.log("Cannot start Bot! Not all necessary User Properties are set! Please set the following User Properties:");
    Logger.log("CONSUMER_KEY");
    Logger.log("CONSUMER_SECRET");
    Logger.log("TWITTER_HANDLE");
    Logger.log("PROJECT_KEY");
    return false;
  }
  
  if(getUserProperty("MAX_TWITTER_ID") === null) {
    setUserProperty("MAX_TWITTER_ID", 0);
  }
  
  setUserProperty("LastMessage", -1);
  setUserProperty("LastAutoTweet", -1)
  
  Logger.log("Starting up Botscript");
  
  Logger.log("Deleting all active Triggers before adding new ones");
  var triggers = ScriptApp.getProjectTriggers();
  for(var i=0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  
  Logger.log("Adding new Triggers");
  ScriptApp.newTrigger("fetchTweets").timeBased().everyMinutes(5).create();
  ScriptApp.newTrigger("postRandomTweet").timeBased().nearMinute(30).everyHours(1).create()
  
  Logger.log("Posting random tweet & fetching Tweets for the 1st time");
  fetchTweets();
  postRandomTweet();
}

// Stop the bot from Autoposting and Autoreplying
function shutdown() {
  Logger.log("Shutting down Bot");
  var triggers = ScriptApp.getProjectTriggers();
  for(var i=0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}

// Shutdown and then start the bot up again
function restart() {
  Logger.log("Restarting Bot");
  shutdown();
  startup();
}