import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@/custom-components/Spinner";
import Card from "@/custom-components/Card";
import {
  getUnsoldAuctionItems,
  republishAuction,
} from "@/store/slices/auctionSlice";

const Inventory = () => {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auction);

  const unsoldAuctions = useSelector(
    (state) => state.auction.unsoldAuctions || [],
  );

  const [selectedAuction, setSelectedAuction] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    dispatch(getUnsoldAuctionItems());
  }, [dispatch]);

  const handleRepublish = (auction) => {
    setSelectedAuction(auction);
    setStartTime("");
    setEndTime("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startTime || !endTime) {
      return;
    }

    dispatch(
      republishAuction(selectedAuction._id, {
        startTime,
        endTime,
      }),
    );

    setSelectedAuction(null);
    setStartTime("");
    setEndTime("");
  };

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
      <h1 className="text-[#d6482b] text-4xl md:text-6xl font-bold mb-10">
        Inventory
      </h1>

      {loading ? (
        <Spinner />
      ) : unsoldAuctions.length > 0 ? (
        <div className="flex flex-wrap gap-6">
          {unsoldAuctions.map((item) => (
            <div
              key={item._id}
              className="flex flex-col gap-3 bg-white rounded-md p-3"
            >
              <Card
                title={item.tittle}
                startTime={item.startTime}
                endTime={item.endTime}
                imgSrc={item.image?.url}
                startingBid={item.startingBid}
                id={item._id}
              />

              <button
                onClick={() => handleRepublish(item)}
                className="bg-[#d6482b] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#b8381e]"
              >
                Republish Auction
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-2xl font-semibold text-gray-600">
            No unsold items available.
          </p>
        </div>
      )}

      {selectedAuction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-5 text-[#d6482b]">
              Republish Auction
            </h2>

            <p className="font-semibold mb-5">{selectedAuction.tittle}</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block font-semibold mb-2">
                  New Start Time
                </label>

                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">New End Time</label>

                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end mt-3">
                <button
                  type="button"
                  onClick={() => setSelectedAuction(null)}
                  className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-md"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[#d6482b] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#b8381e]"
                >
                  Republish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Inventory;
