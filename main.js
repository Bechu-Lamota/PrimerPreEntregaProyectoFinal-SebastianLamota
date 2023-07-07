const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8080;

// Middleware para el manejo del body en formato JSON
app.use(express.json());

// Rutas para el manejo de productos
const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
  const { limit } = req.query;
  let products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));

  if (limit) {
    products = products.slice(0, limit);
  }

  res.json(products);
});

productsRouter.get('/:pid', (req, res) => {
  const { pid } = req.params;
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  const product = products.find((product) => product.id === pid);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

productsRouter.post('/', (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newProduct = {
    id: uuidv4(),
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails,
  };

  let products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  products.push(newProduct);
  fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));

  res.json(newProduct);
});

productsRouter.put('/:pid', (req, res) => {
  const { pid } = req.params;
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  let products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  const productIndex = products.findIndex((product) => product.id === pid);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products[productIndex] = {
    ...products[productIndex],
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
  };

  fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));

  res.json(products[productIndex]);
});

productsRouter.delete('/:pid', (req, res) => {
  const { pid } = req.params;

  let products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  const productIndex = products.findIndex((product) => product.id === pid);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deletedProduct = products.splice(productIndex, 1)[0];

  fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));

  res.json(deletedProduct);
});

app.use('/api/products', productsRouter);

// Rutas para el manejo de carritos
const cartsRouter = express.Router();

cartsRouter.post('/', (req, res) => {
  const newCart = {
    id: uuidv4(),
    products: [],
  };

  let carts = JSON.parse(fs.readFileSync('carrito.json', 'utf-8'));
  carts.push(newCart);
  fs.writeFileSync('carrito.json', JSON.stringify(carts, null, 2));

  res.json(newCart);
});

cartsRouter.get('/:cid', (req, res) => {
  const { cid } = req.params;

  let carts = JSON.parse(fs.readFileSync('carrito.json', 'utf-8'));
  const cart = carts.find((cart) => cart.id === cid);

  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  res.json(cart.products);
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  let carts = JSON.parse(fs.readFileSync('carrito.json', 'utf-8'));
  const cartIndex = carts.findIndex((cart) => cart.id === cid);

  if (cartIndex === -1) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const cart = carts[cartIndex];
  const productIndex = cart.products.findIndex((product) => product.id === pid);

  if (productIndex === -1) {
    const newProduct = {
      id: pid,
      quantity: 1,
    };
    cart.products.push(newProduct);
  } else {
    cart.products[productIndex].quantity += 1;
  }

  fs.writeFileSync('carrito.json', JSON.stringify(carts, null, 2));

  res.json(cart.products);
});

app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
