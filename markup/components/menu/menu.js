$(function () {
    $('body').on('click', '.menu__item_submenu>.menu__btn>.menu__icon, .menu-catalogue__item_submenu>.menu-catalogue__btn>.menu-catalogue__icon', function (e) {

        if (Modernizr.mq('(max-width: ' + ($screenMd - 1) + 'px)')) {
            e.preventDefault();

            $('.menu__submenu, .menu-catalogue__submenu')
                .not($(this).parent().next('.menu__submenu, .menu-catalogue__submenu').toggleClass('opened').toggle().parent().toggleClass('opened').end())
                .not($(this).parents('.menu__submenu, .menu-catalogue__submenu'))
                .removeClass('opened').hide().parent().removeClass('opened');
        }

    }).on('click', function (e) {
        if (Modernizr.mq('(max-width: ' + ($screenMd - 1) + 'px)')) {
            if (!$(e.target).closest('.menu__item_submenu>.menu__btn>.menu__icon, .menu-catalogue__item_submenu>.menu-catalogue__btn>.menu-catalogue__icon').length) {
                $('.menu__submenu, .menu-catalogue__submenu').removeClass('opened').hide().parent().removeClass('opened');
            }
        }
    });

    $('body').on('mouseenter', '.menu-catalogue__item_submenu', function (e) {
        if (Modernizr.mq('(min-width: ' + ($screenMd) + 'px)')) {
            e.preventDefault();

            $(this).children('.menu-catalogue__submenu').addClass('opened').stop(true, false).hide().delay(100).fadeIn(100).parent().addClass('opened');
        }
    }).on('mouseleave', '.menu-catalogue__item_submenu', function (e) {
        if (Modernizr.mq('(min-width: ' + ($screenMd) + 'px)')) {
            e.preventDefault();

            $(this).children('.menu-catalogue__submenu').removeClass('opened').stop(true, false).hide().parent().removeClass('opened');
        }
    });
});