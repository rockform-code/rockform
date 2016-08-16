requirejs.config({
    baseUrl: '/rockform/frontend/lib/',
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

requirejs(['jquery.form.min']); 
requirejs(['jquery.mask.min']); 
requirejs(['baseform.min']); 
