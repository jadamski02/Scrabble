import React from 'react'

function SystemInfo(props) {

  return (
    <div className={props.mes.type}>
      {props.mes.message}
    </div>
  )
}

export default SystemInfo