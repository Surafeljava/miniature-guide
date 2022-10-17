import React, {useState, useEffect, useCallback} from 'react';
import { useWindowDimensions, useMousePosition } from "../shared";

const ITEM_SIZE = 20;

function FollowTheLeader() {
    const {width, height} = useWindowDimensions();
    // const [w,h] = [width/2, height/2];
    const { x, y } = useMousePosition();

    const [nodes, setNodes] = useState([]);
    const [leader, setLeader] = useState([0,0]);

    useCallback(() => {
        // let newNodes = [];
        // for(const nd of nodes){

        // }
    }, []);

    useEffect(() => {
        let nd = [];
        for(let i=0; i<6; i++){
            const x = Math.floor(Math.random() * ((width-ITEM_SIZE) - 0 + 1) + 0);
            const y = Math.floor(Math.random() * ((height-ITEM_SIZE) - 0 + 1) + 0);
            nd.push([x,y]);
        }
        setNodes(nd);

        const x_leader = Math.floor(Math.random() * ((width-ITEM_SIZE) - 0 + 1) + 0);
        const y_leader = Math.floor(Math.random() * ((height-ITEM_SIZE) - 0 + 1) + 0);
        setLeader([x_leader,y_leader]);

    },[height, width]);

    return (
        <div style={{width:width, height:height, background:'#eee'}} className="relative" onClick={() => setLeader([x,y])}>
            
            <div className='absolute bg-yellow-500' style={{top:leader[1], left:leader[0], width:ITEM_SIZE, height:ITEM_SIZE}}></div>

            {nodes.map(([x,y], idx) => {
                return (
                    <div key={idx} className='absolute bg-red-500' style={{top:y, left:x, width:ITEM_SIZE, height:ITEM_SIZE}}></div>
                );
            })}

            <div className='flex flex-row justify-center mt-2'>
                <div className='flex flex-col gap-2 px-6 rounded-lg'>
                    <div className='flex gap-2'> Leader Position x:{leader[0]}  -  y:{leader[1]}</div>
                    {/* <div> Current Mouse x:{x}  -  y:{y} </div> */}
                </div>
            </div>
        </div>
    );
}

export default FollowTheLeader;