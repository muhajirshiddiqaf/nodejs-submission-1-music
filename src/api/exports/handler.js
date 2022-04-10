class ExportsHandler {
  constructor(ProducerService, playlistsService, validator) {
    this._producerService = ProducerService;
    this._playlistsService = playlistsService;
    this._validator = validator;
 
    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
  }
 
  async postExportPlaylistsHandler(request, h) {
      this._validator.validateExportPlaylistsPayload(request.payload);
      const { playlistId } = request.params;
      const credentialId = request.auth.credentials.id;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      const message = {
        userId: credentialId,
        playlistId: playlistId,      
        targetEmail: request.payload.targetEmail,
      };

      await this._producerService.sendMessage('export:playlists', JSON.stringify(message));
 
      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
      });
      response.code(201);
      return response;
  }
}
 
module.exports = ExportsHandler;
