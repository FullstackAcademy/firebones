'use strict'
import React from 'react'
import {connect} from 'react-redux'

import {penDown, moveTo, penUp} from './reducers'

// A single mark on the whiteboard.
export const Stroke = ({stroke}) => <path style={stroke.style} d={stroke.data} />

export const Canvas = ({
  // Props from state
  strokes,
  currentStroke,

  // Actions
  penDown,
  moveTo,
  penUp,

  // These event handlers map x and y appropriately,
  // which turns out to be irritating.
  onTouchStart=withLocalCoordinates(penDown),
  onTouchMove=withLocalCoordinates(moveTo),
  onTouchEnd=withLocalCoordinates(penUp),

  // Root SVG element style
  style={
    width: '100%',
    height: '100%',
    minWidth: '1440px',
    minHeight: '1080px',
  }
}) =>
  <svg
    style={style}
    onTouchStart={onTouchStart}
    onTouchMove={onTouchMove}
    onTouchEnd={onTouchEnd}
    onMouseDown={onTouchStart}
    onMouseMove={onTouchMove}
    onMouseUp={onTouchEnd}>
    {
      strokes.map((stroke, idx) => <Stroke key={idx} stroke={stroke}/>)
    }
    {currentStroke && <Stroke stroke={currentStroke}/>}
  </svg>

function closest(Type, event) {
  let e = event.target
  while (e.parentElement) {
    if (e instanceof Type) return e
    e = e.parentElement
  }
  return null
}

function withLocalCoordinates(actionCreator) {
  return evt => {
    // Get the bounding rectangle of the svg element in screen coordinates
    const rect = closest(window.SVGSVGElement, evt).getBoundingClientRect()
        , x = evt.pageX - rect.left
        , y = evt.pageY - rect.top

    // Call the action creator with the right coordinates.
    return actionCreator(x, y)
  }
}

export default connect(
  ({strokes, currentStroke}) => ({strokes, currentStroke}),
  {penDown, moveTo, penUp},
)(Canvas)
