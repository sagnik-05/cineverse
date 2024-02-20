import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { UserAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';

const TVShowList = () => {
    const [tvShows, setTVShows] = useState([]);
    const [page, setPage] = useState(1);
    const { user } = UserAuth();
    const [likes, setLikes] = useState({});

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=88f67c5b1985c7abf2a685c57dd2e29d&language=en-US&page=${page}`)
            .then(response => response.json())
            .then(data => setTVShows(data.results));
    }, [page]);

    const nextPage = () => {
        setPage(page + 1);
    };

    const prevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const truncateString = (str, num) => {
        if (str?.length > num) {
            return str.slice(0, num) + '...';
        } else {
            return str;
        }
    };

    const saveShow = async (item) => {
        if (user?.email) {
            setLikes({ ...likes, [item.id]: !likes[item.id] });
            const showID = doc(db, 'users', `${user?.email}`);
            await updateDoc(showID, {
                savedShows: arrayUnion({
                    id: item.id,
                    title: item.name,
                    img: item.backdrop_path,
                }),
            });
        } else {
            alert('Please log in to save a show');
        }
    };

    return (
        <div>
            <div className="px-[100px] pt-[100px] grid grid-cols-4 gap-4">
                {tvShows.map(show => (
                    <div key={show.id} className="rounded-lg bg-[#1E293B] overflow-hidden mb-5">
                        <img className="h-[350px] w-full rounded-lg" src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`} alt={show.name} />
                        <div className="mb-3 py-2 px-3">
                            <div className=' flex justify-between'>
                            <div className="font-bold text-xl mb-2 text-white mt-3">{show.name}</div>
                            <button onClick={() => saveShow(show)}>
                                {likes[show.id] ? (
                                    <FaHeart className=" text-red-800" />
                                ) : (
                                    <FaRegHeart className=" text-red-600" />
                                )}
                            </button>
                            </div>
                            <p className="text-gray-400 text-base">{truncateString(show?.overview, 100)}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="pagination flex justify-center space-x-4 mt-4 mb-2">
                <button onClick={prevPage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Previous
                </button>
                <button onClick={nextPage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Next
                </button>
            </div>
        </div>
    );
};

export default TVShowList;