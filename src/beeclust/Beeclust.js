import { useCallback } from "react";
import { useRef, useState } from "react";
import produce from "immer";

import Bee from "./Bee";

// const boxWidth = 20;
// const boxHeight = 20;

function Beeclust() {

    const [running, setRunning] = useState(false);
    const runningRef = useRef(running);
    runningRef.current = running;

    const [robots, setRobots] = useState([]);
    const [robotsPos, setRobotsPos] = useState([]);

    const runCollitionDetection = useCallback(() => {
        if(!runningRef.current){
            return;
        }

        // console.log(`x-pos: ${robotsPos[0].x} & y-pos: ${robotsPos[0].y}`);

        setTimeout(runCollitionDetection, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="relative w-full min-h-screen">
            {robots.map((robot, idx) => 
            <Bee initialX={robot.x} initialY={robot.y} onPositionChanged={(nx,ny) => {
                setRobotsPos((r) => {
                    return produce(r, rCopy => {
                        rCopy[idx].x = nx;
                        rCopy[idx].y = ny;
                    });      
                });
            }}/>)}
            <div className="absolute bottom-10 w-full flex justify-center gap-4">
                <button onClick={() => {
                    setRunning(!running);

                    if(!running){
                        runningRef.current = true;
                        // Add robots to random position here
                        const bees = [];
                        for(let i=0; i<4; i++){
                            const newX = Math.random()*500;
                            const newY = Math.random()*500;
                            bees.push({
                                x: newX,
                                y: newY
                            });
                        }
                        setRobots(bees);
                        setRobotsPos(bees);
                        runCollitionDetection();
                    }
                }} className="px-4 py-2 rounded-lg bg-slate-200">
                    Run Simulation
                </button>
                <button 
                onClick={() => {
                    setRobots([]);
                    setRunning(false);
                }}
                className="px-4 py-2 rounded-lg bg-slate-200">
                    Stop
                </button>


                <div className="fixed top-0 left-0 w-2 bg-slate-500" style={{height: 850}}></div>
                <div className="fixed top-0 w-2 bg-slate-500" style={{height: 850, left: 1300}}></div>

                <div className="fixed left-0 h-2 bg-slate-500" style={{width: 1308, top: 850}}></div>
                <div className="fixed left-0 top-0 h-2 bg-slate-500" style={{width: 1308}}></div>
            </div>
        </div>
    );
}

export default Beeclust;