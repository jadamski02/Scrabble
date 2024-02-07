import React from 'react';
import { WrapperData } from '../Wrapper';

function UserRanking() {

    const { userRanking } = WrapperData();

  return (
    <div className='tableDiv'>
      <h2>Ranking Użytkowników</h2>
      <table>
        <thead>
          <tr>
            <th>Miejsce</th>
            <th>Login</th>
            <th>Łączna liczba punktów</th>
            <th>Rozegrane gry</th>
          </tr>
        </thead>
        <tbody>
          {userRanking.map((entry, index) => (
            <tr key={index}>
              <td>{entry.ranking}</td>
              <td>{entry.login}</td>
              <td>{entry.summed_total_scores}</td>
              <td>{entry.all_games}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserRanking;
