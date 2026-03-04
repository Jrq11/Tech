const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessonNumber: { type: Number, required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  createdAt: { type: Date, default: Date.now },
  file: {
  data: Buffer,               // actual file content
  contentType: String,        // e.g. "application/pdf"
  fileName: String            // optional: for download/display
}
});

module.exports = mongoose.model('Lesson', lessonSchema);
