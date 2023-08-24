//Creo el Require EXPRESS
const express = require('express')
const productRouter = require('./Routes/productsRoutes')
const cartRouter = require('./Routes/cartsRoutes')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

  //El MIDDLEWARE acá esta a nivel Aplicación
  app.use((req, res, next) => {
    console.log('El tiempo de este Middleware a nivel Aplicacion:', Date.now());
    
    return next();
})

app.use('/api/products', productRouter)//work
app.use('/api/carts', cartRouter)//work
  

app.listen(8080, () => {
    console.log('Servidor Express escuchado: Puerto 8080')
})