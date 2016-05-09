 $(function() {

     $('#create_dinamic').click(function() {
         console.log('create_dinamic');
         $('#dinamic').append('<p><a class="btn btn-lg btn-default" data-bf-config="" href="#">Запустить пример</a></p>');
         return false;
     });

     $('#create_dinamic_form').on('click', function() {
         console.log('create_dinamic_form');
         $('#dinamic-form').prepend('    <div class="bf-content">\
            <div class="bf-header">\
                Заказ звонка\
            </div>\
            <form data-bf-config="order_phone" action="" method="post">\
                <div class="bf-row">\
                    <label> Телефон<span>*</span>:</label>\
                    <input data-bf-tooltip="right center" data-bf-mask="+7 (000) 000-00-00" data-bf-placeholder="+7 (___) ___-__-__" class="bf-form-control" name="phone" type="text" value="" />\
                </div>\
                <div class="bf-row">\
                    <input class="btn btn-default bf-right" name="submit" type="submit" value="Отправить" />\
                </div>\
            </form>\
        </div>');
         return false;
     });
 });
