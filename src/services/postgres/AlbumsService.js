const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModel,mapDBToModelSongs } = require('../../utils/albums/');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }
 
  async addAlbum({ name, year }) {
    const id = `Album-${nanoid(16)}`;
 
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
 
    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(mapDBToModel);
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
 
    return result.rows.map(mapDBToModel)[0];
  }

  async getSongsByAlbumById(id) {
    const query = {
      text: 'SELECT * FROM songs where albumid = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModelSongs);
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 , updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async addAlbumCover(id,coverUrl) {

    const query = {
      text: 'UPDATE albums SET cover = $2 WHERE id = $1 RETURNING id',
      values: [id, coverUrl],
    };

    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui cover album. Id tidak ditemukan');
    }
  }  

  async addLikeAlbum(albumId, credentialId) {
    const id = `Album-${nanoid(16)}`;

    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 and album_id = $2 RETURNING id',
      values: [credentialId, albumId],
    };

    await this._cacheService.delete(`albums:${albumId}`);
    const result = await this._pool.query(query);
 
    if (result.rows.length > 0) {
      return 'berhasil berhenti menyukai album'
    }

    const queryLike = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, credentialId, albumId],
    };
    
    const resultLike = await this._pool.query(queryLike);
    
    if (!resultLike.rows[0].id) {
      throw new InvariantError('gagal menyukai album');
    }
    
    return 'berhasil menyukai album';
  }
  
  async getLikeAlbums(albumId) {
      const query = {
        text: 'select count(1) as total_likes from user_album_likes WHERE album_id = $1',
        values: [albumId],
      };
      
      const result = await this._pool.query(query);
      await this._cacheService.set(`albums:${albumId}`, JSON.stringify(result.rows[0]));
      return result.rows[0];      
  }
}

module.exports = AlbumsService;
