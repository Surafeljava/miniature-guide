import { Link } from "react-router-dom";

import { FiGithub, FiLink2 } from "react-icons/fi";

const pageLinks = [
    {to: '/gameoflife', title: "Game of Life", git: 'https://github.com/Surafeljava/miniature-guide/tree/main/src/game-of-life', desc: 'https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life'},
    {to: '/beeclust', title: "Beeclust Algorithm", git: 'https://github.com/Surafeljava/miniature-guide/tree/main/src/beeclust', desc: 'https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life'},
    {to: '/snakegame', title: "Snake Game", git: 'https://github.com/Surafeljava/miniature-guide/tree/main/src/snake-game', desc: 'https://en.wikipedia.org/wiki/Snake_(video_game_genre)'},
    {to: '/2048', title: "2048 Game", git: 'https://github.com/Surafeljava/miniature-guide/tree/main/src/2048', desc: 'https://en.wikipedia.org/wiki/2048_(video_game)'},
    {to: '/tetris', title: "Tetris Game", git: 'https://github.com/Surafeljava/miniature-guide/tree/main/src/tetris-game', desc: 'https://github.com/Surafeljava/miniature-guide'}
];

function HomeMenu() {
    return (
        <div className="relative w-full min-h-screen">
            <div className="w-full min-h-screen absolute z-0 flex items-end">
                <svg viewBox="0 0 1440 320">
                    <path className="fill-red-100" d="M0,160L14.1,181.3C28.2,203,56,245,85,234.7C112.9,224,141,160,169,133.3C197.6,107,226,117,254,144C282.4,171,311,213,339,240C367.1,267,395,277,424,288C451.8,299,480,309,508,288C536.5,267,565,213,593,192C621.2,171,649,181,678,202.7C705.9,224,734,256,762,229.3C790.6,203,819,117,847,117.3C875.3,117,904,203,932,250.7C960,299,988,309,1016,272C1044.7,235,1073,149,1101,122.7C1129.4,96,1158,128,1186,122.7C1214.1,117,1242,75,1271,85.3C1298.8,96,1327,160,1355,165.3C1383.5,171,1412,117,1426,90.7L1440,64L1440,320L1425.9,320C1411.8,320,1384,320,1355,320C1327.1,320,1299,320,1271,320C1242.4,320,1214,320,1186,320C1157.6,320,1129,320,1101,320C1072.9,320,1045,320,1016,320C988.2,320,960,320,932,320C903.5,320,875,320,847,320C818.8,320,791,320,762,320C734.1,320,706,320,678,320C649.4,320,621,320,593,320C564.7,320,536,320,508,320C480,320,452,320,424,320C395.3,320,367,320,339,320C310.6,320,282,320,254,320C225.9,320,198,320,169,320C141.2,320,113,320,85,320C56.5,320,28,320,14,320L0,320Z"></path>
                </svg>
            </div>
            <div className="absolute w-full min-h-screen p-40 grid grid-cols-4 gap-6">
                {pageLinks.map((link) => {
                    return (
                        <div className="col-span-1 pt-4 flex flex-col items-start bg-transparent hover:z-10  duration-200 rounded-xl">
                            <Link to={link.to} 
                            className="group text-2xl font-Semibold grow flex flex-col gap-3 w-full justify-center items-center bg-slate-100 hover:bg-red-100 rounded-t-xl translate-y-0 hover:-translate-y-2 duration-200"> 
                            {link.title} 
                            <div className="h-0.5 bg-red-400 w-0 group-hover:w-1/3 duration-300"></div>
                            </Link>
                            <div className="flex justify-center gap-4 bg-red-200 w-full pb-4 pt-4 rounded-b-xl">
                                <a href={link.git} className="group px-4"><FiGithub className="text-2xl group-hover:text-red-400 group-hover:-translate-y-1 duration-200"/></a>
                                <a href={link.desc} className="group px-4"><FiLink2 className="text-2xl group-hover:text-red-400 group-hover:-translate-y-1 duration-200"/></a>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default HomeMenu;