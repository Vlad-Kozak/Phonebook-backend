const serializeUser = (user) => {
  return {
    id: user._id.toString(),
    email: user.email,
    avatarURL: user.avatarURL,
    subscription: user.subscription,
  };
};

const serializeUserResponse = (user) => {
  return { user: serializeUser(user) };
};

module.exports = {
  serializeUser,
  serializeUserResponse,
};
