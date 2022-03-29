const mapDBToModel = ({ 
    id,
    title,
    year,
    genre,
    performer,
    duration,
    albumid
  }) => ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    albumId : albumid
  });

  const mapGetAllToModel = ({ 
    id,
    title,
    performer
  }) => ({
    id,
    title,
    performer
  });

  module.exports = { mapDBToModel,mapGetAllToModel };
  