const escape = require('../util/escape');

let q;

let db;

function insertStateSchool(states, id) {

    return states.map(state => `
        INSERT INTO state_school (state, school_id)
        VALUES ("${state}", ${id});
    `).join('');
}

module.exports = {

    init: _db => {

        db = _db;

        q = query => db.all(query).catch(e => console.error(e));

    },

    schools: () => q(`
        SELECT * FROM school;
    `),

    courses: () => q(`
        SELECT * FROM course;
    `),

    school: id => new Promise(resolve => q(`
        SELECT * FROM school
        WHERE id = ${id};
    `).then(data => {

        q(`
            SELECT state FROM state_school
            WHERE school_id = ${id};
        `).then(stateRows => {

            data[0].states = stateRows.map(row => row.state);

            resolve(data[0]);

        });

    })),

    course: id => new Promise(resolve => q(`
        SELECT * FROM course
        WHERE id = ${id};
    `).then(data => {

        q(`
            SELECT state FROM state_course
            WHERE course_id = ${id};
        `).then(stateRows => {

            data[0].states = stateRows.map(row => row.state);

            resolve(data[0]);

        });

    })),

    saveSchool: data => {

        if (data.id === 'new') {

            return q('SELECT count(*) FROM school').then(count => {

                data.id = count + 1;

                return db.exec(`
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
                        "${escape(data.description)}");

                    ${insertStateSchool(data.states, data.id)}

                `).catch(e => console.error(e));

            });

        }

        return db.exec(`
            UPDATE school
            SET
                name        = "${escape(data.name)}",
                url         = "${escape(data.url)}",
                email       = "${escape(data.email)}",
                phone       = "${escape(data.phone)}",
                online      = "${escape(data.online)}",
                address     = "${escape(data.address)}",
                logo        = "${escape(data.logo)}",
                color       = "${escape(data.color)}",
                partner     = "${escape(data.partner)}",
                description = "${escape(data.description)}"
            WHERE id = ${data.id};

            DELETE FROM state_school
            WHERE school_id = ${data.id};

            ${insertStateSchool(data.states, data.id)}

        `).catch(e => console.error(e));

    }

};
