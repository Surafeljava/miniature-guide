import { useCallback } from "react";
import { useRef, useState } from "react";
import produce from "immer";

const mainBoxPadding = 80;
const mainBoxWidth = 1200;
const mainBoxHeight = 800;

const targetSize = 300;
const targetPadding = 300;

const beeSpeed = 5;
// const numRobots = 50;

function Beeclust() {

    const [running, setRunning] = useState(false);

    const [numRobots, setNumRobots] = useState(100);
    const [beeSize, setBeeSize] = useState(10);

    const runningRef = useRef(running);
    runningRef.current = running;

    const [robots, setRobots] = useState([]);
    // const [robotsPos, setRobotsPos] = useState([]);

    const runCollitionDetection = useCallback(() => {
        if(!runningRef.current){
            return;
        }

        setRobots((rob) => produce(rob, robCopy => {
            for(let i=0; i<numRobots; i++){
                if(robCopy[i].stop > 0){
                    robCopy[i].stop = robCopy[i].stop - 1;
                }else{
                    const r = rob[i];
                    const an = r.angle;
                    const xinc = beeSpeed * Math.sin(an);
                    const yinc = beeSpeed * Math.cos(an);

                    const newx = r.x + xinc;
                    const newy = r.y + yinc;

                    if (newx>(mainBoxPadding+3) && newx<(mainBoxWidth - beeSize) && newy>(mainBoxPadding+3) && newy<(mainBoxHeight - beeSize)){
                        robCopy[i].x = newx;
                        robCopy[i].y = newy;
                    }else{
                        // onCollision();
                        const radian = (Math.PI * Math.random()*360) / 180;
                        robCopy[i].angle = radian;
                        // setAngle(radian);
                    }
                }

                if(rob[i].stop === 0){
                    for(let k=0; k<numRobots; k++){
                        if(k!==i){
                            //Check if collide with other robot here
                            const {x1, x2} = {x1:rob[k].x, x2:rob[i].x}
                            const {y1, y2} = {y1:rob[k].y, y2:rob[i].y}

                            if(((x2>x1 && x2<x1+beeSize) || (x1>x2 && x1<x2+beeSize)) && ((y2>y1 && y2<y1+beeSize) || (y1>y2 && y1<y2+beeSize))){
                                //Check if they collide in the dark area
                                if(x2>targetPadding && x2<(targetPadding+targetSize) && y2>targetPadding && y2<(targetPadding+targetSize) ){
                                    robCopy[i].stop = 100;
                                }else{
                                    robCopy[i].stop = 10;
                                }

                            }
                        }
                    }
                }

            }
        }));

        setTimeout(runCollitionDetection, 25);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="relative w-full min-h-screen">
            {robots.map((robot, idx) => 
                //The Bee
                <div style={{width: beeSize, height: beeSize, top: robot.y, left: robot.x}} className="bg-slate-600 absolute rounded-xl z-30">
                </div>
            )}
            <div className="fixed bottom-10 w-full flex justify-start pl-20 gap-4">

                <div className="flex flex-col">
                    <div className="text-black">
                        Bee Size
                    </div>
                    <input type="number" className="px-4 py-2 rounded-lg text-black bg-slate-200" value={beeSize} onChange={(e) => {
                        setBeeSize(parseInt(e.target.value));
                    }} />
                </div>

                <div className="flex flex-col">
                    <div className="text-black">
                        Number of Bees
                    </div>
                    <input type="number" className="px-4 py-2 rounded-lg text-black bg-slate-200" value={numRobots} onChange={(e) => {
                        setNumRobots(e.target.value);
                    }} />
                </div>

                <button onClick={() => {
                    setRunning(!running);

                    if(!running){
                        runningRef.current = true;
                        // Add robots to random position here
                        const bees = [];
                        for(let i=0; i<numRobots; i++){
                            const newX = Math.random()*(mainBoxWidth-mainBoxPadding-10) + mainBoxPadding;
                            const newY = Math.random()*(mainBoxHeight-mainBoxPadding-10) + mainBoxPadding;
                            const radian = (Math.PI * Math.random()*360) / 180;
                            bees.push({
                                x: newX,
                                y: newY,
                                angle: radian,
                                stop: 0
                            });
                        }
                        setRobots(bees);
                        // setRobotsPos(bees);
                        runCollitionDetection();
                    }else{
                        setRobots([]);
                        setRunning(false);
                    }
                }} className="px-4 py-2 rounded-lg bg-red-200">
                    {running ?  "Stop Simulation" : robots.length>0 ? "Restart" :  "Run Simulation"}
                </button>
                
                {(running || robots.length>0) && (
                    <button 
                    onClick={() => {
                        setRunning(!running);
                        if(!running){
                            runningRef.current = true;
                            runCollitionDetection();
                        }
                    }}
                    className="px-4 py-2 rounded-lg bg-slate-200">
                        {running ? "Pause" : "Resume"}
                    </button>
                )}

                <div className="fixed z-10 bg-red-200 rounded-full flex justify-center items-center" 
                style={{top:targetPadding, left:targetPadding, width: targetSize, height: targetSize}}>
                    Optimal Place
                </div>

                <div className="fixed z-0 bg-red-100 border-2 border-slate-700" 
                style={{width: (mainBoxWidth-mainBoxPadding), height: (mainBoxHeight-mainBoxPadding), top:mainBoxPadding, left:mainBoxPadding}}></div>
            </div>
        </div>
    );
}

export default Beeclust;