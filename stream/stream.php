<?php

$track = '%23twitpanto';
$username = 'USERNAME';
$password = 'PASSWORD';

$context = stream_context_create(array(
    'http' => array(
        'method'    =>  "POST",
        'content'   =>  "track=$track",
    )
));

# Bit of back story
$out_latest = fetch_latest();
write_latest($out_latest, 'all');
write_latest($out_latest);

$fp_all = fopen('all.json', 'a'); # Where to store all messages
$instream = fopen("https://$username:$password@stream.twitter.com/1/statuses/filter.json", 'r', false, $context);
while (!feof($instream)) {
    if (!($line = stream_get_line($instream, 20000, "\r"))) continue;
    if ($line == "\n") continue;

    fwrite($fp_all, "$line,");
    $tweet = json_decode($line);

    $out_latest[] = json_encode(array(
        'id_str' => $tweet->id_str,
        'user' => array(
            'screen_name' => $tweet->user->screen_name,
            'profile_image_url' => $tweet->user->profile_image_url,
        ),
        'created_at' => $tweet->created_at,
        'text' => $tweet->text,
    ));
    $out_latest = array_slice($out_latest, -100);
    write_latest($out_latest);
    print 'New tweet from @' . $tweet->user->screen_name . "\n";
    flush();
}

# Fetch the most recent 100 before switching to streaming...
function fetch_latest() {
    global $track;
    $out = array();
    system("curl --silent -o temp.json 'http://search.twitter.com/search.json?rpp=100&q=$track'");
    $js = json_decode(file_get_contents('temp.json'), true);
    foreach ($js['results'] as $m) {
        $out[] = json_encode(array(
            'id_str' => $m['id_str'],
            'user' => array(
                'screen_name' => $m['from_user'],
                'profile_image_url' => $m['profile_image_url'],
            ),
            'created_at' => $m['created_at'],
            'text' => $m['text'],
        ));
    }
    $out = array_reverse($out);
    return $out;
}

function write_latest($out, $name='latest') {
    $out = '[' . join(', ', $out) . ']';
    $fp_latest = fopen("$name.json.new", 'w');
    fwrite($fp_latest, $out);
    fclose($fp_latest);
    rename("$name.json.new", "$name.json");
}

