const { Router } = require('express')
const CartManager = require('./cartManager')
const ProductManager = require('./productManager')

const path = require('path');
const cartManager = new CartManager(path.join(__dirname, '../Routes/cart.json'));
const productManager = new ProductManager(path.join(__dirname, '../Routes/product.json'));

const cartRouter = Router()

//El MIDDLEWARE acá esta a nivel Router
cartRouter.use((req, res, next) => {
    console.log('Middleware Router carts');
    
    return next();
})

//Disponibilizo los recursos
cartRouter.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.params.limit) 
        const carts = await cartManager.getCart();
        const mejorVista = limit ? carts.slice(0, limit) : carts;
        res.json(mejorVista);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error'});
    }
});

cartRouter.get('/:cid', async (req, res) => {
    const cid = parseInt(req.params.cid) //obtenemos el id
    const cart = await cartManager.getCartById(cid); //buscamos el id
    try {
      if (cart) {
        const mejorVista = JSON.stringify(cart, null, 2);
        res.type('json').send(mejorVista);
        } else if (!cart) {
         return res.status(404).json({ error: 'Product not found' })
        }
    } catch (e) { res.json(e) }
  })

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    //En este debería agregar al carrito el producto y para esto debería estar enlazado con productManager
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    try {

        const cart = await cartManager.getCartById(cartId); //Obtengo el carrito por su ID desde CartManager.
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const product = await productManager.getProductById(productId); //Obtengo el producto por su ID desde ProductManager.
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const existProduct = cart.products.findIndex(p => p.productId === productId);
        if (existProduct !== -1) {
            cart.products.push({
                productId: product.id,
                quantity: 1
            });
        }

        await cartManager.addCart(cartId, { products: cart.products });

        return res.status(201).json(cart);
    } catch (error) {
        throw res.status(500).json({ error: 'Internal server error'})
    }
});

cartRouter.post('/', async (req, res) => {
    const data = req.body;
    try {
        if (!data.product) {
            return res.status(400).json({ error: 'Faltan datos por completar' });
          }
        
          const newCart = await cartManager.addCart(data);
          return res.status(201).json(newCart)
    } catch (error) {
        console.error("Error interno del servidor:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = cartRouter
