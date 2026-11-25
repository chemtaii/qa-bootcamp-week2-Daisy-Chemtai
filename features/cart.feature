Feature: Shopping cart

As a shopper, I want to add products to my cart so that I can purchase products I need

Scenario: A shopper successfully adds a product to cart

Given the shopper is on the Toolshop homepage
When the shopper selects a product
And add the product to cart
Then the product should appear in their cart
And the quantity of the product should be 1

Scenario: A shopper updates the quantity of a product in their cart

Given the shopper has added a product to cart
And the quantity of the product is 1
When the shopper uses the quality controls to increase the quantity to 3
Then the quantity of the product displayed the cart should update to 3