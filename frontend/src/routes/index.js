import LoginPage from "../pages/Login/index.js";
import Signup from "../pages/Signup/index.js";
import Home from "../pages/Home/index.js";
import AddPost from "../pages/AddPost/index.js";

const Routes = [
  {
    path: "/",
    name: "login",
    exact: true,
    component: LoginPage,
  },
  {
    path: "/add",
    name: "AddPost",
    exact: true,
    component: AddPost,
  },
  {
    path: "/home",
    name: "Home",
    exact: true,
    component: Home,
  },
  {
    path: "/signup",
    name: "signup",
    exact: true,
    component: Signup,
  },
];

export default Routes;
