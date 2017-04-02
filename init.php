<?php

/**
* Rockform - Simple, flexible ajax webform.
* @version 4.1.0
*/

$debug = 1;
if($debug > 0) {
	ini_set('error_reporting', E_ALL);
	ini_set ('display_errors', 1);
}

session_start();

define("BF_PATH", $_SERVER['DOCUMENT_ROOT'].'/rockform/');

require_once BF_PATH.'core/backend/baseform/compatibility.php';

if (version_compare(PHP_VERSION, '5.3.0', '<')) {
	require_once BF_PATH.'core/backend/twig/twig/lib/Twig/Autoloader.php';
	require_once BF_PATH.'core/backend/phpmailer/phpmailer/PHPMailerAutoload.php';
	require_once BF_PATH.'core/backend/rockncoding/json/JSON.php';
	require_once BF_PATH.'core/backend/rockncoding/kcaptcha/kcaptcha.php';
} else {
 	require_once BF_PATH.'core/backend/autoload.php';
}

require_once BF_PATH.'core/backend/baseform/baseform.class.php';

$baseform = new baseform();
echo $baseform->init();
