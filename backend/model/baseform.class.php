<?php

class Baseform {

	protected $config, $lexicon, $field;

	var $tmp_form_popup = 'form_popup.html';
	var $tmp_report_on_mail = 'report_on_mail.html';
	var $tmp_report_after_send_form = 'report_after_send_form.html';

	function __construct() {
		$this->set_default_config();

		Twig_Autoloader::register(true);
		$loader = new Twig_Loader_Filesystem('configs/'.$this->config['name'].'/templates/');
		$this->twig = new Twig_Environment($loader);
		$this->twig_string = new Twig_Environment(new Twig_Loader_String());

		if(
			!file_exists(BASE_FORM_PATH.'configs/'.$this->config['name'].'/events.php')
		) {
			require_once BASE_FORM_PATH.'configs/default/events.php';
		} else {
			require_once BASE_FORM_PATH.'configs/'.$this->config['name'].'/events.php';
		}

	}

	private function set_default_config() {

		$config = array();
		$lexicon = array();

		$config = $this->parse_config_ini_file();
		$config['name'] = $this->get_config_name();

		if(!preg_match('~^default$~', $config['name'])) {

			//delete default validation
			foreach ($config as $key => $value) {
				if(preg_match('~^@~', $key)) {
					unset($config[$key]);
				}
			}

			$config_custom = $this->parse_config_ini_file($config['name']);
		//	print_r($config_custom);
			if(!empty($config_custom) && is_array($config_custom)) {
				//replace default value
				foreach ($config_custom as $k => $value) {
					//if(!empty($value)) {
						$config[$k] = $value;
					//}
				}
			}
		}

		//set lexicon
		if(empty($config['used_lexicon'])) {
			$config['used_lexicon'] = 'default';
		}
		$config_ini = parse_ini_file(BASE_FORM_PATH.'backend/lexicon/'.$config['used_lexicon'].'.ini');

		foreach ($config_ini as $key => $value) {
					if(!empty($value)) {
							$lexicon[$key] = $value;
					}
		}
		$this->lexicon = $lexicon;

		$config['email_to_send'] = empty($config['email_to_send']) ? '' : $config['email_to_send'];
 		$config['subject'] = empty($config['subject']) ? $lexicon['subject'] : $config['subject'];
 		$config['from_email'] = empty($config['from_email']) ? $lexicon['from_email'] : $config['from_email'];
 		$config['from_name'] = empty($config['from_name']) ? $lexicon['from_name'] : $config['from_name'];
 		$config['used_lexicon'] = empty($config['used_lexicon']) ? 'default' : $config['used_lexicon'];
 		$config['disable_mail_send'] = empty($config['disable_mail_send']) ? '' : $config['disable_mail_send'];

 		$config['SMTPHost'] = empty($config['SMTPHost']) ? '' : $config['SMTPHost'];
 		$config['SMTPAuth'] = empty($config['SMTPAuth']) ?  '' : $config['SMTPAuth'];
 		$config['SMTPUsername'] = empty($config['SMTPUsername']) ? '' : $config['SMTPUsername'];
 		$config['SMTPPassword'] = empty($config['SMTPPassword']) ? '' : $config['SMTPPassword'];
 	 	$config['SMTPSecure'] = empty($config['SMTPSecure']) ? 'ssl' : $config['SMTPSecure'];
		$config['SMTPPort'] = empty($config['SMTPPort']) ? 465 : $config['SMTPPort'];

		$config['capcha'] = empty($config['capcha']) ? 0 : $config['capcha'];

	 	//print_r($config);

		$this->config = $config;

	}

	public static function get_config_name() {
 		$default_config_name = 'default';

	 	$config_name = $default_config_name;
		if(isset($_REQUEST['bf-config'])) {
				$config_name = preg_replace ("/[^a-zA-Z0-9_\-]/","", $_REQUEST['bf-config']);
		}

		if(
			!file_exists(BASE_FORM_PATH.'configs/'.$config_name.'/') || empty($config_name)
		) {
			$config_name = $default_config_name;
		}

		return $config_name;
	}

