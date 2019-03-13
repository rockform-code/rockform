<?php defined("BF_PATH") or die("Access denied"); ?>
[config]

 
 
[validation]

req = required 	;Поле становится обязательным для заполнения.
minlength = minlength[5] 	;Минимальное число символов. В скобочках указывается значение.
maxlength = maxlength[10] 	;Максимально число символов. В скобочках указывается значение.
rangelength = rangelength[3,10] 	;Диапозон числа символов. В скобочках указывается значение.
email = email 	;Электронная почта.
url = url 	;Ссылка.
ip = ip 	;ip-адрес.
number = number 	;Дробные числа.
digits = digits 	;Только цифры.
letter = letter 	;Только буквы.
words = words 	;Ввод слов.
file = file[.jpg,.png] 	;Допустимые расширения файлов. В скобочках расширения через запятую.