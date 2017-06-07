// Gallery-slider
function initGallerySlider() {
    $('.gallery-slider').each(function () {
        $(this).find('.gallery-slider__view').slick({
            dots: false,
            arrows: true,
            infinite: true,
            speed: 300,
            fade: true,
            cssEase: 'ease',
            slidesToShow: 1,
            slidesToScroll: 1,
            mobileFirst: true,
            prevArrow: '<button type="button" class="slick-prev icon icon-angle-right-2"></button>',
            nextArrow: '<button type="button" class="slick-next icon icon-angle-right-2"></button>',
            autoplay: false,
            autoplaySpeed: 5000,
            zIndex: 1,
            lazyLoad: 'ondemand',
            asNavFor: $(this).find('.gallery-slider__thumb-inner'),
            responsive: [

            ]
        }).on('lazyLoaded', function (event, slick, image, imageSource) {
            $(image).closest('.slick-slide').removeClass('loading loading_before');
        });

        var g = $(this);
        g.find('.gallery-slider__thumb-inner').slick({
            dots: false,
            arrows: false,
            infinite: true,
            speed: 300,
            fade: false,
            cssEase: 'ease',
            slidesToShow: 4,
            slidesToScroll: 1,
            mobileFirst: true,
            prevArrow: '<button type="button" class="slick-prev icon icon-angle-right"></button>',
            nextArrow: '<button type="button" class="slick-next icon icon-angle-right"></button>',
            autoplay: false,
            autoplaySpeed: 5000,
            zIndex: 1,
            lazyLoad: 'ondemand',
            asNavFor: g.find('.gallery-slider__view'),
            focusOnSelect: true,
            vertical: true,
            verticalSwiping: true,
            initialSlide: 0,
            responsive: [

            ]
        }).on('lazyLoaded', function (event, slick, image, imageSource) {
            $(image).closest('.slick-slide').removeClass('loading loading_before');
        });
        var htmlThumb = g.find('.gallery-slider__thumb-inner').html();
        $(window).on('resize.thumb', function () {
            setTimeout(function () {
                if (g.find('.gallery-slider__thumb-inner').hasClass('slick-initialized')){
                    //g.find('.gallery-slider__thumb-inner').slick('unslick').html(htmlThumb);
                }
                g.find('.gallery-slider__thumb-inner').data('slide-height', (g.height() + 20)/4 - 20).find('.slick-slide').outerHeight((g.height() + 20)/4 - 20);
                g.find('.gallery-slider__thumb-inner').find('.slick-list').outerHeight(g.height() + 20);
                g.find('.gallery-slider__thumb-inner').find('.slick-track')
                    .outerHeight(g.find('.gallery-slider__thumb-inner').find('.slick-slide').length*(g.height() + 20)/4);
                g.find('.gallery-slider__thumb-inner').slick('slickGoTo', g.find('.gallery-slider__view').slick('slickCurrentSlide'), true);
            }, 100);
        }).triggerHandler('resize.thumb');
    });
}

$(function () {
    initGallerySlider();

    $('body').on('click', '.color-item', function (e) {
        e.preventDefault();
        $('.gallery-slider__view, .gallery-slider__thumb-inner').slick('slickUnfilter')
        .slick('slickFilter', '[data-color="' + $(this).data('color') + '"]').slick('slickGoTo', 0, true);
        $(window).triggerHandler('resize.thumb');
    });

    $('body').on('change', 'select.select_size', function (e) {
        e.preventDefault();
        if ($(this).val() == 'all'){
            $('.gallery-slider__view, .gallery-slider__thumb-inner').slick('slickUnfilter');
            return;
        }
        $('.gallery-slider__view, .gallery-slider__thumb-inner').slick('slickUnfilter')
            .slick('slickFilter', '[data-size="' + $(this).val() + '"]').slick('slickGoTo', 0, true);
        $(window).triggerHandler('resize.thumb');
    });
});