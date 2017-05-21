<?php

class Baseform extends Events {

	protected $config, $lexicon, $fields, $valid;

	function __construct($config_name = '') {
 
		$this->set_config($config_name);

		$templates_path = BF_PATH_CONFIGS.$this->config['name'].'/templates/';
		if(!file_exists($templates_path)){
			$templates_path = BF_PATH.'core/config/templates/';
		}

		Twig_Autoloader::register(true);
		$loader = new Twig_Loader_Filesystem($templates_path);
		$this->twig = new Twig_Environment(
			$loader, 
			array(
				'charset' => $this->config['charset']
			)
		);
		$this->twig_string = new Twig_Environment(new Twig_Loader_String());
 
	}

	private function set_config($config_name = '') {

		$config = array();
		$lexicon = array();
		$this->valid = array();

		//set default config
		$params = $this->get_config(BF_PATH.'core/config/config.ini.php');
		$config = isset($params['config']) ? $params['config'] : array();

		$config['name'] = $config_name;
 
		if(!empty($config['name'])) {
 
			$params_custom = $this->get_config(BF_PATH_CONFIGS.$config['name'].'/config.php');

			if(isset($params_custom['validation']) && is_array($params_custom)) {
		 		$this->valid = $params_custom['validation'];
		 	}

			if(!empty($params_custom['config']) && is_array($params_custom)) { 
				foreach ($params_custom['config'] as $k => $value) {
					$config[$k] = $value;
				}
			}
		}

		$config['lexicon'] = empty($config['lexicon']) ? 'default' : $config['lexicon'];
		$this->lexicon = $this->get_lexicon($config['lexicon']);

		//config mail
		$config['mail_disable_send'] = !isset($config['mail_disable_send']) ? 0 : $config['mail_disable_send'];

		$config['mail_to'] = empty($config['mail_to']) ? '' : $config['mail_to'];
 		$config['mail_subject'] = empty($config['mail_subject']) ? $this->lexicon['mail_subject'] : $config['mail_subject'];
 		$config['mail_from'] = empty($config['mail_from']) ? $this->lexicon['mail_from'] : $config['mail_from'];
 		$config['mail_from_name'] = empty($config['mail_from_name']) ? $this->lexicon['mail_from_name'] : $config['mail_from_name'];

 		$config['mail_add_cc'] = empty($config['mail_add_cc']) ? '' : $config['mail_add_cc'];
 		$config['mail_add_bcc'] = empty($config['mail_add_bcc']) ? '' : $config['mail_add_bcc'];
 		$config['mail_reply_to'] = empty($config['mail_reply_to']) ? '' : $config['mail_reply_to'];
 		$config['mail_confirm_reading_to'] = empty($config['mail_confirm_reading_to']) ? '' : $config['mail_confirm_reading_to'];

 		$config['mail_smtp_host'] = empty($config['mail_smtp_host']) ? '' : $config['mail_smtp_host'];
 		$config['mail_smtp_auth'] = empty($config['mail_smtp_auth']) ?  '' : $config['mail_smtp_auth'];
 		$config['mail_smtp_username'] = empty($config['mail_smtp_username']) ? '' : $config['mail_smtp_username'];
 		$config['mail_smtp_password'] = empty($config['mail_smtp_password']) ? '' : $config['mail_smtp_password'];
 	 	$config['mail_smtp_secure'] = empty($config['mail_smtp_secure']) ? 'ssl' : $config['mail_smtp_secure'];
		$config['mail_smtp_port'] = empty($config['mail_smtp_port']) ? 465 : $config['mail_smtp_port'];

		$config['charset'] = empty($config['charset']) ? 'utf-8' : $config['charset'];

		$config['tmp_popup'] = empty($config['tmp_popup']) ? 'popup.html' : $config['tmp_popup'];
		$config['tmp_report'] = empty($config['tmp_report']) ? 'report.html' : $config['tmp_report'];
 		$config['tmp_success'] = empty($config['tmp_success']) ? 'success.html' : $config['tmp_success']; 
 
		$this->config = $config; 
	}

	private function get_lexicon($lexicon = '') {
		$out = array();
		if(file_exists(BF_PATH.'core/lexicon/'.$lexicon.'.ini')) {
			$lexicon = file_get_contents(BF_PATH.'core/lexicon/'.$lexicon.'.ini');
			$out = $this->parse_config($lexicon);
		}  
		return $out;
	}

