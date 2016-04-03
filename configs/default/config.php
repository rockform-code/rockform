<?php defined("BASE_FORM_PATH") or die("Access denied"); ?>
[config]

; Почта получателей. Можно несколько через запятую.
mail_to =   

; Заголовок письма.
subject = 'Сообщение с сайта'


[validation]

bf_capcha = capcha 
name = 'required,minlength[3],words'
phone = required