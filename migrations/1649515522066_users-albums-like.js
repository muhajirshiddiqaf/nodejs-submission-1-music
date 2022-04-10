/* eslint-disable camelcase */
exports.up = (pgm) => {
    pgm.createTable('user_album_likes', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      user_id: {
        type: 'TEXT',
        notNull: true,
      },
      album_id: {
        type: 'TEXT',
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

    pgm.addConstraint('user_album_likes', 'fk_user_album_likes.user.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('user_album_likes', 'fk_user_album_likes.album.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');    

};
  
exports.down = pgm => {
    pgm.dropTable('user_album_likes');
};