	private function get_config($path = '') {
		$out = array();

		if(file_exists($path) && !empty($path)) {
			$config_ini = file_get_contents($path);
			$config_ini = explode('?>', $config_ini);
			$out = $this->parse_config($config_ini[1]);
		}
		
		return $out; 
	}

	private function parse_config($str = '', $flag = true) {

		$inside_section = false;
		$ret = array();

		if(!empty($str)) {
			$lines = explode("\n", $str);

			foreach($lines as $line) {

				$line = trim($line);

				if(!$line || $line[0] == "#" || $line[0] == ";") continue;

				if($line[0] == "[" && $endIdx = strpos($line, "]")){
					if($flag === true) {
						$inside_section = substr($line, 1, $endIdx-1);
					}
					continue;
				}

				if(!strpos($line, '=')) continue;

				$tmp = explode("=", $line, 2);

				$key = trim($tmp[0]);

				$value = explode(";", $tmp[1]);
				if(count($value) > 1) {
					unset($value[count($value) - 1]);
				}
				$value = trim(implode(";", $value));

				if(preg_match("/^\".*\"$/", $value) || preg_match("/^'.*'$/", $value)) {
					$value = mb_substr($value, 1, mb_strlen($value) - 2);
				}

				if($inside_section) {
					$ret[$inside_section][$key] = $value;
				} else {
					$ret[$key] = $value;
				}
			}
 		}
		return $ret;
	}

	public function init() {

		$type = isset($_REQUEST['type']) ? preg_replace ("/[^a-z_]/i","", $_REQUEST['type']) : 'default';

		$out = array();
 
 		switch ($type) {
 		 
 			//set capcha
 			case 'capcha': 
 			return $this->set_capcha();
 
 			//set popup form
			case 'form': 
    		 	$out = $this->set_base_form();
    		break;

    		//check validation
    		case 'validation': 
    			$out = $this->set_json_encode($this->check_validation());
    		break;

    		//set form success
    		case 'form_success': 
    			$out = $this->set_form_success();
    		break;
 
    		//set message
			default:  
			
				$fields = isset($_POST) ? $_POST : array();
				$data = array_merge($fields, $_SERVER);

				foreach ($this->config as $k => $v) {
					$this->config[$k] = $this->twig_string->render($v, $data);
				}
 
				$out = $this->set_json_encode($this->set_form_data()); 
			break;
		}

		return $out;
	}

	function set_capcha() {
		$captcha = new KCAPTCHA();
		$_SESSION['captcha_keystring'] = $captcha->getKeyString();
	}

	private function set_form_data() {

		$out = array();

 		$fields = array();
		foreach ($_POST as $key => $value) {
			if(is_array($value)) {
				$fields[$key] = implode(', ',$value);
			} else {
				$fields[$key] = $value;
			}
		}
 
		list($fields, $config) = $this->before_success_send_form($fields, $this->config);
		$this->fields = $fields;
		$this->config = $config;
 
		//spam protection
 
		$error_check_spam = $this->check_spam();

		if(empty($error_check_spam)) {
			if(empty($config['mail_disable_send'])) {

				$mail_out = $this->set_mail($config);

				if($mail_out) {
					$out = $this->set_form_data_status(1, $this->lexicon['success_email_send']);
				} else {
					$out = $this->set_form_data_status(0, $this->lexicon['err_email_send']);
				}
			} else {
				$out = $this->set_form_data_status(1, $this->lexicon['success_email_send']);
			}

			$this->after_success_send_form($fields, $config);

 		} else {
 			$out = $error_check_spam;
 		}

		return $out;
	}

	private function set_report_form() {
		return $this->twig->render($this->config['tmp_report'], $this->fields);
	}

	private function set_base_form() {
		$attributes = isset($_POST['attributes']) ? $_POST['attributes'] : array(); 
		$attributes['SERVER'] = $_SERVER;
		$attributes['bf_config'] = $this->config;

		//events
		$attributes = $this->before_show_modal($attributes);

		return $this->twig->render($this->config['tmp_popup'], $attributes);
	}

	private function set_form_success($attributes = array()) { 

		$attributes = $this->before_success_modal($attributes);

		return $this->twig->render($this->config['tmp_success'], $attributes);
	}

	private function set_form_data_status($status = 0, $value = '') {
		return array(
			'status' => $status, 
			'value' => $value, 
			'bf-config' => $this->config['name']
		);
	}

