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

		$config_name = $this->get_config_name();
		$config = $this->parse_config_ini_file($config_name);
		$config['name'] = $config_name;

		if(!preg_match('~^default$~', $config['name'])) {
			$config_custom = $this->parse_config_ini_file($config['name']);
			if(!empty($config_custom) && is_array($config_custom)) {
				//replace default value
				foreach ($config_custom as $key => $value) {
					if(!empty($value)) {
						$config[$key] = $value;
					}
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

		$config['capcha'] = empty($config['capcha']) ? 0 : 1;

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
    			$out = $this->set_json_encode($this->validation());
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

	private function validation() {
		return $this->set_token();
	}

	private function set_token() {
		$bf_token = md5(uniqid());
		$_SESSION['bf-token'] = $bf_token;
		return array('token' => $bf_token);
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

		$error = $this->check_error();

		if(empty($error)) {
			if(empty($config['disable_mail_send'])) {
				if(!empty($config['to'])) {
					$body = $this->set_report_form();

					if($this->set_mail($body)) {
						$out = $this->set_form_data_status(1, $this->lexicon['success_email_send']);
					} else {
						$out = $this->set_form_data_status(0, $this->lexicon['email_send']);
					}

				} else {
					$out = $this->set_form_data_status(0, $this->lexicon['not_email']);
				}
			} else {
				$out = $this->set_form_data_status(1, $this->lexicon['success_email_send']);
			}

			events::after_success_send_form($field, $config);

 		} else {
 			$out = $error;
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

	private function set_form_data_status($status = 0, $value = '') {
		return array('status' => $status, 'value' => $value);
	}

	private function check_error() {
		$err = '';

		$capcha = $this->config['capcha'];

		if($capcha > 0) {
			$err = $this->check_capcha();
		}

		if(empty($err)) {
			$err = $this->check_spam();
		}

		return $err;
	}

	private function check_capcha() {
		$out = '';

		$_SESSION['captcha_keystring'] = isset($_SESSION['captcha_keystring']) ? $_SESSION['captcha_keystring'] : '';

		if(strcmp($_SESSION['captcha_keystring'], $this->field['capcha']) !== 0){
			$out = $this->set_form_data_status(0, $this->lexicon['capcha']);
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

	protected function set_mail($body = '') {

		$mail = new PHPMailer();

		$mail->CharSet = 'utf-8';

		$mail->From =  $this->twig_string->render($this->config['from_email'],  $_SERVER);
		$mail->FromName = $this->twig_string->render($this->config['from_name'],  $_SERVER);

		$mail->isHTML(true);
		$mail->Subject = $this->config['subject'];
		$mail->Body    = $body;
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

 		$to = $this->config['to'];
		if(!is_array($to)) {
			$to = explode(',', $to);
		}

		foreach((array)$to as $email) {
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
