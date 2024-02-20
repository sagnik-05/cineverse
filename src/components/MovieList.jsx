import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const { user } = UserAuth();
  const [likes, setLikes] = useState({});
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=88f67c5b1985c7abf2a685c57dd2e29d&language=en-US&page=${page}`
    )
      .then((response) => response.json())
      .then((data) => setMovies(data.results));
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
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  };

  const saveShow = async (item) => {
    if (user?.email) {
        setLikes({ ...likes, [item.id]: !likes[item.id] });
      setSaved(true);
      const movieID = doc(db, "users", `${user?.email}`);
      await updateDoc(movieID, {
        savedShows: arrayUnion({
          id: item.id,
          title: item.title,
          img: item.backdrop_path,
        }),
      });
    } else {
      alert("Please log in to save a movie");
    }
  };

  return (
    <div>
      <div className="px-[100px] pt-[100px] grid grid-cols-4 gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="rounded-lg bg-[#1E293B] overflow-hidden mb-5"
          >
            <img
              className="h-[350px] w-full rounded-lg"
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
            />
            <div className="mb-3 py-2 px-3">
              <div className=" flex justify-between ">
                <div className="font-bold text-xl mb-2 text-white mt-3">
                  {movie.title}
                </div>
                <button onClick={() => saveShow(movie)}>
                  {likes[movie.id]? (
                    <FaHeart className=" text-red-800" />
                  ) : (
                    <FaRegHeart className=" text-red-600" />
                  )}
                </button>
              </div>

              <p className="text-gray-400 text-base">
                {truncateString(movie?.overview, 100)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination flex justify-center space-x-4 mt-4 mb-2">
        <button
          onClick={prevPage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Previous
        </button>
        <button
          onClick={nextPage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MovieList;
