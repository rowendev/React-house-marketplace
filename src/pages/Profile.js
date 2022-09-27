import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";

function Profile() {
  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  const navigate = useNavigate();
  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };
  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // update displayName in firebase
        // object to put update data
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        // update in firestore
        // doc( db, 'collection', params)
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      toast.error("Could not update profile");
    }
  };
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">使用者資訊</p>
        <button type="button" className="logOut" onClick={onLogout}>
          登出
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "確認" : "更改用戶資料"}
          </p>
        </div>
        <div className="profileCard">
          <label htmlFor="name">使用者名稱:</label>
          <input
            type="text"
            id="name"
            className={!changeDetails ? "profileName" : "profileNameActive"}
            disabled={!changeDetails}
            value={name}
            onChange={onChange}
          />
          <hr
            style={{
              color: "#000",
              backgroundColor: "#000",
            }}
          />
          {/* <input
            type="text"
            id="email"
            // className={!changeDetails ? "profileEmail" : "profileEmailActive"}
            
            // disabled={!changeDetails}
            // value={email}
            // onChange={onChange}
          /> */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="email">Email:</label>
            <p
              className="profileEmail"
              id="email"
              style={{ fontWeight: "600" }}
            >
              {email}
            </p>
          </div>
        </div>
        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>刊登您的物件</p>
          <img src={arrowRight} alt="arrowright" />
        </Link>
      </main>
    </div>
  );
}

export default Profile;
