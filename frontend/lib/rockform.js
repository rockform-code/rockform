/**
 * Rockform - Simple, flexible ajax webform.
 * @version 3.0
 */

// AMD support
(function(factory) {
        "use strict";
        if (typeof define === 'function' && define.amd) {
            // using AMD; register as anon module
            define(['jquery'], factory);
        } else {
            // no AMD; invoke directly
            factory((typeof(jQuery) != 'undefined') ? jQuery : window.Zepto);
        }
    }

    (function($) {
        "use strict";


        var bf_path = '/rockform/init.php';

        var bf = {
            init: function() {

                bf.bind_event_capcha();
                bf.bind_event_popup();
                bf.init_form();

            },
            set_background_popup: function() {

                var bg = '<div class="bf-fixed-overlay bf-fixed-overlay__modal"> \
                            <div class="bf-modal"> \
                                <div class="bf-modal_container"> \
                                    <a href="javascript:;" class="bf-modal-close" title="Закрыть"></a> \
                                </div> \
                            </div> \
                        </div>';
                $('body').append(bg);
            },
            bind_event_popup: function() {
                $('[data-bf-config]').on("click", function(e) {
                    e.preventDefault();

                    var config = $(this).data("bf-config");
                    if (typeof config == 'undefined' || config.length < 1) {
                        config = '';
                    }

                    var button = $(this);
                    var attributes = bf.get_custom_popup_attributes(button);

                    $.ajax({
                        url: bf_path,
                        data: {
                            'bf-config': config,
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

                            $('.bf-modal, .bf-fixed-overlay').css('opacity', '0');

                            $('.bf-modal_container a').after(xhr);
                            $('.bf-loading').remove();

                            $('.bf-modal, .bf-fixed-overlay').animate({
                                'opacity': "1"
                            }, 400);

                            bf.bind_event_capcha(); //set refresh for click image
                            bf.update_capcha();
                            $("form[data-bf-config]").off(); //destruct form

                            bf.init_form(config, attributes);

                        }
                    })
                });
                $("form[data-bf-config]").off(); //reset event popup for form
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
            bind_close_popup: function() {
                $(".bf-modal-close, .bf-fixed-overlay").on("click", function() {
                    $(".bf-fixed-overlay").remove();

                    $("form[data-bf-config]").off(); //destruct form
                    bf.init_form();
                });

                $(".bf-modal").on("click", function(e) {
                    e.stopImmediatePropagation();
                });
            },
            bind_event_capcha: function() {
                var capcha = $("[src*='" + bf_path + "?type=capcha']");
                capcha.off();
                capcha.on("click", function() {
                    bf.update_capcha();
                });
            },
            update_capcha: function() {
                $("[src*='" + bf_path + "?type=capcha']").attr('src', bf_path + '?type=capcha&u=' + Math.random())
            },
            init_form: function(config_popup, attributes) {

                $('form[data-bf-config], .bf-modal form').on('submit', function(e) {
                    e.preventDefault();

                    var options = {
                        success: bf.show_response,
                        url: bf_path,
                        type: 'post',
                        dataType: 'json'
                    };

                    var form = $(this);

                    var config = form.data("bf-config");
                    if (typeof config_popup == 'undefined' || config_popup.length < 1) {
                        if (typeof config == 'undefined' || config.length < 1) {
                            config = '';
                        }
                    } else {
                        config = config_popup;
                    }

                    //validation

                    var validation = bf.validation(form);

                    if (validation) {
                        $.post(
                            bf_path, {
                                'type': 'validation',
                                'bf-config': config
                            },
                            function(data) {
                                $('[name="bf-config"]').remove();
                                $('[name="bf-token"]').remove();

                                if (typeof attributes == 'undefined' || attributes.length < 1) {
                                    var attributes = [];
                                }

                                $.each(attributes, function(index, attr) {
                                    form.prepend('<input name="' + index + '" type="hidden" value="' + attr + '" />');
                                });

                                form.prepend('<input name="bf-config" type="hidden" value="' + config + '" />');
                                form.prepend('<input name="bf-token" type="hidden" value="' + data['token'] + '" />');

                                form.ajaxSubmit(options); //set submit form
                            }
                        );
                    }
                });
            },
            tooltip: function(el) {
                /*
               // var p = el.position();
                var o =  el.offset();

               // console.log(p);
                console.log(o);
                var style = 'style="position: absolute; left: '+o['left']+'; right: '+o['top']+';"'
                form.append('<div '+style+' class="tooltip">test</div>');
                */
            },
            validation: function(form) {

                return true;
                /*
                var valid = false;

                $.each($('input, select, textarea', form), function(element) {

                    var value = $(this).val();
                    var pattern = $(this).data('bf-valid-pattern');
                    var required = $(this).data('bf-valid-required');

                    var err_msg = $(this).data('bf-valid-error-msg');
                    if (typeof err_msg == 'undefined' || err_msg.length < 1) {
                        err_msg = 'Пожалуйста, введите верное значение!';
                    }

                    if (value.length > 0) {
                        if (typeof pattern == 'undefined' || pattern.length < 1) {

                        } else {
                              console.log($(this).val());
                            console.log($(this).data('bf-valid-pattern'));

                            var pattern = new RegExp(pattern, 'gi');

                            if (pattern.test(value)) {
                                console.log('Валидно');
                                bf.tooltip($(this));
                            } else {
                                console.log(err_msg);
                            }
                        }
                    } else {

                        var err_msg_required = 'Пожалуйста, заполните это поле.';

                        if (parseInt(required) > 0) {
                            console.log(err_msg_required);
                        }
                    }
                });

                return valid;
                */
            },
            show_response: function(responseText, statusText, xhr, $form) {

                $('.bf-status').remove();
                $form.before('<div class="bf-status bf-status-' + responseText['status'] + '">' + responseText['value'] + '</div>');

                if (responseText['status'] > 0) {
                    $form.hide();

                    bf.update_capcha();

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

    })

);
