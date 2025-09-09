const express = require('express');
const public_users = express.Router();
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios").default;


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "Customer with same username already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register customer."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let booksbyauthor = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["author"] === req.params.author) {
      booksbyauthor.push({"isbn":isbn,
                          "title":books[isbn]["title"],
                          "reviews":books[isbn]["reviews"]});
    }
  });
  res.send(JSON.stringify({booksbyauthor}, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let booksbytitle = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["title"] === req.params.title) {
      booksbytitle.push({"isbn":isbn,
                          "author":books[isbn]["author"],
                          "reviews":books[isbn]["reviews"]});
    }
  });
  res.send(JSON.stringify({booksbytitle}, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"])
});



// TASK 10 - Get the book list available in the shop using Promises
public_users.get('/',function (req, res) {

    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

      get_books.then(() => console.log("Promise for Task 10 resolved"));

  });

// Task 10: Get the book list available in the shop using async/await + Axios
public_users.get('/', async function (req, res) {
    try {
      const response = await axios.get('http://localhost:5000/');
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching book list", error: error.message });
    }
  });

// Task 10 (with Promises): Get the book list using Promises + Axios
public_users.get('/', function (req, res) {
    axios.get('http://localhost:5000/')
      .then(response => res.status(200).json(response.data))
      .catch(error => res.status(500).json({ message: "Error fetching book list", error: error.message }));
  });

  // Task 10: Get the book list using Promises + Axios
public_users.get('/', function (req, res) {
    const promise = new Promise((resolve, reject) => {
      axios.get('http://localhost:5000/')
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });
  
    promise
      .then(data => res.status(200).json(data))
      .catch(error => res.status(500).json({ message: "Error fetching book list", error: error.message }));
  });

// TASK 11 - Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn',function (req, res) {
    const get_books_isbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    // console.log(isbn);
        if (req.params.isbn <= 10) {
        resolve(res.send(books[isbn]));
    }
        else {
            reject(res.send('ISBN not found'));
        }
    });
    get_books_isbn.
        then(function(){
            console.log("Promise for Task 11 is resolved");
   }).
        catch(function () { 
                console.log('ISBN not found');
  });

});

// Task 11: Get book details based on ISBN using async/await + Axios
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(404).json({ message: "Book not found", error: error.message });
    }
  });

  public_users.get('/isbn-async/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(404).json({ message: "Book not found", error: error.message });
    }
  });

// Task 11 (with Promises): Get book details based on ISBN using Promises + Axios
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/isbn/${isbn}`)
      .then(response => res.status(200).json(response.data))
      .catch(error => res.status(404).json({ message: "Book not found", error: error.message }));
  });

// Get book details based on ISBN using Promise and Axios
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    const promise = new Promise((resolve, reject) => {
      axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });
  
    promise
      .then(data => res.status(200).json(data))
      .catch(error => res.status(404).json({ message: `Book with ISBN ${isbn} not found.`, error: error.message }));
  });


// TASK 12 - Get book details based on author
public_users.get('/author/:author',function (req, res) {

    const get_books_author = new Promise((resolve, reject) => {

    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
      }


    });
    reject(res.send("The mentioned author does not exist "))
        
    });

    get_books_author.then(function(){
            console.log("Promise is resolved");
   }).catch(function () { 
                console.log('The mentioned author does not exist');
  });

  });
// Task 12: Get book details based on author using async/await + Axios
public_users.get('/author/:author', async function (req, res) {
    try {
      const author = req.params.author;
      const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(404).json({ message: "Author not found", error: error.message });
    }
  });

// Task 12: Get book details based on author using Promises + Axios
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    const promise = new Promise((resolve, reject) => {
      axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });
  
    promise
      .then(data => res.status(200).json(data))
      .catch(error => res.status(404).json({ message: "Author not found", error: error.message }));
  });

// TASK 13 - // Get all books based on title
public_users.get('/books/title/:title',function (req, res) {

    const get_books_title = new Promise((resolve, reject) => {

    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        booksbytitle.push({"isbn":isbn,
                            "author":books[isbn]["author"],
                            "reviews":books[isbn]["reviews"]});
    resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
      }
    });

    reject(res.send("The mentioned title does not exist "))

       });

    get_books_title.then(function(){
            console.log("Promise is resolved");
   }).catch(function () { 
                console.log('The mentioned book title doesnt exist');
  });

  });

// Task 13: Get book details based on title using async/await + Axios
public_users.get('/title/:title', async function (req, res) {
    try {
      const title = req.params.title;
      const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(404).json({ message: "Title not found", error: error.message });
    }
  });
// Task 13: Get book details based on title using Promises + Axios
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
  
    const promise = new Promise((resolve, reject) => {
      axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });
  
    promise
      .then(data => res.status(200).json(data))
      .catch(error => res.status(404).json({ message: "Title not found", error: error.message }));
  });
module.exports.general = public_users;
