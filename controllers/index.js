module.exports = (req, res) => {

    res.render('index', {
        path: req.path
    });

};
