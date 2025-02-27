import React from 'react'

const TrendingMoviesPile = ({ trending, index }) => {

  const baseImageUrl = 'https://image.tmdb.org/t/p/w500'
    
    // console.log(trending)
  return (
    <div className='inline-block min-w-[250px] '>
      <div className='flex items-center'>
        <p>{index + 1}</p>
        <img className='w-[127px] h-[163px]'  src={`${baseImageUrl}${trending.poster_path}`}   alt="" />
      </div>
    </div>
  )
}

export default TrendingMoviesPile