const db = require('../util/db');

module.exports = (req, res) => {
    console.log(req.body);
    //db.saveSchool(req.body).then(data => {

        res.redirect('/schools');

    //});

};
