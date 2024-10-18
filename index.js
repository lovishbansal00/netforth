const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./config/sequilize');
const userRoutes = require('./routes/user.routes');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/user', userRoutes);

sequelize.sync()
  .then(() => {
    app.listen(3000, () => console.log('Server is running on port 3000'));
  })
  .catch(err => console.log('Error: ' + err));
