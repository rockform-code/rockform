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

requirejs(['baseform']); 
