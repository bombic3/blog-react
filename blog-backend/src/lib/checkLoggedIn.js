const checkLoggedIn = (ctx, next) => {
  if (!ctx.state.user) {
    ctx.status = 401; // Unauthorized
    // 로그인 상태가 아니라면 401 HTTP Status를 반환하고
    return;
    // 그렇지 않으면 그다음 미들웨어를 실행
  }
  return next();
};

export default checkLoggedIn;
