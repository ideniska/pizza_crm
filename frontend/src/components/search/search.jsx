import React from 'react'
import './search.css';

function Search() {

    return (
      <div className='search-container'>
        <div className='input-container'>
          <p id="search-title">Поиск</p>
          <input type="text" name="" id="search-input" />
        </div>
        <div className='period-container'>
            <button>За месяц</button>
            <button>За неделю</button>
            <button>Вчера</button>
            <button>Сегодня</button>
        </div>
      </div>

    )
  }

export default Search;
