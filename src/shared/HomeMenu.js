import { Link } from "react-router-dom";

const pageLinks = [
    {to: '/gameoflife', title: "Game of Life"},
    {to: '/beeclust', title: "BEECLUST"},
    {to: '/tetris', title: "Tetris Game"},
    {to: '/2048', title: "2048"}
];

function HomeMenu() {
    return (
        <div className="w-full min-h-screen p-44 grid grid-cols-4 gap-6">
            {pageLinks.map((link) => {
                return (
                    <Link to={link.to} 
                    className="col-span-1 flex justify-center items-center bg-slate-200 rounded-xl text-2xl hover:-translate-y-4 hover:z-10 hover:bg-slate-300 duration-200"> 
                    {link.title} </Link>
                );
            })}
        </div>
    );
}

export default HomeMenu;