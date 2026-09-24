import React from 'react';

const About = () => {
    const values = [
        {
            id: 1,
            title: "Integrity",
            description:
                "We strive to ensure that all transactions are conducted with integrity, honesty, and fairness."
        },
        {
            id: 2,
            title: "Innovation",
            description:
            "We invest in innovative solutions that enhance the user experience and improve the overall performance of our platform."
        },
        {
            id: 3,
            title: "Community",
            description:
            "We foster a community where users can connect, share experiences, and learn from one another."
        },
        {
            id: 4,
            title: "Customer Focus",
            description:
            "We prioritize customer focus and create a platform that makes it easy for people to find and buy the perfect item."
        }
    ]
    return (
      <>
        <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] gap-7 flex flex-screen py-4 justify-center">
          <div>
            <h1
              className={
                "text-[#d6482b]text-2xl font-bold md-2 min-[480px]:text-4xlmd:text-6xl xl:text-7xl 2xl:text-8xl"
              }
            >
              About Us
            </h1>
            <p className="text-xl text-stone-600">
              Our auction platform aims to connect buyers and sellers, providing
              a platform for real-time bidding and secure transactions. Our
              mission is to help people find the perfect match for their needs,
              while ensuring that all transactions are fair, transparent, and
              secure. We are a team of dedicated professionals, committed to
              providing an exceptional service to our customers. Our team
              members have extensive experience in various industries, including
              real estate, technology, and arts. As a growing platform, we
              strive to keep improving and expanding our offerings, as well as
              addressing the latest trends and challenges in the industry.
            </p>
          </div>
          <div>
            <h3
              className={
                "text-[#111] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl"
              }
            >
              Our Mission
            </h3>
            <p className="text-xl text-stone-600">
              Our mission is to create a platform where buyers and sellers can
              find the perfect match for their needs, while ensuring that all
              transactions are fair, transparent, and secure. By providing a
              safe and convenient way for people to buy and sell goods and
              services, we aim to help them achieve their financial goals and
              achieve their dreams.
            </p>
          </div>
          <div>
            <h3
              className={
                "text-[#111] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl"
              }
            >
              Our Values
            </h3>
            <ul className="list-inside">
              {values.map((element) => {
                return (
                  <li className="text-xl text-stone-600 md-2" key={element.id}>
                    <span className="text-black font-bold">
                      {element.title}
                    </span>
                    : {element.description}
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h3
              className={
                "text-[#111] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl"
              }
            >
              Our Story
            </h3>
            <p className="text-xl text-stone-600">
              At PrimeBid, we believe that every individual deserves to have a
              safe, convenient, and secure place to buy and sell goods and
              services. Our story began in 2017, when we launched our first
              auction platform, PrimeBid. Since then, we have been dedicated to
              creating a platform that helps people find the perfect match for
              their needs, while ensuring that all transactions are fair,
              transparent, and secure. In 2022, we expanded our offerings and
              opened our first store, PrimeBid USA, where we continue to serve
              our customers and expand our platform. Our mission remains the
              same: to create a platform where buyers and sellers can find the
              perfect match for their needs, while ensuring that all
              transactions are fair, transparent, and secure. As a growing
              platform, we strive to keep improving and expanding our offerings,
              as well as addressing the latest trends and challenges in the
              industry. We are committed to providing an exceptional service to
            </p>
          </div>
          <div>
            <h3
              className={
                "text-[#111] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl"
              }
            >
              Join Us
            </h3>
                    <p className="text-xl text-stone-600">
                        If you are interested in joining our team as a professional or as a freelancer, please do not hesitate to reach out to us. We are always looking for talented individuals who can help us create a platform that helps people find the perfect match for their needs, while ensuring that all transactions are fair, transparent, and secure. We are committed to providing an exceptional service to our customers and expanding our platform. To join us, please submit your resume and cover letter, along with any relevant experience or skills, to our recruitment team. We are always looking for talented individuals who can help us create a platform that helps people find the perfect match for their needs, while ensuring that all transactions are fair, transparent, and secure. We are committed to providing an exceptional service to our customers and expanding our platform. To join us, please submit your resume and cover letter, along with any relevant experience or skills, to our recruitment team.
                        
              
            </p>
                </div>
                <div>
                    <p className="text-[#d6482b] text-xl font-bold mb-3">
                        Thank you for choosing PrimeBid.We look forward to being a part of your auction journey!
                    </p>
                </div>
        </section>
      </>
    );
};

export default About;