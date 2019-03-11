<?php

/**
 * Rockform - Simple, flexible async webform
 * @author Rock'n'code
 * @version 4.5.0
*/

$debug = 1;

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

require_once BF_PATH.'core/backend/polyfills.php';

if (version_compare(PHP_VERSION, '5.3.0', '<')) {
	require_once BF_PATH.'core/vendors/twig/twig/lib/Twig/Autoloader.php';
	require_once BF_PATH.'core/vendors/phpmailer/phpmailer/PHPMailerAutoload.php';
	require_once BF_PATH.'core/vendors/rockncoding/json/JSON.php';
	require_once BF_PATH.'core/vendors/rockncoding/kcaptcha/kcaptcha.php';
} else {
 	require_once BF_PATH.'core/backend/autoload.php';
}

$config_name = '';
if(isset($_POST['bf-config'])) {
	$config_name = preg_replace("/[^a-zA-Z0-9_\-]/","", $_POST['bf-config']);
}

//set events
require_once BF_PATH.'core/backend/events_default.class.php';

if(empty($config_name) || !file_exists(BF_PATH_CONFIGS.$config_name.'/events.php')){
	require_once BF_PATH.'core/backend/events.class.php';
} else {
	require_once BF_PATH_CONFIGS.$config_name.'/events.php';
	if(!class_exists('events')) {
		require_once BF_PATH.'core/backend/events.class.php';
	}
}

require_once BF_PATH.'core/backend/rockform.class.php';

$baseform = new baseform($config_name);
echo $baseform->init();
