import React, { useState } from 'react'

function Timer() {
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const limit = 300;

  return (
    <div>Timer</div>
  )
}

export default Timer