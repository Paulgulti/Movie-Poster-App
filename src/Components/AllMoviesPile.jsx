import React from 'react'
import unavailableImage from '/unavailable-img.jpg'



const AllMoviesPile = ({ movie }) => {

    const baseImageUrl = 'https://image.tmdb.org/t/p/w500'

    return (
        <div className=' p-5 bg-cyan-950 cursor-pointer rounded-2xl transform hover:scale-[1.05] transition duration-800'>
            <div className='image-cont '>
                <img className=' object-cover w-[100%] rounded-lg' src={movie.poster_path ? `${baseImageUrl}${movie.poster_path}` : unavailableImage} alt="" />
            </div>
            <p className='my-3 font-extrabold'>{movie.title ? movie.title : 'Title unavailable'}</p>
            <div className='movie-card-description flex gap-3 items-center'>
                <div className='flex gap-1'>
                    <img src="/src/assets/rating.svg" width={"12px"} alt="" loading='lazy' />
                    <p>
                        {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                    </p>
                </div>
                <p>{movie.original_language}</p>
                <p>
                    {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
                </p>
            </div>
        </div>
    )
}

export default AllMoviesPile
