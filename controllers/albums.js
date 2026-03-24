import Album from '../models/album.js';

export const getAllAlbums = async (req, res) => {
  try {
    const {
      sort,
      fields,
      search,
      year,
      startYear,
      endYear,
      page = 1,
      limit = 5
    } = req.query;

    const queryObject = {};

    // Numeric filtering (exact year)
    if (year) {
      queryObject.year = Number(year);
    }

    //Custom filtering (between two years)
    if (startYear && endYear) {
      queryObject.year = {
        $gte: Number(startYear),
        $lte: Number(endYear)
      };
    }

    //Regex search (artist + title)
    if (search) {
      queryObject.$or = [
        { artist: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    let query = Album.find(queryObject);

    //Sorting
    if (sort) {
      const sortList = sort.split(',').join(' ');
      query = query.sort(sortList);
    } else {
      query = query.sort({ createdAt: -1 });
    }

    //Field selection
    if (fields) {
      let fieldList = fields.split(',').map(f => f.trim()).join(' ');
      // Ensure userId is always selected
      if (!fieldList.includes('userId')) {
        fieldList = 'userId ' + fieldList;
      }
      query = query.select(fieldList);
    }

    //Pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    query = query.skip(skip).limit(limitNumber);

    const total = await Album.countDocuments(queryObject);

    const albums = await query;

    res.json({
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalAlbums: total,
      results: albums.length,
      albums
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch albums from DB' });
  }
};

export const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    res.json(album);

  } catch (error) {
    console.error(error);

    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid album ID format' });
    }

    res.status(500).json({ error: 'Failed to fetch album' });
  }
};

export const createAlbum = async (req, res) => {
  try {
    const { title, artist, year, genre, trackCount } = req.body;

    const newAlbum = new Album({
      title,
      artist,
      year,
      genre,
      trackCount,
      userId: req.user._id   
    });

    const savedAlbum = await newAlbum.save();

    res.status(201).json(savedAlbum);

  } catch (error) {
    console.error(error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to create album',
      details: error.message
    });
  }
};

export const updateAlbum = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAlbum = await Album.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedAlbum) {
      return res.status(404).json({ error: 'Album not found' });
    }

    res.json(updatedAlbum);

  } catch (error) {
    console.error(error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.message
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid album ID format' });
    }

    res.status(500).json({ error: 'Failed to update album' });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAlbum = await Album.findByIdAndDelete(id);

    if (!deletedAlbum) {
      return res.status(404).json({ error: 'Album not found' });
    }

    res.json({ message: 'Album deleted successfully' });

  } catch (error) {
    console.error(error);

    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid album ID format' });
    }

    res.status(500).json({ error: 'Failed to delete album' });
  }
};
