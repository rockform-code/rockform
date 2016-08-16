<?php

class Baseform {

	protected $config, $lexicon, $field, $valid;
 
	private $tmp_form_popup = 'form_popup.html';
	private $tmp_report_on_mail = 'report_mail.html'; 
	private $tmp_form_success = 'form_success.html';

	function __construct() {

		$this->set_default_config();

		Twig_Autoloader::register(true);
		$loader = new Twig_Loader_Filesystem(BASE_FORM_PATH.'configs/'.$this->config['name'].'/templates/');
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

		$params = $this->get_config_file();
		$this->valid = isset($params['validation']) ? $params['validation'] : array();

		$config = isset($params['config']) ? $params['config'] : array();
		$config['name'] = $this->get_config_name();

		if(!preg_match('~^default$~', $config['name'])) {

			//delete default validation
			unset($params['validation']);
			$this->valid = array();

			$params_custom = $this->get_config_file($config['name']);
			if(isset($params_custom['validation'])) {
		 		$this->valid = $params_custom['validation'];
		 	}

			if(!empty($params_custom['config']) && is_array($params_custom)) {
				//replace default value
				foreach ($params_custom['config'] as $k => $value) {
					if(!empty($value)) {
						$config[$k] = $value;
					}
				}
			}
		}

 		$config['used_lexicon'] = empty($used_lexicon) ? 'default' : $used_lexicon;
		$this->set_lexicon($config['used_lexicon']);

		$config['mail_to'] = empty($config['mail_to']) ? '' : $config['mail_to'];
 		$config['subject'] = empty($config['subject']) ? $this->lexicon['subject'] : $config['subject'];
 		$config['from_email'] = empty($config['from_email']) ? $this->lexicon['from_email'] : $config['from_email'];
 		$config['from_name'] = empty($config['from_name']) ? $this->lexicon['from_name'] : $config['from_name'];
 		$config['used_lexicon'] = empty($config['used_lexicon']) ? 'default' : $config['used_lexicon'];
 		$config['disable_mail_send'] = empty($config['disable_mail_send']) ? '' : $config['disable_mail_send'];

		$config['charset'] = empty($config['charset']) ? 'utf-8' : $config['charset'];

 		$config['SMTPHost'] = empty($config['SMTPHost']) ? '' : $config['SMTPHost'];
 		$config['SMTPAuth'] = empty($config['SMTPAuth']) ?  '' : $config['SMTPAuth'];
 		$config['SMTPUsername'] = empty($config['SMTPUsername']) ? '' : $config['SMTPUsername'];
 		$config['SMTPPassword'] = empty($config['SMTPPassword']) ? '' : $config['SMTPPassword'];
 	 	$config['SMTPSecure'] = empty($config['SMTPSecure']) ? 'ssl' : $config['SMTPSecure'];
		$config['SMTPPort'] = empty($config['SMTPPort']) ? 465 : $config['SMTPPort'];

		$this->config = $config; 
	}

	private function set_lexicon($used_lexicon = '') {
		$config_ini = parse_ini_file(BASE_FORM_PATH.'backend/lexicon/'.$used_lexicon.'.ini');
		foreach ($config_ini as $key => $value) {
					if(!empty($value)) {
							$lexicon[$key] = $value;
					}
		}
		$this->lexicon = $lexicon;
	}

	public function get_config_name() {
 		$default_config_name = 'default';

	 	$config_name = $default_config_name;
		if(isset($_POST['bf-config'])) {
			$config_name = preg_replace ("/[^a-zA-Z0-9_\-]/","", $_POST['bf-config']);
		}
 
		if(
			!file_exists(BASE_FORM_PATH.'configs/'.$config_name.'/config.php') ||
			empty($config_name)
		) {
			$config_name = $default_config_name;
		} 

		return $config_name;
	}

	private function get_config_file($config_name = 'default') {
		$config_ini = file_get_contents(BASE_FORM_PATH.'configs/'.$config_name.'/config.php');
		$config_ini = explode('?>', $config_ini);
		return $this->parse_config($config_ini[1], true);
	}

