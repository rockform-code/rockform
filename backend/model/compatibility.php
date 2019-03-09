<?php

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

		$json = new Services_JSON();
		return $json->encode($data);
	}
}