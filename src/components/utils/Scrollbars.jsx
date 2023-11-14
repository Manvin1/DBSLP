import React from 'react'

import ReactScrollbars from 'react-custom-scrollbars-2'

/**
 * Componente que cria Scrollbars para seus herdeiros.
 */
function Scrollbars({children, xOffset = '0px'}) {

  let style = {
    width: `calc(100% + ${xOffset})`
  };

  return (
    <ReactScrollbars
      style={style}
      autoHide
      >
      {children}
    </ReactScrollbars>
  )
}

export default Scrollbars
