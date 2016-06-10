<?php defined("BASE_FORM_PATH") or die("Access denied"); ?>
[config]

; Почта получателей. Можно несколько через запятую.
mail_to =  

; Заголовок письма.
subject = 'Сообщение с сайта'

disable_mail_send = 1


[validation]

name = 'required,minlength[3],words'
phone = required