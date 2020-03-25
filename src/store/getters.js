const getters = {
  id: state => state.user.id,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  nickName: state => state.user.nickName,
  showMoveImg: state => state.cart.showMoveImg,
  showCart: state => state.cart.showCart,
  cartList: state => state.cart.cartList,
  receiveInCart: state => state.cart.receiveInCart,
  userList: state => state.chat.userList,
  chatList: state => state.chat.chatList
}
export default getters
