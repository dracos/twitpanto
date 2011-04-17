<?php

require_once('lib/twitteroauth.php');
require_once('config.php');

if (!isset($_COOKIE['access_token']) || !isset($_COOKIE['access_token_secret'])) {
    print "Cookies gone away, wah";
    exit;
}

$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $_COOKIE['access_token'], $_COOKIE['access_token_secret']);

$status = $_POST['status'];
if ($status) {
    $d = $connection->post('statuses/update', array('status' => $status));
    print 'Done';
    // print_r($d);
}

