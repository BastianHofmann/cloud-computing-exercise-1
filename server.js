// require express and other modules
const express = require('express');
const app = express();
// Express Body Parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Set Static File Directory
app.use(express.static(__dirname + '/public'));


/************
 * DATABASE *
 ************/

const db = require('./models');

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', (req, res) => {
  // TODO: Document all your api endpoints below as a simple hardcoded JSON object.
  res.json({
    message: 'Welcome to my app api!',
    documentationUrl: '', //leave this also blank for the first exercise
    baseUrl: '', //leave this blank for the first exercise
    endpoints: [
      {method: 'GET', path: '/api', description: 'Describes all available endpoints'},
      {method: 'GET', path: '/api/profile', description: 'Data about me'},
      {method: 'GET', path: '/api/books/', description: 'Get All books information'},
      {method: 'POST', path: '/api/books/', description: 'Create a new book'},
      {method: 'PUT', path: '/api/books/:id', description: 'Update a book'},
      {method: 'DELETE', path: '/api/books/:id', description: 'Delete a book'},
    ]
  })
});
// TODO:  Fill the values
app.get('/api/profile', (req, res) => {
  res.json({
    'name': 'John Doe',
    'homeCountry': 'Germany',
    'degreeProgram': 'informatics',//informatics or CSE.. etc
    'email': 'john.doe@example.com',
    'deployedURLLink': '',//leave this blank for the first exercise
    'apiDocumentationURL': '', //leave this also blank for the first exercise
    'currentCity': '',
    'hobbies': []

  })
});
/*
 * Get All books information
 */
app.get('/api/books/', (req, res) => {
  /*
   * use the books model and query to mongo database to get all objects
   */
  db.books.find({}, function (err, books) {
    if (err) throw err;
    /*
     * return the object as array of json values
     */
    res.json(books);
  });
});
/*
 * Add a book information into database
 */
app.post('/api/books/', (req, res) => {

  /*
   * New Book information in req.body
   */
  console.log(req.body);
  /*
   * TODO: use the books model and create a new object
   * with the information in req.body
   */
  db.books.create(req.body, function(err, book) {
    if (err) {
      res.send(err);
    }
    res.json(book);
  });
  /*
   * return the new book information object as json
   */
});

/*
 * Update a book information based upon the specified ID
 */
app.put('/api/books/:id', (req, res) => {
  /*
   * Get the book ID and new information of book from the request parameters
   */
  const bookId = req.params.id;
  const bookNewData = req.body;
  console.log(`book ID = ${bookId} \n Book Data = ${bookNewData}`);

  /*
   * TODO: use the books model and find using the bookId and update the book information
   */
  db.books.findByIdAndUpdate(bookId, bookNewData, function(err, updatedBookInfo) {
    if (err) {
      res.send(err);
    }
    res.json(updatedBookInfo);
  });
  /*
   * Send the updated book information as a JSON object
   */
});
/*
 * Delete a book based upon the specified ID
 */
app.delete('/api/books/:id', (req, res) => {
  /*
   * Get the book ID of book from the request parameters
   */
  const bookId = req.params.id;
  /*
   * TODO: use the books model and find using
   * the bookId and delete the book
   */
  /*
   * Send the deleted book information as a JSON object
   */
  db.books.findById(bookId, function(err, book) {
    if (err) {
        res.send(err);
    }

    db.books.remove({
      _id: bookId,
    }, function(err) {
      if (err) {
        res.send(err);
      }

      res.json(book);
    });
  });
});


/**********
 * SERVER *
 **********/

// listen on the port 3000
app.listen(process.env.PORT || 80, () => {
  console.log('Express server is up and running on http://localhost:80/');
});
