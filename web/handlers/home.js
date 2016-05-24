'use strict';

let express   = require('express'),
    wrap      = require('co-express'),
    faker     = require('faker'),
    _         = require('lodash'),
    router    = express.Router(),
    tmpldir;

// set template directory
router.use(function (req, res, next) {
    tmpldir = req.app.get('config').paths.templates + '/hello';

    next();
});

router.get('/', function (req, res) {
    res.render(tmpldir + '/index', {
        'title': 'Sqlite demo',
        'file' : req.app.get('config').web.db.file
    });
});

router.post('/users', wrap(function* (req, res, next) {
    let user = new (req.app.get('core')).user.User();

    user.id    = faker.random.number();
    user.fName = faker.name.firstName();
    user.lName = faker.name.lastName();
    user.email = faker.internet.email();

    try {
        yield req.app.get('core').user.Repo.save(user);
    } catch (e) {
        return next(e);
    }

    res.json({
        'done'   : true,
        'payload': user
    });
}));

router.get('/users', wrap(function* (req, res, next) {
    let users;

    let start = + req.query.start,
        length = + req.query.length,
        end = start + length;

    try {
        users = yield req.app.get('core').user.Repo.getAll(start, end);
    } catch (e) {
        return next(e);
    }

    // res.json(users);
    res.json({
        "draw": req.query.draw,
        "data": _.map(users, (user) => {
            return [user.id, user.fName, user.lName, user.email];
        })
});
}));

module.exports = router;
