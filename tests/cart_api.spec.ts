import {test, expect} from '@playwright/test';


test('Creates cart and adds product successfully', async ({request}) => {
    let cartID: string | undefined;

    try {
        const cartResponse = await request.post('https://api.practicesoftwaretesting.com/carts', {
            data: {}
        });
        console.log('Status:', cartResponse.status());
        console.log('Response body:', await cartResponse.text());
        expect(cartResponse.status()).toBe(201);

        const cartBody = await cartResponse.json();

        cartID = cartBody.id;
        expect(cartID).toBeTruthy();

        const addProductResponse = await request.post(`https://api.practicesoftwaretesting.com/carts/${cartID}`, {
            data: {
                product_id: '01M8BVMY1ZDDN2ETS0T15RBEKB',
                quantity: 1
            }
        });
        console.log('Add product status:', addProductResponse.status());
        console.log('Add product body:', await addProductResponse.text());
        expect(addProductResponse.status()).toBe(200);

        const addProductBody = await addProductResponse.json();
        expect(addProductBody.result).toBe('item added or updated');
    } 
    finally {
        if(cartID) {
            const deleteCartResponse = await request.delete(`https://api.practicesoftwaretesting.com/carts/${cartID}`);
            
            console.log('Cart deletion status:', deleteCartResponse.status());

            expect(deleteCartResponse.status()).toBe(204);
        }
    }

})

test('Returns 404 to a non-existent cart ID', async ({request})=> {
    const cartResponse = await request.get('https://api.practicesoftwaretesting.com/carts/781892');
    expect(cartResponse.status()).toBe(404);
})