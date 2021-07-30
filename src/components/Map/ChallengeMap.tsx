/* module imports */
import DeckGL from '@deck.gl/react'
import React, { useCallback, useState } from 'react'
import ReactMapGL, { Marker, _MapContext } from 'react-map-gl'
import { PathLayer } from '@deck.gl/layers'
import { ViewState } from 'react-map-gl/src/mapbox/mapbox'

/* local imports */
import { Challenge, Track } from '../../model/ChallengeConfiguration'
import pinImg from '../../assets/red-pin.png'

/* interfaces & types */
interface PropTypes {
  tracks: Track[]
  challenge?: Challenge
}

/* helpers & constants */
// This will initialize a challenge from a couple of lines.
const defaultChallenge: Challenge = {
  start: {
    firstPoint: {
      lon: -122.4,
      lat: 37.7,
    },
    secondPoint: {
      lon: -122.4,
      lat: 37.8,
    },
  },
  finish: {
    firstPoint: {
      lon: -122.5,
      lat: 37.7,
    },
    secondPoint: {
      lon: -122.5,
      lat: 37.8,
    },
  },
}

// This constant defaults to showing San Francisco.
const defaultView: ViewState = {
  latitude: 37.78,
  longitude: -122.45,
  zoom: 12,
}

/* react component */
const ChallengeMap = ({ tracks, challenge = defaultChallenge }: PropTypes) => {
  // Map's viewstate
  const [viewState, setViewState] = useState<ViewState>(defaultView)
  const handleViewStateChange = useCallback(
    (args: { viewState: ViewState }) => {
      setViewState(args.viewState)
    },
    [],
  )

  const layers = [
    new PathLayer({
      id: 'path-layer',
      data: tracks,
      pickable: true,
      widthMinPixels: 2,
      getPath: (d) => d.path.map((point) => [point.lon, point.lat]),
      getColor: (d) => d.color,
      getWidth: () => 5,
    }),
  ]

  const [position, setPosition] = useState<{ lat: number; lon: number }>({
    ...challenge.start.firstPoint,
  })

  const onDrag = useCallback((event: any) => {
    console.log(event)
    setPosition({
      lat: event.lngLat[1],
      lon: event.lngLat[0],
    })
  }, [])

  return (
    <DeckGL
      controller
      layers={layers}
      viewState={viewState}
      onViewStateChange={handleViewStateChange}
      ContextProvider={_MapContext.Provider}
    >
      <ReactMapGL
        {...viewState}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxApiAccessToken="pk.eyJ1IjoiYXN5bmNyYWNpbmciLCJhIjoiY2tybWNrcjZzMWQyNDJwcDh6cHlva2Q1eSJ9._Nazy17wuseOnfKuo3_zCA"
        width="100%"
        height="100%"
      />
      <Marker
        longitude={position.lon}
        latitude={position.lat}
        offsetTop={-50}
        offsetLeft={-25}
        draggable
        onDrag={onDrag}
      >
        <img
          alt="pin"
          src={pinImg}
          style={{ width: '50px', height: '50px', pointerEvents: 'none' }}
        />
      </Marker>
    </DeckGL>
  )
}

export { ChallengeMap }
