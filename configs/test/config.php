<?php defined("BASE_FORM_PATH") or die("Access denied"); ?>
[сonfig]

; Почта получателей. Можно несколько через запятую.
; Пример:  email@example.com, add_email@example.com

to =

; Заголовок письма.
; Пример: Сообщение из формы связи example.com

subject =

; Типы проверяемых ошибок.
; capcha - проверяет капчу;
; spam - защита от спама, csrf;
; Пример: 'capcha,spam,required_field'.

error_type = spam,required_field,capcha

;Поля обязательные для заполнения.
;Где, например, phone — это значение атрибута 'name' тега <input>.

required_field = name,phone

; Почта, которая будет указана в качестве адреса отправителя.
; Пример:  'email@example.com'

from_email =

; Опционально. Имя или название источника отправителя.
; Пример: 'Иванов Иван' или 'Из example.com'.

from_name =

; локализация

used_lang = ru

;Оправлять почту или нет, по умолчанию [1] - отправлять, [0] - не отправлять.

mail_send = 1

[smtp]

smtp_mode = disabled
smtp_host =
smtp_port =
smtp_username =
