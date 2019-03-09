<?php

/**
* Rockform - Simple, flexible ajax webform.
* @version 4.0.0
*/

$debug = 1;
if($debug > 0) {
	ini_set('error_reporting', E_ALL);
	ini_set ('display_errors', 1);
}

session_start();

define("BASE_FORM_PATH", $_SERVER['DOCUMENT_ROOT'].'/rockform/');

require_once BASE_FORM_PATH.'backend/model/compatibility.php';

if (version_compare(PHP_VERSION, '5.3.0', '<')) {
	require_once BASE_FORM_PATH.'backend/lib/twig/twig/lib/Twig/Autoloader.php';
	require_once BASE_FORM_PATH.'backend/lib/phpmailer/phpmailer/PHPMailerAutoload.php';
	require_once BASE_FORM_PATH.'backend/lib/rockncoding/json/JSON.php';
	require_once BASE_FORM_PATH.'backend/lib/rockncoding/kcaptcha/kcaptcha.php';
} else {
 	require_once BASE_FORM_PATH.'backend/lib/autoload.php';
}

require_once BASE_FORM_PATH.'backend/model/baseform.class.php';

$baseform = new baseform();
echo $baseform->init();
