const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
 
class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }
 
  async addCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_colaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }
 
    return result.rows[0].id;
  }
 
  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: 'DELETE FROM playlist_colaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows[0]) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }
  }
 
  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM playlist_colaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }
}
 
module.exports = CollaborationsService;
