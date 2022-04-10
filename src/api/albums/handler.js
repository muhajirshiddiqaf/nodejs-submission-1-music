class AlbumsHandler {
  constructor(service, cacheService, validator) {
    this._service = service;
    this._cacheService = cacheService;
    this._validator = validator;
 
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
    this.getAlbumLikeHandler = this.getAlbumLikeHandler.bind(this);    
  }
 
  async postAlbumHandler(request, h) {
      this._validator.validateAlbumPayload(request.payload);
      const { name = 'untitled', year } = request.payload;
 
      const albumId = await this._service.addAlbum({ name, year });
 
      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId,
        },
      });
      response.code(201);
      
      return response;
  }
 
  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }
 
  async getAlbumByIdHandler(request, h) {
      const { id } = request.params;
      const album = await this._service.getAlbumById(id);
      const songs = await this._service.getSongsByAlbumById(id);
    
      return {
        status: 'success',
        data: {
          album : {
            "id": album.id,
            "name": album.name,
            "year": album.year,
            "coverUrl": album.cover,
            "songs" : songs  
          }
        },
      };      
  }
 
  async putAlbumByIdHandler(request, h) {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const { id } = request.params;
 
      await this._service.editAlbumById(id, { name, year });
 
      return {
        status: 'success',
        message: 'Album berhasil diperbarui',
      };
  }
 
  async deleteAlbumByIdHandler(request, h) {
      const { id } = request.params;
      await this._service.deleteAlbumById(id);
 
      return {
        status: 'success',
        message: 'Album berhasil dihapus',
      };
  }

  async postAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.getAlbumById(albumId);
    const status = await this._service.addLikeAlbum(albumId, credentialId);

    const response = h.response({
      status: 'success',
      message: status,
    });
    response.code(201);
    
    return response;
  }

  async getAlbumLikeHandler(request, h) {
    const { id } = request.params;
    try {
      const result = await this._cacheService.get(`albums:${id}`);
      const response = h.response({
        status: 'success',
        data: {
          likes: parseInt(JSON.parse(result).total_likes),
        },
      });
      response.header('X-Data-Source','cache');
      return response;
    } catch (error) {
      const likes = await this._service.getLikeAlbums(id);
      return {
        status: 'success',
        data: {
          likes: parseInt(likes.total_likes),
        },
      };    
    }
  }  
}
 
module.exports = AlbumsHandler;