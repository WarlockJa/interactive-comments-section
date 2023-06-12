import "./carduserskeleton.scss";
import "./loadinganimation.scss";

// user data inside of the card loading stub
const CardUserSkeleton = () => {
    return (
        <div className="card__cardUserSkeleton">
            <div className="card__cardUserSkeleton--image"></div>
            <p className="card__header--username">{"           "}</p>
            <div className="card__cardUserSkeleton--flashAnimation loadingAnimation"></div>
        </div>
    );
};

export default CardUserSkeleton;
