const Tables = [
    {
        name: 'player',
        columns: {
            id: 'id',
            email: {
                type: 'varchar(100)',
                notNull: true,
            },
            password: {
                type: 'character(60)',
                notNull: true,
            },
            permissions: {
                type: 'bigint',
                notNull: true,
                default: 1,
            }
        },
        options: {}
    },
    {
        name: 'location',
        columns: {
            id: 'id',
            spec: {
                type: 'varchar(120)',
                notNull: true,
            },
        },
        options: {}
    },
    {
        name: 'character',
        columns: {
            id: 'id',
            name: {
                type: 'varchar(120)',
                notNull: true,
            },
            fk_player: {
                type: 'serial',
                references: 'player',
            },
            fk_location: {
                type: 'serial',
                references: 'location',
            }
        },
        options: {}
    }
];

exports.up = function(pgm) {
    Tables.forEach(
        (tbl) => pgm.createTable(tbl.name, tbl.columns, tbl.options)
    )
};

exports.down = function(pgm) {
    Tables.reverse().forEach(
        (tbl) => pgm.dropTable(tbl.name)
    );
};
