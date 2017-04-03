<?php

class Events_default {
	
	function before_set_validation() {

	}

	function before_show_modal() {

	}

	function after_show_modal() {

	}

	function before_success_send_form($field = array(), $config = array()) {

  
		return array($field, $config);
	}

  	function after_success_send_form($field = array(), $config = array()){


	}
}