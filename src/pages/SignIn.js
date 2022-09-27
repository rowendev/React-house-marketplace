import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import OAuth from "../components/OAuth";
import Spinner from "../components/Spinner";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;
  const navigate = useNavigate();
  const onChange = (e) => {
    setFormData((preState) => ({
      ...preState,
      [e.target.id]: e.target.value,
    }));
  };

  if (loading) {
    return <Spinner />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        setLoading(false);
        navigate("/profile");
        toast.success("歡迎回來!");
        setTimeout(() => {
          toast.info("建議使用本名,以便客戶聯絡");
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Email/密碼輸入錯誤");
    }
  };
  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>

        <form onSubmit={onSubmit}>
          <input
            type="email"
            className="emailInput"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
          />
          <div className="passwordInputDiv">
            <input
              type={showPassword ? "text" : "password"}
              className="passwordInput"
              placeholder="Password"
              id="password"
              value={password}
              onChange={onChange}
            />
            <img
              src={visibilityIcon}
              alt="show password"
              className="showPassword"
              onClick={() => {
                setShowPassword((prevState) => !prevState);
              }}
            />
          </div>
          <Link to="/forgot-password" className="forgotPasswordLink">
            Forgot Password?
          </Link>

          <div className="signDiv">
            <button className="button-24">Sign In</button>
          </div>
        </form>

        <OAuth />

        <Link to="/sign-up" className="registerLink">
          Sign Up Instead
        </Link>
      </div>
    </>
  );
}

export default SignIn;
