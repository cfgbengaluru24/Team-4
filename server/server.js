const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const morgan = require('morgan');

require('dotenv').config();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
const auth = require('./routes/auth');
app.use('/api/auth', auth);
const user = require('./routes/user');
app.use('/api/user', user);
const feed = require('./routes/feed');
app.use('/api/feed', feed);
const query = require('./routes/query');
app.use('/api/query', query);
const notification = require('./routes/notification');
app.use('/api/notification', notification);
const trainee = require('./routes/trainee');
app.use('/api/trainee', trainee);

const book_tickets = require('./routes/book-tickets')
app.use('/api/book-tickets',book_tickets)

const feedback = require('./routes/feedback');
app.use('/api/feedback', feedback);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
