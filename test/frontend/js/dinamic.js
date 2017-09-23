 //test custom init

 (function($) {
     $(function() {

         $.bf('#go', {
             config: 'test1',
             before_send_form: function(form) {

                 alert(1);

             }
         });

         $.bf('#go1', {
             config: 'test3',
             before_send_form: function(form) {

                 alert(3);

             }
         });

         $.bf('#go2', {
             config: 'test2',
             before_send_form: function(form) {

                 alert(2);

             }
         });
 
     });
 })(jQuery);


 $(function() {
     //test dinamic
     $('#create_dinamic').click(function() {
         console.log('create_dinamic');
         $('#dinamic').append('<p><a class="btn btn-lg btn-default" data-bf="capcha" href="#">Запустить пример</a></p>');
         return false;
     });

     $('#create_dinamic_form').on('click', function() {
         console.log('create_dinamic_form');
         $('#dinamic-form').prepend('    <div class="bf-content">\
            <div class="bf-header">\
                Заказ звонка\
            </div>\
            <form data-bf="capcha" action="" method="post">\
                <div class="bf-row">\
                    <label> Телефон<span>*</span>:</label>\
                    <input data-bf-mask="+7 (000) 000-00-00" placeholder="+7 (___) ___-__-__" class="bf-form-control" name="phone" type="text" value="" />\
                </div>\
                    <div class="bf-row">\
            <div class="bf-info-img">\
                <img width="100" height="50" title="Обновить картинку" data-bf-capcha="" src="" alt="" />\
            </div>\
            <input class="capcha bf-form-control" name="bf_capcha" placeholder="Код с картинки" type="text" value="" />\
        </div>\
                <div class="bf-row">\
                    <input class="btn btn-default bf-right" name="submit" type="submit" value="Отправить" />\
                </div>\
            </form>\
        </div>');

         return false;
     });
 });