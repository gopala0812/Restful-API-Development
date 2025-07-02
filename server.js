const express = require('express');
const app = express();
const bookRoutes = require('./routes/books');

app.use(express.json());

// Use the book routes
app.use('/books', bookRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
