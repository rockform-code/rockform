<?php

class Events {
	
	function before_set_validation($configs = array()) {

		return $configs;
	}

	function before_show_modal($attributes = array()) {

		$attributes['test1'] = 123;

		return $attributes;
	}

	function before_success_modal($attributes = array()) {

		$attributes['test2'] = 123;

		return $attributes;
	}

	function before_success_send_form($fields = array(), $config = array()) {

		$fields['test3'] = 123;

		return array($fields, $config);
	}

  	function after_success_send_form($field = array(), $config = array()){


	}
}