import React from 'react';




const Spinner = () => {
    return (
        <div className='w-full min-h-[600px] flex justify-center items-center'>
            <hashLoader size={130} color="[#D6482B]" />
  
        </div>
    );
};

export default Spinner;