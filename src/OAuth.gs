function getOAuthService() {
  var service = OAuth1.createService('twitter');
  service.setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
  service.setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
  service.setAuthorizationUrl('https://api.twitter.com/oauth/authorize')
  service.setConsumerKey(getUserProperty("CONSUMER_KEY"));
  service.setConsumerSecret(getUserProperty("CONSUMER_SECRET"));
  service.setProjectKey(getScriptProperty("PROJECT_KEY"));
  service.setCallbackFunction('authCallback');
  service.setPropertyStore(ScriptProps());
  return service;
}

function authCallback(request) {
  var service = getOAuthService();
  var isAuthorized = service.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this page and start the script again.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this page');
  }
}

function authManually() {
  var service = getOAuthService();
  if(service.hasAccess()) {
    Logger.log("Access already given");
  } else {
    var authorizationUrl = service.authorize();
    Logger.log('Please visit the following URL and then re-run the script: ' + authorizationUrl);
    throw('Please visit the following URL and then re-run the script: ' + authorizationUrl);
  }
}

function resetToken() {
  var service = OAuth1.createService('twitter');
  service.setPropertyStore(ScriptProps());
  service.reset();
}