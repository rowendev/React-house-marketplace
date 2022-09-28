import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  orderBy,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";

function Profile() {
  const auth = getAuth();
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

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
      toast.error("無法更新個人資料");
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const onDelete = async (listingId, listingData) => {
    if (window.confirm(`確定刪除物件 "${listingData.name}" ?`)) {
      setLoading(true);
      // delete from firebase
      await deleteDoc(doc(db, "listings", listingId));
      // update new listings on screen
      const updateListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updateListings);
      setLoading(false);
      toast.success(`物件 ${listingData.name} 已刪除成功`);
    }
  };
  const onEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };

  if (loading) {
    return <Spinner />;
  }

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

        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">您刊登的物件:</p>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id, listing.data)}
                  onEdit={() => onEdit(listing.id, listing.data)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;