	private function check_validation() {

		//checks for validation rules
		$configs = $this->get_validation_configs();
		//events
		$configs = $this->before_set_validation($configs);
 
		$out = array();
 
		if(!empty($configs)) { 
			foreach ($configs as $name => $type) {
				foreach ($type as $type_element) {

					//Validation parameters of the filter
					$detail_params = explode('[', $type_element); 
					//Type the name of the validation
					$name_params = $detail_params[0]; 
 
					if(!empty($detail_params[1])) {
						$detail_params = str_replace(']', '', $detail_params[1]);
					}

					$err = $this->set_validation($name, array($name_params, $detail_params));
					if(!empty($err)) {
						$out[$name][$name_params] = $err;
					}
					 
				}
			}
		}

		//Verifying the existence of mail address
		$mail_disable_send = $this->config['mail_disable_send'];
		$mail_to = $this->config['mail_to'];
		if(empty($mail_to) && empty($mail_disable_send)) {
			$out['mail_to'] = $this->lexicon['err_isset_email'];
		}

		$out['filesize'] = $this->check_file_uploads();

		$out['token'] = $_SESSION['bf-token'] = md5(uniqid());

		return $out;
	}

	private function set_validation($name = '', $type = '') {

		list($type_name, $type_param) = $type;


		$fields = isset($_POST['fields']) ? $_POST['fields'] : array();
 
		$field_value = '';
		$field_size = '';

 		//get the value of the field to check
		foreach ($fields as $field) { 
			if(strcmp($name, $field['name']) == 0) {
				if(isset($field['value'])) {
					$field_value = isset($field['value']) ? $field['value'] : 0;
					$field_size = isset($field['size']) ? $field['size'] : 0;
				}
			}
		}

 		$out = array();

		switch ($type_name) {
			case 'min': //Makes the element require a given minimum.
			break;
			case 'max': //Makes the element require a given maximum.
			break;
			case 'range': //Makes the element require a given value range.
			break;
			case 'regexp':

			break;
			case 'email': //Makes the element require a valid email
				if(!empty($field_value)) {
					if (!filter_var($field_value, FILTER_VALIDATE_EMAIL)) {
						$out = $this->lexicon['valid_email'];
					}
				}
			break;
			case 'url': //Makes the element require a valid url
				if(!empty($field_value)) {
					if (!filter_var($field_value, FILTER_VALIDATE_URL)) {
						$out = $this->lexicon['valid_url'];
					}
				}
			break;
			case 'ip': //Makes the element require a valid url
				if(!empty($field_value)) {
					if (!filter_var($field_value, FILTER_VALIDATE_IP)) {
						$out = $this->lexicon['valid_ip'];
					}
				}
			break;
			case 'number': //Makes the element require a decimal number.
				if(!empty($field_value)) {
					if (!filter_var($field_value, FILTER_VALIDATE_FLOAT)) {
						$out = $this->lexicon['valid_number'];
					}
				}
			break;
			case 'digits': //Makes the element require digits only.
				if(!empty($field_value)) {
					if (!filter_var($field_value, FILTER_VALIDATE_INT)) {
						$out = $this->lexicon['valid_digits'];
					}
				}
			break;
			case 'letter':
				if(!empty($field_value)) {
					if(
					!preg_match('~^\p{L}+$~u', $field_value)
					) {
						$out = $this->lexicon['valid_word'];
					}
				}
			break;
			case 'words':
				if(!empty($field_value)) {
					if(!preg_match('~^[\p{L} \-]+$~iu', $field_value)) {
						$out = $this->lexicon['valid_words'];
					}
				}
			break;
			case 'file':

				if(!empty($field_value)) {
					$type_params = explode(',', $type_param);

					if(!empty($type_params)) {
							$e = 0;

							foreach ($type_params as $value) {
								if(!empty($value)) {
									$value = str_replace('.', '\.', $value);
									if(preg_match('~'.$value.'$~i', $field_value)) {
										$e = $e + 1;
									}
								}
							}
							if(empty($e)) {
								$out = $this->twig_string->render(
									$this->lexicon['valid_file'],
									array('file' => $type_param)
								);
							}
					}
				}

			break;
			case 'filesize': 
 
				if(!empty($field_value)) {
					if(!empty($type_param)) {
						if($type_param < $field_size) {
							
							$size = $this->format_byte_to_megabyte($type_param);
							$size_user = $this->format_byte_to_megabyte($field_size);

							$out = $this->twig_string->render(
								$this->lexicon['valid_filesize'],
								array(
									'size' => $size,
									'size_user' =>  $size_user
								)
							);
						}
					}
				}
			break;
			case 'minlength': //Makes the element require a given minimum length.
				if(!empty($field_value)) {
					$field_count = mb_strlen($field_value, 'utf-8');
						if($field_count < intval($type_param)) {
							$out = $this->twig_string->render(
							$this->lexicon['valid_minlength'],
							array('minlength' => intval($type_param))
						);
					}
				}
			break;
			case 'maxlength': //Makes the element require a given maxmimum length.
				if(!empty($field_value)) {
					$field_count = mb_strlen($field_value, 'utf-8');
					if($field_count > intval($type_param)) {
						$out = $this->twig_string->render(
						$this->lexicon['valid_maxlength'],
						array('maxlength' => $type_param)
						);
					}
				}
			break;
			case 'rangelength': //Makes the element require a given value range.
				if(!empty($field_value)) {
			  		$field_count = mb_strlen($field_value, 'utf-8');
					$type_param = explode(',', $type_param);

					if(count($type_param) == 2) {
						if(
							$field_count > intval($type_param[1]) ||
							$field_count < intval($type_param[0])
						) {
						    $out = $this->twig_string->render(
								$this->lexicon['valid_rangelength'],
								array(
									'maxlength' => $type_param[1],
									'minlength' => $type_param[0]
								)
							);
						}
					}
				}
			break;
			case 'capcha': //Makes the element required.
				$_SESSION['captcha_keystring'] = 
				isset($_SESSION['captcha_keystring']) ? $_SESSION['captcha_keystring'] : '';
				 
				if(
					strcmp($_SESSION['captcha_keystring'], $field_value) !== 0
				){
					$out = $this->lexicon['valid_capcha'];
				}
			break;
			case 'required': //Makes the element required.
				if(empty($field_value)) {
					$out = $this->lexicon['valid_required'];
				}
			break;
			default:
				# code...
			break;
		}
		return $out;
	}

