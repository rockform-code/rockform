/**
 * Rockform - Simple, flexible ajax webform.
 * @version 3.5
 */

// AMD support
(function(factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
      // using AMD; register as anon module
      define(['jquery', 'jquery.form.min'], factory);
    } else {
      // no AMD; invoke directly
      factory((typeof(jQuery) != 'undefined') ? jQuery : window.Zepto);
    }
  }

  (function($) {
    "use strict";

    $ = $.noConflict(true);

    var base_name_form = 'rockform';

    var lang = {
      err_msg_required: 'Пожалуйста, заполните это поле.',
      err_msg_pattern: 'Пожалуйста, введите верное значение!'
    }

    var tooltip = {
      init: function(el, err_msg) {

        if (err_msg.length > 0) {

          tooltip.set(el, err_msg);

          $(window).resize(function() {
            tooltip.set(el, err_msg);
          });
        } else { //close view

          var id = el.attr('name');
          if (id) {

            id = id.replace('[', '').replace(']', '');
            $('.bf-tooltip-' + id).remove();
          }
        }
      },
      set: function(el, err_msg) {

        if (el.attr('name')) {
          var min_dist = 20;

          var id = el.attr('name').replace('[', '').replace(']', '');
          $('.bf-tooltip-' + id).remove();

          var o = el.offset();
          var h = el.outerHeight();
          var w = el.outerWidth();

          el.after(
            '<div class="bf-tooltip bf-tooltip-' + id + '"> \
          <div class="bf-arrow"></div>' + err_msg + '</div>'
          );

          var popup_el = $('.bf-tooltip-' + id);
          var w_tooltip = popup_el.outerWidth();
          var default_position = o['left'] + w / 4 * 3;

          var pos = default_position + w_tooltip + min_dist;
          var pos_min = $(window).outerWidth() - min_dist - w_tooltip;

          if (pos > $(window).outerWidth()) {
            default_position = pos_min;
          }

          if (pos_min <= o['left']) {
            default_position = o['left'];
            popup_el.width(w - min_dist);
          }

          popup_el.offset({
            top: o['top'] + h,
            left: default_position
          });

        }
      },
      delete: function() {
        $('.bf-tooltip').remove();
      }
    }

    var validation = {

      client: function(form) {

        var valid = 0;
        var el;
        var err_msg, err_msg_pattern;
        var required, pattern, value;

        $.each($('input, select, textarea', form), function(element) {
          el = $(this);
          err_msg = '';

          value = el.val();
          pattern = el.data('bf-valid-pattern');
          required = el.data('bf-valid-required');

          //set default error message
          err_msg_pattern = el.data('bf-valid-error-msg');
          if (typeof err_msg_pattern == 'undefined' || err_msg_pattern.length < 1) {
            err_msg_pattern = lang.err_msg_pattern;
          }

          if (value.length > 0) {
            if (typeof pattern == 'undefined') {

            } else {
              // console.log(el.val());
              //console.log(el.data('bf-valid-pattern'));

              var pattern = new RegExp(pattern, 'g');
              if (pattern.test(value)) {

              } else {
                err_msg = err_msg_pattern;
              }
            }
          } else {

            if (typeof required == 'undefined') {

            } else {
              if (parseInt(required) > 0) {
                err_msg = lang.err_msg_required;
              }
            }
          }

          tooltip.init(el, err_msg);
          if (err_msg.length > 0) {
            valid = valid + 1;
          }

        });

        if (parseInt(valid) > 0) {
          return false;
        } else {
          return true;
        }
      },
      server: function(form, data) {

        var err_msg;
        var el;
        var valid = 0;

        $('.bf-status').remove();

        if (data.email_to_send) {
          console.log(data.email_to_send);
          form.before(
            '<div class="bf-status bf-status-0">' + data.email_to_send + '</div>'
          );
          return false;
        }

        $.each(data, function(name, value) {
          err_msg = '';

          if (name == 'token') {
            form.prepend(
              '<input name="bf-token" type="hidden" value="' + data['token'] + '" />'
            );
          } else if (name == 'capcha') {

            tooltip.init($('[name="capcha"]', form), value);

            if (value.length > 0) {
              valid = +1;
            }
          } else {
            err_msg = validation.server_set_err_msg(value);

            if ($('[name="' + name + '"]', form).attr('name')) {
              el = $('[name="' + name + '"]', form);
            } else if ($('[name="' + name + '\[\]"]', form).attr('name')) {
              el = $('[name="' + name + '\[\]"]', form);
            }

            tooltip.init(el, err_msg);

            if (err_msg.length > 0) {
              valid = +1;
            }
          }


        });

        if (parseInt(valid) > 0) {
          return false;
        } else {
          return true;
        }
      },
      server_set_err_msg: function(err) {
        var err_msg = '';
        if (err.required) {
          err_msg = err.required;
        } else {
          if (err.rangelength) {
            err_msg = err.rangelength;
          } else if (err.minlength) {
            err_msg = err.minlength;
          } else if (err.maxlength) {
            err_msg = err.maxlength;
          } else {
            $.each(err, function(name, msg) {
              if (
                name == 'required' ||
                name == 'rangelength' ||
                name == 'minlength' ||
                name == 'maxlength'
              ) {

              } else {
                err_msg = msg;
                return false;
              }
            });
          }
        }

        return err_msg;
      }
    }

    var bf = {

      config: '',
      path: '/' + base_name_form + '/init.php',

      init: function() {

        bf.init_popup();
        bf.init_form();
      },
      set_background_popup: function() {

        $('body').append('<div class="bf-fixed-overlay bf-fixed-overlay__modal"> \
                            <div class="bf-modal"> \
                                <div class="bf-modal_container"> \
                                    <a href="javascript:;" class="bf-modal-close" title=""></a> \
                                      <div class="bf-modal-box"></div> \
                                </div> \
                            </div> \
                        </div>');

      },
      init_popup: function() {
        $('[data-bf-config]').on("click", function(e) {
          e.preventDefault();

          tooltip.delete();

          var config_popup = $(this).data("bf-config");
          if (typeof config_popup == 'undefined' || config_popup.length < 1) {
            config_popup = '';
          }

          var button = $(this);
          var attributes = bf.get_custom_popup_attributes(button);

          $.ajax({
            url: bf.path,
            data: {
              'bf-config': config_popup,
              'attributes': attributes,
              'type': 'form'
            },
            method: "post",
            dataType: "html",
            beforeSend: function(xhr) {
              $('body').append('<div class="bf-loading"></div>');
            },
            success: function(xhr) {

              bf.set_background_popup();
              bf.bind_close_popup();

              //animation begin
              $('.bf-modal, .bf-fixed-overlay').css('opacity', '0');

              $('.bf-modal-box').html(xhr);
              $('.bf-loading').remove();

              //animation end
              $('.bf-modal, .bf-fixed-overlay').animate({
                'opacity': "1"
              }, 400);

              bf.init_form(config_popup, attributes);
            }
          })
        });
        $("form[data-bf-config]").off(); //reset event popup for form
      },
      bind_close_popup: function() {
        $(".bf-modal-close, .bf-fixed-overlay").one("click", function() {
          $(".bf-fixed-overlay").remove();
          bf.init_form();
        });

        $(".bf-modal").on("click", function(e) {
          e.stopImmediatePropagation();
        });
      },
      get_custom_popup_attributes: function(button) {

        var attributes = {};
        var attr_el = '';

        if (button.length) {
          $.each(button[0].attributes, function(index, attr) {
            attr_el = attr.name;
            if (/data\-bf\-field/.test(attr_el)) {
              attr_el = attr_el.replace('data-bf-', '');
              attributes[attr_el] = attr.value;
            }
          });
        }

        attributes['field_page_h1'] = $('h1').html();
        attributes['field_page_link'] = document.location.href;

        return attributes;

      },
      init_capcha: function() {
        var capcha = $("[src*='" + bf.path + "?type=capcha']");
        capcha.off();
        bf.update_capcha();
        capcha.on("click", function() {
          bf.update_capcha();
        });
      },
      update_capcha: function() {
        $("[src*='" + bf.path + "?type=capcha']").attr('src', bf.path + '?type=capcha&u=' + Math.random())
      },
      init_form: function(config_popup, attributes) {
        bf.init_capcha();
        $('form[data-bf-config], .bf-modal form').off('submit');
        $('form[data-bf-config], .bf-modal form').on('submit', function(e) {
          e.preventDefault();

          var form = $(this);
          bf.config = bf.get_config(config_popup, form.data("bf-config"));

          if (validation.client(form)) {

            var formdata = form.formToArray(); //get serialized form
            //replace file object with name file
            $.each(formdata, function(index, element) {
              if (element.type == 'file') {
                formdata[index].value = element.value.name
              }
            });

            $.post(
              bf.path, {
                'fields': formdata,
                'type': 'validation',
                'bf-config': bf.config
              },
              function(data) {
                $('[name="bf-config"], [name="bf-token"]').remove();
                form.prepend('<input name="bf-config" type="hidden" value="' + bf.config + '" />');

                if (validation.server(form, data)) {
                  //set add params from popup
                  if (typeof attributes != 'undefined') {
                    $('.bf-attr').remove();
                    $.each(attributes, function(index, attr) {
                      form.prepend(
                        '<input class="bf-attr" name="' + index + '" type="hidden" value="' + attr + '" />'
                      );
                    });
                  }


                  form.ajaxSubmit({
                    success: bf.show_response,
                    url: bf.path,
                    type: 'post',
                    dataType: 'json'
                  });
                }
              });
          }
        });
      },
      get_config: function(config_popup, config) {
        if (typeof config_popup == 'undefined' || config_popup.length < 1) {
          if (typeof config == 'undefined' || config.length < 1) {
            config = '';
          }
        } else {
          config = config_popup;
        }
        return config;
      },
      show_response: function(responseText, statusText, xhr, $form) {

        $('.bf-status').remove();
        $form.before('<div class="bf-status bf-status-' + responseText['status'] + '">' + responseText['value'] + '</div>');

        if (responseText['status'] > 0) {
          $form.hide();

          setTimeout(
            function() {
              $('.bf-modal-close').click(); //if popup
            }, 2000
          );

          setTimeout(
            function() {
              $form.show();
              $('.bf-status').remove();
              $form.clearForm();
            }, 3000
          );
        }
      }
    }
    bf.init();
  }));
