<?php

class Events_default {
	
	function before_set_validation($configs = array()) {

		return $configs;
	}

	function before_show_modal($attributes = array()) {

		return $attributes;
	}

	function before_success_modal($attributes = array()) {

		return $attributes;
	}

	function before_success_send_form($field = array(), $config = array()) {

		return array($field, $config);
	}

  	function after_success_send_form($field = array(), $config = array()){


	}
}