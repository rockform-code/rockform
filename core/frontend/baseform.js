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
                config: '',
                path: '/rockform/init.php',
                timer: 2000,
                before_send_form: function() {},
                after_send_form: function() {},
                before_show_modal: function() {},
                after_show_modal: function() {},
                close_modal: function() {}
            };

            dataSettings = $(element).data('bf') || {};
            _.options = $.extend({}, _.defaults, settings, dataSettings);

            _.init();
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
                        _.set_attr_form(form, data.token, 'bf-token');
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

    baseform.prototype.set_attr_form = function(form, value, name) {
        form.prepend('<input name="' + name + '" class="bf-attr" type="hidden" value="' + value + '" />');
    };

    baseform.prototype.init = function(creation) {

        var _ = this;

        var bf = {

            init: function() {

                _.capcha();
                _.mask_fields();

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
                            _.options.config = bf.get_config(param.config_popup, form.data("bf-config"));

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
                                _.options.path, {
                                    'fields': formdata,
                                    'type': 'validation',
                                    'bf-config': _.options.config,
                                    'filesize': filesize
                                },
                                function(data) {

                                    data = data || {};

                                    _.set_attr_form(form, _.options.config, 'bf-config');

                                    //вывод ошибок валидации и уведомлений
                                    if (_.validation(form, data)) {

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
                                            url: _.options.path,
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
                    path: _.options.path,
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
                        _.options.path, {
                            'type': 'form_success',
                            'bf-config': response['bf-config']
                        },
                        function(content) {
                            form.hide();

                            form.after(content);

                            setTimeout(
                                function() {
                                    $.rmodal('reset');
                                }, _.options.timer
                            );

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
        bf.init();

    };

    $.fn.rockform = function(method) {
        var _ = this,
            opt = arguments[0];
        console.log(opt);


        //_.each(function() {

        if (typeof opt == 'object' || typeof opt == 'undefined') {
            new baseform(_, opt);
        } else {

        }

        // });

        /*
        if (methods[method]) {
            //return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (method.length > 0) {
            return new baseform(_, opt);
        } else {
            $.error('Method "' + method + '" not find');
        }
        return method;
        */
        /*

 $.fn.slick = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].slick = new Slick(_[i], opt);
            else
                ret = _[i].slick[opt].apply(_[i].slick, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
};
        */
        return _;
    };

}));





(function($) {
    $(function() {
        $('a').rockform({
            config: 'xxx',
            before_send_form: function() {

                alert(1);

            }
        });

        //$('[name="phone"]').rtooltip({ 'msg': 'Спасибо' });

    });
})(jQuery);