	private function parse_config_ini_file($config_name = 'default') {
		$config_ini = file_get_contents(BASE_FORM_PATH.'configs/'.$config_name.'/config.php');
		$config_ini = explode('?>', $config_ini);
		return parse_ini_string($config_ini[1]);
	}

	public function init() {

		$type = isset($_REQUEST['type']) ? preg_replace ("/[^a-z]/i","", $_REQUEST['type']) : 'default';

		$out = array();

 		switch ($type) {
 			case 'capcha':
 			return $this->set_capcha();

			case 'form':
    		 	$out = $this->set_base_form();
    		break;

    		case 'validation':
    			$out = $this->set_json_encode($this->check_validation());
    		break;

			default:
				$out = $this->set_json_encode($this->set_form_data());
			break;
		}
		return $out;
	}

	function set_capcha() {
		include('backend/lib/kcaptcha/kcaptcha.php');
		$captcha = new KCAPTCHA();
		$_SESSION['captcha_keystring'] = $captcha->getKeyString();
	}

	private function set_form_data() {

		$out = array();

 		$field = array();
		foreach ($_POST as $key => $value) {
			if(is_array($value)) {
				$field[$key] = implode(', ',$value);
			} else {
				$field[$key] = $value;
			}
		}

		list($field, $config) = events::before_success_send_form($field, $this->config);
		$this->field = $field;
		$this->config = $config;

		$error_check_spam = $this->check_spam();

		if(empty($error_check_spam)) {
			if(empty($config['disable_mail_send'])) {
					if($this->set_mail()) {
						$out = $this->set_form_data_status(1, $this->lexicon['success_email_send']);
					} else {
						$out = $this->set_form_data_status(0, $this->lexicon['email_send']);
					}
			} else {
				$out = $this->set_form_data_status(1, $this->lexicon['success_email_send']);
			}
			events::after_success_send_form($field, $config);
 		} else {
 			$out = $error_check_spam;
 		}

		return $out;
	}

	private function set_report_form() {
		return $this->twig->render($this->tmp_report_on_mail, $this->field);
	}

	private function set_base_form() {
		$attributes = isset($_POST['attributes']) ? $_POST['attributes'] : array();
		$attributes = isset($_POST['attributes']) ? $_POST['attributes'] : array();
		return $this->twig->render($this->tmp_form_popup, $attributes);
	}

	private function set_form_data_status($status = 0, $value = '') {
		return array('status' => $status, 'value' => $value);
	}

	private function check_validation() {

		$configs = $this->get_validation_configs();
		$out = array();

		if(!empty($configs)) {
			foreach ($configs as $name => $type) {
				foreach ($type as $type_element) {

					$type_element = explode('[', $type_element);
					$type_element_name = $type_element[0];

					$type_element_param = '';
					if(!empty($type_element[1])) {
						$type_element_param = str_replace(']', '', $type_element[1]);
					}

					if(preg_match('~^error_message~', 	$type_element_name)) {

					} else {
						$err = $this->set_validation($name, array($type_element_name, $type_element_param));
						if(!empty($err)) {
							$out[$name][$type_element_name] = $err;
						}
					}
				}
			}
		}

		if($this->config['capcha'] > 0) {
			$out['capcha'] = $this->set_validation('capcha', array('capcha', ''));
		}

		$email_to_send = $this->config['email_to_send'];
		if(empty($email_to_send)) {
			$out['email_to_send'] = $this->lexicon['err_isset_email'];
		}

		$out['token'] = $this->set_token();

		return $out;
	}

