/**
 * Rockform - Simple, flexible ajax webform.
 * @version 3.2
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

        var lang = {
            err_msg_required: 'Пожалуйста, заполните это поле.',
            err_msg_pattern: 'Пожалуйста, введите верное значение!'
        }

        var bf = {

            config: '',

            path: '/rockform/init.php',

            init: function() {

                bf.bind_event_capcha();
                bf.bind_event_popup();
                bf.init_form();

            },
            set_background_popup: function() {

                $('body').append('<div class="bf-fixed-overlay bf-fixed-overlay__modal"> \
                            <div class="bf-modal"> \
                                <div class="bf-modal_container"> \
                                    <a href="javascript:;" class="bf-modal-close" title=""></a> \
                                </div> \
                            </div> \
                        </div>');

            },
            bind_event_popup: function() {
                $('[data-bf-config]').on("click", function(e) {
                    e.preventDefault();

                    $('.bf-tooltip').remove();

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

                            $('.bf-modal, .bf-fixed-overlay').css('opacity', '0');

                            $('.bf-modal_container a').after(xhr);
                            $('.bf-loading').remove();

                            //animation
                            $('.bf-modal, .bf-fixed-overlay').animate({
                                'opacity': "1"
                            }, 400);

                            bf.bind_event_capcha(); //set refresh for click image
                            bf.update_capcha();
                            $("form[data-bf-config]").off(); //destruct form

                            bf.init_form(config_popup, attributes);

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
                var capcha = $("[src*='" + bf.path + "?type=capcha']");
                capcha.off();
                capcha.on("click", function() {
                    bf.update_capcha();
                });
            },
            update_capcha: function() {
                $("[src*='" + bf.path + "?type=capcha']").attr('src', bf.path + '?type=capcha&u=' + Math.random())
            },
            init_form: function(config_popup, attributes) {

                //bf.validation_server(config_popup);

                $('form[data-bf-config], .bf-modal form').on('submit', function(e) {
                    e.preventDefault();

                    var options = {
                        success: bf.show_response,
                        url: bf.path,
                        type: 'post',
                        dataType: 'json'
                    };

                    var form = $(this);
                    bf.config = bf.get_config(config_popup, form.data("bf-config"));

                    //validation on client
                    var validation_client = bf.validation_client(form);

                    if (validation_client) {
                        $.post(
                            bf.path, {
                                'type': 'validation',
                                'bf-config': bf.config
                            },
                            function(data) {

                                if (typeof attributes != 'undefined') {
                                    $.each(attributes, function(index, attr) {
                                        form.prepend('<input name="' + index + '" type="hidden" value="' + attr + '" />');
                                    });
                                }

                                $('[name="bf-config"], [name="bf-token"]').remove();
                                form.prepend('<input name="bf-config" type="hidden" value="' + bf.config + '" />');
                                form.prepend('<input name="bf-token" type="hidden" value="' + data['token'] + '" />');

                                form.ajaxSubmit(options); //set submit form
                            }
                        );
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
            validation_server: function(config_popup) {

                var elements = $('form[data-bf-config] select, form[data-bf-config] input, form[data-bf-config] textarea, .bf-modal form select, .bf-modal form input, .bf-modal form textarea');
                elements.off('keyup');
                elements.on('keyup', function(e) {
                    e.preventDefault();
                    var el = $(this);
                    var form = el.parents('form');
                    bf.config = bf.get_config(config_popup, form.data("bf-config"));
                    /*
                    console.log('config_popup:' + config_popup);
                    console.log('config:' + form.data("bf-config"));
                    console.log(bf.config);

                    if (el.val()) {
                        $.post(
                            bf.path, {
                                'type': 'validation',
                                'bf-config': config
                            },
                            function(data) {


                            }
                        );
                    }
                    */

                });

            },
            tooltip: function(el, form, err_msg) {

                if (err_msg.length > 0) {

                    bf.set_tooltip(el, form, err_msg);

                    $(window).resize(function() {
                        bf.set_tooltip(el, form, err_msg);
                    });
                } else {
                    var id = el.attr('name');
                    if (id) {
                        id = id.replace('[', '').replace(']', '');
                        $('.bf-tooltip-' + id).remove();
                    }
                }
            },
            set_tooltip: function(el, form, err_msg) {

                var min_dist = 20;

                var id = el.attr('name').replace('[', '').replace(']', '');
                $('.bf-tooltip-' + id).remove();

                var o = el.offset();
                var h = el.outerHeight();
                var w = el.outerWidth();

                el.after(
                    '<div class="bf-tooltip bf-tooltip-' + id + '"><div class="bf-arrow"></div>' + err_msg + '</div>'
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

                //console.log(($(window).width() - min_dist) +', '+ w  );

                popup_el.offset({
                    top: o['top'] + h,
                    left: default_position
                });

            },
            validation_client: function(form) {

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

                    bf.tooltip(el, form, err_msg);
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
