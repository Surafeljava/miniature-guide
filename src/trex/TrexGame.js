import React, { useState, useEffect, useRef } from 'react';
import { FiRotateCcw } from "react-icons/fi";

import running from "../assets/trex/run.gif";
import jumping from "../assets/trex/jump.png";

function TrexGame() {

    const WINDOW_HEIGHT = window.innerHeight*0.5;
    const WINDOW_WIDTH = window.innerWidth*0.95;
    const TREX_SIZE = 40;

    const [trexPosition, setTrexPosition] = useState(0);
    const trexRef = useRef(trexPosition);

    const [velocity, setVelocity] = useState(0);
    const gravity = 1;

    // w:3 or w:5 & pos
    const [cactuses, setCactuses] = useState([]);
    // const [floor, setFloor] = useState([]);

    const [gameOver, setGameOver] = useState(false);
    const gameOverRef = useRef(gameOver);

    const [score, setScore] = useState(0);

    const handleCheckCollission = (cactus) => {
        if(cactus.pos>=(WINDOW_WIDTH/2 - cactus.w) && cactus.pos<=WINDOW_WIDTH/2){
            // console.log("here");
            if(trexPosition>=0 && trexPosition<=cactus.h){
                // console.log("Collission detected");
                setGameOver(true);
                gameOverRef.current = true;
            }
        }
    }

    useEffect(() => {
        if(!gameOver){
            for (let i = 0; i < cactuses.length; i++) {
                const cactus = cactuses[i];
                handleCheckCollission(cactus);
            }
        }
        // eslint-disable-next-line
    }, [cactuses])

    const generateTheNextCactus = () => {
        const width_sets = [40, 60, 80];
        const height_sets = [40, 60, 80];
        const w_c = Math.floor(Math.random() * width_sets.length);
        const h_c = Math.floor(Math.random() * height_sets.length);
        let w = width_sets[w_c];
        let h = height_sets[h_c];
        let pos = 0;

        setCactuses((prev_cactuses) => [...prev_cactuses, {w, h, pos}]);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if(!gameOverRef.current){
                generateTheNextCactus();
            }
        }, 2000);

        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [])

    const handleUpdateCactuses = () => {
        if(cactuses.length>0 && !gameOver){
            setCactuses((prev) => cactuses.map(cactus => {
                return {...cactus, pos: cactus.pos + 1};
            }));
            setScore((last_score) => last_score+0.01);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            handleUpdateCactuses();
        }, 1000/580);

        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [cactuses])

    const handleJump = () => {
        if(trexRef.current===0){
            setVelocity(0);
            setVelocity(20);
        }
    }

    const moveBirdOnArrowKeys = () => {
        window.addEventListener('keydown', (e) => {
            if(e.key === ' ') {
                handleJump();
            }
        })
    }

    useEffect(() => {
        moveBirdOnArrowKeys();
        // eslint-disable-next-line
    }, [])

    const updateTrexPosition = (new_value) => {
        setTrexPosition(new_value);
        trexRef.current = new_value;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if(!gameOverRef.current){
                if(velocity>0){
                    setVelocity((prev_velocity) => prev_velocity - gravity);
                    // setTrexPosition((prev_position) => prev_position + velocity);
                    updateTrexPosition(trexPosition + velocity);
                }
                
                if(velocity<=0 && trexPosition>0){
                    setVelocity((prev_velocity) => prev_velocity - gravity);
                    // setTrexPosition((prev_position) => prev_position + velocity);
                    updateTrexPosition(trexPosition + velocity);
                }
            }


        }, 1000/60);

        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [velocity, trexPosition, gravity]);


    const restartGame = () => {
        setCactuses([]);
        setTrexPosition(0);
        trexRef.current = 0;
        setScore(0);
        setGameOver(false);
        gameOverRef.current = false;
    }

    return (
        <div className='flex flex-col justify-center items-center h-screen w-full'>

            <div className='flex flex-col justify-center items-center bg-white relative overflow-hidden' style={{height: WINDOW_HEIGHT, width: WINDOW_WIDTH}}>

                <div className='absolute bottom-0 left-0 w-full h-[2px] bg-black'></div>

                {cactuses.length>0 && cactuses.map((cactus, index) => (
                    <div key={index} className='absolute bottom-0 bg-white border-2 border-black' style={{width: cactus.w, right: cactus.pos, height:cactus.h}}>
                    </div>
                ))}

                <div className='absolute' style={{width:TREX_SIZE, height:TREX_SIZE, bottom:trexPosition, left:(WINDOW_WIDTH/2 - TREX_SIZE), rotate:(trexPosition===0 ? '0deg' : `${velocity}deg`)}}>
                    {/* <p>{velocity}</p> */}
                    <img src={(trexPosition===0 && !gameOver) ? running : jumping} alt="trex-man" style={{width:'100%', height:'100%'}} />
                </div>

                <div className='absolute top-5 right-10'>
                    <p className='text-2xl font-[500] font-mono tracking-wide'>{'0'.repeat(4-`${Math.floor(score)}`.split('').length)}{Math.floor(score)}</p>
                </div>

                {gameOver && (
                    <div className='w-full h-full absolute top-0 left-0 z-10 bg-black bg-opacity-5 flex justify-center items-center'>
                        <button onClick={restartGame} className='px-4 py-4 rounded-lg bg-white'>
                            <FiRotateCcw color='#000' size={20}/>
                            {/* <p className='text-white uppercase'>Restart</p> */}
                        </button>
                    </div>
                )}

            </div>

        </div>
    );
}

export default TrexGame;