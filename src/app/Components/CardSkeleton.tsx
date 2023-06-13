import "./cardskeleton.scss";
import "./loadinganimation.scss";
import "./card.scss";

// loading stub
const CardSkeleton = () => {
    return (
        <div className="cardSkeleton card">
            <div className="cardSkeleton__header card__header">
                <div className="cardSkeleton--item cardSkeleton__header--image"></div>
                <div className="cardSkeleton--item cardSkeleton__header--username"></div>
                <div className="cardSkeleton--item cardSkeleton__header--date"></div>
            </div>
            <div className="cardSkeleton__comment card__comment">
                <div className="cardSkeleton--item cardSkeleton__comment--line"></div>
                <div className="cardSkeleton--item cardSkeleton__comment--line"></div>
                <div className="cardSkeleton--item cardSkeleton__comment--line"></div>
                <div className="cardSkeleton--item cardSkeleton__comment--line"></div>
            </div>

            <div className="cardSkeleton__rating card__rating">
                <div className="card__rating__wrapper">
                    <div className="card__rating--filler"></div>
                    <div className="card__rating--filler"></div>
                    <div className="card__rating--filler"></div>
                </div>
            </div>
            <div className="cardSkeleton--item cardSkeleton__interact card__interact"></div>
            <div className="cardSkeleton--flashAnimation loadingAnimation"></div>
        </div>
    );
};

export default CardSkeleton;
