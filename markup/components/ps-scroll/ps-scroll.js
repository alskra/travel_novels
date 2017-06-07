function initPerfectScrollbar() {
    $('.ps-scroll:not(.ps-container)').each(function () {
        $(this).perfectScrollbar($(this).data('ps-scroll'));
    });
    $('.ps-scroll.ps-container').perfectScrollbar('update');
}
function reInitPerfectScrollbar() {
    initPerfectScrollbar();
    setTimeout(function () {
        reInitPerfectScrollbar();
    }, 100);
}
$(function () {
    reInitPerfectScrollbar();
    $('.ps-scroll').on('ps-y-reach-start', function (e) {
        $(this).addClass('ps-y-reach-start').removeClass('ps-y-reach-end');
    }).on('swipedown', function (e) {
        e.stopPropagation();
        if ($(this).hasClass('ps-y-reach-start') || !$(this).hasClass('ps-active-y')){
            $('.wrapper').moveUp();
        }
    }).on('ps-scroll-down', function (e) {
        $(this).removeClass('ps-y-reach-start');
    });
    $('.ps-scroll').on('ps-y-reach-end', function (e) {
        $(this).addClass('ps-y-reach-end').removeClass('ps-y-reach-start');
    }).on('swipeup', function (e) {
        e.stopPropagation();
        if ($(this).hasClass('ps-y-reach-end') || !$(this).hasClass('ps-active-y')){
            $('.wrapper').moveDown();
        }
    }).on('ps-scroll-up', function (e) {
        $(this).removeClass('ps-y-reach-end');
    });
});