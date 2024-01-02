const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;
const PORT2 = 8081;

//DATABASE

const ctflag1 = "WITCHERFLAG001";
//const ctflag2 = "WITCHERFLAG002";
const ctflag3 = "WITCHERFLAG003";
const ctflag4 = "WITCHERFLAG004";
const ctflag5 = "WITCHERFLAG005";
const ctflag6 = "WITCHERFLAG006";
const ctflag7 = "WITCHERFLAG007";
const ctflag8 = "WITCHERFLAG008";
const ctflag9 = "WITCHERFLAG009";
const ctflag10 = "WITCHERFLAG010";
const ctflag10_encoded = Buffer.from(ctflag10).toString('base64');

const users = [
  { userID: 'u001', username: 'maki', password: 'password1', firstname: "Maki", lastname: "Dee", phone: 94390842, birthday: "12/05/1993", email: 'Makidee@yahoo.com', secret: 'None', apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1MDAxIiwibmFtZSI6Ik1pa2UiLCJyb2xlIjoiV0lUQ0hFUkZMQUcwMDJPTEQifQ._ureZEi4_uFHkDFUXONMHNSpEvgENye06yNHxyD4rWA' },
  { userID: 'u002', username: 'davies', password: 'password2', firstname: "Davies", lastname: "Lee", phone: 83239651, birthday: "16/12/1987", email: 'Davieslee@gmail.com', secret: ctflag3,  apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1MDAyIiwibmFtZSI6IkRhdiIsInJvbGUiOiJ1c2VyIn0.k-2jema74MuvZ1i8nbd3sJY00GRt_BaAg1MQpol2_IU' },
];

const accountID = users.map(user => {
  return {
    userID: user.userID,
    firstname: user.firstname
  };
});

const products = [
  { id: 1, name: 'Elvis Live Ticket', price: 350.00, details: 'Live at Singapore Stadium!', date: 'March 1, 2024', image: 'https://i.etsystatic.com/10019178/r/il/93c0ad/5220800113/il_1588xN.5220800113_d8rs.jpg' },
  { id: 2, name: 'Taylor Swift', price: 400.00, details: 'Live at Tokyo Stadium!', date: 'March 2, 2024', image: 'https://m.media-amazon.com/images/M/MV5BMmJlYWZmMzYtN2Y3OS00OTNkLTg2MzgtNjNkMTUyMzg0MTI3XkEyXkFqcGdeQXVyMzExODEzNDA@._V1_.jpg' },
];

const betaproducts = [{ id: 1, name: 'Beta Product 1', price: 25.00, details: 'This is a beta product!' }];

//dummy
const accounts = {
  "u001": "Maki",
  "u002": "Davies",
  "u003": "Darryl",
  "u004": "Frankie",
  "u005": "Jok",
  "u006": "Wendell",
  "u007": "KY",
};


const cart = [];

// Passport configuration...
// ...
app.use(cors());
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
//app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Custom error handling middleware for parsing errors
app.use((err, req, res, next) => {

  const requestedFile = req.url;
  
  // Check if the requested file has a .html extension
  if (requestedFile.endsWith('.html')) {
    return res.status(403).send('Access to HTML files is not allowed');
  }
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // Handle JSON parsing error
    return res.status(400).json({ error: 'Invalid JSON format' });
  }

  // Pass the error to the next middleware
  next(err);

  
});


const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

passport.use(new LocalStrategy((username, password, done) => {
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    return done(null, user);
  } else {
    return done(null, false, { message: 'Incorrect username or password' });
  }
}));

passport.serializeUser((user, done) => done(null, user.userID));
passport.deserializeUser((id, done) => {
  const user = users.find(u => u.userID === id);
  done(null, user);
});

