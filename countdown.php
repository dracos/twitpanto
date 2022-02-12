<?php

$deadline = strtotime("3:30pm 2009-12-18");
$seconds = $deadline - time();

$minutes = $seconds / 60;
$seconds = $seconds % 60;

$hours = $minutes / 60;
$minutes = $minutes % 60;

$days = floor($hours / 24);
$hours = $hours % 24;

echo "{$days}d {$hours}h $minutes' $seconds''";
