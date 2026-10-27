/**
 * Reducer của giỏ hàng: nhận state hiện tại và action mô tả thao tác vừa xảy ra,
 * trả về mảng giỏ hàng mới. Hàm pure, không sửa state cũ và không đọc/ghi localStorage
 * (việc lưu trữ do CartProvider lo).
 * Các action:
 * 'added' ({ variantId, quantity }): chưa có variant thì thêm vào cuối, có rồi thì cộng số lượng.
 * 'quantity_changed' ({ variantId, quantity }): gán số lượng mới cho variant đó.
 * 'removed' ({ variantId }): bỏ variant đó khỏi giỏ.
 * @param {Array<{ variantId: number, quantity: number }>} state - giỏ hàng hiện tại
 * @param {{ type: string, variantId?: number, quantity?: number }} action - thao tác vừa xảy ra
 * @returns {Array<{ variantId: number, quantity: number }>} giỏ hàng mới
 * @throws {Error} khi action.type không thuộc 3 action trên
 */
export function cartReducer(state, action) {
  switch (action.type) {
    case 'added': {
      const isInCart = state.some(
        (item) => item.variantId === action.variantId
      );

      if (isInCart) {
        return state.map((item) =>
          item.variantId === action.variantId
            ? { ...item, quantity: item.quantity + action.quantity }
            : item
        );
      }

      return [
        ...state,
        { variantId: action.variantId, quantity: action.quantity },
      ];
    }

    case 'quantity_changed':
      return state.map((item) =>
        item.variantId === action.variantId
          ? { ...item, quantity: action.quantity }
          : item
      );

    case 'removed':
      return state.filter((item) => item.variantId !== action.variantId);

    default:
      throw new Error('Unknown action: ' + action.type);
  }
}
