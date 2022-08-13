import { useState, useEffect, useCallback } from "react";

import produce from "immer";

const boxWidth = 20;
const boxHeight = 20;

const incBy = 5;

function Bee({initialX, initialY, onPositionChanged}) {

    const [position, setPosition] = useState({x: initialX, y: initialY});

    const [angle, setAngle] = useState((ag) => {
        const a = Math.random()*360;
        const radian = (Math.PI * a) / 180;
        return radian;
    } );

    const runSimulation = useCallback(() => {

        setPosition((pos) => produce(pos, posCopy => {
            const xinc = incBy * Math.sin(angle);
            const yinc = incBy * Math.cos(angle);

            //Y = mx + b

            const newx = pos.x + xinc;
            const newy = pos.y + yinc;

            if (newx>3 && newx<1300 && newy>3 && newy<848){
                posCopy.x = newx;
                posCopy.y = newy;
    
                onPositionChanged(newx, newy);
            }else{
                const a = Math.random()*360;
                const radian = (Math.PI * a) / 180;
                setAngle(radian);


                // const xinc = incBy * Math.sin(radian);
                // const yinc = incBy * Math.cos(radian);

                // posCopy.x = pos.x + xinc;
                // posCopy.y = pos.y + yinc;
    
                // onPositionChanged(pos.x + xinc, pos.y + yinc);
            }

        }));


        setTimeout(runSimulation, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        runSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return (
        <div style={{width: boxWidth, height: boxHeight, top: position.y, left: position.x}} className="bg-slate-600 absolute rounded-full">
        </div>
    );
}

export default Bee;