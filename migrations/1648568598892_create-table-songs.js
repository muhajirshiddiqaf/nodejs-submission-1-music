/* eslint-disable camelcase */
exports.up = (pgm) => {
    pgm.createTable('songs', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      title: {
        type: 'TEXT',
        notNull: true,
      },
      year: {
        type: 'integer',
        notNull: true,
      },
      genre: {
        type: 'TEXT',
        notNull: true,
      },
      performer: {
        type: 'TEXT',
        notNull: true,
      },
      duration: {
        type: 'integer',
        notNull: false,
      },
      albumid: {
        type: 'TEXT',
        notNull: false,
      },
      created_at: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func('current_timestamp'),
      },
      updated_at: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func('current_timestamp'),
      },
    });
  };
  
exports.down = pgm => {
    pgm.dropTable('songs');
};
