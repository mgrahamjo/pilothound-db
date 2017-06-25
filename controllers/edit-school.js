const db = require('../util/db'),
    swap = require('../util/swap');

const field = (key, value = '') => swap(key, {

    id: () => `<input type="hidden" name="id" value="${value}"/>`,

    description: () => `<div>
        <label for="description">description</label>
        <textarea name="description" id="description">${value}</textarea>
    </div>`,

    online: () => `<div>
        <label for="online">online</label>
        <input type="checkbox" name="online" id="online" ${value ? 'checked' : ''}/>
    </div>`,

    default: () => `<div>
        <label for="${key}">${key}</label>
        <input type="text" name="${key}" id="${key}" value="${value}"/>
    </div>`

});

module.exports = (req, res) => {

    if (req.params.id === 'new') {

        res.render('edit', {
            h1: 'New School',
            path: '/schools',
            fields: [
                field('id'),
                field('name'),
                field('url'),
                field('email'),
                field('phone'),
                field('online'),
                field('address'),
                field('logo'),
                field('color'),
                field('partner'),
                field('description')
            ]
        });

    } else {
        
        db.school(req.params.id).then(data => {

            data = data[0];

            res.render('edit', {
                h1: 'Edit School',
                path: '/schools',
                fields: Object.keys(data).map(key => field(key, data[key]))
            });

        });

    }

};
