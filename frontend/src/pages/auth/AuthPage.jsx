
const handleLogin = async () => {
  const res = await axios.post("http://localhost:5000/api/v1/users/login", {
    email,
    password,
  });

  const token = res.data.token;

  localStorage.setItem("token", token);
  navigate("/");
};
