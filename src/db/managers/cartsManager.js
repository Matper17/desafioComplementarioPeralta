import { cartsModel } from "../models/carts.model.js";

class CartsManager {
  async createCart() {
    const newCart = { products: [] };
    const response = await cartsModel.create(newCart);
    return response;
  }

  async findCartById(idCart) {
    const response = await cartsModel
      .findById(idCart)
      .populate("products.product", ["name", "price"]);
    return response;
  }

  async addProductToCart(idCart, idProduct) {
    const cart = await cartsModel.findById(idCart);
    const productIndex = cart.products.findIndex((p) =>
      p.product.equals(idProduct)
    );

    if (productIndex === -1) {
      cart.products.push({ product: idProduct, quantity: 1 });
    } else {
      cart.products[productIndex].quantity++;
    }
    return cart.save();
  }

  async quantityUpdate(idCart,idProduct,quantity){
    const cart = await cartsModel.findById(idCart);
    if(!cart){
      return("Carrito No Existente")
    }
    const productIndex = cart.products.findIndex((p) =>
    p.product.equals(idProduct))

    if (productIndex === -1){
      return("Producto No Existente")
    } else{
      cart.products[productIndex]=quantity
    }
    return cart.save();
  }

  async cartUpdate(idCart,newProducts){
    const cart = await cartsModel.findById(idCart);
    if(!cart){
      return("Carrito No Existente")
    }
    cart.products = newProducts.products
    console.log(newProducts.products)
    return cart.save();
  }
 

  async deleteProductOfCart(idCart,idProduct){
    const cart = await cartsModel.findById(idCart);
    if(!cart){
      return("Carrito No Existente")
    }
    const productIndex = cart.products.findIndex((p) =>
    p.product.equals(idProduct))

    if (productIndex === -1){
      return("Producto No Existente")
    } else{
      cart.products.splice(productIndex,1)
    }
    return cart.save();
  }

  async deleteCartProducts(idCart){
    const cart = await cartsModel.findById(idCart);
    if(!cart){
      return("Carrito No Existente")
    }
    cart.products = []
    return cart.save();
  }

}

export const cartsManager = new CartsManager();