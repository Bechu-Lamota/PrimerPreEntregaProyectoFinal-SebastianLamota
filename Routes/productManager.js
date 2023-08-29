const fs = require('fs')

class ProductManager  {
    constructor (path) {
        this.products = []
        this.path = path
    }

    addProduct = async (data) => {
        if (!data.title || !data.description || !data.price || !data.thumbnail || !data.code || !data.stock) {
            return "Error: Faltan completar campos";
        }
    
        const existProduct = this.products.find((product) => product.code === data.code);
        if (existProduct) {
            console.log("El codigo de producto está en uso");
            return "Error: El codigo está en uso.";
        }
    
        const products = await this.getProduct();
        const newProduct = {
            id: products.length + 1,
            title: data.title,
            description: data.description,
            price: data.price,
            thumbnail: data.thumbnail,
            code: data.code,
            stock: data.stock,
        };

        products.push(newProduct);

        try {
            const productoAgregado = JSON.stringify(products, null, 2);
    
            await fs.promises.writeFile(this.path, productoAgregado, 'utf-8');
            console.log("Producto agregado satisfactoriamente");
        } catch (err) {
            console.log("Error al agregar el producto:", err);
        }
    
        return newProduct;
    }
    //Lo corregí

    getProduct () {
        return fs.promises.readFile(this.path, 'utf-8')
        .then((productString) => {
            const products = JSON.parse(productString)
            console.log(products)

            return products
        })
        .catch (error => {
            console.log('Error al leer el archivo', error )
            return []
        })
    }

      getProductById (id) {
        return this.getProduct()
          .then((products) => {
            const product = products.find(product => product.id === id)

            return product
          })
          .catch(e => {
            console.log('Error al obtener el Producto')
            return e
          })
      }


    updateProduct = async (id, actualizacion) => {
        try {
            const products = await this.getProduct();
            const productIndex = products.findIndex(product => product.id === id);

            if (productIndex === -1) {
                console.log("Producto no encontrado");
                return;
            }

            products[productIndex] = {...products[productIndex], ...actualizacion};

            await this.writeProductsToFile(products); // Llamada a writeProductsToFile

            console.log("Producto actualizado correctamente");
        } catch (err) {
            console.log("Error al actualizar el producto:", err);
        }
    }

    async writeProductsToFile(products) {
        try {
            const productoString = JSON.stringify(products, null, 2);
            await fs.promises.writeFile(this.path, productoString);
        } catch (err) {
            throw err;
        } 
    
        /*
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
        console.log("Producto no encontrado");
        return "Error: Producto no actualizado";
    }

    this.products[index] = { ...this.products[index], ...actualizacion };
    const productoActualizado = JSON.stringify(this.products, null, 2);

    try {
        await fs.promises.writeFile(this.path, productoActualizado, 'utf-8');
        console.log("Producto actualizado correctamente");
        return this.products[index]; // Retorna el producto actualizado
    } catch (err) {
        console.log("No se pudo actualizar el producto");
        throw err;
    }
    */
}


deleteProduct(id) {
        const index = this.products.findIndex((product) => product.id === id);
        if (index === -1) {
            console.log("Producto no encontrado"); // Producto no encontrado
        }

        this.products.splice(index, 1)

        const productoActualizado = JSON.stringify(this.products, null, 2);
        fs.writeFile(this.path, productoActualizado, 'utf-8', (err) => {
            if (err) {
                console.log("No se pudo actualizar el producto");
            } else {
                console.log("Producto eliminado correctamente");
            }
        });
    }

}

module.exports = ProductManager