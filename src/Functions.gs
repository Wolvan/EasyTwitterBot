COMMANDRETURN = Object.freeze({
  PAUSE: 0,
  RESTART: 1,
  SHITPOST: 2
});

function ScriptProps() { return PropertiesService.getScriptProperties(); }
function UserProps() { return PropertiesService.getUserProperties(); }

function setScriptProperty(key, value) { ScriptProps().setProperty(key, value); }
function getScriptProperty(key) { return ScriptProps().getProperty(key); }

function setUserProperty(key, value) { UserProps().setProperty(key, value); }
function getUserProperty(key) { return UserProps().getProperty(key); }

function mergeProperties (from, to, replace) {

  var props = from.getProperties();
  var existingProps = to.getProperties();
  
  Object.keys(props).forEach ( function (k) {
    if (replace || !existingProps.hasOwnProperty(k)) {
      existingProps[k] = props[k];
    }
  });
  
  to.setProperties(existingProps);
  return existingProps;
}

function migrate() {

  mergeProperties ( ScriptProperties , PropertiesService.getScriptProperties());
  mergeProperties ( UserProperties , PropertiesService.getUserProperties());

  // check
  Logger.log("script");
  Logger.log( PropertiesService.getScriptProperties().getProperties());
  
  Logger.log("user");
  Logger.log( PropertiesService.getUserProperties().getProperties());
}

function evalCommand(cmd) {
  
}

// Thank you +Martin Hawksey - you are awesome
function encodeString (q) {
  var str = q.replace(/\(/g,'{').replace(/\)/g,'}').replace(/\[/g,'{').replace(/\]/g,'}').replace(/\!/g, '|').replace(/\*/g, 'x').replace(/\'/g, '');
  return encodeURIComponent(str);
  return str
}

function propsSet() {
  if(getUserProperty("CONSUMER_KEY") === "" || getUserProperty("CONSUMER_SECRET") === "" || getUserProperty("TWITTER_HANDLE") === "" || getScriptProperty("PROJECT_KEY") === "") {
    return false; 
  }
  return true; 
}

function postRandomTweet() {
  sendTweet(getTweet());
}

function getResponse() {
  
  Logger.log("Getting random response");
  
  var random = Math.floor(Math.random() * Responses.length);
  while (random == getUserProperty("LastMessage")) {
    random = Math.floor(Math.random() * Responses.length);
  }
  setUserProperty("LastMessage", random);
  Logger.log(random);
  return Responses[random];
}  

function getTweet() {
  
  Logger.log("Posting random Tweet");
  
  var random = Math.floor(Math.random() * Responses.length);
  while (random == getUserProperty("LastAutoTweet")) {
    random = Math.floor(Math.random() * Responses.length);
  }
  setUserProperty("LastAutoTweet", random);
  return RandomTweet[random];
}