/**
 * Rockform - Simple, flexible ajax webform.
 * @version 3.7.1
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

        var tooltip = {
            init: function(el, err_msg) {

                if (err_msg.length > 0) {

                    tooltip.set({
                        'el': el,
                        'err_msg': err_msg
                    });

                    $(window).on("resize", {
                        'el': el,
                        'err_msg': err_msg
                    }, tooltip.set);

                } else {

                    var id = el.attr('name');
                    if (id) {
                        $('[data-bf-tooltip-id="' + id + '"]').remove();
                    }
                }
            },
            set: function(event) {

                var el, err_msg;

                if (event.data) {
                    el = event.data.el;
                    err_msg = event.data.err_msg;
                } else {
                    el = event.el;
                    err_msg = event.err_msg;
                }

                if (el.attr('name')) {
                    var min_dist = 20;

                    var id = el.attr('name');
                    $('[data-bf-tooltip-id="' + id + '"]').remove();

                    var o = el.offset();
                    var h = el.outerHeight();
                    var w = el.outerWidth();

                    el.after(
                        '<div class="bf-tooltip" data-bf-tooltip-id="' + id + '"> \
                         <div class="bf-arrow"></div>' + err_msg + '</div>'
                    );

                    var popup_el = $('[data-bf-tooltip-id="' + id + '"]');
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
            reset: function() {
                $(window).off("resize", tooltip.set);
                $('.bf-tooltip').remove();

            },
            position: function(el, err_msg) {
                //http://github.hubspot.com/tooltip/docs/welcome/
                var pos = $('form', el);

                if(pos == 'top right') {

                } else if(pos == 'top center') {

                } else if(pos == 'top left') {

                } else if(pos == 'left top') {

                } else if(pos == 'left middle') {

                } else if(pos == 'left bottom') {

                } else if(pos == 'bottom left') {

                } else if(pos == 'bottom center') {

                } else if(pos == 'bottom right') {

                } else if(pos == 'right bottom') {

                } else if(pos == 'right middle') {

                } else if(pos == 'right top') {

                } else {

                }

            }
        }

        var validation = {

            server: function(form, data) {

                var err_msg;
                var el;
                var valid = 0;

                tooltip.reset();

                $('.bf-status').remove();

                if (data.mail_to) {

                    form.before(
                        '<div class="bf-status bf-status-0">' + data.mail_to + '</div>'
                    );
                    return false;
                }

                $.each(data, function(name, value) {
                    err_msg = '';

                    if (name == 'token') {

                        bf.set_attr_form(form, data.token, 'bf-token');

                    } else {
                        err_msg = validation.set_err_msg(value);
                        el = $('[name="' + name + '"]');

                        if (el) {
                            tooltip.init(el, err_msg);
                        }

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
            set_err_msg: function(err) {
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

        var popup = {

            init: function(path, data, custom_func, param_custom_func) {

                $.ajax({
                    url: path,
                    data: data,
                    method: "post",
                    dataType: "html",
                    beforeSend: function(xhr) {
                        popup.loader_on();
                    },
                    success: function(xhr) {

                        popup.set_overlay();
                        popup.set_close_event();

                        //animation begin
                        $('.bf-modal, .bf-fixed-overlay').css('opacity', '0');

                        $('.bf-modal-box').html(xhr);

                        popup.loader_off();

                        //animation end
                        $('.bf-modal, .bf-fixed-overlay').animate({
                            'opacity': "1"
                        }, 400);

                        custom_func(param_custom_func);
                        //bf.init_form(config_popup, attributes);
                    }
                })

            },

            set_overlay: function() {

                $('body').append('<div class="bf-fixed-overlay bf-fixed-overlay__modal"> \
                            <div class="bf-modal"> \
                                <div class="bf-modal_container"> \
                                    <a href="javascript:;" class="bf-modal-close" title=""></a> \
                                      <div class="bf-modal-box"></div> \
                                </div> \
                            </div> \
                        </div>');

            },

            loader_on: function() {
                $('body').append('<div class="bf-loading"></div>');
            },
            loader_off: function() {
                $('.bf-loading').remove();
            },
            set_close_event: function() {
                $(".bf-modal-close, .bf-fixed-overlay").one("click", function() {
                    $(".bf-fixed-overlay").remove();
                    bf.init_form();
                });

                $(".bf-modal").on("click", function(e) {
                    e.stopImmediatePropagation();
                });
            }

        };

        var capcha = {
            init: function() {
                var item = $('[data-bf-capcha=""]');
                item.off();
                capcha.update();
                item.on("click", function() {
                    capcha.update();
                });
            },
            update: function() {
                $('[data-bf-capcha=""]').attr('src', bf.path + '?type=capcha&u=' + Math.random());
            }
        };

        var bf = {

            config: '',
            path: '/' + base_name_form + '/init.php',

            init: function() {

                bf.init_popup_form();
                bf.init_form();
            },
            init_popup_form: function() {
                $('[data-bf-config]').on("click", function(e) {
                    e.preventDefault();

                    tooltip.reset();

                    var config_popup = $(this).data("bf-config");
                    if (typeof config_popup == 'undefined' || config_popup.length < 1) {
                        config_popup = '';
                    }

                    var attributes = bf.get_custom_popup_attributes($(this));

                    popup.init(
                        bf.path, {
                            'bf-config': config_popup,
                            'attributes': attributes,
                            'type': 'form'
                        },
                        bf.init_form, {
                            'config_popup': config_popup,
                            'attributes': attributes
                        }
                    );

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
            init_form: function(param) {
                capcha.init();

                $('form[data-bf-config], .bf-modal form').off('submit');
                $('form[data-bf-config], .bf-modal form').on('submit', function(e) {
                    e.preventDefault();

                    var form = $(this);
                    if (typeof param == 'undefined') {
                        param = {};
                        param.config_popup = '';
                    }
                    bf.config = bf.get_config(param.config_popup, form.data("bf-config"));

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

                            bf.set_attr_form(form, bf.config, 'bf-config');

                            if (validation.server(form, data)) {
                                //set add params from popup
                                if (typeof param.attributes != 'undefined') {
                                    $.each(param.attributes, function(name_item, value_item) {
                                        bf.set_attr_form(form, value_item, name_item);
                                    });
                                }

                                form.ajaxSubmit({
                                    success: bf.show_response,
                                    url: bf.path,
                                    type: 'post',
                                    dataType: 'json'
                                });


                            }
                            $('.bf-attr').remove();
                        });

                });
            },
            set_attr_form: function(form, value, name) {
                form.prepend('<input name="' + name + '" class="bf-attr" type="hidden" value="' + value + '" />');
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
