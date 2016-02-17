require.config({
    baseUrl: '/static',
    paths: {
        'jquery'    : 'thirdparty/jquery/dist/jquery.min',
        'bootstrap' : 'thirdparty/bootstrap-css/js/bootstrap.min',
        'nprogress' : 'thirdparty/nprogress/nprogress'
    },
    shim: {
        'bootstrap' : {
            'deps' : ['jquery']
        }
    }
});

require(['jquery', 'nprogress'], function ($, nprogress) {
    nprogress.configure({ showSpinner: false });

    $(document).ajaxStart(function () {
        nprogress.start();
    });

    $(document).ajaxStop(function () {
        nprogress.done(true);
    });

    getUsers();

    $('.add-user .btn-primary').on('click', function () {
        addUser(getUsers);
    });

    function addUser(cb) {
        $.post('/users', function(res) {
            cb();
        });
    }

    function getUsers() {
        $.get('/users', function(res) {
            var html = '';

            $.each(res, function (index, user) {
                html += '<tr>';
                html += '<td>' + user.id +'</td>';
                html += '<td>' + user.fName +'</td>';
                html += '<td>' + user.lName +'</td>';
                html += '<td>' + user.email +'</td>';
                html += '</tr>';
            });

            $('.all-users tbody').html(html);
        });
    }
});
