const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  nickName: state => state.user.nickName,
  showCart: state => state.cart.showCart,
  cartList: state => state.cart.cartList,
  receiveInCart: state => state.cart.receiveInCart
}
export default getters
