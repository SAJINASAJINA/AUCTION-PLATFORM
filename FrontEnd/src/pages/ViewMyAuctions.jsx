import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@/custom-components/Spinner";
import Card from "@/custom-components/Card";
import { getMyAuctionItems } from "@/store/slices/auctionSlice";

const ViewMyAuctions = () => {
  const dispatch = useDispatch();

  const { myAuctions, loading } = useSelector((state) => state.auction);

  useEffect(() => {
    dispatch(getMyAuctionItems());
  }, [dispatch]);

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
      <h1 className="text-[#d6482b] text-4xl md:text-6xl font-bold mb-10">
        My Auctions
      </h1>

      {loading ? (
        <Spinner />
      ) : myAuctions && myAuctions.length > 0 ? (
        <div className="flex flex-wrap gap-6">
          {myAuctions.map((element) => (
            <Card
              key={element._id}
              title={element.title}
              startTime={element.startTime}
              endTime={element.endTime}
              imgSrc={element.image?.url}
              startingBid={element.startingBid}
              id={element._id}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-2xl font-semibold text-gray-600">
            You have no auctions yet.
          </p>
        </div>
      )}
    </section>
  );
};

export default ViewMyAuctions;
