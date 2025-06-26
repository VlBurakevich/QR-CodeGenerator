exports.up = function (knex) {
    return knex.schema.createTable('qrcodes', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.string('title').notNullable();
        table.string('value').notNullable();
        table.jsonb('settings').notNullable();
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('qrcodes');
};
