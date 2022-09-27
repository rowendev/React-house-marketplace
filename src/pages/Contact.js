import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

function Contact() {
  const [message, setMessage] = useState("");
  const [houseOwner, setHouseOwner] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getHouseOwner = async () => {
      const docRef = doc(db, "users", params.houseOwnerId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log(docSnap.data());
        setHouseOwner(docSnap.data());
      } else {
        toast.error("無法聯絡屋主");
      }
    };

    getHouseOwner();
  }, [params.houseOwnerId]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">聯絡屋主</p>
      </header>
      {houseOwner !== null && (
        <main>
          <div>
            <p className="landlordName">{houseOwner?.name}</p>
          </div>
          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">
                訊息:
              </label>
              <textarea
                name="message"
                id="message"
                className="textarea"
                value={message}
                onChange={onChange}
              ></textarea>
            </div>

            <a
              href={`mailto:${houseOwner.email}?Subject=${searchParams.get(
                "listingName"
              )}&body=${message}`}
            >
              <button className="primaryButton" type="button">
                發送 Email !
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
}

export default Contact;
