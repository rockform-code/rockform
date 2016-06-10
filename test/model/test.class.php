<?php 

class Test {

  function __construct() {

  }

  function init() {

    define("BASE_FORM_PATH", $_SERVER['DOCUMENT_ROOT'].'/rockform/');
    session_start();

    require_once BASE_FORM_PATH.'backend/lib/twig/twig/lib/Twig/Autoloader.php';
    require_once BASE_FORM_PATH.'backend/lib/phpmailer/phpmailer/PHPMailerAutoload.php';
    require_once BASE_FORM_PATH.'backend/model/baseform.class.php';

    $this->baseform = new baseform();

    //Check work parser config
    echo $this->report($this->test_parse_config(), 'Проверка работы функции парсинга конфига.'); 
 
  }

  function report($value = false, $name = 'test') {
    $out = '';
    if($value === true) {
        $out .= '<p class="success">'.$name.'</p>';
    } else {
        $out .= '<p style="error">'.$name.'</p>';
    }
    return $out;
  }

  function test_parse_config() {

    $origin = array(
      'config' => Array ( 'mail_to' => 'test@yandex.ru', 'subject' => 'Сообщение с сайта' ) ,
      'validation' => Array ( 'name' => 'required,minlength[3],words', 'phone[][123][]' => 'required' )
    );

    $data = "[config]

    ; Почта получателей. Можно несколько через запятую.
    mail_to = test@yandex.ru; comments
    subject = 'Сообщение с сайта'

    [validation]

    name = 'required,minlength[3],words'
    phone[][123][] = 'required';
    ";

      $reflectionMethod = new ReflectionMethod('Baseform', 'parse_config');
      $reflectionMethod->setAccessible(true);

      $result = $reflectionMethod->invokeArgs($this->baseform , [$data, true]);

      if(strcmp(serialize($result), serialize($origin)) == 0) {
          return true;
      } else {
        echo '<pre>';
          print_r($result);
         echo '</pre>';
        return false;
      }

  }

}
