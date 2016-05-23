<?php
ini_set('error_reporting', E_ALL);
ini_set ('display_errors', 1);

header('Content-type: text/html;  charset=utf-8');

include_once $_SERVER['DOCUMENT_ROOT'].'/rockform/test/model/test.class.php';
$test = new Test();

?>
<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="robots" content="noindex, nofollow" />
    <title>Тестирование</title>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" type="text/css" rel="stylesheet" />

  <style>
 
    .error {
       background:  red;
      padding: 10px 20px;
      margin-bottom: 15px;
      color: #fff;
      min-width: 250px;
      border-radius: 4px;
      font-family: arial;
      font-size: 16px;
    }
    .success {
       background: green;
      padding: 10px 20px;
      margin-bottom: 15px;
      color: #fff;
      min-width: 250px;
      border-radius: 4px;
      font-family: arial;
      font-size: 16px;
    }
  </style>
    <!-- Rockform -->
 
    <link href="/rockform/frontend/themes/default/main.css" type="text/css" rel="stylesheet" />
    <script data-main="/rockform/frontend/lib/app" src="/rockform/frontend/lib/require.min.js"></script>
    <!-- // Rockform -->

</head>

<body>
    <div class="container">
        <div class="page-header">
            <h1>Rockform тесты бэкенда</h1>
  
        </div>

  
<?php 


$test->init();

?>
<div class="page-header">
            <h1>Rockform тесты фронтенда</h1>
  <ol>
    <li><a href="frontend/tooltip.html">Проверка тултипов</a></li>
     <li><a href="frontend/dinamic.html">Проверка работы с динамически созданными тегами</a></li>
  </ol>
        </div>
        
    </div>
    <!-- /container -->
</body>

</html>
 