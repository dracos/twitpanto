<?php

require_once('lib/twitteroauth.php');
require_once('config.php');

$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);
$request_token = $connection->getRequestToken(OAUTH_CALLBACK);

$time = 60*60*24*10; # 10 days

$token = $request_token['oauth_token'];
setcookie('oauth_token', $token, time() + $time, '/');
setcookie('oauth_token_secret', $request_token['oauth_token_secret'], time() + $time, '/');

if ($connection->http_code == 200) {
    $url = $connection->getAuthorizeURL($token);
    header('Location: ' . $url); 
    print "<html><head><title>Redirecting to Twitter...</title></head><body>
<p>Twitpanto is now redirecting you to Twitter so you can authenticate yourself
there (this way, we do not have access to your password - you should never
give your Twitter password to any website but Twitter itself).
If you are not redirected, please follow this link:
<a href='$url'>$url</a>.</p>
</body></html>";
} else {
    echo 'Could not connect to Twitter. Refresh the page or try again later.';
}