	private function parse_config($str = '', $flag = false) {

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
 			//рисует капчу
 			//set capcha
 			case 'capcha': 
 			return $this->set_capcha();

 			//рисует всплывающую форму
 			//set popup form
			case 'form': 
    		 	$out = $this->set_base_form();
    		break;

    		//проверяет валидацию
    		//check validation
    		case 'validation': 
    			$out = $this->set_json_encode($this->check_validation());
    		break;

    		//отдаёт шаблон ответа, об успешной отправке
    		//set form success
    		case 'form_success': 
    			$out = $this->set_form_success();
    		break;

    		//отправляет сообщение
    		//set message
			default: 
			
				//шаблонизация параметров
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

		//Проверка, что отправлено с сайта и что это ajax 
		//spam protection
 
		$error_check_spam = $this->check_spam();

		if(empty($error_check_spam)) {
			if(empty($config['disable_mail_send'])) {

				$mail_out = $this->set_mail($config);

				if($mail_out) {
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
		return $this->twig->render($this->tmp_form_popup, $attributes);
	}

	private function set_form_success($attributes = array()) { 
		return $this->twig->render($this->tmp_form_success, $attributes);
	}

	private function set_form_data_status($status = 0, $value = '') {
		return array(
			'status' => $status, 
			'value' => $value, 
			'bf-config' => $this->config['name']
		);
	}

	private function check_validation() {

		//проверяет наличие правил валидации
		//checks for validation rules
		$configs = $this->get_validation_configs();
 
		$out = array();
 
		if(!empty($configs)) { 
			foreach ($configs as $name => $type) {
				foreach ($type as $type_element) {

					//Параметры фильтра валидации
					//Validation parameters of the filter
					$detail_params = explode('[', $type_element); 
					//Название типа валидации
					//Type the name of the validation
					$name_params = $detail_params[0]; 
 
					if(!empty($detail_params[1])) {
						$detail_params = str_replace(']', '', $detail_params[1]);
					}

					if(preg_match('~^error_message~', 	$name_params)) {

					} else {
						$err = $this->set_validation($name, array($name_params, $detail_params));
						if(!empty($err)) {
							$out[$name][$name_params] = $err;
						}
					}
				}
			}
		}

		//Проверка существования почты получателя
		//Verifying the existence of mail address
		$disable_mail_send = $this->config['disable_mail_send'];
		$mail_to = $this->config['mail_to'];
		if(empty($mail_to) && empty($disable_mail_send)) {
			$out['mail_to'] = $this->lexicon['err_isset_email'];
		}

		$out['token'] = $this->set_token();

		return $out;
	}

	private function set_validation($name = '', $type = '') {

		list($type_name, $type_param) = $type;

		$fields = isset($_POST['fields']) ? $_POST['fields'] : array();
 
		$field_value = '';
 		
 		//получаем значение поля для проверки
 		//get the value of the field to check
		foreach ($fields as $field) { 
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
			isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
			strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'
		) {

		} else {
			$out = $this->set_form_data_status(0, $this->lexicon['spam']);
		}

		//CSRF check
		$token = isset($_POST['bf-token']) ? $_POST['bf-token'] : '';
		$_SESSION['bf-token'] = isset($_SESSION['bf-token']) ? $_SESSION['bf-token'] : 0;

		if(!empty($token) && (strcmp($_SESSION['bf-token'], $token) !== 0)) {
			$out = $this->set_form_data_status(0, $this->lexicon['spam']);
		}

		//Capcha validation check
		//Приводим передаваемые данные в масссив - fields
		$field_post = isset($_POST) ? $_POST : array();
		unset($_POST);
		foreach ($field_post as $name => $value) {
			$_POST['fields'][] = array('name' => $name, 'value' => $value); 
		}

		$v = $this->check_validation(); 
		if(isset($v['capcha'])) { 
			$out = $this->set_form_data_status(0, $this->lexicon['spam']);
		}

		return $out;
	}

	private function set_token() {
		return $_SESSION['bf-token'] = md5(uniqid());
	}

	protected function set_mail($config = array()) {

		$mail = new PHPMailer();

		$mail->CharSet = 'utf-8';

		$mail->From =  $config['from_email'];
		$mail->FromName = $config['from_name'];

		$mail->isHTML(true);
		$mail->Subject = $config['subject'];
 
		$body = $this->set_report_form();

		$mail->Body = $body;
		$mail->AltBody = strip_tags($body);

 		$this->set_files_on_mail($mail);
 
		$mail_to = explode(',', $config['mail_to']);
		foreach($mail_to as $email) {
			//Recipients will know all of the addresses that have received a letter
			$mail->addAddress($email, '');
		}

		if($this->config['SMTPAuth']) {
			//$mail->SMTPDebug = 3;

			$mail->isSMTP(); // Set mailer to use SMTP
			$mail->Host = $config['SMTPHost'];  // Specify main and backup SMTP servers
			$mail->SMTPAuth = $config['SMTPAuth']; // Enable SMTP authentication
			$mail->Username = $config['SMTPUsername']; // SMTP username
			$mail->Password = $config['SMTPPassword']; // SMTP password
			$mail->SMTPSecure = $config['SMTPSecure']; // Enable TLS encryption, `ssl` also accepted
			$mail->Port = $config['SMTPPort']; // TCP port to connect to
		}

		return $mail->send();
	}

	private function set_files_on_mail($mail) {
		$err = array();
 
		//Проверка включена ли поддержка загрузки файлов
		if(ini_get('file_uploads')) {
 
			//Перебираем поля с атрибутом отправки файла
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

		} else {
			$err = $this->set_form_data_status(0, $this->lexicon['file_uploads_none']);
		}
 
		return $err;
	}

	protected function set_json_encode($value) {
		header('Content-type: text/json;  charset=utf-8');
		header('Content-type: application/json');
		return  json_encode($value);
	}
}
