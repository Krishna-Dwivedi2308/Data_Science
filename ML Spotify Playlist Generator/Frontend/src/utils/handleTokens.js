const set_token_to_local = (token, name) => {
  localStorage.setItem("token", token);
  localStorage.setItem("spotify_user_name", name);
};
const get_token_from_local = () => {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("spotify_user_name");
  return { token, name };
};
const remove_token_from_local = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("spotify_user_name");
};
export { set_token_to_local, get_token_from_local, remove_token_from_local };