	private function get_validation_configs() {
		$out = array();
		 
		$configs = $this->valid;
		if(!empty($configs)) {
			foreach ($configs as $key => $value) {
				preg_match_all('~([a-z_]+(\[.*?\])?)~iu', $value, $match);
				$out[$key] = $match[1];
			}
		}
		 
		return $out;
	}

	private function check_spam() {
		$out = '';

		//ajax check
		if(
			!isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
			!strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'
		) {
			$out = $this->set_form_data_status(0, $this->lexicon['err_spam']);
		}  

		//CSRF check
		$token = isset($_POST['bf-token']) ? $_POST['bf-token'] : '';
		$_SESSION['bf-token'] = isset($_SESSION['bf-token']) ? $_SESSION['bf-token'] : 0;

		if(!empty($token) && (strcmp($_SESSION['bf-token'], $token) !== 0)) {
			$out = $this->set_form_data_status(0, $this->lexicon['err_spam']);
		}

		return $out;
	}

	protected function check_file_uploads() {
		$out = '';
 
 		$filesize = isset($_POST['filesize']) ? $_POST['filesize'] : array();

		if(array_sum($filesize) > 0) {

			//Проверка включена ли поддержка загрузки файлов
			if(ini_get('file_uploads')) {

				//Проверка, что файлов в форме меньше, чем разрешено на сервере
 				if(ini_get('max_file_uploads')) {
 					if(ini_get('max_file_uploads') < count($filesize)) {
 						$out = $this->lexicon['err_file_uploads_count'];
 					}
				}

				$post_max_size = $this->format_size_to_byte(ini_get('post_max_size'));
				$upload_max_filesize = $this->format_size_to_byte(ini_get('upload_max_filesize'));

				//размер файлов
				$max_size = $post_max_size;
				if($upload_max_filesize < $max_size) {
					$max_size = $upload_max_filesize;
				}

				if($max_size < array_sum($filesize)) {
 
 					$out = $this->twig_string->render(
						$this->lexicon['err_file_uploads_size'],
						array(
							'max_size' => $this->format_byte_to_megabyte($max_size)
						)
					);
				}
 
			} else {
				$out = $this->lexicon['err_file_uploads_none'];
			}
		}

		return $out;
	}

