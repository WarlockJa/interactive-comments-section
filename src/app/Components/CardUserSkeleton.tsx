import "./carduserskeleton.scss";
import "./cardskeleton.scss";

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
