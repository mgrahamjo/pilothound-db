const escape = require('../util/escape');

let sql;

let db;

module.exports = {

    init: _db => {

        db = _db;

        sql = query => db.all(query).catch(e => console.error(e));

    },

    schools: () => sql(`
        SELECT * FROM school;
    `),

    courses: () => sql(`
        SELECT * FROM course;
    `),

    school: id => sql(`
        SELECT * FROM school
        WHERE id = ${id};
    `),

    course: id => sql(`
        SELECT * FROM course
        WHERE id = ${id};
    `),

    saveSchool: data => {

        if (data.id === 'new') {

            return db.run(`
                INSERT INTO school (
                    name,
                    url,
                    email,
                    phone,
                    online,
                    address,
                    logo,
                    color,
                    partner,
                    description)
                VALUES (
                    "${escape(data.name)}",
                    "${escape(data.url)}",
                    "${escape(data.email)}",
                    "${escape(data.phone)}",
                    "${escape(data.online)}",
                    "${escape(data.address)}",
                    "${escape(data.logo)}",
                    "${escape(data.color)}",
                    "${escape(data.partner)}",
                    "${escape(data.description)}"
                );`).catch(e => console.error(e));

        } else {



        }

};
