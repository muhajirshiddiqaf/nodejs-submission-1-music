const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModel,mapGetAllToModel } = require('../../utils/songs');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }
 
  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
 
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows[0].id) {
      throw new InvariantError('Music gagal ditambahkan');
    }
 
    return result.rows[0].id;
  }

  async getSongs(title, performer) {
    
    title = '%'+title+'%';
    performer = '%'+performer+'%';

    const query = {
      text: 'SELECT * FROM songs WHERE LOWER(title) like LOWER($1) and LOWER(performer) like LOWER($2)',
      values: [title,performer],
    };

    const result = await this._pool.query(query);
    return result.rows.map(mapGetAllToModel);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Music tidak ditemukan');
    }
 
    return result.rows.map(mapDBToModel)[0];
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const updatedAt = new Date();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, albumId = $6 , updated_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui music. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Music gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
