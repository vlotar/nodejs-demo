var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/userlist', function (req, res) {
    var pool = req.pool;
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": "100", "status": "Error in connection database"});
            return;
        }

        console.log('Connected as id ' + connection.threadId);

        connection.query("select * from users order by id desc", function (err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });

        connection.on('error', function (err) {
            connection.release();
            res.json({"code": "100", "status": "Error in connection database"});
            return;
        });
    });
});

/*
 * POST to adduser.
 */
router.post('/adduser', function (req, res) {
    var pool = req.pool;
    pool.getConnection(function (err, connection) {
        var query = connection.query("INSERT INTO users SET ?", req.body, function (err) {
            connection.release();
            if (err) {
                console.log(err.message);
            }
            res.send((err === null) ? {msg: ''} : {msg: err});
        });
        console.log(query.sql);
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
    var pool = req.pool;
    var userToDelete = req.params.id;
    pool.getConnection(function (err, connection) {
        var query = connection.query("DELETE from users where id = ?", userToDelete, function (err) {
            connection.release();
            if (err) {
                console.log(err.message);
            }
            res.send((err === null) ? {msg: ''} : {msg: err});
        });
        console.log(query.sql);
    });
});

module.exports = router;
