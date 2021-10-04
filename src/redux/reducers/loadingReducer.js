export const LoadingReducer = (loading = false, action) => {
  // console.log(action)
  const {
    type,
    payload
  } = action;
  switch (type) {
    case 'change':
      loading = payload;
      return loading;

    default:
      return loading;
  }
}