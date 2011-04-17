<?php

require_once('lib/twitteroauth.php');
require_once('config.php');

$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $_COOKIE['oauth_token'], $_COOKIE['oauth_token_secret']);
$access_token = $connection->getAccessToken($_REQUEST['oauth_verifier']);

$time = 60*60*24*10; # 10 days

setcookie('access_token', $access_token['oauth_token'], time() + $time, '/');
setcookie('access_token_secret', $access_token['oauth_token_secret'], time() + $time, '/');
setcookie('oauth_token', '', time() - 3600, '/');
setcookie('oauth_token_secret', '', time() - 3600, '/');

if (200 == $connection->http_code) {
    setcookie('authed', 1, time() + $time, '/');
}
header('Location: /');
