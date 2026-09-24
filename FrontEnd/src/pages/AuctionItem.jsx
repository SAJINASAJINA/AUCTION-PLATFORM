import Spinner from "@/custom-components/Spinner";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
import { placeBid } from "@/store/slices/bidSlice";
import React, { useEffect, useState } from "react";
import { FaGreaterThan } from "react-icons/fa";
import { RiAuctionFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

const AuctionItem = () => {
  const { id } = useParams();
  const { loading, auctionDetails, auctionBidders } = useSelector(
    (state) => state.auction,
  );
  const { isAuthenticated } = useSelector((state) => state.user);

  const navigaTo = useNavigate();
  const dispatch = useDispatch();

  const [amount, setAmount] = useState(0);
  const handleBid = () => {
    const formData = new FormData();
    formData.append("amount", amount);
    dispatch(placeBid(id, formData));
    dispatch(getAuctionDetail(id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigaTo("/");
      return;
    }

    if (id) {
      dispatch(getAuctionDetail(id));
    }
  }, [isAuthenticated, id, dispatch, navigaTo]);

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
        <div className="text-[16px] flex flex-wrap gap-2 items-center">
          <Link
            to="/"
            className="font-semibold transition-all duration-300 hover:text-[#D6482B]"
          >
            Home
          </Link>
          <FaGreaterThan />
          <Link
            to={"/auctions"}
            className="font-semibold transition-all duration-300 hover:text-[#D6482B]"
          >
            Auctions
          </Link>
          <FaGreaterThan />
          <p>{auctionDetails.tittle}</p>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex gap-4 flex-col lg:flex-row">
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex gap-4 flex-col lg:flex-row">
                <div className="bg-white w-[100%] lg:w-40 lg:h-40 flex justify-center item-center p-5">
                  <img
                    src={auctionDetails.image?.url}
                    alt={auctionDetails.tittle}
                  />
                </div>
                <div className="flex flex-col justify-around">
                  <h3 className="text-[#111] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
                    {auctionDetails.tittle}
                  </h3>
                  <p className="text-xl font-semibold">
                    Minimum Bid:
                    <span className="text-[#D6482B]">
                      Rs.{auctionDetails.startingBid}
                    </span>
                  </p>
                </div>
              </div>
              <p className="text-xl-w-fit fond-bold">
                Auction Item Description
              </p>
              <hr className="my-2 border-t-[1px] border-t-stone-700" />
              {auctionDetails.description &&
                auctionDetails.description.split(". ").map((element, index) => {
                  return (
                    <li key={index} className="text-[18px] my-2">
                      {element}
                    </li>
                  );
                })}
            </div>
            <div className="flex-1">
              <header className="bg-stone-200 py-4 text-[24px] font-semibold px-4">
                BIDS
              </header>
              <div className="bg-white px-4 min-h-fit lg:min-h-[650px]">
                {new Date(auctionDetails.startTime) <= Date.now() &&
                new Date(auctionDetails.endTime) >= Date.now() ? (
                  auctionBidders && auctionBidders.length > 0 ? (
                    auctionBidders.map((element, index) => {
                      return (
                        <div
                          key={index}
                          className="py-2 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={element.profileImage}
                              alt={element.userName}
                              className="w-12 h-12 rounded-full my-2 hidden md:block"
                            />
                            <p className="text-[18px] font-semibold">
                              {element.userName}
                            </p>
                          </div>

                          {index === 0 ? (
                            <p className="text-[20px] font-semibold text-green-600">
                              1st
                            </p>
                          ) : index === 1 ? (
                            <p className="text-[20px] font-semibold text-blue-600">
                              2nd
                            </p>
                          ) : index === 2 ? (
                            <p className="text-[20px] font-semibold text-yellow-600">
                              3rd
                            </p>
                          ) : (
                            <p className="text-[20px] font-semibold text-gray-600">
                              {index + 1}th
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center min-h-[300px]">
                      <p className="text-2xl font-semibold text-gray-600">
                        No bids yet. Be the first bidder!
                      </p>
                    </div>
                  )
                ) : Date.now() < new Date(auctionDetails.startTime) ? (
                  <div className="flex items-center justify-center min-h-[300px]">
                    <p className="text-2xl font-semibold text-gray-600">
                      Auction has not started yet!
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center min-h-[300px]">
                    <p className="text-2xl font-semibold text-gray-600">
                      Auction has ended!
                    </p>
                  </div>
                )}
              </div>
              <div className="bg-[#d6482b] py-4 text-[16px] md:text-[24px] font-semibold px-4 flex items-center justify-between">
                {Date.now() >= new Date(auctionDetails.startTime) &&
                  (Date.now() <= new Date(auctionDetails.endTime) ? (
                    <>
                      <div className="flex gap-3 flex-col sm:flex-row sm:items-center">
                        <p className="text-white">Place Bid</p>
                        <input
                          type="number"
                          className="w-32 focus:outline-none md:text-[20px] p-1"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                      <button
                        className="p-4 text-white bg-black rounded-full transition-all duration-300 hover:bg-[#222]"
                        onClick={handleBid}
                      >
                        <RiAuctionFill />
                      </button>
                    </>
                  ) : new Date(auctionDetails.startTime) > Date.now() ? (
                    <p className="text-white font-semibold text-xl">
                      Auction is not started yet!
                    </p>
                  ) : (
                    <p className="text-white font-semibold text-xl">
                      Auction has ended!
                    </p>
                  ))}
              </div>
            </div>
          </div>
        )}
        ;
      </section>
    </>
  );
};

export default AuctionItem;
