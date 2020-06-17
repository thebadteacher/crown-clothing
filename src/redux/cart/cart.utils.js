export const addItemToCart = (cartItems, cartItemToAdd) => {
	const existingCartItem = cartItems.find(
		(cartItem) => cartItem.id === cartItemToAdd.id
	);
	console.log(cartItemToAdd);

	if (existingCartItem) {
		return cartItems.map((cartItem) =>
			cartItem.id === cartItemToAdd.id
				? { ...cartItem, quantity: cartItem.quantity + 1 }
				: cartItem
		);
	}

	return [...cartItems, { ...cartItemToAdd, quantity: 1 }];
};

export const deleteItemFromCart = (cartItems, cartItemToRemove) => {
	const cartItemExists = cartItems.find(
		(cartItem) => cartItem.id === cartItemToRemove.id
	);

	if (cartItemExists.quantity <= 1) {
		return cartItems.filter((cartItem) => cartItem.id !== cartItemToRemove.id);
	}

	return cartItems.map((cartItem) => {
		if (cartItem.id === cartItemToRemove.id) {
			return { ...cartItem, quantity: cartItem.quantity - 1 };
		}

		return cartItem;
	});
};
