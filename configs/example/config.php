<?php defined("BF_PATH") or die("Access denied"); ?>
[config]

; Почта получателей. Можно несколько через запятую.
; mail_to =  
 
; Заголовок письма.
; mail_subject = 'Сообщение с сайта'
 
[validation]

name = 'required,minlength[3],words'
phone = required  
rule = required  