const db = require('../util/db');

module.exports = (req, res) => {
    console.log(req.body);
    //db.saveCourse(req.body).then(data => {

        res.redirect('/courses');

    //});

};
