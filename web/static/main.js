require.config({
    baseUrl: '/static',
    paths: {
        'jquery'    : 'thirdparty/jquery/dist/jquery.min',
        'bootstrap' : 'thirdparty/bootstrap-css/js/bootstrap.min',
        'nprogress' : 'thirdparty/nprogress/nprogress',
        'datatables': 'thirdparty/datatables/media/js/jquery.dataTables',
        'datatables-bootstrap': 'thirdparty/datatables-plugins/integration/bootstrap/3/dataTables.bootstrap'
    },
    shim: {
        'bootstrap' : {
            'deps' : ['jquery']
        },
        'datatables': {
            deps: ['jquery']
        },
        'datatables-bootstrap': {
            deps: ['datatables']
        }
    }
});

require(['jquery', 'nprogress', 'datatables-bootstrap'], function ($, nprogress) {
    var $usersTable = $('.all-users').dataTable();

    nprogress.configure({ showSpinner: false });

    $(document).ajaxStart(function () {
        nprogress.start();
    });

    $(document).ajaxStop(function () {
        nprogress.done(true);
    });

    getUsers();

    $('.add-user .btn-primary').on('click', function () {
        addUser();
    });

    function addUser() {
        $.post('/users', function(res) {
            renderTable($usersTable, [res.payload], false);
        });
    }

    function getUsers() {
        $.get('/users', function(res) {
            renderTable($usersTable, res, true);
        });
    }

    function renderTable($table, payload, clearTable) {
        if (clearTable) {
            $table.fnClearTable();
        }

        $.each(payload, function (index, user) {
            $table.fnAddData([
                user.id,
                user.fName,
                user.lName,
                user.email
            ]);
        });

        $table.fnDraw();
    }
});
