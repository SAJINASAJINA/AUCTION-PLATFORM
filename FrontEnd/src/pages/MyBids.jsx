import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getMyBids } from "@/store/slices/bidSlice";

const MyBids = () => {
  const dispatch = useDispatch();

  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      const data = await dispatch(getMyBids());
      setBids(data);
      setLoading(false);
    };

    fetchBids();
  }, [dispatch]);

  if (loading) {
    return (
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px]">
        <h1 className="text-[#d6482b] text-4xl md:text-6xl font-bold mb-10">
          My Bids
        </h1>

        <p className="text-xl font-semibold text-gray-600">
          Loading bid history...
        </p>
      </section>
    );
  }

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px]">
      <h1 className="text-[#d6482b] text-4xl md:text-6xl font-bold mb-10">
        My Bids
      </h1>

      {bids.length === 0 ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-2xl font-semibold text-gray-600">No bids found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {bids.map((bid) => (
            <div
              key={bid._id}
              className="bg-white rounded-lg shadow-md p-5 flex flex-col md:flex-row gap-5"
            >
              <img
                src={bid.auctionItem?.image?.url}
                alt={bid.auctionItem?.tittle}
                className="w-full md:w-40 h-32 object-cover rounded-md"
              />

              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">
                  {bid.auctionItem?.tittle}
                </h2>

                <p>
                  <span className="font-semibold">Your Bid:</span> ₹{bid.amount}
                </p>

                <p>
                  <span className="font-semibold">Starting Bid:</span> ₹
                  {bid.auctionItem?.startingBid}
                </p>

                <p>
                  <span className="font-semibold">Auction Type:</span>{" "}
                  {bid.auctionItem?.auctionType}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyBids;
