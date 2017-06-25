const express = require('express'),
    app = express(),
    manila = require('manila')(),
    sqlite = require('sqlite'),
    index = require('./controllers/index'),
    bodyParser = require('body-parser'),
    db = require('./util/db');

sqlite.open('./pilothound.db').then(() => {

    db.init(sqlite);

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(express.static('static'));

    app.engine('mnla', manila);

    app.set('view engine', 'mnla');

    app.set('views', './views');

    app.get('/', require('./controllers/index'));

    app.get('/schools', require('./controllers/schools'));

    app.get('/schools/:id?', require('./controllers/edit-school'));

    app.get('/courses', require('./controllers/courses'));

    app.get('/courses/:id?', require('./controllers/edit-course'));

    app.post('/schools', require('./controllers/post-school'));

    app.post('/courses', require('./controllers/post-course'));

    app.listen(8001);

    console.log('listening on 8001');

});
