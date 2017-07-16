<?php defined("BASE_FORM_PATH") or die("Access denied"); ?>
[config]

; Почта получателей. Можно несколько через запятую.
mail_to =

; Заголовок письма
; mail_subject =


[validation]

name = 'required,minlength[3],words'
phone = required
;rule = required
bf_capcha = capcha
