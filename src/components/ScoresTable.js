import React from 'react';
import { WrapperData } from '../Wrapper';

function ScoresTable () {

    const { scores } = WrapperData();

  return (
    <div className='tableDiv'>
    <h2>Tabela Wyników</h2>
    <table>
      <thead>
        <tr>
          <th>Login</th>
          <th>Wynik</th>
          <th>Data gry</th>
        </tr>
      </thead>
      <tbody>
        {scores.map((score, index) => (
          <tr key={index}>
            <td>{score.login}</td>
            <td>{score.total_score}</td>
            <td>{new Date(score.date_played).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default ScoresTable;