	private function format_size_to_byte($size = 0){
		$byte = 0;

		if(preg_match('~G~i', $size)) {
			$byte = intval($size) * 1024 * 1024 * 1024;
		} else if(preg_match('~M~i', $size)) {
			$byte = intval($size) * 1024 * 1024;
		} else if(preg_match('~K~i', $size)) {
			$byte = intval($size) * 1024;
		} else {
			$byte = intval($size);
		}

		return $byte;
	}

	private function format_byte_to_megabyte($byte = 0){
		return round(($byte / 1024 / 1024), 2);
	}

	protected function set_mail($config = array()) {

		$body = $this->set_report_form();

		$mail = new PHPMailer();

		$mail->CharSet = $config['charset'];
		$mail->From =  $config['mail_from'];
		$mail->FromName = $config['mail_from_name'];
		$mail->isHTML(true);
		$mail->Subject = $config['mail_subject'];

		$mail->Body = $body;
		$mail->AltBody = strip_tags($body);

 		$this->set_files_on_mail($mail);
 
		foreach($this->parser_option_mail($config['mail_to']) as $m) { 
			$mail->addAddress($m[0], $m[1]);
		}

		foreach($this->parser_option_mail($config['mail_add_cc']) as $m) { 
			$mail->addAddress($m[0], $m[1]);
		}

		foreach($this->parser_option_mail($config['mail_add_bcc']) as $m) { 
			$mail->addAddress($m[0], $m[1]);
		}
 
		foreach($this->parser_option_mail($config['mail_reply_to']) as $m) { 
			$mail->addAddress($m[0], $m[1]);
		}
 		
 		if(!empty($config['mail_confirm_reading_to'])){
			$mail->ConfirmReadingTo = $config['mail_confirm_reading_to'];
 		}

		if($this->config['mail_smtp_auth']) {
			//$mail->SMTPDebug = 3;

			$mail->isSMTP(); // Set mailer to use SMTP
			$mail->Host = $config['mail_smtp_host'];  // Specify main and backup SMTP servers
			$mail->SMTPAuth = $config['mail_smtp_auth']; // Enable SMTP authentication
			$mail->Username = $config['mail_smtp_username']; // SMTP username
			$mail->Password = $config['mail_smtp_password']; // SMTP password
			$mail->SMTPSecure = $config['mail_smtp_secure']; // Enable TLS encryption, `ssl` also accepted
			$mail->Port = $config['mail_smtp_port']; // TCP port to connect to
		}

		return $mail->send();
	}

	private function parser_option_mail($option = '') {
		$out = array();
		$option = explode(',', $option);

		foreach ($option as $row) {
			$row = explode('(', $row);
			if(!empty($row[1])) {
				$row[1] = str_replace(')', '', $row[1]);
			} else {
				$row[1] = '';
			}
			$out[] = array(trim($row[0]), trim($row[1]));
		}
		return $out;
	}

	private function set_files_on_mail($mail) {
		$err = array();
 
		foreach ($_FILES as $name_upload_file => $files) {

			if(isset($_FILES[$name_upload_file]["name"])) {
				if(is_array($_FILES[$name_upload_file]['name'])) {
					foreach ($_FILES[$name_upload_file]['name'] as $key => $name_file) {
						if ($_FILES[$name_upload_file]['error'][$key] == UPLOAD_ERR_OK) {
    						$mail->AddAttachment(
    							$_FILES[$name_upload_file]['tmp_name'][$key],
    							$_FILES[$name_upload_file]['name'][$key],
    								'base64',
    								$_FILES[$name_upload_file]['type'][$key]
    						);
						} else {
							$err = $this->set_form_data_status(0, $this->lexicon['err_file_uploads']);
						}
					} 
				} else {
					if ($_FILES[$name_upload_file]['error'] == UPLOAD_ERR_OK) {
    					$mail->AddAttachment(
    						$_FILES[$name_upload_file]['tmp_name'],
    						$_FILES[$name_upload_file]['name'],
    						'base64',
    						$_FILES[$name_upload_file]['type']
    					);
					} else {
						$err = $this->set_form_data_status(0, $this->lexicon['err_file_uploads']);
					}
				}
			}
		}

		return $err;
	}

	protected function set_json_encode($value) {
		header('Content-type: text/json;  charset=utf-8');
		header('Content-type: application/json');
		return  json_encode($value);
	}
}
