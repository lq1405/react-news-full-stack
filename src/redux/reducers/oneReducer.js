//这是定义的一个reducer函数
export const oneReducer = (a = {
  data: 1
}, action) => {

  console.log(111, action);
  return a;

}