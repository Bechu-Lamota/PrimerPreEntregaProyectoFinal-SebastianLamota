const fs = require('fs')

class cartManager  {
    constructor (path) {
        this.carts = []
        this.path = path
    }

 async addCart(data) {
    const carts = await this.getCart();
        if (!data.quantity) {
            return "Error: Faltan completar campos";
        }

        const existCart = carts.findIndex((cart) => cart.id === data.id);
        if (existCart !== -1) {
            console.log("El código de carrito está en uso");
            return "Error: El código está en uso.";
        }

        const newCart = {
            id: carts.length + 1,
            products: []
        };

        carts.push(newCart); // Agregar el nuevo carto

        try {
            const cartsString = JSON.stringify(carts, null, 2);

            await fs.promises.writeFile(this.path, cartsString);
            console.log("Carrito agregado satisfactoriamente");
        } catch(err) {
            console.log("Error al agregar el carrito:", err);
        };
    
        return newCart;
    }

    async getCart () {
        try {
            return fs.promises.readFile(this.path, 'utf-8')
            .then((cartString) => {
                const carts = JSON.parse(cartString)
                console.log(carts)
    
                return carts
        }) 
        } catch (error) {
            console.log('Error al leer el archivo', error )
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

    async updatecart (quantity, actualizacion) {
        const carts = await this.getCart();
        try {
            const index = carts.findIndex((cart) => cart.quantity === quantity);
            if (index === -1) {
                console.log("Error: carrito no actualizado");
                return
            }
            carts[index] = {...carts[index], ...actualizacion};

            const cartActualizado = JSON.stringify(carts, null, 2);
            await fs.writeFile(this.path, cartActualizado, 'utf-8')
            console.log("carto actualizado correctamente") 
        } catch (err) {
            console.log("No se pudo actualizar el carto", err);
        }
    }

   async deleteCart (id) {
        const carts = await this.getCart();
        const index = carts.findIndex((cart) => cart.id === id);
        if (!index == -1) {
            return console.log("Carrito no encontrado")
        }
        const eliminarCarrito = carts.splice(index, 1)[0];
        
        try {
            const cartString = JSON.stringify(carts, null, 2);
            await fs.writeFile(this.path, cartString); 
            console.log("Producto eliminado correctamente");
        } catch (error) {
            console.log("No se pudo eliminar el producto", error);
        }
        return eliminarCarrito;
    }

}

module.exports = cartManager