	private function set_validation($name = '', $type = '') {

		list($type_name, 	$type_param) = $type;

		$fields = isset($_POST['fields']) ? $_POST['fields'] : array();
		//print_r($name);
		$field_value = '';

		foreach ($fields as $field) {
			$field['name'] = str_replace('[]', '', $field['name']);
			if(strcmp($name, $field['name']) == 0) {
				if(isset($field['value'])) {
					$field_value = trim($field['value']);
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
			case 'minlength': //Makes the element require a given minimum length.
				$field_count = mb_strlen($field_value, 'utf-8');
				if($field_count < intval($type_param)) {
					$out = $this->twig_string->render(
						$this->lexicon['valid_minlength'],
						array('minlength' => intval($type_param))
					);

				}
			break;
			case 'maxlength': //Makes the element require a given maxmimum length.
				$field_count = mb_strlen($field_value, 'utf-8');
				if($field_count > intval($type_param)) {
					$out = $this->twig_string->render(
						$this->lexicon['valid_maxlength'],
						array('maxlength' => $type_param)
					);
				}
			break;
			case 'rangelength': //Makes the element require a given value range.
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
			break;
			case 'capcha': //Makes the element required.
			$_SESSION['captcha_keystring'] = isset($_SESSION['captcha_keystring']) ? $_SESSION['captcha_keystring'] : '';
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
		$configs = $this->config;
		if(!empty($configs)) {
			foreach ($configs as $key => $value) {
					if(preg_match('~^@~', $key)) {
						$key = str_replace('@', '', $key);
						preg_match_all('~([a-z_]+(\[.*?\])?)~iu', $value, $match);
						$out[$key] = $match[1];
					}
			}
		}
		return $out;
	}

	private function check_spam() {
		$out = '';

		if(
			isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
			strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'
		) {

		} else {
			$out = $this->set_form_data_status(0, $this->lexicon['spam']);
		}

		$token = isset($_POST['bf-token']) ? $_POST['bf-token'] : '';
		$_SESSION['bf-token'] = isset($_SESSION['bf-token']) ? $_SESSION['bf-token'] : 0;

		if(!empty($token) && (strcmp($_SESSION['bf-token'], $token) !== 0)) {
			$out = $this->set_form_data_status(0, $this->lexicon['spam']);
		}

		return $out;
	}

	private function set_token() {
		$_SESSION['bf-token'] = $bf_token = md5(uniqid());
		return $bf_token;
	}

	protected function set_mail() {

		$mail = new PHPMailer();

		$mail->CharSet = 'utf-8';

		$mail->From =  $this->twig_string->render($this->config['from_email'],  $_SERVER);
		$mail->FromName = $this->twig_string->render($this->config['from_name'],  $_SERVER);

		$mail->isHTML(true);
		$mail->Subject = $this->config['subject'];

		$body = $this->set_report_form();
		$mail->Body = $body;
		$mail->AltBody = strip_tags($body);

 		//set files
		foreach ($_FILES as $name_upload_file => $files) {
			if(isset($_FILES[$name_upload_file]["name"])) {
				$files_count = sizeof($_FILES[$name_upload_file]["name"]);
				for ($i = 0; $i <= $files_count - 1; $i++) {
					if (
						isset($_FILES[$name_upload_file]) &&
						 $_FILES[$name_upload_file]['error'][$i] == UPLOAD_ERR_OK
					) {
    					$mail->AddAttachment(
    						$_FILES[$name_upload_file]['tmp_name'][$i],
    						$_FILES[$name_upload_file]['name'][$i],
    						'base64',
    						$_FILES[$name_upload_file]['type'][$i]
    					);
					}
				}
			}
		}

		$email_to_send = explode(',', $this->config['email_to_send']);
		foreach($email_to_send as $email) {
			//Recipients will know all of the addresses that have received a letter
			$mail->addAddress($email, '');
		}

		if($this->config['SMTPAuth']) {
			//$mail->SMTPDebug = 3;

			$mail->isSMTP(); // Set mailer to use SMTP
			$mail->Host = $this->config['SMTPHost'];  // Specify main and backup SMTP servers
			$mail->SMTPAuth = $this->config['SMTPAuth']; // Enable SMTP authentication
			$mail->Username = $this->config['SMTPUsername']; // SMTP username
			$mail->Password = $this->config['SMTPPassword']; // SMTP password
			$mail->SMTPSecure = $this->config['SMTPSecure']; // Enable TLS encryption, `ssl` also accepted
			$mail->Port = $this->config['SMTPPort']; // TCP port to connect to
		}

		return $mail->send();
	}

	protected function set_json_encode($value) {
		header('Content-type: text/json;  charset=utf-8');
		header('Content-type: application/json');
		return  json_encode($value);
	}
}