app.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  const isValidCredentials = checkCredentialsStuffing(username, password);

  if (isValidCredentials) {
    return res.json({ challenge: ctflag10_encoded });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.json({ success: false, message: 'Incorrect username or password' });

    req.logIn(user, (err) => {
      if (err) return next(err);
      req.session.userID = user.userID;
      req.session.apikey = user.apikey;

      return res.json({ success: true, userID: user.userID, apikey: user.apikey });
    });
  })(req, res, next);
});

function checkCredentialsStuffing(username, password) {
  const Username = 'admin';
  const Password = 'P@ssw0rd123';
  return username === Username && password === Password;
}

app.get('/admin/v1', (req, res) => {
  res.send(ctflag1);
});

app.get('/admin/hidden/v3',  (req, res) => {
  // Check if the 'apikey' header is present and has the correct value
  const apiKeyHeader = req.headers['apikey'];
  const adminroleApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1MDAyIiwibmFtZSI6IkRhdiIsInJvbGUiOiJhZG1pbiJ9.pIzs4EFu3LEBKfbE4wE6e0ysCeTh-nRUcpZNZ3caaY0";

  if (apiKeyHeader === adminroleApiKey) {
    // If the header is valid, set the flag5 variable
    //const flag5 = "Your desired value for flag5";
    res.json({ flag: ctflag4 });
  } else {
    // If the header is not valid, return an error response
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Error destroying session:', err);
    res.redirect('/login');
  });
});

app.get('/main', isAuthenticated, (req, res) => {
  fs.readFile(path.join(__dirname, 'main.html'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading main.html:', err);
      return res.status(500).send('Internal Server Error');
    }

    const userID = req.session.userID;
    const apiKey = req.session.apikey;

    const modifiedContent = data.replace('{{userID}}', userID).replace('{{apikey}}', apiKey);

    res.send(modifiedContent);
  });
});

app.get('/main.html', isAuthenticated, (req, res) => {

});

app.get('/accounts/list', (req, res) => {
  res.json(accountID);
});

app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/', (req, res) => res.redirect('/login'));

app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'signup.html')));

const checkApiKey = (req, res, next) => {
  const apikey = req.headers.apikey;

  if (apikey) {
    const userWithApikey = users.find(user => user.apikey === apikey);

    if (userWithApikey) {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized access' });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized access' });
  }
};

const checkApiKeyNoValidation = (req, res, next) => {
  const apikey = req.headers.apikey;

  if (apikey) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized access' });
  }
};

app.get('/cart.html', (req, res) => res.sendFile(path.join(__dirname, 'cart.html')));

