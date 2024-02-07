import React from 'react';
import ScoresTable from './ScoresTable';
import UserRanking from './UserRanking';
import { Link } from 'react-router-dom';

function ScoresTabs () {
  return (
    <>
    <div className='highScoreLinkContainer'>
    <Link to={'/'} className='highScoreLink'>
        Powrót do strony głównej
      </Link>
    </div>

    <div className="tables-container">
        <ScoresTable />
        <UserRanking />
    </div>
    </>

  );
};

export default ScoresTabs