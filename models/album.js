import mongoose from 'mongoose';

const currentYear = new Date().getFullYear();

const allowedGenres = [
  'rock',
  'pop',
  'hip hop',
  'jazz',
  'classical',
  'electronic',
  'metal',
  'country'
];

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Album title is required'],
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [50, 'Title cannot exceed 50 characters']
  },

  artist: {
    type: String,
    required: [true, 'Artist name is required'],
    minlength: [3, 'Artist must be at least 3 characters'],
    maxlength: [50, 'Artist cannot exceed 50 characters']
  },

  trackCount: {
    type: Number,
    min: [1, 'Track count must be at least 1'],
    max: [100, 'Track count cannot exceed 100']
  },

  year: {
    type: Number,
    required: [true, 'Release year is required'],
    min: [1900, 'Year must be after 1900'],
    validate: {
      validator: function(value) {
        return value <= new Date().getFullYear();
      },
      message: 'Release year cannot be in the future'
    }
  },

  genre: {
    type: String,
    enum: {
      values: allowedGenres,
      message: 'Genre is not valid'
    }
  },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },// ownership

  artistTitle: {
    type: String,
    validate: {
      validator: async function(value) {
        const Album = this.model('Album');

        const existingAlbum = await Album.findOne({
          artist: this.artist,
          title: this.title,
          _id: { $ne: this._id }
        });

        return !existingAlbum;
      },
      message: 'An album with this artist and title already exists'
    }
  }

}, {
  collection: 'backend-collection',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


albumSchema.virtual('albumInfo').get(function () {
  return this.title + ' by ' + this.artist + ' (' + this.year + ')';
});

albumSchema.methods.isClassic = function () {
  return currentYear - this.year >= 25;
};


albumSchema.pre('validate', function () {
  this.artistTitle = this.artist + '_' + this.title;
});


export default mongoose.model('Album', albumSchema);
