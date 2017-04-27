import {combineReducers} from 'redux'
import {List} from 'immutable'

// -- // -- // Actions // -- // -- //
export const PEN_DOWN = 'PEN_DOWN'
export const penDown = (x, y) => ({
  type: PEN_DOWN,
  pos: [x, y]
})

export const MOVE_TO = 'MOVE_TO'
export const moveTo = (x, y) => (dispatch, state) => dispatch({
  type: MOVE_TO,
  pos: [x, y],
  doNotSync: !state().currentStroke,  // Don't journal move events unless
                                      // we're drawing a stroke.
})

export const PEN_UP = 'PEN_UP'
export const penUp = (x, y) => ({
  type: PEN_UP,
  pos: [x, y]
})

// -- // -- // State // -- // -- //
const initial = {
  // All the strokes on the whiteboard.
  // We're using an immutable list here, which is easier
  // to work with in the reducer.
  strokes: List(),

  // The stroke we are currently drawing.
  // Null if we're not drawing, which is how we start off.
  currentStroke: null,
}

// -- // -- // Helpers // -- // -- //
// Convert an array of points into an SVG path data string
function svgPathData(points) {
  return 'M ' + points
          .map(([x, y]) => `${x},${y}`)
          .join(' L ')
}

// -- // -- // Reducer // -- // -- //
export default (state=initial, action) => {
  let points
  switch (action.type) {
  case PEN_DOWN:
    points = List().push(action.pos)
    return {...state,
      currentStroke: {
        points,
        style: {
          fill: 'none',
          stroke: '#000000',
          strokeWidth: '5px'
        },
        data: svgPathData(points)
      }
    }

  case MOVE_TO:
    if (!state.currentStroke) return state
    points = state.currentStroke.points.push(action.pos)
    return {...state,
      currentStroke: {...state.currentStroke,
        points,
        data: svgPathData(points)
      }
    }

  case PEN_UP:
    if (!state.currentStroke) return state
    return {...state,
      strokes: state.strokes.push(state.currentStroke),
      currentStroke: null
    }
  }
  return state
}
