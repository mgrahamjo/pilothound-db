const escape = require('../util/escape');

let q;

let db;

function insertStates(type, states, id) {

    return states.map(state => state ? `
        INSERT INTO state_${type} (state, ${type}_id)
        VALUES ("${state}", ${id});
    ` : '').join('');
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

            return q('SELECT count(*) AS count FROM school').then(count => {

                data.id = count[0].count + 1;

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
                        "${escape(data.description)}");

                    ${insertStates('school', data.states, data.id)}

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
                description = "${escape(data.description)}"
            WHERE id = ${data.id};

            DELETE FROM state_school
            WHERE school_id = ${data.id};

            ${insertStates('school', data.states, data.id)}

        `).catch(e => console.error(e));

    },

    saveCourse: data => {

        if (data.id === 'new') {

            return q('SELECT count(*) AS count FROM course').then(count => {

                data.id = count[0].count + 1;

                return db.exec(`
                    INSERT INTO course (
                        school,
                        name,
                        price,
                        online,
                        url,
                        headline,
                        description,
                        features,
                        level)
                    VALUES (
                        "${escape(data.school)}",
                        "${escape(data.name)}",
                        "${escape(data.price)}",
                        "${escape(data.online)}",
                        "${escape(data.url)}",
                        "${escape(data.headline)}",
                        "${escape(data.description)}",
                        "${escape(data.features)}",
                        "${escape(data.level)}");

                    ${insertStates('course', data.states, data.id)}

                `).catch(e => console.error(e));

            });

        }

        return db.exec(`
            UPDATE course
            SET
                school      = "${escape(data.school)}",
                name        = "${escape(data.name)}",
                price       = "${escape(data.price)}",
                online      = "${escape(data.online)}",
                url         = "${escape(data.url)}",
                headline    = "${escape(data.headline)}",
                description = "${escape(data.description)}",
                features    = "${escape(data.features)}",
                level       = "${escape(data.level)}"
            WHERE id = ${data.id};

            DELETE FROM state_course
            WHERE course_id = ${data.id};

            ${insertStates('course', data.states, data.id)}

        `).catch(e => console.error(e));

    }

};
