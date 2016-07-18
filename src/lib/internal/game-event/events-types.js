
// temporary solution. it should be related with database
// to support multilanguage and language tools.
//
const EVENTS_DEFINITION = {
    'char.say': {
        variants: {
            self: 'Mówisz: "$content"',
            others: '$source mówi: "$content"',
        },
        args: {
            content: 'text'
        }
    }
};

module.exports = {
    types: {
        CharSay: 'char.say',
    },
    definition: EVENTS_DEFINITION,
};
