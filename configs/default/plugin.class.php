<?php

class Events {
	public static function before_success_send_form($field = array(), $config = array()) {
  
		return array($field, $config);
	}

  public static function after_success_send_form($field = array(), $config = array()){

	}
}
