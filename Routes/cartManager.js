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

async addCart(data) {
        console.log("Iniciando addCart...");
        const carts = await this.getCart();
        console.log("Obteniendo carritos existentes:", carts);

        if (!data.product) { 
            throw new Error("Error: Faltan completar campos");
        }

        const existCart = carts.find((cart) => cart.id === data.id);
        if (existCart) { 
            console.log("El codigo de producto está en uso");
            throw new Error( "Error: El codigo está en uso."); 
        }
        
        const newCart = {
            id: carts.length + 1,
            product:[]
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
        // Obtener el carrito por su ID
        const cart = await this.getCartById(id);
        if (!cart) {
            return { error: 'Cart not found' };
        }

        const productId = newData.productId;
        const quantity = newData.quantity;

        // Verificar si existe el producto en el carrito
        const existingProduct = cart.products.findIndex(p => p.productId === productId);

        if (existingProduct !== -1) {
            // Si el producto existe, aumentar la cantidad
            cart.products[existingProduct].quantity += quantity;
        } else {
            // Agregar el producto al carrito
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