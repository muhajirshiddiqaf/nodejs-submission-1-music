const ClientError = require('../../exceptions/ClientError');
 
class PlaylistsHandler {
  constructor(service, validator,auth) {
    this._service = service;
    this._validator = validator;
 
    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistDetailByIdHandler = this.getPlaylistDetailByIdHandler.bind(this);
    this.deleteSongPlaylistByIdHandler = this.deleteSongPlaylistByIdHandler.bind(this);
    this.getPlaylistsActivities = this.getPlaylistsActivities.bind(this);
  }
 
  async postPlaylistHandler(request, h) {
      this._validator.validatePlaylistPayload(request.payload);
      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      const playlistId = await this._service.addPlaylist({ name, credentialId });
 
      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
        },
      });
      response.code(201);
      
      return response;
  }
 
  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    
    const playlists = await this._service.getPlaylists({ credentialId });
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id,credentialId);
    await this._service.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    const { id: idPlaylist } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(idPlaylist,credentialId);
    await this._service.verifySongs(songId);
    const playlistId = await this._service.addPlaylistSongs({ idPlaylist, songId });
    await this._service.addPlaylistActivities(idPlaylist,songId,credentialId,"add")

    const response = h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan pada Playlist',
      data: {
        playlistId,
      },
    });
    response.code(201);
    
    return response;
  }

  async getPlaylistDetailByIdHandler(request, h) {
    const { id: idPlaylist } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistAccess(idPlaylist,credentialId);
    
    const playlist = await this._service.getPlaylistById(credentialId,idPlaylist);
    const songs = await this._service.getSongsByPlaylistById(idPlaylist);
    
    return {
      status: 'success',
      data: {
        playlist : {
          "id": playlist.id,
          "name": playlist.name,
          "username": playlist.username,
          "songs" : songs  
        }
      },
    };      
  }

  async deleteSongPlaylistByIdHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(id,credentialId);
    await this._service.deleteSongPlaylistById(songId,id);
    await this._service.addPlaylistActivities(id,songId,credentialId,"delete")
    
    return {
      status: 'success',
      message: 'Song berhasil dihapus dari playlist',
    };
  }

  async getPlaylistsActivities(request, h) {
    const { id: idPlaylist } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistAccess(idPlaylist,credentialId);
    
    const activities = await this._service.getPlaylistsActivities(idPlaylist);
    
    return {
      status: 'success',
      data: {
        playlistId:idPlaylist,
        activities : activities
      },
    };      
  }  
}
 
module.exports = PlaylistsHandler;