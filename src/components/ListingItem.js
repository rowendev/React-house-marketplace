import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";
import carIcon from "../assets/svg/car.svg";

function ListingItem({ listing, id, onEdit, onDelete }) {
  return (
    <li className="categoryListing">
      <Link
        to={`/category/${listing.type}/${id}`}
        className="categoryListingLink"
      >
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className="categoryListingImg"
        />
        <div className="categoryListingDetails">
          <p className="categoryListingName">{listing.name}</p>
          <p className="categoryListingLocation">{listing.address}</p>
          <p className="categoryListingPrice">
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice}
            {listing.type === "rent" && "元 / 月"}
          </p>
          <div className="categoryListingInfoDiv">
            <img src={bedIcon} alt="bed" />
            <p className="categoryListingInfoText">
              {listing.bedrooms > 1 ? `${listing.bedrooms} 房` : "1 房"}
            </p>
            <img src={bathtubIcon} alt="bathrooms" />
            <p className="categoryListingInfoText">
              {listing.bathrooms > 1 ? `${listing.bathrooms} 衛` : "1 衛"}
            </p>
            {listing.parking && (
              <p className="categoryListingInfoText">| 有停車位</p>
            )}
          </div>
        </div>
      </Link>
      {onDelete && (
        <DeleteIcon
          className="removeIcon"
          fill="rgb(231,76,60)"
          onClick={() => onDelete(listing.id, listing.name)}
        />
      )}
      {onEdit && (
        <p
          onClick={() => onEdit(listing.id, listing.name)}
          className="editIcon"
        >
          編輯物件
        </p>
        // <EditIcon
        //   className="editIcon"
        //
        //   onClick={() => onEdit(listing.id, listing.name)}
        // />
      )}
    </li>
  );
}

export default ListingItem;
