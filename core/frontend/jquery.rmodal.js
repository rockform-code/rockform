/**
 * Rmodal
 * @author Rock'n'code
 * @version 0.2.0
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

    var rmodal = { 
        init: function(delegate, arguments) {

            var _ = this;
            _.options = arguments;

            $(document).off('click', delegate).on('click', delegate, function(e) {
                e.preventDefault();

                 _.reset();

                var el = $(this);

                _.options = _.options.before(el, _.options) || _.options;
                //console.log(_.options.attributes);
                $.ajax({
                    url: _.options.path,
                    data: _.options.attributes,
                    method: _.options.method || "post",
                    dataType: _.options.datatype || "html",
                    beforeSend: function(xhr) {
                        _.loader_on();
                    },
                    success: function(xhr) {

                        _.set_template();
                        _.set_close_event();

                        $('.bf-modal, .bf-fixed-overlay').css('opacity', '0');

                        $('.bf-modal-box').html(xhr);
                        _.loader_off();

                        $('.bf-modal, .bf-fixed-overlay').animate({ 'opacity': "1" }, 500);
                        
                        _.options.after(el, $('.bf-modal-box'), _.options);

                    }
                });

            });
        },
        set_template: function() {

            $('[data-rmodal="wrap"]').remove();
            $('body').append(this.options.template);

        },
        loader_on: function() {
            $('body').append('<div class="bf-loading"></div>');
        },
        loader_off: function() {
            $('.bf-loading').remove();
        },
        set_close_event: function() {
            var _ = this;

            $(document).on("click", "[data-rmodal='reset']", function() {
                _.reset();
                _.options.reset();
            });

            $(document).on("click", ".bf-modal", function(e) {
                e.stopImmediatePropagation();
            });
        },
        reset : function() {
            $(".bf-fixed-overlay").remove(); 
        }
    };

    // определяем необходимые параметры по умолчанию
    var defaults = {
        path: '',
        attributes: {},
        template: '<div data-rmodal="reset" data-rmodal="wrap"  class="bf-fixed-overlay bf-fixed-overlay__modal"> \
                            <div class="bf-modal"> \
                                <div class="bf-modal_container"> \
                                    <a href="javascript:;" data-rmodal="reset" class="bf-modal-reset" title=""></a> \
                                      <div class="bf-modal-box"></div> \
                                </div> \
                            </div> \
                            <small class="bf-modal-after"></small> \
                        </div>',
        before: function(el, opt) {
            return opt;
        },
        after: function(el, wrap_form, opt) {
           
        },
        reset: function(el, opt) {
            
        }
    };

    var methods = {
        init: function(delegate, arguments) {
            var arguments = $.extend({}, defaults, arguments);
            return rmodal.init(delegate, arguments);
        },
        reset: function() {
            rmodal.reset();
        }
    };

    $.rmodal = function(delegate) {
        
        if (methods[delegate]) {
             return methods[delegate].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (delegate.length > 0) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method "' + delegate + '" not find');
        }
        return delegate;
    };

}));
