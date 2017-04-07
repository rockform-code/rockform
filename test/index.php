<?php
ini_set('error_reporting', E_ALL);
ini_set ('display_errors', 1);

header('Content-type: text/html;  charset=utf-8');

include_once $_SERVER['DOCUMENT_ROOT'].'/rockform/test/model/test.class.php';
$test = new Test();

$title = 'Тестирование';
include 'template/header.php'; 

$test->init();

$frontend = scandir(BF_PATH.'/test/frontend/');

foreach ($frontend as $file) {

  if(preg_match('~\.html~', $file)) {
    include(BF_PATH.'/test/frontend/'.$file);
  }

}

?>
<div class="page-header">

   <h1>Rockform тесты фронтенда</h1>

  <ol>
    <li><a href="frontend/tooltip.html">Проверка тултипов</a></li>
     <li><a href="frontend/dinamic.html">Проверка работы с динамически созданными тегами</a></li>
      <li><a href="frontend/set_params.html">Передача параметра в всплывающую форму</a></li>
      <li><a href="frontend/success.html">Проверка шаблона ответа об успешной отправке</a></li>
      <li><a href="frontend/capcha.html">Проверка добавления капчи</a></li>
      <li><a href="frontend/set_file_upload.html">Проверка прикрепления файла</a></li>
      <li><a href="frontend/popup_control.html">Проверка управляющих элементов внутри всплывающей формы (вызов другой формы, закрытие формы)</a></li>
       <li><a href="frontend/twig_in_config.html">Проверка шаблонизации конфига</a></li>
        <li><a href="frontend/timer.html">Проверка таймера</a></li> 


  </ol>
        </div>
        
    </div>
    <!-- /container -->
</body>

</html>
 