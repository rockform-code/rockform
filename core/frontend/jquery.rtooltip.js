;(function(factory) {
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
        options: {},
        init: function(el, msg) {
            var _ = this;

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
                var id = el.attr('name') || '';
                if (id) {
                    $('[data-bf-tooltip-id="' + id + '"]').remove();
                }
            }
        },
        set: function(event) {

            var _ = this,
                el, msg;

            //Выбираем данные при прямой передачи и через событие ресайза
            if (event.data) {
                el = event.data.el;
                msg = event.data.msg;
            } else {
                el = event.el;
                msg = event.msg;
            }

            var id = el.attr('name') || el.attr('data-name') || '';

            if (id.length > 0) {

                //получаем первый элемент формы для групп с одинаковым именем
                el = $('[name="' + id + '"]:first', el.parents('form'));

                //получаем позицию для вывода
                var pos = el.attr('data-bf-tooltip') || el.parents('form').attr('data-bf-tooltip') || tooltip.options.pos;

                $('[data-bf-tooltip-id="' + id + '"]').remove();

                el.after(
                    '<span class="bf-tooltip bf-tooltip-' + pos + '" data-bf-tooltip-id="' + id + '"> \
                         <span class="bf-arrow"></span>' + msg + '</span>'
                );

                tooltip.position(el, pos);
            }

        },
        reset: function() {
            $(window).off("resize", tooltip.set);
            $('.bf-tooltip').remove();

        },
        response: function(left, top, w_tooltip, el_offset, w_el, t) {
            var _ = this;

            t.css('white-space', 'nowrap');

            if (t.is('[class*="left"]')) {

                if (left <= _.options.min_dist_border_window) {

                    t.css('white-space', 'normal');
                    left = _.options.min_dist_border_window;

                    //добавляем адаптив для левой позиции
                    if (t.hasClass('bf-tooltip-left')) {
                        t.removeClass('bf-tooltip-left').addClass('bf-tooltip-bottom-left');
                    }
                }

            } else {
                var pos = left + w_tooltip + _.options.min_dist_border_window;
                var pos_min = $(window).outerWidth() - _.options.min_dist_border_window - w_tooltip;

                if (pos > $(window).outerWidth()) {
                    left = pos_min;

                    //добавляем адаптив для правой позиции
                    if (t.hasClass('bf-tooltip-right')) {
                        t.removeClass('bf-tooltip-right').addClass('bf-tooltip-top-right');
                    }
                }

                if (pos_min <= el_offset['left']) {

                    t.css('white-space', 'normal');
                    left = el_offset['left'];
                }
            } 

            return { top: top, left: left };
        },
        position: function(el, pos) {
            var _ = this;

            if (el.length > 0) {

                var el_offset = el.offset();
                var id = el.attr('name') || el.attr('data-name') || '';
                var t = $('[data-bf-tooltip-id="' + id + '"]');

                var h_el = el.outerHeight();
                var w_el = el.outerWidth();
                var w_tooltip = t.outerWidth();
                var h_tooltip = t.outerHeight();
                var top = 0,
                    left = 0;

                if (pos === 'top') {

                    top = el_offset['top'] - h_tooltip;
                    left = el_offset['left'] + w_el / 2 - w_tooltip / 2;
                    
                } else if (pos == 'top-right') {

                    left = el_offset['left'] + w_el / 6 * 5;
                    top = parseInt(el_offset['top']) - parseInt(h_tooltip) - _.options.dist_from_item;
                    
                } else if (pos === 'top-center') {

                    top = el_offset['top'] - h_tooltip;
                    left = el_offset['left'] + w_el / 2;

                } else if (pos === 'top-left') {

                    top = parseInt(el_offset['top']) - parseInt(h_tooltip) - _.options.dist_from_item;
                    left = el_offset['left'] + w_el / 6 - w_tooltip;

                } else if (pos === 'bottom') {

                    top = el_offset['top'] + h_el;
                    left = el_offset['left'] + w_el / 2 - w_tooltip / 2;

                } else if (pos === 'bottom-left') {

                    top = el_offset['top'] + h_el;
                    left = el_offset['left'] + w_el / 6 - w_tooltip;

                } else if (pos === 'bottom-center') {

                    top = el_offset['top'] + h_el;
                    left = el_offset['left'] + w_el / 2;

                } else if (pos === 'bottom-right') {

                    top = el_offset['top'] + h_el;
                    left = el_offset['left'] + w_el / 6 * 5;

                } else if (pos === 'left') {

                    top = el_offset['top'] + h_el / 2 - h_tooltip / 2;
                    left = el_offset['left'] - w_tooltip;

                } else if (pos === 'right') {

                    top = el_offset['top'] + h_el / 2 - h_tooltip / 2;
                    left = el_offset['left'] + w_el;
                }

                t.offset(tooltip.response(left, top, w_tooltip, el_offset, w_el, t));
            }
        }
    };

    // определяем необходимые параметры по умолчанию
    var defaults = {
        'min_dist_border_window': 20, //расстояние до границы после которого начинается адаптив
        'dist_from_item': 5, //расстояние от элемента
        'pos': 'top-right'
    };

    // наши публичные методы
    var methods = {
        // инициализация плагина
        init: function(params) {
            // актуальные настройки, будут индивидуальными при каждом запуске
            var options = $.extend({}, defaults, params);

            tooltip.options = options;

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
            $.error('Method "' + method + '" not find');
        }
    };

}));