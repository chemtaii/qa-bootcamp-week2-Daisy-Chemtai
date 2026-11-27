import {test, expect} from '@playwright/test';


test('C4 Add to cart', async ({request}) => {
    let cartID: string | undefined;

    try {
        const cartResponse = await request.post('https://api.practicesoftwaretesting.com/carts', {
            headers: {Accept: 'application/json'},
            data: {}
        });
        console.log('Status:', cartResponse.status());
        console.log('Response body:', await cartResponse.text());
        expect(cartResponse.status()).toBe(201);

        const cartBody = await cartResponse.json();

        cartID = cartBody.id;
        expect(cartID).toBeTruthy();

        const productsResponse = await request.get('https://api.practicesoftwaretesting.com/products',{
            headers: {Accept: 'application/json'}
        });
        expect(productsResponse.status()).toBe(200);

        const productsBody = await productsResponse.json();
        console.log('Products body:', JSON.stringify(productsBody));

        const productID = productsBody.data[0].id;
        console.log('Using product ID:', productID);

        const addProductResponse = await request.post(`https://api.practicesoftwaretesting.com/carts/${cartID}`, {
            headers: {Accept: 'application/json'},
            data: {
                product_id: productID,
                quantity: 1
            }
        });
        console.log('Add product status:', addProductResponse.status());
        console.log('Add product body:', await addProductResponse.text());
        expect(addProductResponse.status()).toBe(200);

        const addProductBody = await addProductResponse.json();
        expect(addProductBody.result).toBe('item added or updated');

        // check the cart really contains the product
        const getCartResponse = await request.get(`https://api.practicesoftwaretesting.com/carts/${cartID}`, {
            headers: {Accept: 'application/json'}
        });
        expect(getCartResponse.status()).toBe(200);

        const getCartBody = await getCartResponse.json();
        console.log('Cart body:', JSON.stringify(getCartBody));

        expect(getCartBody.cart_items).toHaveLength(1);              
        expect(getCartBody.cart_items[0].product.id).toBe(productID);   
        expect(getCartBody.cart_items[0].quantity).toBe(1);
    } 
    finally {
        if(cartID) {
            const deleteCartResponse = await request.delete(`https://api.practicesoftwaretesting.com/carts/${cartID}`, {
                headers: {Accept: 'application/json'}
            });
            
            console.log('Cart deletion status:', deleteCartResponse.status());

            expect(deleteCartResponse.status()).toBe(204);
        }
    }

})