/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('playlist_song_activities', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      playlist_id: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      song_id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      user_id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      action: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      time: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
    });

    pgm.addConstraint('playlist_song_activities', 'fk_playlist_songs_activities.playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
};
  
exports.down = pgm => {
    pgm.dropTable('playlist_song_activities');
};