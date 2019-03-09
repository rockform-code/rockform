/**
 * Rtooltip
 * @author Rock'n'code
 * @version 0.1.0
 */

;
(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($) {

    var tooltip = {
        init: function(el, msg) {

            $(document).on('mouseover', '.bf-tooltip', function() {
                $(this).remove();
            });

            if (msg.length > 0) {

                tooltip.set({
                    'el': el,
                    'msg': msg
                });

                $(window).on("resize", {
                    'el': el,
                    'msg': msg
                }, tooltip.set);

            } else {
                //убираем тултип, если нету сообщения об ошибке
                var id = el.attr('name');
                if (id) {
                    $('[data-bf-tooltip-id="' + id + '"]').remove();
                }
            }
        },
        set: function(event) {

            var el, msg;

            //Выбираем данные при прямой передачи и через событие ресайза
            if (event.data) {
                el = event.data.el;
                msg = event.data.msg;
            } else {
                el = event.el;
                msg = event.msg;
            }

            var id = el.attr('name') || '';

            //получаем первый элемент формы для групп с одинаковым именем
            el = $('[name="' + id + '"]:first', el.parents('form'));

            var pos = el.attr('data-bf-tooltip');

            //генерируем класс для тултипа
            if (typeof pos != 'undefined') {
                pos = pos.replace(/[ ]+?/gi, "-");
            } else {

                pos = el.parents('form').attr('data-bf-tooltip');

                if (pos === undefined) {
                    pos = 'top-right';
                } else {
                    pos = pos.replace(/[ ]+?/gi, "-");
                }
            }

            $('[data-bf-tooltip-id="' + id + '"]').remove();
            el.after(
                '<div class="bf-tooltip bf-tooltip-' + pos + '" data-bf-tooltip-id="' + id + '"> \
                         <div class="bf-arrow"></div>' + msg + '</div>'
            );

            tooltip.position(el);

        },
        reset: function() {
            //$(window).off("resize", tooltip.set);
            $('.bf-tooltip').off().remove();

        },
        response: function(left, w_tooltip, el_offset, el_outer_w, t) {
            var min_dist = 20;

            t.css('white-space', 'nowrap');
            var pos = left + w_tooltip + min_dist;
            var pos_min = $(window).outerWidth() - min_dist - w_tooltip;

            if (pos > $(window).outerWidth()) {
                left = pos_min;
            }

            if (pos_min <= el_offset['left']) {

                t.css('white-space', 'normal');

                left = el_offset['left'];
                t.width(el_outer_w - min_dist);
            }

            return left;
        },
        position: function(el) {

            var dist_from_input = 5;

            var el_offset = el.offset();

            if (typeof el_offset != 'undefined') {

                var el_outer_h = el.outerHeight();
                var el_outer_w = el.outerWidth();
                var id = el.attr('name');

                var t = $('[data-bf-tooltip-id="' + id + '"]');
                var w_tooltip = t.outerWidth();
                var h_tooltip = t.outerHeight();

                var pos = el.attr('data-bf-tooltip');

                if (pos === undefined) {

                    var pos = el.parents('form').attr('data-bf-tooltip');

                    if (pos === undefined) {
                        pos = 'top right';
                    }
                }

                if (pos == 'top right') {

                    var left = el_offset['left'] + el_outer_w / 6 * 5;
                    left = tooltip.response(left, w_tooltip, el_offset, el_outer_w, t);

                    h_tooltip = t.outerHeight();

                    var top = parseInt(el_offset['top']) - parseInt(h_tooltip) - dist_from_input;

                    t.offset({
                        top: top,
                        left: left
                    });

                } else if (pos == 'top center') {

                    var position = el_offset['left'] + el_outer_w / 2;
                    position = tooltip.response(position, w_tooltip, el_offset, el_outer_w, t);
                    h_tooltip = t.outerHeight();
                    t.offset({
                        top: el_offset['top'] - h_tooltip,
                        left: position
                    });

                } else if (pos == 'top') {

                    var position = el_offset['left'];
                    position = tooltip.response(position, w_tooltip, el_offset, el_outer_w, t);
                    h_tooltip = t.outerHeight();
                    t.offset({
                        top: el_offset['top'] - h_tooltip,
                        left: position
                    });
                } else if (pos == 'top left') {

                    var left = el_offset['left'] + el_outer_w / 6 - w_tooltip;

                    h_tooltip = t.outerHeight();

                    var top = parseInt(el_offset['top']) - parseInt(h_tooltip) - dist_from_input;

                    t.offset({
                        top: top,
                        left: left
                    });

                } else if (pos == 'left center') {
                    var position = el_offset['left'] - w_tooltip;
                    h_tooltip = t.outerHeight();
                    t.offset({
                        top: el_offset['top'] + el_outer_h / 2 - h_tooltip / 2,
                        left: position
                    });

                } else if (pos == 'bottom') {

                    var position = el_offset['left'];
                    position = tooltip.response(position, w_tooltip, el_offset, el_outer_w, t);

                    t.offset({
                        top: el_offset['top'] + el_outer_h,
                        left: position
                    });

                } else if (pos == 'bottom left') {

                    var position = el_offset['left'] + el_outer_w / 6 - w_tooltip;

                    t.offset({
                        top: el_offset['top'] + el_outer_h,
                        left: position
                    });

                } else if (pos == 'bottom center') {

                    var position = el_offset['left'] + el_outer_w / 2;
                    position = tooltip.response(position, w_tooltip, el_offset, el_outer_w, t);

                    t.offset({
                        top: el_offset['top'] + el_outer_h,
                        left: position
                    });

                } else if (pos == 'bottom right') {

                    var position = el_offset['left'] + el_outer_w / 6 * 5;
                    position = tooltip.response(position, w_tooltip, el_offset, el_outer_w, t);

                    t.offset({
                        top: el_offset['top'] + el_outer_h,
                        left: position
                    });

                } else if (pos == 'right center') {
                    var position = el_offset['left'] + el_outer_w;

                    t.offset({
                        top: el_offset['top'] + el_outer_h / 2 - h_tooltip / 2,
                        left: position
                    });
                }
            }
        }
    };

    // определяем необходимые параметры по умолчанию
    var defaults = {

    };

    // наши публичные методы
    var methods = {
        // инициализация плагина
        init: function(params) {
            // актуальные настройки, будут индивидуальными при каждом запуске
            var options = $.extend({}, defaults, params);

            return this.each(function() {

                if (params !== undefined) {
                    var msg = params.msg || '';

                    if (msg.length > 0) {
                        tooltip.init($(this), msg);
                    }
                }

            });
        },

        reset: function() {
            tooltip.reset(); 
        }
    };

    $.fn.rtooltip = function(method) {

        // немного магии
        if (methods[method]) {
            // если запрашиваемый метод существует, мы его вызываем
            // все параметры, кроме имени метода прийдут в метод
            // this так же перекочует в метод
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {

            // если первым параметром идет объект, либо совсем пусто
            // выполняем метод init
            return methods.init.apply(this, arguments);
        } else {
            // если ничего не получилось
            $.error('Метод "' + method + '" не найден');
        }
    };

}));
