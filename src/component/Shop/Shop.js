import React, { useEffect, useState } from 'react';
import fakeData from '../../fakeData';
import './Shop.css';
import Product from '../Product/Product'
import Cart from '../Cart/Cart';
import { addToDatabaseCart, getDatabaseCart } from '../../utilities/databaseManager';
import { Link } from 'react-router-dom';

const Shop = () => {
    const first10 = fakeData.slice(0,10);
    const [products, setProducts] = useState(first10);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = getDatabaseCart();
        const productKeys = Object.keys(savedCart);
        const previousCart = productKeys.map( existingKey => {
            const product = fakeData.find(pd => pd.key === existingKey)
            product.quantity = savedCart[existingKey];
            return product;
        })
        setCart(previousCart);
    }, []);
    
    const handleAddProduct = (product) => {

        const sameProduct = cart.find(pd => pd.key === product.key);
        const toBeAddedKey = product.key;
        let count = 1;
        let newCart;
        if(sameProduct){
            count = sameProduct.quantity + 1;
            sameProduct.quantity = count;
            const others = cart.filter(pd => pd.key !== toBeAddedKey);
            newCart = [...others, sameProduct];
        }
        else{
            product.quantity = 1;
            newCart = [...cart, product];
        }
        setCart(newCart);
        addToDatabaseCart(product.key, count);

    };
    
    return (
        <div className="shop-container">
           <div className="product-container">
                {
                    products.map(product => <Product 
                        key = {product.key}
                        showAddToCart={true}
                        handleAddProduct={handleAddProduct} 
                        product={product}>
                        </Product>)
                }
           </div>
           <div className="cart-container">
               <Cart cart={cart}>
                 <Link to="/reviews">
                    <button className="main-button">Review Order</button>
                </Link>
               </Cart>
           </div>
        </div>
    );
};

export default Shop;