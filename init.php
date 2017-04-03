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

$config_name = '';
if(isset($_POST['bf-config'])) {
	$config_name = preg_replace("/[^a-zA-Z0-9_\-]/","", $_POST['bf-config']);
}

//set events
require_once BF_PATH.'core/backend/baseform/events_default.class.php';

if(empty($config_name) || !file_exists(BF_PATH.'configs/'.$config_name.'/events.php')){
	require_once BF_PATH.'core/backend/baseform/events.class.php';
} else {
	require_once BF_PATH.'configs/'.$config_name.'/events.php';
	if(!class_exists('events')) {
		require_once BF_PATH.'core/backend/baseform/events.class.php';
	}
}

require_once BF_PATH.'core/backend/baseform/baseform.class.php';

$baseform = new baseform($config_name);
echo $baseform->init();
