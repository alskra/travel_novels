$(function () {
    $('body').on('click', '.to-top-btn', function (e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, 500);
    });
});