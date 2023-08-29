const { Router } = require('express')
const ProductManager = require('./productManager')

const path = require('path');
const productManager = new ProductManager(path.join(__dirname, '../Routes/product.json'));

const productRouter = Router()

//Disponibilizo los recursos
productRouter.get('/', (req, res, next) => {
	console.log('MIDDLEWARE CONTROL GET')
	//El MIDDLEWARE acá esta a nivel Endpoint
	return next()
}, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit)
  
        const products = await productManager.getProduct();
        const mejorVista = limit ? products.slice(0, limit) : products;
        res.json(mejorVista);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
      }
})

productRouter.get('/:pid', async (req, res) => {
    try {
      const pid = parseInt(req.params.pid)
      
      const product = await productManager.getProductById(pid);
      if (product) {
        const mejorVista = JSON.stringify(product, null, 2);
        res.type('json').send(mejorVista);
        } else if (!product) {
         return res.status(404).json({
            error: 'Product not found'
         })
        }
    } catch (e) { res.json(e) }
  })

//Tengo un problema el método post me carga un producto nuevo, PERO no me respeta los id. Estoy seguro que es por el productManager.js que arranca con this.products = [] entonces cuando aplica .length+1 arranca de []+1 y id queda igual a 1 SIEMPRE, pero no logro corregirlo...
productRouter.post('/', async (req, res) => {
  const data = req.body;

  if (!data.title || !data.description || !data.price || !data.stock || !data.code) {
    return res.status(400).json({ error: 'Faltan datos por completar' });
  }

  const newProduct = await productManager.addProduct(data);
  return res.status(201).json(newProduct)
})


productRouter.put('/:pid', (req, res) => {
  const data = req.body;
  const pid = parseInt(req.params.pid);

  const updatedProduct = productManager.updateProduct(pid, data);

  if (!updatedProduct) {
      return res.status(404).json({
          error: 'Product not found'
      });
  }

  return res.json({
      message: 'Producto Actualizado'
  });
});

productRouter.delete('/:pid', (req, res) => {
	const pid = parseInt(req.params.pid)

  const deleted = productManager.deleteProduct(pid);

  if (!deleted) {
      return res.status(404).json({
          error: 'Product not found'
      });
  }

	return res.status(204).json({})
})

module.exports = productRouter
