/**
 * Rockform - Simple, flexible ajax webform.
 * @author Rock'n'code
 * @version 4.4.0
 */

;
(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'jquery.form.min', 'jquery.mask.min', 'jquery.rtooltip', 'jquery.rmodal'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($) {

    var baseform = window.baseform || {};
    baseform = (function() {

        function baseform(element, settings) {

            var _ = this,
                dataSettings;

            _.defaults = {
                accessibility: true,

            };

            _.initials = {
                animating: false,
                dragging: false,

            };

            $.extend(_, _.initials);

            _.activeBreakpoint = null;

            dataSettings = $(element).data('slick') || {};

            _.options = $.extend({}, _.defaults, settings, dataSettings);

        }

        return baseform;

    }());

    var base_name_form = 'rockform';


    baseform.prototype.fileupload = function(creation) {
        var _ = this;

        //Стилизация загружаемого файла
        $(document).on('change', '.bf-input-file', function(e) {

            var $input = $(this),
                $label = $input.next('label'),
                labelVal = $label.html();
            var fileName = '';

            if (this.files && this.files.length > 1) {
                fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
            } else if (e.target.value) {
                fileName = e.target.value.split('\\').pop();
            }

            if (fileName) {
                $label.find('span').html(fileName);
            } else {
                $label.html(labelVal);
            }
        });

    };

    baseform.prototype.capcha = function(creation) {
        var _ = this;

        //Отслеживание создания капчи для динамически вставленных форм
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || '';

        if (MutationObserver.length > 0) {
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

            var callback = function(allmutations) {
                    allmutations.map(function(mr) {
                        var jq = $(mr.addedNodes);
                        jq.find('img[data-bf-capcha]').click();
                    });
                },
                mo = new MutationObserver(callback),
                options = {
                    'childList': true,
                    'subtree': true
                };
            mo.observe(document, options);
        }

        var capcha = {
            init: function() {
                capcha.update();
                $(document)
                    .off("click", 'img[data-bf-capcha]')
                    .on("click", 'img[data-bf-capcha]', function() {
                        capcha.update();
                    });
            },
            update: function() {
                $('img[data-bf-capcha]').attr('src', bf.path + '?type=capcha&u=' + Math.random());
            }
        };

        capcha.init();

    };

    baseform.prototype.mask_fields = function(creation) {

        var _ = this;

        var mask_pattern = '',
            mask_placeholder = {};

        var mask_fields = {
            init: function() {

                $(document).on('focus', '[data-bf-mask]', function() {
                    mask_fields.set($(this));
                });

                $('[data-bf-mask]').each(function() {
                    mask_fields.set($(this));
                });
            },
            set: function(el) {
                mask_pattern = el.data('bf-mask');
                mask_placeholder = el.attr('placeholder');

                if (mask_pattern.length > 0) {

                    if (typeof mask_placeholder == 'undefined' || mask_placeholder.length < 1) {
                        mask_placeholder = mask_pattern.replace(/[a-z0-9]+?/gi, "_");
                    }

                    mask_placeholder = { placeholder: mask_placeholder };

                    el.mask(mask_pattern, mask_placeholder);
                }
            }
        }

        mask.init();

    };

    baseform.prototype.validation = function(creation) {
        var _ = this;
        var validation = {

            server: function(form, data, event) {

                var err_msg;
                var el;
                var valid = 0;

                $('.bf-tooltip').rtooltip('reset');

                if (data.mail_to) {

                    $('[type="submit"], [type="image"], [type="button"]', form).rtooltip({ 'msg': data.mail_to });
                    return false;
                }

                if (data.filesize) {

                    $('[type="submit"], [type="image"], [type="button"]', form).rtooltip({ 'msg': data.filesize });
                    return false;
                }

                $.each(data, function(name, value) {
                    err_msg = '';

                    //устанавливаем токен в форму
                    if (name == 'token') {
                        bf.set_attr_form(form, data.token, 'bf-token');
                    } else if (name == 'filesize') {

                    } else {

                        err_msg = validation.set_err_msg(value);
                        el = $('[name="' + name + '"]', form);

                        el.rtooltip({ 'msg': err_msg });

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
        return validation;
    };

    baseform.prototype.init = function(creation) {

        var _ = this;

        var bf = {

            config: '',
            path: '/' + base_name_form + '/init.php',
            timer: function(form) {
                var def = 2000;

                var timer = form.data('bf-timer');
                if (typeof timer != 'undefined') {
                    if (parseInt(timer) > 0) {
                        def = timer;
                    }
                }

                return def;
            },
            init: function() {
                capcha.init();
                bf_mask.init();

                $(document).off('submit', 'form[data-bf-config], .bf-modal form')
                    .on('submit', 'form[data-bf-config], .bf-modal form',
                        function(e) {
                            e.preventDefault();

                            $('.bf-tooltip').rtooltip('reset');

                            var form = $(this);
                            if (typeof param == 'undefined') {
                                param = {};
                                param.config_popup = '';
                            }
                            bf.config = bf.get_config(param.config_popup, form.data("bf-config"));

                            //сериализуем форму
                            var formdata = form.formToArray();
                            var filesize = [];

                            //заменяем объект файла именем файла
                            $.each(formdata, function(index, element) {
                                if (element.type == 'file') {
                                    formdata[index].size = element.value.size || '';
                                    formdata[index].value = element.value.name || '';

                                    filesize.push(formdata[index].size);
                                }
                            });

                            //серверная валидация
                            $.post(
                                bf.path, {
                                    'fields': formdata,
                                    'type': 'validation',
                                    'bf-config': bf.config,
                                    'filesize': filesize
                                },
                                function(data) {

                                    bf.set_attr_form(form, bf.config, 'bf-config');

                                    //вывод ошибок валидации и уведомлений
                                    if (validation.server(form, data, e)) {

                                        //добавляем дополнительные параметры в форму из всплывающего окна
                                        if (typeof param.attributes != 'undefined') {
                                            $.each(param.attributes, function(name_item, value_item) {
                                                bf.set_attr_form(form, value_item, name_item);
                                            });
                                        }

                                        form.ajaxSubmit({
                                            beforeSubmit: function(arr, form, options) {

                                                $(':focus', form).prop('disabled', true);

                                            },
                                            success: bf.show_response,
                                            url: bf.path,
                                            type: 'post',
                                            dataType: 'json',
                                            error: function(jqXHR, textStatus, errorThrown) {
                                                alert('Server: ' + textStatus);
                                            }
                                        });

                                    }
                                    $('.bf-attr').remove();
                                });

                        });

                //всплывающая форма
                $.rmodal('[data-bf-config]:not(form)', {
                    path: bf.path,
                    before: function(el, option) {
                        //очищаем тултипы
                        $('.bf-tooltip').rtooltip('reset');

                        var config = $(el).data("bf-config") || '';

                        var data = {
                            'attributes': bf.get_attributes(el),
                            'bf-config': config,
                            'type': 'form'
                        }
                        option.attributes = data;

                        return option;
                    }
                });
            },
            get_attributes: function(button) {

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

                attributes['field_page_h1'] = $('h1:first').text() || ''
                attributes['field_page_link'] = document.location.href;

                return attributes;

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
            show_response: function(response, statusText, xhr, form) {

                var focused = $('[type="submit"], [type="image"], [type="button"]', form);

                focused.prop('disabled', false).removeAttr("disabled");


                if (parseInt(response.status) > 0) {

                    $.post(
                        bf.path, {
                            'type': 'form_success',
                            'bf-config': response['bf-config']
                        },
                        function(content) {
                            form.hide();

                            form.after(content);

                            setTimeout(
                                function() {
                                    $.rmodal('reset');
                                }, bf.timer(form)
                            );

                            setTimeout(
                                function() {
                                    form.show();
                                    form.clearForm();
                                    $('[data-bf-success]').remove();
                                }, (bf.timer(form) + 1000)
                            );
                        },
                        'html'
                    );

                } else {
                    focused.rtooltip({ 'msg': response.value });
                }
            }
        }
        bf.init();

    };

    $.fn.rockform = function(method) {
        var _ = this,
            opt = arguments[0];

        if (methods[method]) {
            //return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (method.length > 0) {
            return new baseform(_, opt);
        } else {
            $.error('Method "' + method + '" not find');
        }
        return method;
    };

}));