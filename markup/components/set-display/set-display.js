$(function () {
    $('body').on('click', '.set-display__view', function () {
        $(this).addClass('set-display__view_active').siblings('.set-display__view').removeClass('set-display__view_active');

        $('#' + $(this).closest('.set-display').data('for-list'))
            .removeClass('products-list_view_list products-list_view_grid')
            .addClass('products-list_view_' + $(this).data('view'));
    });

    $(window).on('resize.setDisplay', function () {
        if (Modernizr.mq('(max-width: ' + ($screenSm - 1) + 'px)')){
            $('.set-display__view_grid').click();
        }
        else {
            $('.set-display__view_list').click();
        }
    }).triggerHandler('resize.setDisplay');
});