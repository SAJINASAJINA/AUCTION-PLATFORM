import React from 'react'
import {
    FaUser,
    FaGavel,
    FaEnvelope,
    FaDollarSign,
    FaFileInvoice,
    FaRedo,
} from "react-icons/fa";

const HowItWorks = () => {
    const steps = [
        {
            icon: <FaUser />,
            title: "User Registration",
            description: "Users must register or login to perform operations such as posting auctions,bidding on item, accessing the dashboard, and sending payments proof.",
        },
        {
            icon: <FaGavel />,
            title: "Auction Posting",
            description: "Auctions are created by users and are posted on the platform. Users can choose to post an auction with a starting bid, or by specifying a reserve price.",
        },
        {
            icon: <FaEnvelope />,
            title: "Bid on Items",
            description: "Users can bid on items by placing a bid below the current highest bid. If the bid is higher than the current highest bid, the auction will be closed and the user will be awarded the item.",
        },
        {
            icon: <FaDollarSign />,
            title: "Payment Proof",
            description: "Users must provide payment proof to the auctioneer. This could be a bank transfer, wire transfer, or a payment link.",
        },
        {
            icon: <FaFileInvoice />,
            title: "Receive Item",
            description: "Once the auction is closed and the highest bidder is awarded the item, the auctioneer will receive a notification and the item will be delivered to the highest bidder's address.",
        },
        {
            icon: <FaRedo />,
            title: "Repeat Auctions",
            description: "Users can repeat auctions by creating new auctions with the same or different item details.",
        },
    ];
  return (
      <>
          <section
        className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px]
                          flex flex-screen py-4 justify-center"
          >
              <h1
            className={
              "text-[#d6482b]text-2xl font-bold md-2 min-[480px]:text-4xlmd:text-6xl xl:text-7xl 2xl:text-8xl"
            }
              >
                  Discover How PrimeBid Operates
              </h1>
              <div className="flex flex-col gap-4 my-5">
                  {
                      steps.map((element, index) => {
                          return (
                            <div
                              key={index}
                              className="bg-white rounded-md p-2 lg:p-5 flex flex-col gap-2 group hover:bg-black transition-all duration-300"
                            >
                              <div className="bg-black text-white p-3 text-xl rounded-full w-fit group-hover:bg-[#d6482b] transition-all duration-300">
                                {element.icon}
                              </div>
                              <h3
                                className={
                                  "text-[#d6482b] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl"
                                }
                              >
                                {element.title}
                                  </h3>
                                  <p className='text-xl text-stone-700 group-hover:text-[#fff] transition-all duration-300'>
                                       {element.description}
 
                                  </p>
                            </div>
                          );
                    })  
                  }
                  
              </div>
      </section>
      
      
      </>
  )
}

export default HowItWorks