var twitpanto = function() {
    var message = 'Merry Christmas!';
    var placeA = 0;
    var placeC = 1;
    var next_cast_time;
    var timer;
    var running = 0;

    return {

/* Start of public functions and variables */

move_on_cast: function() {
    placeC += 1;
    var next = $('#stage .results div:eq(' + placeC + ')');
    $('#stage .wrap').scrollTo(next, { duration: 100, axis: 'y' });
    next = $('#stage .results div:eq(' + (placeC+1) + ')');
    var time = next.find('small').html();
    next_cast_time = new Date('Mon, 20 Dec 2010 ' + time + ' GMT');
},

move_on: function() {
    placeA += 1;
    var next = $('#audience .results div:eq(' + placeA + ')');
    var time = next.find('small').html();
    var current_audience_time = new Date('Mon, 20 Dec 2010 ' + time + ' GMT');
    if (current_audience_time >= next_cast_time) {
        twitpanto.move_on_cast();
    }
    $('#audience .wrap').scrollTo(next, { duration: 100, axis: 'y' });
    timer = window.setTimeout('twitpanto.move_on()', 3000);
},

play: function() {
    if (running) {
        if (placeA < 93) {
            placeA = 93;
            placeC = 92;
        }
        if (!timer) twitpanto.move_on();
        return false;
    }
    var next = $('#stage .results div:eq(2)');
    var time = next.find('small').html();
    next_cast_time = new Date('Mon, 20 Dec 2010 ' + time + ' GMT');
    running = 1;
    placeA = 93;
    placeC = 92;
    twitpanto.move_on();
    return false;
},

play_all: function() {
    if (running) {
        if (!timer) twitpanto.move_on();
        return false;
    }
    var next = $('#stage .results div:eq(2)');
    var time = next.find('small').html();
    next_cast_time = new Date('Mon, 20 Dec 2010 ' + time + ' GMT');
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
    $('#control_pause').click(twitpanto.pause);
    $('#control_reset').click(twitpanto.reset);
});

