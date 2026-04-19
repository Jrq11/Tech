const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessonNumber: { type: Number, required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  createdAt: { type: Date, default: Date.now },
  file: {
  data: Buffer,               
  contentType: String,       
  fileName: String            
}
});

module.exports = mongoose.model('Lesson', lessonSchema);
