import { useEffect } from 'react';
import './App.css'
import { useState } from 'react';
import TrendingMoviesPile from './Components/TrendingMoviesPile';
import useDebounce from './Hooks/useDebounce';
import AllMoviesPile from './Components/AllMoviesPile';
import Loading from './Components/Loading';

function App() {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);


  const debounceQuery = useDebounce(searchValue, 500)


  const API_KEY = import.meta.env.VITE_API_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  };

  async function displayTrending() {

    setIsLoading(true)
    try {

      const response = await fetch(`${BASE_URL}/trending/all/day?language=en-US`, options)
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }

      const data = await response.json();

      setTrendingMovies(data.results)
      setIsLoading(false)

    } catch (error) {
      setError(error.message)
      console.log(error.message)
    }
  }


  async function fetchMovies(query = "", page = currentPage) {

    setIsLoading(true)
    try {
      const endPoint = query
        ? `${BASE_URL}/search/multi?query=${query}&page=${page}`
        : `${BASE_URL}/discover/movie?language=en-US&page=${page}&sort_by=popularity.desc`;

      const response = await fetch(endPoint, options)
      // console.log(response)

      if (!response.ok) {
        setIsLoading(false)
        throw new Error(`Response status: ${response.status}`)
      }
      const data = await response.json()
      setMovies(data.results)
      setIsLoading(false)
      setTotalPage(data.total_pages)

      if (data.results.length === 0) {
        throw new Error("Couldn't fetch file. Please Try again")
        // console.log("couldn't find data")
      }
      // console.log(data)

    } catch (error) {
      setError(error.message)
      console.error(error.message)
    }
  }

  useEffect(() => {
    displayTrending()
    // fetchMovies()
  }, [])


  useEffect(() => {

    if (searchValue.trim() !== "") {
      fetchMovies(debounceQuery)
    }
    else {
      fetchMovies()
    }

  }, [debounceQuery, currentPage])




  function handleNextPage() {
    if (isLoading) return;
    else if (currentPage < totalPage) {
      setCurrentPage(prevPage => prevPage + 1)
    }
    // fetchMovies(searchValue, currentPage + 1)
  }

  function handlePreviousPage() {
    if (isLoading) return;
    else if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1)

    }
  }



  return (
    <main className=' min-h-screen '>
      <header>
        <div className='logo my-10 mx-5 text-pink-950 font-extrabold text-4xl'>MOVIFY</div>
        <div className='w-[70%] mx-auto'>
          <div className='mx-auto '>
            <img src="./hero.jpg" className='w-full h-[300px] object-cover object-center rounded-xl md:rounded-2xl' alt="hero image" />
          </div>
          <h1 className='text-center mt-4 text-2xl lg:text-4xl font-bold'>
            Your Home <br /> to The <span className='text-pink-950 text-3xl'>Movies</span> You Love</h1>
        </div>
      </header>
      <div className='text-center'>
        <input type="text"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
            setCurrentPage(1)
            setError(false)
          }}
          placeholder='Search...'
          className='border-2 w-[220px] my-4 px-3 py-2 rounded-xl' />
      </div>
      {isLoading && <Loading />}
      <section className='trending-container px-9 py-12'>
        <h1 className='mb-3 text-pink-950 text-xl md:text-3xl'>Trending Movies</h1>
        {error ? `${error}` :
          <>
            {trendingMovies.length > 0 &&
              <div className='overflow-x-auto whitespace-nowrap no-scrollbar'>
                {trendingMovies
                  .filter((_, index) => index < 5)
                  .map((trending, index) => <TrendingMoviesPile key={trending.id} trending={trending} index={index} />)}
              </div>
            }

          </>
        }
      </section>

      <section className='px-9 py-18  '>
        <h1 className='text-pink-950 text-xl md:text-3xl'>All Movies</h1>
        <div className='page-selector flex justify-between my-3'>
          {isLoading ? <></> : <img src="./left-chevron.png" onClick={handlePreviousPage} className='cursor-pointer w-[20px] h-[20px] md:w-[30px] md:h-[30px] lg:w-[40px] lg:h-[40px]' />}
          {isLoading ? <Loading /> : <p className='text-md lg:text-2xl'>{currentPage}/{totalPage}</p> }
          {isLoading ? <></> : <img src="./right-chevron.png" onClick={handleNextPage} className='cursor-pointer w-[20px] h-[20px] md:w-[30px] md:h-[30px] lg:w-[40px] lg:h-[40px]' />}
        </div>
        {isLoading ? <Loading />
          : (<>

            {error ? `${error}` :
              <>
                {movies.length > 0 &&
                  <>
                    <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ' >
                      {movies.map(movie => <AllMoviesPile key={movie.id} movie={movie} />)}
                    </div>
                  </>
                }

              </>
            }

          </>)
        }

      </section>

    </main>
  )
}

export default App