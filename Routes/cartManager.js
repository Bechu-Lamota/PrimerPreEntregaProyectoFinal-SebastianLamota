const fs = require('fs')

class cartManager  {
    constructor (path) {
        this.carts = []
        this.path = path
    }

 addcart(data) {
        if (!data.quantity) {
            return "Error: Faltan completar campos";
        }

        const existcart = this.carts.findIndex((cart) => cart.id === data.id);
        if (existcart !== -1) {
            console.log("El código de carrito está en uso");
            return "Error: El código está en uso.";
        }

        const newCart = {
            id: this.carts.length + 1,
            quantity: data.quantity,
        };
    
        // Cargar los cartos existentes desde el archivo
        fs.promises.readFile(this.path, 'utf-8')
            .then((cartString) => {
                const carts = JSON.parse(cartString);
    
                // Agregar el nuevo carto
                carts.push(newCart);
    
                // Escribir la lista completa de cartos al archivo
                const cartsString = JSON.stringify(carts, null, 2);
                return fs.promises.writeFile(this.path, cartsString);
            })
            .then(() => {
                console.log("cart agregado satisfactoriamente");
            })
            .catch((err) => {
                console.log("Error al agregar el cart:", err);
            });
    
        return newCart;
    }

    async saveCarts() {
        try {
            const cartString = JSON.stringify(this.carts, null, 2);
            await fs.promises.writeFile(this.path, cartString); // Usamos writeFile en lugar de appendFile
            console.log("Carritos guardados correctamente");
        } catch (error) {
            console.error("No se pudieron guardar los carritos:", error);
        }
    }

    getcart () {
        return fs.promises.readFile(this.path, 'utf-8')
        .then((cartString) => {
            const carts = JSON.parse(cartString)
            console.log(carts)

            return carts
        })
        .catch (error => {
            console.log('Error al leer el archivo', error )
            return []
        })
    }

      getCartById (id) {
        return this.getcart()
          .then((carts) => {
            const cart = carts.find(cart => cart.id === id)

            return cart
          })
          .catch(e => {
            console.log('Error al obtener el carto')
            return e
          })
      }

    updatecart (quantity, actualizacion) {
        const index = this.carts.findIndex((cart) => cart.quantity === quantity);
        if (index === -1) {
            console.log("carto no actualizado");
            return "Error: carto no actualizado"
        }
        this.carts[index] = {...this.carts[index], ...actualizacion};
        const cartActualizado = JSON.stringify(this.carts, null, 2);
        fs.writeFile(this.path, cartActualizado, 'utf-8', (err) => {
            if (err) {
                console.log("No se pudo actualizar el carto");
            } else {
                console.log("carto actualizado correctamente");
            }
        });
    }

    deletecart (quantity) {
        const index = this.carts.find((cart) => cart.quantity === quantity);
        if (!index) {
            return console.log("carto no encontrado")
        }
        const eliminarcartos = this.carts.splice(index, 1)[0];

        return eliminarcartos;
    }

}

module.exports = cartManager