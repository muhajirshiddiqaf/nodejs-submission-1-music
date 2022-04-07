const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModel,mapDBToModelSongs } = require('../../utils/playlists');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }
 
  async addPlaylist({ name, credentialId }) {
    const id = `Playlist-${nanoid(16)}`;
    const idColaboration = `Colaboration-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, credentialId, createdAt, updatedAt],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }else{
      const query_colaborations = {
        text: 'INSERT INTO playlist_colaborations VALUES($1, $2, $3, $4, $5) RETURNING id',
        values: [idColaboration, id, credentialId, createdAt, updatedAt],
      };
   
      await this._pool.query(query_colaborations);  
    }
 
    return result.rows[0].id;
  }

  async getPlaylists({ credentialId }) {
    const query = {
      text: `SELECT a.id,a.name,c.username 
      FROM playlists a JOIN playlist_colaborations b on a.owner = b.user_id
      JOIN users c on b.user_id = c.id AND a.id = b.playlist_id
      WHERE c.id = $1
      `,
      values: [credentialId],
    };

    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModel);
  }

  async addPlaylistSongs({ idPlaylist, songId }) {
    const id = `PlaylistSong-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, idPlaylist, songId, createdAt, updatedAt],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows[0].id) {
      throw new InvariantError('Song gagal ditambahkan ke Playlist');
    }
 
    return result.rows[0].id;
  }

  async getPlaylistById(credentialId,id) {
    const query = {
      text: `SELECT a.id,a.name,c.username 
      FROM playlists a JOIN playlist_colaborations b on a.owner = b.user_id
      JOIN users c on b.user_id = c.id AND a.id = b.playlist_id
      WHERE c.id = $1 and a.id = $2
      `,
      values: [credentialId,id],
    };

    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
 
    return result.rows.map(mapDBToModel)[0];
  }

  async getSongsByPlaylistById(id) {
    const query = {
      text: 'select a.id,a.title,a.performer from songs a join playlist_songs b on a.id = b.song_id where b.playlist_id =  $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModelSongs);
  }

  async editPlaylistById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE playlists SET name = $1, year = $2 , updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui playlist. Id tidak ditemukan');
    }
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async deleteSongPlaylistById(songId,playlistId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 and song_id = $2 RETURNING id',
      values: [playlistId,songId],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Resource yang Anda minta tidak ditemukan');
    }
 
    const note = result.rows[0];
 
    if (note.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifySongs(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
 
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }
  }

}

module.exports = PlaylistsService;
