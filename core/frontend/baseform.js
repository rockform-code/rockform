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
                element = element || '[data-bf]',
                settings = settings || {};
 
            _.defaults = {
                config: '',
                path: '/rockform/init.php',
                timer: 2000,
                fields: {},
                submit_selector: '[type="submit"], [type="image"], [type="button"]',
                before_send_form: function(form) {},
                after_send_form: function(form) {},
                before_show_modal: function() {},
                after_show_modal: function() {},
                close_modal: function() {}
            };
 
            _.options = $.extend({}, _.defaults);

            _.init(element, settings);
        }

        return baseform;
    }());

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
                $('img[data-bf-capcha]').attr('src', _.options.path + '?type=capcha&u=' + Math.random());
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

        mask_fields.init();

    };

    baseform.prototype.validation = function(form, data) {
        var _ = this;
        var validation = {

            init: function(form, data) {

                var err_msg,
                    el;
                valid = 0,
                    data = data || {};

                $('.bf-tooltip').rtooltip('reset');

                if (data.mail_to) {

                    $(_.options.submit_selector, form).rtooltip({ 'msg': data.mail_to });
                    return false;
                }

                if (data.filesize) {

                    $(_.options.submit_selector, form).rtooltip({ 'msg': data.filesize });
                    return false;
                }

                $.each(data, function(name, value) {
                    err_msg = '';

                    if (name == 'token') {
                        //устанавливаем токен в форму
                        _.set_attr_form(form, 'bf-token', data.token);
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
        return validation.init(form, data);
    };

    baseform.prototype.set_attr_form = function(form, name, value) {
        form.prepend('<input name="' + name + '" class="bf-attr" type="hidden" value="' + value + '" />');
    };

    baseform.prototype.init = function(el, settings) {

        var _ = this;

        var bf = {

            init: function(el, settings) {

                _.capcha();
                _.mask_fields();

                $(document).off('submit', 'form' + el).on('submit', 'form' + el,
                    function(e) {
                        e.preventDefault();
                        var form = $(this);

                        $('.bf-tooltip').rtooltip('reset');

                        data = form.data('bf') || '';
                        if (typeof data === 'string') {
                            data = { 'config': data };
                        }
                        _.options = $.extend({}, _.options, data, settings);

                        //console.log(_.options);
                        //сериализуем форму
                        var formdata = form.formToArray();
                        var filesize = [];

                        //заменяем объект файла именем файла
                        $.each(formdata, function(index, element) {
                            if (element.type == 'file') {
                                formdata[index].size = element.value.size || '';
                                formdata[index].value = element.value.name || '';

                                //вычисляем размер файлов для загрузки
                                filesize.push(formdata[index].size);
                            }
                        });

                        //серверная валидация
                        $.post(
                            _.options.path, {
                                'fields': formdata,
                                'type': 'validation',
                                'bf-config': _.options.config,
                                'filesize': filesize
                            },
                            function(response) {

                                response = response || {};
                                //отправка формы, если валидация прошла
                                if (_.validation(form, response)) {

                                    _.set_attr_form(form, 'bf-config', _.options.config);

                                    //добавляем дополнительные параметры в форму из всплывающего окна
                                    $.each(_.options.fields, function(name_item, value_item) {
                                        _.set_attr_form(form, 'bf[fields][' + name_item + ']', value_item);
                                    });

                                    form.ajaxSubmit({
                                        beforeSubmit: function(arr, form, options) {
                                            //событие перед отправкой формы
                                            _.options.before_send_form(form);
                                            $(_.options.submit_selector, form).prop('disabled', true);
                                        },
                                        url: _.options.path,
                                        type: 'post',
                                        dataType: 'json',
                                        success: bf.show_response,
                                        error: function(jqXHR, textStatus, errorThrown) {
                                            alert('Server: ' + textStatus);
                                        }
                                    });

                                }
                                $('.bf-attr').remove();
                            });
                    });

                console.log(el + ':not(form)');

                //всплывающая форма
                $.rmodal(el + ':not(form)', {
                    path: _.options.path,
                    before: function(el, option) {
                        //очищаем тултипы
                        $('.bf-tooltip').rtooltip('reset');

                        //получаем данные конфигурации
                        var data = $(el).data("bf") || '';

                        //если нет json
                        if (typeof data === 'string') {
                            data = { 'config': data };
                        }

                        //передаём дополнительные поля к форме отправки
                        var custom_fields_attributes = bf.get_custom_fields_attributes(el);
                        data.fields = data.fields || {};
                        data.fields = $.extend({}, data.fields, custom_fields_attributes);

                        settings = settings || '---';
                        console.log(settings);
                        data = $.extend({}, _.options, data);

                        if (settings) {
                            console.log('settings');
                            data = $.extend({}, data, settings);
                        }

                        var attr = {};

                        attr.fields = data.fields || {};
                        attr.config = data.config || {};
                        attr.timer = data.timer || {};

                        var attributes = {
                            'data': attr,
                            'bf-config': data.config,
                            'type': 'form'
                        }
                        option.attributes = attributes;
                        // console.log(attributes);
                        return option;
                    },
                    after: function(el, wrap_form, option) {
                        //передаём в новую форму параметры с кнопки
                        var data = JSON.stringify(option.attributes.data);
                        wrap_form.find('form').attr('data-bf', data);
                    }
                });
            },
            get_custom_fields_attributes: function(button) {

                var attributes = {};
                var attr_el = '';

                if (button.length) {
                    $.each(button[0].attributes, function(index, attr) {
                        attr_el = attr.name;
                        if (/data\-bf\-field/.test(attr_el)) {
                            attr_el = attr_el.replace(/data\-bf\-field(\-|_)/, '');
                            attributes[attr_el] = attr.value;
                        }
                    });
                }

                attributes['page_h1'] = $('h1:first').text() || '';
                attributes['page_url'] = document.location.href;

                return attributes;

            },
            show_response: function(response, statusText, xhr, form) {

                var focused = $(_.options.submit_selector, form);
                focused.prop('disabled', false).removeAttr("disabled");


                if (parseInt(response.status) > 0) {

                    //событие после успешной отправки формы
                    _.options.after_send_form(form);

                    //выводим окно об успешной отправке
                    $.post(
                        _.options.path, {
                            'type': 'form_success',
                            'bf-config': response['bf-config']
                        },

                        function(content) {
                            form.hide();

                            form.after(content);

                            //закрываем окно всплывающее
                            setTimeout(
                                function() {
                                    $.rmodal('reset');
                                }, _.options.timer
                            );

                            //сбрасываем состояние встроенной формы
                            setTimeout(
                                function() {
                                    form.show();
                                    form.clearForm();
                                    $('[data-bf-success]').remove();
                                }, (_.options.timer + 1000)
                            );
                        },
                        'html'
                    );

                } else {
                    focused.rtooltip({ 'msg': response.value });
                }
            }
        }
        bf.init(el, settings);
    };

    $.bf = function(el) {
        var _ = this,
            opt = arguments[1] || {};

            //console.log(el);
            //console.log(opt);

            //$(document).on('click', el, function(){
                //opt.before_send_form();
            //});

            new baseform(el, opt);
        return _;
    };

    new baseform();

}));