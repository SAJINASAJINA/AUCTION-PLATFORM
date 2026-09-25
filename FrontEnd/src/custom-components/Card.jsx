import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Card = ({ imgSrc, title, startingBid, startTime, endTime, id }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const startDifference = new Date(startTime) - now;
    const endDifference = new Date(endTime) - now;
    let timeLeft = {};

    if (startDifference > 0) {
      timeLeft = {
        type: "Starts In:",
        days: Math.floor(startDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((startDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((startDifference / 1000 / 60) % 60),
        seconds: Math.floor((startDifference / 1000) % 60),
      };
    } else if (endDifference > 0) {
      timeLeft = {
        type: "Ends In:",
        days: Math.floor(endDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((endDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((endDifference / 1000 / 60) % 60),
        seconds: Math.floor((endDifference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTimeLeft = ({ days, hours, minutes, seconds }) => {
    const pad = (num) => String(num).padStart(2, "0");
    return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <Link
      to={`/auction/item/${id}`}
      className="flex-grow basis-full bg-white rounded-md group sm:basis-56 lg:basis-60 2xl:basis-80"
    >
      <div className="w-full h-48 sm:h-56 overflow-hidden rounded-t-md">
        <img src={imgSrc} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="px-2 pt-4 pb-2">
        <h5 className="font-semibold text-[18px] group-hover:text-[#d6482b] mb-2">
          {title}
        </h5>

        {startingBid && (
          <p className="text-stone-600 font-light">
            Starting Bid:
            <span className="text-[#fdba88] font-bold ml-1">{startingBid}</span>
          </p>
        )}

        <p className="text-stone-600 font-light">
          {timeLeft.type}

          {Object.keys(timeLeft).length > 1 ? (
            <span className="text-[#fdba88] font-bold ml-1">
              {formatTimeLeft(timeLeft)}
            </span>
          ) : (
            <span className="text-[#fdba88] font-bold ml-1">Time's up!</span>
          )}
        </p>
      </div>
    </Link>
  );
};

Card.propTypes = {
  imgSrc: PropTypes.string,
  title: PropTypes.string,
  startingBid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  id: PropTypes.string,
};

export default Card;
