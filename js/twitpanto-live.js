var twitpanto = function() {

    /* Private static variables */
    var message = 'Merry Christmas!';
    var cast = [ 'dracos', 'twitpanto', 'bounder', 'probablydrunk', 'graphiquillan', 'tom_watson', 'jonhickman', 'philipjohn', 'cataspanglish', 'benjiw', 'swearynews', 'mazzawoo', 'daneed4', 'karmadillo', 'chrisunitt', 'cybrum', 'mandyrose1', 'getgood', 'gavinwray', 'tomattwood' ];
    var crew = []; // 'alexhughes' ];
    var narrator = 'twitpanto';

    var start_time = new Date('Mon, 20 Dec 2010 13:45:00 GMT');

    var max_id = '';
    var audience_alt = 0;
    var stage_alt = 0;
    var stop = false;
    var timer;

    /* Private functions */

    function make_links(str) {
        var a_start = '<a target="_blank" title="Opens in new window" href="';
        return str
            .replace(/http:\/\/twitpic\.com\/([\d\w]+)/i, 'http://twitpic.com/$1 <br><img class="twitpic" src="http://twitpic.com/show/thumb/$1" alt="">') // Twitpic
            .replace(/http:\/\/yfrog\.(com|us)\/([\d\w]+)/i, 'http://yfrog.$1/$2 <br><img class="twitpic" src="http://yfrog.com/%2.th.jpg" alt="">') // yfrog
            .replace(/([^"])(https?:\/\/[\S]+)/g, '$1' + a_start + '$2">$2</a>')
            .replace(/(^|[^a-z0-9_])@([a-z0-9_]+)/gi, '$1' + a_start + 'http://twitter.com/$2">@$2</a>')
            .replace(/#([a-z0-9_]+)/gi, a_start + 'http://search.twitter.com/search?q=%23$1">#$1</a>')
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
        var loc, alt;
        //var from = message.from_user;
        var from = message.user.screen_name;
        if (new Date() > start_time && ($.inArray(from.toLowerCase(), cast) > -1 || $.inArray(from.toLowerCase(), crew) > -1)) {
            loc = '#stage';
            stage_alt ^= 1;
            alt = stage_alt;
        } else {
            loc = '#audience';
            audience_alt ^= 1;
            alt = audience_alt;
        }
        var text = make_links(message.text);
        if (from == narrator) text = '<strong>' + text + '</strong>';
        var row = [
            //'<div class="a', alt, ' user_', from, '" lang="', message.iso_language_code, '">',
            '<div class="a', alt, ' user_', from, '">',
            //'<img src="', message.profile_image_url, '" width="32"> ',
            '<img src="', message.user.profile_image_url, '" width="32"> ',
            '<a target="_blank" href="http://twitter.com/', from, '" class="user">', from, '</a> ',
            text, ' <span><a class="date" target="_blank" href="http://twitter.com/',
            from, '/status/',
            message.id_str, '">', '<small>', pretty_date(message.created_at), '</small></a></span></div>'
        ].join('');
        row = $(row);
        row.appendTo(loc + ' .results');
        var h = row.height() + 30;
        $(loc + ' .wrap').scrollTo('+=' + h + 'px', { duration: 100, axis: 'y' });
    }

    return {

/* Start of public functions and variables */

search_term: 'twitpanto',

/* Function to search Twitter and deal with results */
update: function() {
    //url = 'http://search.twitter.com/search.json';
    //if (since_id) url += since_id;
    //else url += '?q=%23' + twitpanto.search_term;
    //url += '&callback=?&rpp=100&result_type=recent';
    url = '/stream/latest.json';
    $.getJSON(url, function(data) {
        if (!stop) timer = setTimeout('twitpanto.update()', 3000);
        //if (!data.results) return;
        //since_id = data.refresh_url;
        //data.results.reverse();
        //data.reverse();
        //$.each(data.results, function(i, message) {
        $.each(data, function(i, message) {
            if (!max_id || message.id_str > max_id) {
                add_message(message);
                max_id = message.id_str;
            }
        });
    });
},

stop: function() {
    if (timer) clearTimeout(timer);
    stop = true;
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
    //var date = new Date('Mon, 20 Dec 2010 13:45:00 GMT');
    //if (new Date() > date) {
        twitpanto.update();
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
    $.ajaxSetup({ cache: false });
    twitpanto.launch();
});

