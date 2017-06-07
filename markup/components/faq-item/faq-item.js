$(function () {
    var speedAnimateFaqItem;
    $(window).on('resize.faqItem', function () {
        $('.faq-list').each(function () {
            var faqList = $(this);
            faqList.find('.faq-item__content').each(function () {
                if (Modernizr.mq('(min-width: ' + $screenMd + 'px)')){
                    $(this).css('margin-top', 0).css('margin-top', faqList.offset().top - $(this).siblings('.faq-item__header').offset().top);
                }
                else {
                    $(this).css('margin-top', 0);
                }
            });
        });
        speedAnimateFaqItem = Modernizr.mq('(min-width: ' + $screenMd + 'px)') ? 0 : 200;
    }).triggerHandler('resize.faqItem');

    $('body').on('click', '.faq-item__header', function () {
        $(this).closest('.faq-item').addClass('faq-item_opened').find('.faq-item__content').slideDown(speedAnimateFaqItem).end()
            .siblings('.faq-item').removeClass('faq-item_opened').find('.faq-item__content').slideUp(speedAnimateFaqItem);
    });

    $('.faq-list').each(function () {
        if (!$(this).find('.faq-item_opened').length){
            $(this).find('.faq-item').eq(0).addClass('faq-item_opened').find('.faq-item__content').slideDown(speedAnimateFaqItem);
        }
    });


});