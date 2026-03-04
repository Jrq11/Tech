// routes/auth.js
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate user here (e.g., check DB, bcrypt.compare)

  if (isValidUser) {
    // Create JWT (optional)
    const token = createToken(user.id); // e.g., using jwt.sign()

    res.status(200).json({
      message: 'Login successful',
      token, // optional
      user: { id: user.id, name: user.name }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setup destination
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Upload route
app.post('/api/upload', upload.single('uploadFile'), async (req, res) => {
  const {
    title,
    bookcode,
    copyright,
    edition,
    units,
    lesson,
    description,
  } = req.body;

  try {
    const newBook = new Book({
      title,
      bookcode,
      copyright,
      edition,
      units,
      lesson,
      description,
      fileId: req.file.id, // Save GridFS file ID
      fileName: req.file.filename, // Save filename too if needed
    });

    await newBook.save();

    res.status(200).json({
      message: 'File and form saved successfully!',
      data: newBook,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({
      message: 'Failed to save data to MongoDB',
      error: err.message,
    });
  }
});

