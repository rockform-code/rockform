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

requirejs(['core']); 
