const { Router } = require('express')
const CartManager = require('./cartManager')

const path = require('path');
const cartManager = new CartManager(path.join(__dirname, '../Routes/cart.json'));

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
    try {
      const cid = parseInt(req.params.cid)
      
      const cart = await cartManager.getCartById(cid);
      if (cart) {
        const mejorVista = JSON.stringify(cart, null, 2);
        res.type('json').send(mejorVista);
        } else if (!cart) {
         return res.status(404).json({
            error: 'Product not found'
         })
        }
    } catch (e) { res.json(e) }
  })

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cartId = parseInt(cid);
        const productId = parseInt(pid);
        const cart = await cartManager.getcartById(cartId);
        if (!cart) {
            return res.status(404).json({
                error: 'Cart not found',
            });
        }

        const existingProduct = cart.find((p) => p.id === productId);
        if (existingProduct) {
            return res.status(400).json({
                error: 'Product already in cart',
            });
        }

        // Agregar el producto con la cantidad al carrito
        cart.products.push({
            id: productId,
        });

        // Actualizar el carrito en el archivo JSON
        await cartManager.updateCart(cartId, { products: cart.products });

        return res.status(201).json(cart);
    } catch (error) {
        return res.status(500).json({
            error: 'Internal server error',
        });
    }
});

cartRouter.post('/', (req, res) => {
	const data = req.body

	const newCart = cartManager.addCart(data);

	return res.status(201).json(newCart)
})


module.exports = cartRouter
