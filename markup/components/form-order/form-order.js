$(function () {
   $('.form-order').validate(
       {
           onkeyup: function(element) {
               //this.element(element);
           },
           onfocusout: function(element) {
               //this.element(element);
           },
           errorElement: 'div',
           errorPlacement: function(error, element) {
               error.addClass('form-msg form-msg_error').insertAfter(element.closest('.form-field, .form-checkbox, .form-radio'));
           }
       }
   );
});