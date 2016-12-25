<?php

/**
* Rockform - Simple, flexible ajax webform.
* @version 3.16.1
*/

$debug = 0;
if($debug > 0) {
	ini_set('error_reporting', E_ALL);
	ini_set ('display_errors', 1);
}

if(!function_exists('mb_substr')){
    function mb_substr($string, $offset, $length) {
        $arr = preg_split("//u", $string);
        $slice = array_slice($arr, $offset + 1, $length);
        return implode("", $slice);
    }
}

if(!function_exists('mb_strlen')){
	function mb_strlen($string = '') {
    	return (count(preg_split("//u", $string)) - 2);
	}
}

if(!function_exists('hash')){
	function hash ($algo = '', $data = '') {
		return md5($data);
	}
}

if(!function_exists('ctype_alpha')){
	function ctype_alpha() {
		return true;
	}
}

if(!function_exists('json_encode')){
	function json_encode($data) {
		require_once BASE_FORM_PATH.'backend/lib/Services_JSON-1.0.3/JSON.php';
		$json = new Services_JSON();
		return $json->encode($data);
	}
}

define("BASE_FORM_NAME", 'rockform');
define("BASE_FORM_PATH", $_SERVER['DOCUMENT_ROOT'].'/'.BASE_FORM_NAME.'/');

session_start();

require_once BASE_FORM_PATH.'backend/lib/twig/twig/lib/Twig/Autoloader.php';
require_once BASE_FORM_PATH.'backend/lib/phpmailer/phpmailer/PHPMailerAutoload.php';
require_once BASE_FORM_PATH.'backend/model/baseform.class.php';

$baseform = new baseform();
echo $baseform->init();
