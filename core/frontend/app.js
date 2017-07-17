requirejs.config({
    baseUrl: '/rockform/core/frontend/',
    paths: {
        jquery: 'jquery.min'
    },
    map: {
        "*": {
            "jquery": "noconflict"
        },
        "noconflict": {
            "jquery": "jquery"
        } 
    }
});

requirejs(['jquery.rtooltip']); 
requirejs(['jquery.rmodal']); 
requirejs(['jquery.form.min']); 
requirejs(['jquery.mask.min']); 
requirejs(['baseform']); 
