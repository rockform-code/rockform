<?php defined("BASE_FORM_PATH") or die("Access denied"); ?>
[config]

; Почта получателей. Можно несколько через запятую.
mail_to =

disable_mail_send = 1

; Заголовок письма.
subject = 'Проверка капчи'

[validation]


capcha = required, capcha
