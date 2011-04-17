var twitpanto = function() {

    /* Private static variables */
    var message = 'Merry Christmas!';

    return {

/* Start of public functions and variables */

search_term: 'twitpanto',

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

