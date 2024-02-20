import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const key = process.env.REACT_APP_IMDB_API_KEY

const Navbar = () => {
  const { user, logOut } = UserAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [result, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

   const searchMoviesTV = async (searchQuery) => {
        
        const apiKey = key;
        const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}`;

        try {
            setLoading(true);
            const response = await fetch(url);
            const data = await response.json();
            setResults(data.results);
            console.log(data.results)
        } catch (error) {
            console.error("Error fetching data from TMDB:", error);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (search) {
          searchMoviesTV(search);
        }
      }
      , 500);
      return () => clearTimeout(timeoutId);
    }
    , [search]);

    useEffect(() => {
      document.addEventListener("click", (e) => {
        if (e.target.id !== "search") {
          setResults([]);
          setSearch("");
        }
      }
      );
      return () => {
        document.removeEventListener("click", (e) => {
          if (e.target.id !== "search") {
            setResults([]);
            setSearch("");
          }
        }
        );
      };
    }
    , []);
  


  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
 

  return (
    <div className="flex justify-between items-center p-4 z-[100] w-full absolute bg-slate-900/50">
      <div className="text-white font-semibold text-lg flex gap-6">
      <Link to="/">
        <h1 className="text-[#38BDF8] text-4xl  font-bold cursor-pointer">
          CINEVERSE
        </h1>
      </Link>
      <div className=" ml-9 flex gap-5 ">
        <Link to="/">
          <button className="text-white mt-1 over:bg-[#38BDF8]">Home</button>
        </Link>
        <Link to="/movies">
          <button className="text-white mt-1">Movies</button>
        </Link>

        <Link to="/tv">
          <button className="text-white mt-1">TV Shows</button>
        </Link>
        </div>
      
        <div className=" mt-2 max-w-lg">
        <div className=" flex w-full rounded-lg focus-within:shadow-lg overflow-hidden">
          <div className="grid place-items-center h-full w-12 text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="peer h-full w-full outline-none text-lg text-white pr-2 bg-transparent border-b-2 border-[#38BDF8] focus:border-[#38BDF8] transition-all duration-300 ease-in-out"
            type="text"
            id="search"
            autoComplete="off"
            placeholder="Search"
          />
         {
          result.length > 0 && search && !loading && (
            <div className="fixed top-14 max-h-[50vh] overflow-auto bg-slate-900 w-[40vw] z-50">
              <ul className="divide-y divide-gray-300">
                {result.map((movie) => (
                  <li key={movie.id} className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-10 h-10"
                        />
                        <div>
                          <h3 className="text-white font-semibold">{movie.title || movie.name}</h3>
                          <p className="text-gray-400">{movie.release_date || movie.first_air_date}</p>
                        </div>
                      </div>
                  </li>
                ))}
              </ul>
            </div>
          )
         }
          </div>
        </div>
      </div>
      </div>

      
      {user?.email ? (
        <div>
          <Link to="/account">
            <button className="text-white pr-4">My Watchlist</button>
          </Link>
          <button
            onClick={handleLogout}
            className="bg-[#38BDF8] px-6 py-2 rounded cursor-pointer text-white"
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <Link to="/login">
            <button className="text-white pr-4">Sign In</button>
          </Link>
          <Link to="/signup">
            <button className="bg-[#38BDF8] px-6 py-2 rounded cursor-pointer text-white">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
