$(function () {

    $('.slider-product-card').each(function () {
        var $this = $(this);
        $this.find('.slider-product-card__main').slick({
            dots: false,
            arrows: false,
            infinite: true,
            speed: 300,
            fade: true,
            cssEase: 'linear',
            slidesToShow: 1,
            slidesToScroll: 1,
            mobileFirst: true,
            prevArrow: '<button type="button" class="slick-prev icon icon-angle-right-2"></button>',
            nextArrow: '<button type="button" class="slick-next icon icon-angle-right-2"></button>',
            autoplay: false,
            autoplaySpeed: 5000,
            zIndex: 1,
            lazyLoad: 'ondemand',
            asNavFor: $this.find('.slider-product-card__thumbs'),
            responsive: [

            ]
        }).on('lazyLoaded', function (event, slick, image, imageSource) {
            $(image).closest('.slick-slide').removeClass('loading loading_before');
        });

        $this.find('.slider-product-card__thumbs').slick({
            dots: false,
            arrows: false,
            infinite: true,
            speed: 300,
            fade: false,
            cssEase: 'ease',
            slidesToShow: 3,
            slidesToScroll: 1,
            mobileFirst: true,
            prevArrow: '<button type="button" class="slick-prev icon icon-angle-right"></button>',
            nextArrow: '<button type="button" class="slick-next icon icon-angle-right"></button>',
            autoplay: false,
            autoplaySpeed: 5000,
            zIndex: 1,
            lazyLoad: 'ondemand',
            asNavFor: $this.find('.slider-product-card__main'),
            focusOnSelect: true,
            vertical: false,
            verticalSwiping: true,
            initialSlide: 0,
            responsive: [
                {
                    breakpoint: $screenSm - 1,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        vertical: true
                    }
                }
            ]
        }).on('lazyLoaded', function (event, slick, image, imageSource) {
            $(image).closest('.slick-slide').removeClass('loading loading_before');
        });
    });

    $(window).on('resize.sliderProductCard', function () {
        setTimeout(function () {
            $('.slider-product-card__thumbs').each(function () {
                var $this = $(this);

                if (Modernizr.mq('(max-width: ' + ($screenSm - 1) + 'px)')){
                    $this.find('.slider-product-card__thumb-item').height('auto');
                    $this.find('.slick-track').height('auto');
                }
                else {
                    var heightItem = ($this.outerHeight() + 20)/3;
                    $this.find('.slider-product-card__thumb-item')
                        .css('height', heightItem - 20.5 + 'px');

                    $this.find('.slick-track')
                        .height($this.find('.slider-product-card__thumb-item').length*(heightItem + 20));
                }

                $this.slick('slickGoTo', 0, true);
                setTimeout(function () {
                    $this.css('opacity', 1);
                }, 400);
            });
        }, 200);
    }).triggerHandler('resize.sliderProductCard');
});