app.get('/api/user/profile/:userID', checkApiKey, (req, res) => {
  const userId = req.params.userID;
  const userWithoutPassword = users.find(u => u.userID === userId);

  if (userWithoutPassword) {
    const userProfile = { userID: userWithoutPassword.userID, username: userWithoutPassword.username, firstname: userWithoutPassword.firstname, lastname: userWithoutPassword.lastname, phone: userWithoutPassword.phone, birthday: userWithoutPassword.birthday, email: userWithoutPassword.email, secret: userWithoutPassword.secret  };
    res.json(userProfile);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/import', async (req, res) => {
  try {
    const { photoUrl } = req.body;
    const url = new URL(photoUrl);
    const urlPort = parseInt(url.port, 10);
    const response = await fetch(photoUrl, { method: 'HEAD' });
    const statusCode = response.status;

    if (statusCode == 200 && urlPort !== PORT) {
      res.json({ photoUrl, statusCode, flag: `${ctflag7}` });
    } else {
      res.json({ photoUrl, statusCode });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/products', checkApiKeyNoValidation, (req, res) => res.json(products));

app.get('/api/beta/products', (req, res) => res.json(betaproducts));

app.put('/api/beta/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const { name, price, details } = req.body;
  const betaProduct = betaproducts.find(product => product.id === productId);

  if (!betaProduct) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  betaProduct.name = name || betaProduct.name;
  betaProduct.price = price || betaProduct.price;
  betaProduct.details = details || betaProduct.details;

  res.json({ success: true, product: betaProduct, flag: `${ctflag8}` });
});




// Handle sign-up request
app.post('/signup', (req, res) => {

  try {
  
    const { username, password, confirmPassword, email } = req.body;
  
    // Basic validation
    if (!username || !password || !confirmPassword || !email) {
      //return res.status(400).json({ error: 'All fields are required' });
    throw new Error('Required fields has not been populated');
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords does not match' });
      //throw new Error('Passwords does not match'); 
    }
    // Save user data (you might want to use a database for this)
    const newUser = { username, password, email };
    //users.push(newUser);
  
    return res.json({ message: 'User signed up successfully', user: newUser });
  } catch (error) {
      // In a vulnerable scenario, the error message may contain sensitive information
      res.status(500).json({ flag: ctflag6, stackTrace: error.stack });
    }
  
  });



// Function to fetch conversion rate from the external API
async function fetchConversionRate(currencyCode) {
  const conversionRateApiUrl = `http://currency-api:3001/api/convert/${currencyCode}`;
  const response = await fetch(conversionRateApiUrl);

  if (!response.ok) {
    throw new Error(`Error fetching conversion rate. Network response was not ok. Status: ${response.status}`);
  }

  const data = await response.json();
  return data.rate;
}

// Function to calculate the converted price
function calculateConvertedPrice(product, conversionRate) {
  return product.price * conversionRate;
}

// Function to handle buy logic
function handleBuyLogic(res, itemName, convertedPrice, quantity) {
  if (quantity > 0 && quantity <= 4) {
    const itemPrice = convertedPrice;

    if (itemPrice === undefined || itemPrice === 0) {
      res.json({ success: true, flag: `${ctflag9}` });
    } else {
      cart.push({ itemName, itemPrice, quantity });
      res.json({ success: true, convertedPrice });
    }
  } else if (quantity > 4) {
    res.json({ success: true, flag: `${ctflag5}`, convertedPrice });
  } else {
    res.json({ success: false, error: 'Invalid quantity or item not found', convertedPrice });
  }
}

// Function to handle /buy endpoint
app.post('/buy', async (req, res) => {
  try {
    const { itemName, quantity, currencyCode } = req.body;

    // Find the product by name
    const product = products.find(p => p.name === itemName);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Fetch conversion rate from the external API
    const conversionRate = await fetchConversionRate(currencyCode);

    // Calculate the converted price
    const convertedPrice = calculateConvertedPrice(product, conversionRate);

    console.log(`Product: ${itemName}, Original Price: ${product.price} USD, Conversion Rate: ${conversionRate}, Converted Price: ${convertedPrice} ${currencyCode}`);

    // Handle buy logic
    handleBuyLogic(res, itemName, convertedPrice, quantity);
  } catch (error) {
    console.error('Error in /buy:', error);
    res.status(503).json({ error: 'Internal server error' });
  }
});

// Function to handle /get-converted-price endpoint
app.post('/convertcurrency', async (req, res) => {
  try {
    const { productName, currencyCode } = req.body;

    // Find the product by name
    const product = products.find(p => p.name === productName);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Fetch conversion rate from the external API
    const conversionRate = await fetchConversionRate(currencyCode);

    // Calculate the converted price
    const convertedPrice = calculateConvertedPrice(product, conversionRate);

    console.log(`Product: ${productName}, Original Price: ${product.price} USD, Conversion Rate: ${conversionRate}, Converted Price: ${convertedPrice} ${currencyCode}`);

    // Return the product details and converted price to the frontend
    res.json({ product, convertedPrice });
  } catch (error) {
    console.error('Error in /convertcurrency:', error);
    res.status(503).json({ error: 'Internal server error' });
  }
});


app.use(express.static(__dirname));

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

app.listen(PORT2, () => console.log(`Server is running on http://localhost:${PORT2}`));
