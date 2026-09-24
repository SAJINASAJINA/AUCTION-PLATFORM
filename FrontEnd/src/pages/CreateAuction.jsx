import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAuction } from "../store/slices/auctionSlice";

const CreateAuction = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [auctionType, setAuctionType] = useState("Traditional");
  const [startingBid, setStartingBid] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const { loading } = useSelector((state) => state.auction);
  const { isAuthenticated } = useSelector((state) => state.user);

  const auctionCategories = [
    "Electronics",
    "Furniture",
    "Art & Antique",
    "jewellery & watches",
    "Books",
    "Home & Garden",
    "Sports & Outdoors",
    "Toys & Hobbies",
    "Vehicles",
    "Business & Industrial",
  ];

  const imageHandler = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleCreateAuction = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("image", image);

    // Backend/schema currently uses "tittle"
    formData.append("tittle", title);

    formData.append("description", description);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("auctionType", auctionType);
    formData.append("startingBid", startingBid);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);

    dispatch(createAuction(formData));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated, navigateTo]);

  return (
    <article className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col py-4 justify-center">
      <h1 className="text-[#111] text-4xl font-bold md:text-6xl xl:text-7xl 2xl:text-8xl mb-6">
        Create Auction
      </h1>

      <div className="bg-white mx-auto w-full h-auto px-4 flex flex-col gap-4 items-center py-6 justify-center rounded-md">
        <form
          className="flex flex-col gap-6 w-full"
          onSubmit={handleCreateAuction}
        >
          <p className="font-semibold text-xl md:text-2xl">Auction Detail</p>

          {/* Title / Category / Condition / Starting Bid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="flex flex-col">
              <label className="text-[16px] text-stone-600">Title</label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter auction title"
                required
                className="text-[16px] py-2 bg-transparent border-b border-b-stone-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[16px] text-stone-600">Category</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="text-[16px] py-2 bg-transparent border-b border-b-stone-500 focus:outline-none"
              >
                <option value="">Select Category</option>

                {auctionCategories.map((element) => (
                  <option key={element} value={element}>
                    {element}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[16px] text-stone-600">Condition</label>

              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
                className="text-[16px] py-2 bg-transparent border-b border-b-stone-500 focus:outline-none"
              >
                <option value="">Select condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[16px] text-stone-600">Auction Type</label>

              <select
                value={auctionType}
                onChange={(e) => setAuctionType(e.target.value)}
                required
                className="text-[16px] py-2 bg-transparent border-b border-b-stone-500 focus:outline-none"
              >
                <option value="Traditional">Traditional Auction</option>
                <option value="Reverse">Reverse Auction</option>
                <option value="Sealed">Sealed Bid Auction</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[16px] text-stone-600">Starting Bid</label>

              <input
                type="number"
                min="1"
                value={startingBid}
                onChange={(e) => setStartingBid(e.target.value)}
                placeholder="Enter starting bid"
                required
                className="text-[16px] py-2 bg-transparent border-b border-b-stone-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="text-[16px] text-stone-600">Description</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your auction item"
              required
              rows="4"
              className="text-[16px] py-2 px-2 bg-transparent border border-stone-400 rounded-md focus:outline-none"
            />
          </div>

          {/* Image */}
          <div className="flex flex-col">
            <label className="text-[16px] text-stone-600 mb-2">
              Auction Item Image
            </label>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={imageHandler}
              required
              className="text-[16px]"
            />

            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Auction Preview"
                  className="w-48 h-48 object-cover rounded-md border"
                />
              </div>
            )}
          </div>

          {/* Start and End Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col">
              <label className="text-[16px] text-stone-600">Start Time</label>

              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="text-[16px] py-2 bg-transparent border-b border-b-stone-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[16px] text-stone-600">End Time</label>

              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="text-[16px] py-2 bg-transparent border-b border-b-stone-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#d6482b] text-white font-semibold px-10 py-3 rounded-md hover:bg-[#b93820] transition"
            >
              {loading ? "Creating Auction..." : "Create Auction"}
            </button>
          </div>
        </form>
      </div>
    </article>
  );
};

export default CreateAuction;
