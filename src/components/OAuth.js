import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import googleIcon from "../assets/svg/googleIcon.svg";
import Spinner from "../components/Spinner";

function OAuth() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  if (loading) {
    return <Spinner />;
  }
  const onGoogleClick = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // check for user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      // create user
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      setLoading(false);
      navigate("/profile");
      toast.success("歡迎使用!");
      setTimeout(() => {
        toast.info("建議使用本名,以便客戶聯絡");
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast.error("無法使用Google登入");
    }
  };
  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === "/sign-up" ? "up" : "in"} with </p>
      <button className="socialIconDiv" onClick={onGoogleClick}>
        <img src={googleIcon} alt="google" className="socialIconImg" />
      </button>
    </div>
  );
}

export default OAuth;
