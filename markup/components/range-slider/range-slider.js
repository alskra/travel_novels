$(function () {
    $('.range-slider').each(function () {
        var $this = $(this);
        $this.find('.range-slider__input').ionRangeSlider({
            type: "double",
            min: $this.data('rs-min'),
            max: $this.data('rs-max'),
            from: $this.data('rs-from'),
            to: $this.data('rs-to'),
            step: $this.data('rs-step'),
            onStart: function (data) {
                $this.find('.range-slider__from').val(data.from);
                $this.find('.range-slider__to').val(data.to);
            },
            onChange: function (data) {
                $this.find('.range-slider__from').val(data.from);
                $this.find('.range-slider__to').val(data.to);
            },
            onFinish: function (data) {
                //console.log(data);
            },
            onUpdate: function (data) {
                $this.find('.range-slider__from').val(data.from);
                $this.find('.range-slider__to').val(data.to);
            }
        });

        $this.find('.range-slider__from').on('change', function () {
            var slider = $this.find('.range-slider__input').data("ionRangeSlider");

            slider.update({
                from: $(this).val()
            });
        });

        $this.find('.range-slider__to').on('change', function () {
            var slider = $this.find('.range-slider__input').data("ionRangeSlider");

            slider.update({
                to: $(this).val()
            });
        });

    });
});