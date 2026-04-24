import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  summary: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Stock Market', 'Crypto', 'Economy', 'Opinion', 'Global News']
  },
  sourceLink: {
    type: String
  },
  imageUrl: {
    type: String
  },
  isTrending: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const News = mongoose.model('News', newsSchema);
export default News;
