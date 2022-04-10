class UploadsHandler {
  constructor(service, albumsService, validator) {
    this._service = service;
    this._albumsService = albumsService;
    this._validator = validator;
    
    this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);
  }
 
  async postUploadCoverHandler(request, h) {
      const { cover } = request.payload;
      const { id } = request.params;
      this._validator.validateImageHeaders(cover.hapi.headers);
 
      const filename = await this._service.writeFile(cover, cover.hapi);
      this._albumsService.addAlbumCover(id,`http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`)

      const response = h.response({
        status: 'success',
        message: "Sampul berhasil diunggah"
      });
      response.code(201);
      return response;
  }
}
 
module.exports = UploadsHandler;
