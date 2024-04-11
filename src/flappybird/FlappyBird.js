import React, {useEffect, useState} from 'react';

import bird from '../assets/flappy/bird.png';
import pipe_image from '../assets/flappy/pipe.png';
import bg_image from '../assets/flappy/bg.png';

function FlappyBird() {

    const WINDOW_HEIGHT = window.innerHeight*0.9;
    const WINDOW_WIDTH = window.innerWidth*0.95;
    const BIRD_SIZE = 40;
    const PIPE_GAP = 200;

    const [birdPosition, setBirdPosition] = useState(WINDOW_HEIGHT/2);
    const [velocity, setVelocity] = useState(0);
    const gravity = 0.3;

    const [score, setScore] = useState(0);

    const [pipes, setPipes] = useState([]);


    const [gameOver, setGameOver] = useState(false);

    const generateRandomPipeLocations = () => {
        if(pipes.length===0 || pipes[pipes.length-1].pos === PIPE_GAP){
            setPipes((prev_pipes) => {
                // console.log(prev_pipes);
                if(prev_pipes.length===0 || prev_pipes[prev_pipes.length-1].pos === PIPE_GAP){
                    const endPos = Math.floor(Math.random() * (WINDOW_HEIGHT - 250) + 50);
                    return [...prev_pipes, {pos: -BIRD_SIZE, height: endPos}];
                } else{
                    return prev_pipes;
                }
            });
        } else if(pipes[0].pos === WINDOW_WIDTH+BIRD_SIZE){
            let all_pipes = [...pipes];
            all_pipes.shift();
            setPipes((prev) => all_pipes);
            // console.log("Here 2");
        }
        // console.log({pos: -BIRD_SIZE, height: endPos});
    }

    useEffect(() => {
        generateRandomPipeLocations();
        // console.log(pipes);
    }, [pipes])

    const checkForBirdBlockCollition = () => {
        for(let i=0; i<pipes.length; i++){
            const {pos, height} = pipes[i];
            
            const samePose = (pos>=(WINDOW_WIDTH/2-BIRD_SIZE) && pos<=((WINDOW_WIDTH/2)));
            const sameHeight = (birdPosition<=(height+50) || birdPosition>=(height+200));

            if(samePose && sameHeight){
                // console.log("Colission");
                // console.log(height+50, height+200, birdPosition);
                setGameOver(true);
            }

            if(pos === WINDOW_WIDTH/2-(BIRD_SIZE/2)){
                setScore((prev) => prev+1);
            }
        }
    }

    useEffect(() => {
        checkForBirdBlockCollition();
    }, [pipes])

    useEffect(() => {
        const interval = setInterval(() => {
            // console.log(gameOver);
            if(pipes.length>0 && !gameOver){
                setPipes((prev) => pipes.map(pipe => {
                    return {...pipe, pos: pipe.pos + 1};
                }));
            }
        }, 1000/60);

        return () => clearInterval(interval);
    }, [pipes]);

    const handleJump = () => {
        if(!gameOver){
            setVelocity(0);
            setVelocity(velocity - 6);
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
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            if(birdPosition<(WINDOW_HEIGHT-BIRD_SIZE)){
                setVelocity(velocity + gravity);
                setBirdPosition(birdPosition + velocity);
            }
        }, 1000/60);

        return () => clearInterval(interval);
    }, [velocity, birdPosition, gravity]);

    useEffect(() => {
        // console.log(birdPosition);
        if((birdPosition+50)>=WINDOW_HEIGHT){
            setGameOver((prev) => true);
        }
    }, [birdPosition])

    const restartGame = () => {
        setBirdPosition((prev) => WINDOW_HEIGHT/2);
        setVelocity((prev) => 0);
        setGameOver((prev) => !prev);
        setPipes((prev) => []);
        setScore(0)
    }

    return (
        <div className='flex flex-col justify-center items-center h-screen w-full'>
            <div className='flex flex-col justify-center items-center bg-slate-100 relative overflow-hidden' style={{height: WINDOW_HEIGHT, width: WINDOW_WIDTH}}>
                <div className='absolute opacity-50' style={{width: WINDOW_WIDTH, height: WINDOW_HEIGHT, backgroundImage: `url(${bg_image})`, backgroundSize: 'cover'}}>
                </div>
                {pipes.length>0 && pipes.map((pipe, index) => (
                    <div key={index} className='flex flex-col h-full absolute top-0' style={{width: BIRD_SIZE, right: pipe.pos}}>
                        <div style={{height:(50+pipe.height), backgroundImage: `url(${pipe_image})`}} className='border-[2px] border-white overflow-hidden rounded-b-lg border-t-0 bg-cover'>
                        </div>
                        <div className='bg-[#ffffff00]' style={{height:150}}></div>
                        <div className='flex-grow border-[2px] border-white overflow-hidden rounded-t-lg border-b-0' 
                        style={{backgroundImage: `url(${pipe_image})`}}>
                        </div>
                    </div>
                ))}
                <div className='absolute' 
                style={{top: birdPosition, width: BIRD_SIZE, height: BIRD_SIZE, left:WINDOW_WIDTH/2, rotate:`${velocity*2}deg`}}>
                    <img src={bird} alt="bird" style={{width: BIRD_SIZE, height: BIRD_SIZE}} className='resize-contain' />
                </div>


                <div className='absolute top-0 left-0 w-full z-10 flex justify-center items-center pt-5'>
                    <div className='px-4 py-2 bg-white rounded-lg flex flex-row items-center gap-1'>
                        <h2 className='font-[400] text-sm'>My score:</h2>
                        <h2 className='font-[800] text-md'>{score}</h2>
                    </div>
                </div>
                
                <div onClick={handleJump} className='absolute top-0 left-0 w-full h-full bg-[#00000000] z-50 flex justify-center items-center'>
                </div>

                {gameOver && (
                    <div className='absolute top-0 left-0 w-full h-full bg-[#00000022] z-50 flex justify-center items-center'>
                        <div className='px-10 py-6 bg-white rounded-lg flex flex-col items-center gap-3'>
                            <h2 className='font-[400] text-xl tracking-wider'>GAME OVER!</h2>
                            <button onClick={restartGame} className='px-4 py-2 bg-green-500 rounded-md'>
                                <p className='text-white'>Restart</p>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FlappyBird;