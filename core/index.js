'use strict';

let _       = require('lodash'),
    fs      = require('fs'),
    modules = [
        'user',
];

function init(cfg) {
    let core   = {},
        sqlite3 = require('sqlite3').verbose(),
        exists = fs.existsSync(cfg.web.db.file),
        db     = new sqlite3.Database(cfg.web.db.file);

    // create table.
    db.serialize(function() {
        if( !exists) {
            let query = `CREATE TABLE users (id INT PRIMARY KEY NOT NULL,
               fName VARCHAR(50) NOT NULL,
               lName VARCHAR(50) NOT NULL,
               email VARCHAR(100) NOT NULL
            )`;

            db.run(query);
        }
    });

    _.each(modules, function (m) {
        core[m] = require('./' + m)(cfg, db);
    });

    return core;
}

module.exports = init;
