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

cartRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        return res.status(201).json(newCart);
    } catch (error) {
        return res.status(500).json({ error: 'Error al crear el carrito' });
    }
})

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = req.body.quantity || 1;

    try {
        const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const updatedCart = await cartManager.updateCart(cartId, {
            productId: productId,
            quantity: quantity // Utiliza la cantidad proporcionada en el cuerpo o 1 si no se proporciona
        });

        return res.status(201).json(updatedCart);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = cartRouter
