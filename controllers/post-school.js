const db = require('../util/db');

module.exports = (req, res) => {

    db.saveSchool(req.body).then(() => res.redirect('/schools'));

};
