const fs = require('fs')

class ProductManager  {
    constructor (path) {
        this.products = []
        this.path = path
    }

    async addProduct (data) {
        const products = await this.getProduct();

        if (!data.title || !data.description || !data.price || !data.thumbnail || !data.code || !data.stock) {
            return "Error: Faltan completar campos";
        }
    
        const existProduct = products.find((product) => product.code === data.code);
        if (existProduct) {
            console.log("El codigo de producto está en uso");
            return "Error: El codigo está en uso.";
        }
    
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

    async getProduct () {
        try {
        return fs.promises.readFile(this.path, 'utf-8')
        .then((productString) => {
            const products = JSON.parse(productString)
            console.log(products)

            return products
        })
        } catch (error) {
            console.log('Error al leer el archivo', error )
            return []
         }
        }

    async getProductById (id) {
        const products = await this.getProduct();
        const existProduct = products.find(product => product.id === id);
        if (!existProduct) {
            const error = 'Error al obtener el producto'
            return error
        }
        return existProduct
      }


    async updateProduct (id, actualizacion) {
        const products = await this.getProduct();
        try {
            const productIndex = products.findIndex(product => product.id === id);
            if (productIndex === -1) {
                return "Producto no encontrado";
            }
            products[productIndex] = {...products[productIndex], ...actualizacion};
            await this.writeProductsToFile(products); // Llamada a writeProductsToFile
            return "Producto actualizado correctamente";
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
}


async deleteProduct(id) {
    const products = await this.getProduct()
        const index = products.findIndex((product) => product.id === id);
        if (index === -1) {
           return console.log("Producto no encontrado"); // Producto no encontrado
        }
        const eliminarProductos = products.splice(index, 1)[0];

        try {
            const productString = JSON.stringify(products, null, 2);
            await fs.promises.writeFile(this.path, productString); 
            console.log("Producto eliminado correctamente");
        } catch (error) {
            console.log("No se pudo eliminar el producto", error);
        }
        return eliminarProductos;
    }

}

module.exports = ProductManager