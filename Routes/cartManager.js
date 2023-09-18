const fs = require('fs')

const ProductManager  = require("./productManager")

//No logro anexar el PRODUCTMANAGER A CARTMANAGER
/*
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
*/

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

async updateCart(id, newData) {
    try {
        // Obtener el carrito por su ID
        const cart = await this.getCartById(id);
        if (!cart) {
            return { error: 'Cart not found' };
        }

        const productId = newData.productId;
        const quantity = newData.quantity; // Si no se proporciona la cantidad, establece el valor predeterminado en 1

        // Verificar si existe el producto en el carrito
        const existProduct = cart.products.findIndex(p => p.productId === productId);

        if (existProduct !== -1) {
            // Si el producto existe, actualizar la cantidad
            cart.products[existProduct].quantity = quantity;
        } else {
            // Agregar el producto al carrito con la cantidad especificada
            cart.products.push({
                productId: productId,
                quantity: quantity
            });
        }

        return cart;
    } catch (error) {
        return { error: 'Internal server error' };
    }
}

}

module.exports = cartManager