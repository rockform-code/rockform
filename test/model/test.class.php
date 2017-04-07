<?php 

class Test {

  function __construct() {

  }

  function init() {
    
$debug = 2; 

if($debug > 0) {
  ini_set('error_reporting', E_ALL);
  ini_set ('display_errors', 1);
}

session_start();

define("BF_PATH", $_SERVER['DOCUMENT_ROOT'].'/rockform/'); 

if($debug == 2) {
  define("BF_PATH_CONFIGS", BF_PATH.'test/configs/'); 
} else {
  define("BF_PATH_CONFIGS", BF_PATH.'configs/'); 
}

require_once BF_PATH.'core/backend/baseform/compatibility.php';

if (version_compare(PHP_VERSION, '5.3.0', '<')) {
  require_once BF_PATH.'core/backend/twig/twig/lib/Twig/Autoloader.php';
  require_once BF_PATH.'core/backend/phpmailer/phpmailer/PHPMailerAutoload.php';
  require_once BF_PATH.'core/backend/rugoals/json/JSON.php';
  require_once BF_PATH.'core/backend/rugoals/kcaptcha/kcaptcha.php';
} else {
  require_once BF_PATH.'core/backend/autoload.php';  
}

$config_name = '';
if(isset($_POST['bf-config'])) {
  $config_name = preg_replace("/[^a-zA-Z0-9_\-]/","", $_POST['bf-config']); 
}

//set events        
require_once BF_PATH.'core/backend/baseform/events_default.class.php';

if(empty($config_name) || !file_exists(BF_PATH_CONFIGS.$config_name.'/events.php')){
  require_once BF_PATH.'core/backend/baseform/events.class.php';
} else {
  require_once BF_PATH_CONFIGS.$config_name.'/events.php';
  if(!class_exists('events')) {
    require_once BF_PATH.'core/backend/baseform/events.class.php';
  }
}

require_once BF_PATH.'core/backend/baseform/baseform.class.php';

    $this->baseform  = new baseform($config_name);
 
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

      $result = $reflectionMethod->invokeArgs($this->baseform , array($data, true));

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
