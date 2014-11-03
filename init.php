<?php

/**
* Rockform - Simple, flexible ajax webform.
* @version 3.0
*/

$debug = 1;

if($debug > 0) {
	ini_set('error_reporting', E_ALL);
	ini_set ('display_errors', 1);
}

define("BASE_FORM_PATH", $_SERVER['DOCUMENT_ROOT'].'/rockform/');

require_once BASE_FORM_PATH.'backend/lib/Twig-1.18.1/lib/Twig/Autoloader.php';
require_once BASE_FORM_PATH.'backend/lib/PHPMailer/PHPMailerAutoload.php';

session_start();

$config = array();
$lang = array();

$default_config_name = 'default';

//get default params
$config_ini = file_get_contents(BASE_FORM_PATH.'configs/'.$default_config_name.'/config.php');
$config_ini = explode('?>', $config_ini);
$config = parse_ini_string($config_ini[1]);

$config_name = isset($_REQUEST['bf-config']) ? preg_replace ("/[^a-zA-Z0-9_\-]/","", $_REQUEST['bf-config']) : '';

if(
	!file_exists(BASE_FORM_PATH.'configs/'.$config_name.'/') ||
 	empty($config_name)
) {
	$config_name = $default_config_name;
} else {
	$config_ini = file_get_contents(BASE_FORM_PATH.'configs/'.$config_name.'/config.php');
	$config_ini = explode('?>',$config_ini);
	$config_ini = parse_ini_string($config_ini[1]);

	foreach ($config_ini as $key => $value) {
		if(!empty($value)) {
			$config[$key] = $value;
		}
	}
}

$config['name'] = $config_name;

//add custom user php class

if(!file_exists(BASE_FORM_PATH.'configs/'.$config_name.'/model/events.class.php')) {
	require_once(BASE_FORM_PATH.'configs/'.$default_config_name.'/model/events.class.php');
} else {
	require_once(BASE_FORM_PATH.'configs/'.$config_name.'/model/events.class.php');
}

if(!empty($config['used_lang'])) {
	require_once(BASE_FORM_PATH.'backend/lexicon/'.$config['used_lang'].'.php');
}

require_once BASE_FORM_PATH.'backend/model/rockform.class.php';

$roсkform = new rockform($config, $lang);
echo $roсkform->init();
