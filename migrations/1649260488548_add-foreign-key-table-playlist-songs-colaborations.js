/* eslint-disable camelcase */
exports.up = pgm => {
    pgm.addConstraint('songs', 'fk_songs.albums.id', 'FOREIGN KEY(albumid) REFERENCES albums(id) ON DELETE CASCADE');
    pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('playlist_songs', 'fk_playlist_songs.songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
    pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
    pgm.addConstraint('playlist_colaborations', 'fk_playlist_colaborations.user.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('playlist_colaborations', 'fk_playlist_colaborations.playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');    
};

exports.down = pgm => {
    pgm.dropConstraint('songs', 'fk_songs.albums.id', 'FOREIGN KEY(albumid) REFERENCES albums(id) ON DELETE CASCADE');
    pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
    pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
    pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
    pgm.dropConstraint('playlist_colaborations', 'fk_playlist_colaborations.user.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
    pgm.dropConstraint('playlist_colaborations', 'fk_playlist_colaborations.playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');    
};
