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
    <title><?=$title?></title>
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

 <!--[if lt IE 8]> 
         <script src="/rockform/frontend/lib/json2.js"></script>
       <link href="/rockform/themes/default/ie.css" type="text/css" rel="stylesheet" />
     <![endif]-->

<?php if(isset($_GET['alt'])) { ?> 
 
    <link href="/rockform/themes/default/main.css" type="text/css" rel="stylesheet" />
    <script src="/rockform/core/frontend/lib/jquery.min.js"></script>
    <script src="/rockform/core/frontend/lib/jquery.mask.min.js"></script>
    <script src="/rockform/core/frontend/lib/jquery.form.min.js"></script>
    <script src="/rockform/core/frontend/lib/baseform.min.js"></script>


<?php } else { ?>
 
   <link href="/rockform/core/themes/default/main.css" type="text/css" rel="stylesheet" />
    <script data-main="/rockform/core/frontend/lib/app" src="/rockform/frontend/lib/require.min.js"></script>
 <?php } ?>
<!-- // Rockform -->

 
    <script src="/rockform/test/frontend/js/dinamic.js"></script>
</head>

<body>
    <div class="container">
        <div class="page-header">
            <h1>Rockform тесты бэкенда</h1>
  
        </div>
