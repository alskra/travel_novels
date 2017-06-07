$(function () {
    $('body').on('click', '.counter__btn_dec', function () {
        var $input = $(this).siblings('.counter__input'),
            value = parseInt($input.val());
        value > 1 ? $input.val(value - 1) : null
    }).on('click', '.counter__btn_inc', function () {
        var $input = $(this).siblings('.counter__input'),
            value = parseInt($input.val());
        $input.val(value + 1);
    }).on('change', '.counter__input', function () {
        $(this).val() <= 0 ? $(this).val(1) : null
    });

});