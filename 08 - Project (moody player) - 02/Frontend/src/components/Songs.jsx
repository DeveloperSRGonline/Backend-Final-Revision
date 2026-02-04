import React, { useState } from 'react'

const MoodSongs = () => {

    const [Songs,setSong] = useState([
        {
            title:"title_title",
            artist:"test_artist",
            url:"test_url"
        },{
            title:"title_title",
            artist:"test_artist",
            url:"test_url"
        },{
            title:"title_title",
            artist:"test_artist",
            url:"test_url"
        }
    ])
  return (
    <div className='mood-songs'>
        <h2>Recomended Song</h2>
            {Songs.map((song,index) => {
                <div key={index}>
                    <div key={index}>
                        <div className="title">
                            <h3>{song.title}</h3>
                            <p>{song.artist}</p>
                        </div>
                        <div className="play-pause-button">
                            <i class="ri-pause-line"></i>
                            <i class="ri-play-line"></i>
                        </div>
                    </div>
                </div>
            })}
    </div>
  )
}

export default MoodSongs