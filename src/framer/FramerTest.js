import React, { useEffect } from 'react';
import { scroll } from 'framer-motion';

function FramerTest() {
    useEffect(() => {
        const videoRef = document.querySelector("video");
        videoRef.pause();

        // Scrub through the video on scroll
        scroll((progress) => {
            if (videoRef.readyState) {
                videoRef.currentTime = videoRef.duration * progress;
            }
        });
    }, [])

    return (
        <div className='w-full bg-black'>
            <video className='fixed z-10 w-full min-h-screen object-cover opacity-50' muted playsinline preload loop 
            src={require('../assets/vid.mp4')}
            ></video>

            <div className='relative flex flex-col gap-4 z-20 items-center py-10'>
                {[...Array(30)].map((item, index) => {
                    return (
                        <div className='w-96 bg-white rounded-xl p-4'>
                            <h2>Title {index}</h2>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur saepe 
                                autem aliquid assumenda quisquam omnis nisi vero dicta exercitationem doloremque?</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default FramerTest;