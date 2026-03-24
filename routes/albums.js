import express from 'express';
import { 
  getAllAlbums, 
  getAlbumById, 
  createAlbum, 
  updateAlbum, 
  deleteAlbum 
} from '../controllers/albums.js';
import { isAuthenticated, isOwnerOrAdmin } from '../middleware/auth.js';
import Album from '../models/album.js';

const router = express.Router();

router.get('/', getAllAlbums);
router.get('/:id', getAlbumById);
router.post('/', isAuthenticated, createAlbum);
router.put('/:id', isAuthenticated, isOwnerOrAdmin(async (req) => {
  const album = await Album.findById(req.params.id);
  return album.userId;
}), updateAlbum);
router.delete('/:id', isAuthenticated, isOwnerOrAdmin(async (req) => {
  const album = await Album.findById(req.params.id);
  return album.userId;
}), deleteAlbum);

export default router;