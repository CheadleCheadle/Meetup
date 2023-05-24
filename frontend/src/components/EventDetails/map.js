import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

class MapContainer extends Component {
  render() {
    const { lat, lng} = this.props;
    console.log("lats", lat, lng)
    return (

      <Map
        google={this.props.google}
        zoom={14}
        initialCenter={{
          lat,
          lng
        }}
      />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCuR8c72mbLTAxw7jcDrnbCakHUZ6kNT3k'
})(MapContainer);
