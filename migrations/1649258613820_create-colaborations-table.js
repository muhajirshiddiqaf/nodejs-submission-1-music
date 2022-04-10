/* eslint-disable camelcase */
exports.up = (pgm) => {
    pgm.createTable('playlist_colaborations', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      playlist_id: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      user_id: {
        type: 'VARCHAR(50)',
        notNull: true,
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
    pgm.dropTable('playlist_colaborations');
};
