var twitpanto = function() {

    /* Private static variables */
    var message = 'Merry Christmas!';
    var cast = [ 'dracos', 'twitpanto', 'bounder', 'probablydrunk', 'tom_watson', 'ewan', 'citizensheep', 'cybrum', 'jonhickman', 'exsanguinator', 'steve_nicholls', 'peteashton', 'benjiw', 'fionahandscomb', 'ellielovell', 'clareedwards', 'getgood', 'cataspanglish', 'chrisivens', 'editorialgirl', 'mazzawoo', 'boofie', 'hmobius', 'dullaccountant', 'tomattwood' ];
    var crew = [ 'alexhughes' ];
    var narrator = 'twitpanto';

    var since_id = '';
    var stop = false;
    var alt_stage = 0;
    var alt_audience = 0;
    var timer;

    /* Private functions */

            //.replace(/http:\/\/twitpic.com\/([A-Za-z0-9]+)/i, 'http://twitpic.com/$1 <br><img class="twitpic" src="http://twitpic.com/show/thumb/$1" alt="">') // Twitpic
    function make_links(str) {
        var a_start = '<a target="_blank" title="Opens in new window" href="';
        return str.replace(/(https?:\/\/[\S]+)/g, a_start + '$1">$1</a>').replace(/(^|[^a-z0-9_])@([a-z0-9_]+)/gi, '$1' + a_start + 'http://twitter.com/$2">@$2</a>').replace(/#([a-z0-9_]+)/gi, a_start + 'http://twitter.com/search?q=%23$1">#$1</a>');
    }

    function pretty_date(d) {
        var date = new Date(d);
        var diff = (new Date() - date) / 1000;
        if (diff < 60) return '#';
        if (diff < 120) return '1 minute ago';
        if (diff < 3600) return Math.floor(diff/60) + ' minutes ago';
        if (diff < 7200) return '1 hour ago';
        if (diff < 86400) return Math.floor(diff/3600) + ' hours ago';
        if (diff < 86400*2) return '1 day ago';
        if (diff < 86400*7) return Math.floor(diff/86400) + ' days ago';
        return d;
    }

    function add_message(message) {
        var stage, alt;
        var from = message.from_user;
        if ($.inArray(from.toLowerCase(), cast) > -1 || $.inArray(from.toLowerCase(), crew) > -1) {
            stage = '#stage';
            alt_stage ^= 1;
            alt = alt_stage;
        } else {
            stage = '#audience';
            alt_audience ^= 1;
            alt = alt_audience;
        }
        var text = make_links(message.text);
        if (from == narrator) text = '<strong>' + text + '</strong>';
        var row = [
            '<div class="a', alt, ' user_', from, '" lang="', message.iso_language_code, '">',
            '<img src="', message.profile_image_url, '" width="32"> ',
            '<a target="_blank" href="http://twitter.com/', from, '" class="user">', from, '</a> ',
            text, ' <span><a class="date" target="_blank" href="http://twitter.com/',
            from, '/status/',
            message.id, '">', '<small>', pretty_date(message.created_at), '</small></a></span></div>'
        ].join('');
        row = $(row);
        row.appendTo(stage + ' .results');
        var h = row.height() + 30;
        $(stage + ' .wrap').scrollTo('+=' + h + 'px', { duration: 100, axis: 'y' });
    }

    return {

/* Start of public functions and variables */

search_term: 'twitpanto',

/* Function to search Twitter and deal with results */
update: function() {
    var url = 'http://search.twitter.com/search.json?callback=?&rpp=50&since_id=' + since_id + '&q=' + twitpanto.search_term;
    $.getJSON(url, function(data) {
        if (!stop) timer = setTimeout('twitpanto.update()', 3000);
        if (!data.results) return;
        since_id = data.max_id;
        data.results.reverse();
        $.each(data.results, function(i, message) {
            add_message(message);
        });
    });
},

stop: function() {
    if (timer) clearTimeout(timer);
    stop = true;
},

clear: function() {
    $.cookie('authed', null, { 'path': '/' });
},

trends: function() {
    var url = 'http://search.twitter.com/trends/current.json';
    $.getJSON(url, function(data) {
    });
},

/* Shows the post to Twitter form if we can, and deals with posting */
show_post_form: function() {
    $('#post_form').show();
    $('#post_login').hide();
    $('#post_form').submit(function(){
        var s = $('#post_status').val();
        if (!s || s.match(/^\s*#twitpanto\s*$/)) {
            $('#post_feedback').text('(Write something!)').addClass('error').show().fadeOut(1000);
            return false;
        }
        $('#post_feedback').text('');
        $.post('/post.php', {
            'status': s
        });
        $('#post_status').val(' #' + twitpanto.search_term);
        $('#post_feedback').text('Submitted.').removeClass('error').show().fadeOut(2000);
        return false;
    });
},

/* Run on document.ready. Sets stuff going. */
launch: function() {
    var date = new Date('Fri, 18 Dec 2009 15:15:00 GMT');
    //if (new Date() > date) {
    //    twitpanto.update();
    //}
    $('#post_status').charCounter(140, { delay: 100, pulse: false });
    $('.help_wrap').css('overflow', 'hidden');
    $('#accordion').accordion({ fillSpace:true});
    if ($.cookie('authed')) {
        twitpanto.show_post_form();
    }

},

/* End of public functions */

        easter_egg: function() { alert(message); }
    };
}();

/* And the function to run upon document loading */
$(function() {
    twitpanto.launch();
});

