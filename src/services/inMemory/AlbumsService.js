const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._albums = [];
  }
 
  addAlbum({ title, body, tags }) {
    const id = nanoid(16);
 
    const newAlbum = {
      title, tags, body, id
    };
 
    this._albums.push(newAlbum);
 
    const isSuccess = this._albums.filter((album) => album.id === id).length > 0;
 
    if (!isSuccess) {
      throw new InvariantError('Album gagal ditambahkan');
    }
 
    return id;
  }

  getAlbums() {
    return this._albums;
  }

  getAlbumById(id) {
    const album = this._albums.filter((n) => n.id === id)[0];
    if (!album) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    return album;
  }

  editAlbumById(id, { title, body, tags }) {
    const index = this._albums.findIndex((album) => album.id === id);
 
    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
 
    const updatedAt = new Date();
 
    this._albums[index] = {
      ...this._albums[index],
      title,
      tags,
      body,
      updatedAt,
    };
  }

  deleteAlbumById(id) {
    const index = this._albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
    this._albums.splice(index, 1);
  }

}

module.exports = AlbumsService;

