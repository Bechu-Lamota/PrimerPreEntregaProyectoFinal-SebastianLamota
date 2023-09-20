const fs = require('fs')

const ProductManager  = require("./productManager")

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

    async getCartById (id) {
        const carts = await this.getCart();
        const existCart = carts.find(cart => cart.id === id);
        if (!existCart) {
            const error = 'Error al obtener el producto'
            return error
        }
        return existCart
      }

async addCart() {
    const cart = await this.getCart();

    const newCart = {
        id: cart.length + 1,
        products: [], //Se crea un carrito nuevo con un array vacío.
    };

    cart.push(newCart);

    try {
        await fs.promises.writeFile(this.path, JSON.stringify(cart, null, 2), 'utf-8');
        console.log("Carrito agregado satisfactoriamente");
    } catch (err) {
        console.log("Error al agregar el carrito:", err);
        throw err;
    }

    return newCart;
}

async updateCart(id, actualizo) {
    const cart = await this.getCart()
    try {
        // Busco si el carrito existe.
        const cartExist = cart.findIndex(cart => cart.id === id);
        if (cartExist === -1) {
            return { error: 'Cart not found' }; // Si no existe
        }
        // Pero si existe el carrito, busco si el producto a agregar existe
        const productExist = await this.getCartProductById(actualizo.productId);
        try {
            const cartProductExist = productExist.findIndex(p => p.productId === actualizo.productId); // Buscamos si el producto que queremos agregar existe
            if (cartProductExist === -1) { 
                // Si no existe lo agrego
                const newProduct = {
                    productId: actualizo.productId,
                    quantity: actualizo.quantity
                }
                cartProductExist.products.push(newProduct);
            } else {
                // Si existe lo actualizo
                productExist[cartProductExist] = {...productExist[cartProductExist], ...actualizo};
                await this.writeProductsCartToFile(productExist);
                return "Producto actualizado correctamente";
            }
        } catch (err) { 
            console.log("Error al actualizar el producto:", err);
        }
    } catch (error) { 
        return { error: 'Internal server error' };
    }
}

    async getCartProductById(productId) {
        const cart = await this.getCart();
        const product = cart.products.find(p => p.productId === productId);
        if (!product) {
            return { error: 'Cart Product not found' };
        }
        return product;
    }

    async writeProductsCartToFile(products) {
        try {
            const pString = JSON.stringify(products, null, 2);
            await fs.promises.writeFile(this.path, pString);
        } catch (err) {
            throw err;
        } 
}

}

module.exports = cartManager