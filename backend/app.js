const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')

const auth = require('./routes/auth');
const media = require('./routes/media');
const reports = require('./routes/report');
const disaster = require('./routes/disaster');
const area = require('./routes/area');
const tool = require('./routes/tool');
const quiz = require('./routes/quiz');
const igRoutes = require('./routes/ig');

app.use(cors())
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit: "50mb", extended: true }));
app.use(cookieParser());

app.use('/api/v1', auth);
app.use('/api/v1', media);
app.use('/api/v1', reports);
app.use('/api/v1', disaster);
app.use('/api/v1', area);
app.use('/api/v1', tool);
app.use('/api/v1', quiz);
app.use('/api/v1', igRoutes);

module.exports = app