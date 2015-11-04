<?php

/**
* Rockform - Simple, flexible ajax webform.
* @version 3.1
*/

$debug = 1;

if($debug > 0) {
	ini_set('error_reporting', E_ALL);
	ini_set ('display_errors', 1);
}

if ( !function_exists( 'parse_ini_string' ) ) {

function parse_ini_string($str) {

    if(empty($str)) return false;

    $lines = explode("\n", $str);
    $ret = Array();
    $inside_section = false;

    foreach($lines as $line) {

        $line = trim($line);

        if(!$line || $line[0] == "#" || $line[0] == ";") continue;

        if($line[0] == "[" && $endIdx = strpos($line, "]")){
            $inside_section = substr($line, 1, $endIdx-1);
            continue;
        }

        if(!strpos($line, '=')) continue;

        $tmp = explode("=", $line, 2);

        if($inside_section) {

            $key = rtrim($tmp[0]);
            $value = ltrim($tmp[1]);

            if(preg_match("/^\".*\"$/", $value) || preg_match("/^'.*'$/", $value)) {
                $value = mb_substr($value, 1, mb_strlen($value) - 2);
            }

            $t = preg_match("^\[(.*?)\]^", $key, $matches);
            if(!empty($matches) && isset($matches[0])) {

                $arr_name = preg_replace('#\[(.*?)\]#is', '', $key);

                if(!isset($ret[$inside_section][$arr_name]) || !is_array($ret[$inside_section][$arr_name])) {
                    $ret[$inside_section][$arr_name] = array();
                }

                if(isset($matches[1]) && !empty($matches[1])) {
                    $ret[$inside_section][$arr_name][$matches[1]] = $value;
                } else {
                    $ret[$inside_section][$arr_name][] = $value;
                }

            } else {
                $ret[$inside_section][trim($tmp[0])] = $value;
            }

        } else {

            $ret[trim($tmp[0])] = ltrim($tmp[1]);

        }
    }
    return $ret;
}

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
