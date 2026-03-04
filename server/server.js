const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Book = require('./models/Book');
const Lesson = require('./models/Lesson');
const jwt = require('jsonwebtoken');
const multer = require('multer');


const storage = multer.memoryStorage(); // 📌 memory, not disk
const upload = multer({ storage: multer.memoryStorage() });


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");

  app.listen(8000, () => {
    console.log(`Server running on port 8000`);
  });
}).catch((err) => console.error("MongoDB connection error:", err));

/* ---------- ROUTES ---------- */

// ✅ Test route
app.get('/api/message', (req, res) => {
  res.json({ message: "Hello from server!" });
});

// ✅ Register API
app.post('/api/register', async (req, res) => {
  try {
    const { name, last, email, password, role } = req.body;

    if (!name || !last || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const newUser = new User({ name, last, email, password, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Login API
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/*const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // contains { id, email }
    next();
  });
};*/

app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books", error: err.message });
  }
});


// GET /api/lessons
app.get('/api/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find().populate('book'); // 👈 this adds the book data
    res.json(lessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});


// ✅ Get lessons for a book
// GET /api/books/:bookId/lessons
app.get('/api/books/:bookId/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find({ book: req.params.bookId })
      .populate('book'); // 👈 Include book details

    res.json(lessons);
  } catch (err) {
    console.error('Error fetching lessons:', err);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});





// ✅ Create Book (no file upload)
app.post('/api/books', async (req, res) => {
  try {
    // No need to attach user anymore
    const bookData = { ...req.body };

    const book = await Book.create(bookData);
    const lessonCount = parseInt(book.lesson);

    if (!isNaN(lessonCount) && lessonCount > 0) {
      const lessons = [];

      for (let i = 1; i <= lessonCount; i++) {
        lessons.push({
          title: `Lesson ${i}`,
          lessonNumber: i,
          book: book._id,
        });
      }

      await Lesson.insertMany(lessons);
      console.log("✅ Lessons created successfully");
    }

    res.status(201).json(book);
  } catch (err) {
    console.error('❌ Error creating book and lessons:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// PUT /api/lessons/:lessonId/upload
app.put('/api/lessons/:lessonId/upload', upload.single('file'), async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    lesson.file = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
      fileName: req.file.originalname,
    };

    await lesson.save();

    res.json({ message: 'File uploaded to database successfully' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Failed to upload file', error: err.message });
  }
});

app.get('/api/lessons/:lessonId/file', async (req, res) => {
  const lesson = await Lesson.findById(req.params.lessonId);
  res.set('Content-Type', lesson.file.contentType);
  res.send(lesson.file.data);
});





