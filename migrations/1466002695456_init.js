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
    pgm.sql(`
        CREATE OR REPLACE FUNCTION information_schema._pg_keypositions() RETURNS SETOF integer
        LANGUAGE sql
        IMMUTABLE
        AS $pg_keypositions$
        select g.s
        from generate_series(1,current_setting('max_index_keys')::int, 1)
        as g(s)
        $pg_keypositions$;
    `);
    Tables.forEach(
        (tbl) => pgm.createTable(tbl.name, tbl.columns, tbl.options)
    )
};

exports.down = function(pgm) {
    Tables.reverse().forEach(
        (tbl) => pgm.dropTable(tbl.name)
    );
    pgm.sql(`
        DROP FUNCTION IF EXISTS information_schema._pg_keypositions()
    `);
};
