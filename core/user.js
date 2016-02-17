'use strict';

module.exports = function (cfg, db) {
    let Promise = require('bluebird'),
        _       = require('lodash');

    class User {
        constructor() {
            this.id    = null;
            this.fName = null;
            this.lName = null;
            this.email = null;
        }
    }

    class Repo {
        static save(user) {
            return new Promise((resolve, reject) => {
                db.run('INSERT INTO users (id, fName, lName, email) VALUES ($id, $fName, $lName, $email)', {
                    $id   : user.id,
                    $fName: user.fName,
                    $lName: user.lName,
                    $email: user.email
                }, (err) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(true);
                });
            });
        }

        static getAll() {
            return new Promise((resolve, reject) => {
                db.all('SELECT id, fname, lName, email FROM users', [], (err, rows) => {
                    if (err) {
                        return reject(err);
                    }

                    if (! rows.length) {
                        return resolve([]);
                    }

                    resolve(
                        _.map(rows, (row) => {
                            return _.create(new User(), row);
                        })
                    );
                });
            });
        }
    }

    return {
        'User' : User,
        'Repo' : Repo
    };
};
