const fs = require('fs')

const ProductManager  = require("./productManager")

//No logro anexar el PRODUCTMANAGER A CARTMANAGER

const products = async () => {
    const manager = new ProductManager("product.json");
    try {
        const product = await manager.getProduct();
        console.log("Product list:", product); // Agregar esta línea para imprimir la lista de productos
        return product;
    } catch (error) {
        console.log("Error al obtener la lista de productos:", error);
        return [];
    }
}


class cartManager  {
    constructor (path) {
        this.path = path
        console.log("Ruta del cart.json:", path); // Agregar esta línea para imprimir la ruta
    }

    async getCart () {
        try {
            const cartString = await fs.promises.readFile(this.path, 'utf-8')
                const carts = JSON.parse(cartString)
                console.log(carts)
                return carts
        } catch (error) { console.log('Error al leer el archivo', error )
            return []
        }
    }

      getCartById (id) {
        return this.getCart()
          .then((carts) => {
            const cart = carts.find(cart => cart.id === id)

            return cart
          })
          .catch(e => {
            console.log('Error al obtener el carto')
            return e
          })
      }

async addCart(data) {
        console.log("Iniciando addCart...");
        const carts = await this.getCart();
        console.log("Obteniendo carritos existentes:", carts);

        if (!data.product) { 
            throw new Error("Error: Faltan completar campos"); //Acá me esta faltando otro else if que me agregue el array de data
        }

        const existCart = carts.find((cart) => cart.id === data.id);
        if (existCart) { 
            console.log("El codigo de producto está en uso");
            throw new Error( "Error: El codigo está en uso."); 
        }
        
        const newCart = {
            id: carts.length + 1,
            product:{
                title: data.title,
                description: data.description,
                price: data.price,
                thumbnail: data.thumbnail,
                code: data.code,
                stock: data.stock
            }
        };
        carts.push(newCart);

    try {
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
        console.log("Producto agregado satisfactoriamente");

        return newCart;
        } catch (err) {
        console.log("Error al agregar el carrito:", err);
        throw err;
        }
}

async updateCart(id, newData) {

    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        //Verifico si existe el producto en el carrito
        const existingProduct = cart.products.findIndex(p => p.product.id === productId);
        if (existingProduct !== -1) {
            //si existe, aumento la cantidad y actualizo el stock
            cart.products[existingProduct].quantity += 1;
        } else {
        // Agregar el producto con la cantidad al carrito
             cart.products.push({
                product: {
                     id: productId
                        },
                quantity: 1
             });
        }
    
        // Actualizar el carrito en el archivo JSON
        await cartManager.updateCart(cartId, { products: cart.products });

        return res.status(201).json(cart);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}
}

module.exports = cartManager