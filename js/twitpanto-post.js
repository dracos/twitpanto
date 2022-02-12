var twitpanto = function() {
    var message = 'Merry Christmas!';
    var placeA = 0;
    var placeC = 1;
    var next_cast_time;
    var next_audience_time;
    var timer;
    var timer2; // Interval one
    var running = 0;

    return {

/* Start of public functions and variables */

move_on_cast: function() {
    placeC += 1;
    var next = $('#stage .results div:eq(' + placeC + ')');
    $('#stage .wrap').scrollTo(next, { duration: 100, axis: 'y' });
    next = $('#stage .results div:eq(' + (placeC+1) + ')');
    var time = next.find('small').html();
    next_cast_time = new Date('Sun, 30 Dec 2012 ' + time + ' GMT');
},

move_on: function() {
    placeA += 1;
    var next = $('#audience .results div:eq(' + placeA + ')');
    var time = next.find('small').html();
    var current_audience_time = new Date('Sun, 30 Dec 2012 ' + time + ' GMT');
    if (current_audience_time >= next_cast_time) {
        twitpanto.move_on_cast();
    }
    $('#audience .wrap').scrollTo(next, { duration: 100, axis: 'y' });
    timer = window.setTimeout('twitpanto.move_on()', 1000);
},

maybe_move_on: function() {
    running = new Date(running.getTime() + 1000);
    var next, time;
    if (running >= next_cast_time) {
        placeC += 1;
        next = $('#stage .results div:eq(' + placeC + ')');
        $('#stage .wrap').scrollTo(next, { duration: 100, axis: 'y' });
        next = $('#stage .results div:eq(' + (placeC+1) + ')');
        time = next.find('small').html();
        next_cast_time = new Date('Sun, 30 Dec 2012 ' + time + ' GMT');
    }
    if (running >= next_audience_time) {
        placeA += 1;
        next = $('#audience .results div:eq(' + placeA + ')');
        $('#audience .wrap').scrollTo(next, { duration: 100, axis: 'y' });
        next = $('#audience .results div:eq(' + (placeA+1) + ')');
        time = next.find('small').html();
        next_audience_time = new Date('Sun, 30 Dec 2012 ' + time + ' GMT');
    }
},

play_real: function() {
    var next,time;

    twitpanto.pause();

    running = new Date('Sun, 30 Dec 2012 22:01:03 GMT');
    placeA = 217;
    placeC = 42;

    next = $('#stage .results div:eq(' + placeC + ')');
    time = next.find('small').html();
    next_cast_time = new Date('Sun, 30 Dec 2012 ' + time + ' GMT');

    next = $('#audience .results div:eq(' + placeA + ')');
    time = next.find('small').html();
    next_audience_time = new Date('Sun, 30 Dec 2012 ' + time + ' GMT');

    timer2 = window.setInterval('twitpanto.maybe_move_on()', 1000);
    return false;
},

play: function() {
    twitpanto.pause();
    if (running) {
        if (placeA < 207) {
            placeA = 207;
            placeC = 42;
        }
        twitpanto.move_on();
        return false;
    }
    var next = $('#stage .results div:eq(2)');
    var time = next.find('small').html();
    next_cast_time = new Date('Sun, 30 Dec 2012 ' + time + ' GMT');
    running = 1;
    placeA = 207;
    placeC = 42;
    twitpanto.move_on();
    return false;
},

play_all: function() {
    twitpanto.pause();
    if (running) {
        twitpanto.move_on();
        return false;
    }
    var next = $('#stage .results div:eq(2)');
    var time = next.find('small').html();
    next_cast_time = new Date('Sun, 30 Dec 2012 ' + time + ' GMT');
    running = 1;
    placeA = -1;
    placeC = 1;
    twitpanto.move_on();
    return false;
},

pause: function() {
    if (timer) {
        window.clearTimeout(timer);
        timer = 0;
    }
    if (timer2) {
        window.clearInterval(timer2);
        timer2 = 0;
    }
    return false;
},

reset: function() {
    twitpanto.pause();
    running = 0;
    $('#stage .wrap').scrollTo(0);
    $('#audience .wrap').scrollTo(0);
    return false;
},

/* End of public functions */

        easter_egg: function() { alert(message); }
    };
}();

/* And the function to run upon document loading */
$(function() {
    $('.help_wrap').css('overflow', 'hidden');
    $('#accordion').accordion({ fillSpace:true});
    $('#control_play').click(twitpanto.play);
    $('#control_play_all').click(twitpanto.play_all);
    $('#control_play_real').click(twitpanto.play_real);
    $('#control_pause').click(twitpanto.pause);
    $('#control_reset').click(twitpanto.reset);
});

