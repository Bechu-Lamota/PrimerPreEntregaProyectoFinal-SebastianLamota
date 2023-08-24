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

productRouter.post('/', (req, res) => {
	const { title, description, code, price, stock, category, thumbnails } = req.body;

	if (!title || !description || !code || !price || !stock || !category) {
	  return res.status(400).json({ error: 'Missing required fields' });
	}
  
    const newProduct = {
        id: String(products.length + 1), // Convertir el id a string
        title: title, // Asignar las variables
        description: description,
        code: code,
        price: Number(price), // Convertir el precio a número
        status: true,
        stock: Number(stock), // Convertir el stock a número
        category: category,
        thumbnails: thumbnails ? Array(thumbnails) : [], // Si se proporciona thumbnails, convertirlo a un array, de lo contrario, usar un array vacío
    };

	products.push(newProduct)

	return res.status(201).json(newProduct)
})

productRouter.put('/:pid', (req, res) => {
	const data = req.body
	const pid = parseInt(req.params.pid)

	const product = products.find(product => product.id === pid)
	if (!product) {
		return res.status(404).json({
			error: 'Product not found'
		})
	}

	product.nombre = data.nombre || product.nombre
	product.apellido = data.apellido || product.apellido
	product.genero = data.genero || product.genero

	return res.json(product)
})

productRouter.delete('/:pid', (req, res) => {
	const pid = parseInt(req.params.pid)

	const productIndex = products.findIndex(product => product.id === pid)
	if (productIndex === -1) {
		return res.status(404).json({
			error: 'Product not found'
		})
	}

	products.splice(productIndex, 1)
	return res.status(204).json({})
})

module.exports = productRouter
