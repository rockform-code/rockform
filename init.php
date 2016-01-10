<?php

/**
* Rockform - Simple, flexible ajax webform.
* @version 3.4
*/

$debug = 1;

if($debug > 0) {
	ini_set('error_reporting', E_ALL);
	ini_set ('display_errors', 1);
}

if(!function_exists('parse_ini_string')){
	function parse_ini_string($str = '', $flag = false) {

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

									if(
										!isset($ret[$inside_section][$arr_name]) ||
									 	!is_array($ret[$inside_section][$arr_name])
									 ) {
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

			if($flag === false) {
					$temp_ret = array();
					foreach ($ret as $ret_block) {
						foreach ($ret_block as $ret_item_key => $ret_item) {
							$temp_ret[$ret_item_key] = $ret_item;
						}
					}
					$ret = $temp_ret;
			}

			return $ret;
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

define("BASE_FORM_PATH", $_SERVER['DOCUMENT_ROOT'].'/rockform/');
session_start();

require_once BASE_FORM_PATH.'backend/model/rockform.class.php';
$rockform = new rockform();
echo $rockform->init();
