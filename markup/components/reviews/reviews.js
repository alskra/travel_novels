$(function () {
    $('.reviews').slick({
        dots: true,
        arrows: false,
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
        asNavFor: '',
        adaptiveHeight: true,
        responsive: [

        ]
    }).on('lazyLoaded', function (event, slick, image, imageSource) {
        $(image).closest('.slick-slide').removeClass('loading loading_before');
    });
});