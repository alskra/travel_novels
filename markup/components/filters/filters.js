$(function () {
    $('body').on('click', '.filters .aside__header', function () {
        if ($('html, body').hasClass('open_left')) {
            setTimeout(function () {
                $('html, body').removeClass('open_left');
            }, 200);
        }
        else {
            $('html, body').addClass('open_left');
        }

        $('.wrapper').toggleClass('wrapper_open_left');
    });
});