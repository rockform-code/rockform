<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="robots" content="noindex, nofollow"/>
    <title>Тестирование</title>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" type="text/css"
          rel="stylesheet"/>

    <style>

        .error {
            background: red;
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
    <script src=https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js></script>
    <link href="/rockform/core/themes/default/main.css" type="text/css" rel="stylesheet"/>
    <script src="/rockform/dist/rockform.min.js"></script>
    <!-- // Rockform -->

    <script src="/rockform/test/frontend/js/dinamic.js"></script>
</head>

<body>
<div class="container">
    <div class="page-header">
        <h1>Rockform тесты</h1>

        <ol>
            <li> Проверка валидации</li>
            <li>Проверка событий</li>
            <li>Проверка появления окна успешного выполнения</li>
            <li>Проверка таймера</li>
            <li>Проверка кнопки закрытия</li>
            <li>Проверка в разных браузерах</li>
            <li>Проверка в разных версиях php</li>
            <li>Проверка конфликтов с jquery</li>
        </ol>
    </div>


    <?php

    header('Content-type: text/html;  charset=utf-8');

    define("BF_PATH", $_SERVER['DOCUMENT_ROOT'] . '/rockform/');

    $frontend = scandir(BF_PATH . '/test/frontend/');

    foreach ($frontend as $file) {
        if (preg_match('~\.html~', $file)) {
            ?>
            <div style="display: inline-block; width: 100%;">
                <?php
                include(BF_PATH . '/test/frontend/' . $file);
                ?>
            </div>
            <?php
        }

    }

    ?>


    <br>
    <br> <br> <br>
</div>
<!-- /container -->
</body>

</html>
 