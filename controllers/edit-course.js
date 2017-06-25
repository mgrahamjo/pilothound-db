const db = require('../util/db'),
    swap = require('../util/swap');

const field = (key, value = '') => swap(key, {

    id: () => `<input type="hidden" name="id" value="${value}"/>`,

    description: () => `<div>
        <label for="description">description</label>
        <textarea name="description" id="description">${value}</textarea>
    </div>`,

    features: () => `<div>
        <label for="features">features</label>
        <textarea name="features" id="features">${value}</textarea>
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
            h1: 'New Course',
            path: '/courses',
            fields: [
                field('id'),
                field('school'),
                field('name'),
                field('price'),
                field('online'),
                field('url'),
                field('headline'),
                field('description'),
                field('features'),
                field('level')
            ]
        });

    } else {

        db.course(req.params.id).then(data => {

            data = data[0];

            res.render('edit', {
                h1: 'Edit Course',
                path: '/courses',
                fields: Object.keys(data).map(key => field(key, data[key]))
            });

        });

    }
    
};
