const express = require('express');
const app = express();

const animeRoutes = require('./routes/mal/anime');
const mangaRoutes = require('./routes/mal/manga');
const lightnovelRoutes = require('./routes/mal/lightnovel');
const dramaRoutes = require('./routes/mdl/drama');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/mal', animeRoutes);
app.use('/mal', mangaRoutes);
app.use('/mal', lightnovelRoutes);
app.use('/mdl', dramaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
