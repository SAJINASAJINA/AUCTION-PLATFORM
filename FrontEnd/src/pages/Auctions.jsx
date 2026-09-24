import Card from "@/custom-components/Card";
import Spinner from "@/custom-components/Spinner";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAuctionItems } from "@/store/slices/auctionSlice";

const Auctions = () => {
  const dispatch = useDispatch();

  const { allAuctions, loading } = useSelector((state) => state.auction);

  useEffect(() => {
    dispatch(getAllAuctionItems());
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <article className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
          <section className="my-8">
            <h1 className="text-[#d6482b] text-2xl font-bold md:text-2xl min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl">
              Auctions
            </h1>

            <div className="flex flex-wrap gap-6">
              {Array.isArray(allAuctions) &&
                allAuctions.map((element) => (
                  <Card
                    title={element.tittle}
                    startTime={element.startTime}
                    endTime={element.endTime}
                    imgSrc={element.image?.url}
                    startingBid={element.startingBid}
                    id={element._id}
                    key={element._id}
                  />
                ))}
            </div>
          </section>
        </article>
      )}
    </>
  );
};

export default Auctions;
