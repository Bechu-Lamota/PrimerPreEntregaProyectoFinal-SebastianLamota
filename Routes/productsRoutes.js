const { Router } = require('express')
const ProductManager = require('./productManager')

const path = require('path');
const productManager = new ProductManager(path.join(__dirname, '../Routes/product.json'));

const productRouter = Router()

const products = []

//Disponibilizo los recursos
productRouter.get('/', (req, res, next) => {
	console.log('MIDDLEWARE CONTROL GET')
	//El MIDDLEWARE acá esta a nivel Endpoint
	return next()
}, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit)
  
        const products = await productManager.getProduct(limit);
        const mejorVista = JSON.stringify(products, null, 2);
        res.type('json').send(mejorVista);
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
    } catch (e) { 
        res.json(e)
    }
  })

//Tengo un problema el método post me carga un producto nuevo, PERO no me respeta los id. Estoy seguro que es por el productManager.js que arranca con this.products = [] entonces cuando aplica .length+1 arranca de []+1 y id queda igual a 1 SIEMPRE, pero no logro corregirlo...
productRouter.post('/', (req, res) => {
  const data = req.body;

  if (!data.title || !data.description || !data.code || !data.price || !data.stock) {
    return res.status(400).json({ error: 'Faltan datos por completar' });
  }

  const newProduct = productManager.addProduct(data);

  data.id = products.length + 1

  products.push(data)

  return res.status(201).json(newProduct)
  /*
  //No logro hacerlo funcionar... ¿debo borrar el addProduct de productManager.js?
	const { title, description, code, price, stock, thumbnail } = req.body;

	if (!title || !description || !code || !price || !stock ) {
	  return res.status(400).json({ error: 'Missing required fields' });
	}
  
    const data = {
      id: products.length + 1,
      title: title, // Asignar las variables
      description: description,
      code: code,
      price: Number(price), // Convertir el precio a número
      status: true,
      stock: Number(stock), // Convertir el stock a número
      thumbnail: thumbnail ? Array(thumbnail) : [], // Si se proporciona thumbnails, convertirlo a un array, de lo contrario, usar un array vacío
    };

    const newProduct = productManager.addProduct(data)

	return res.status(201).json(newProduct)
*/
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
