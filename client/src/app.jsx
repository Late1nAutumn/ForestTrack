import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

const WA_URL =
  "http://ec2-54-67-78-242.us-west-1.compute.amazonaws.com:3000/wa/FSpy_update";

const getOffset = (el) => {
  var _x = 0;
  var _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
};
const translateCoord = (lati, longi) => {
  const end = {
    N: 36.29167,
    E: -115.25621,
    y: 6.02957906712173, // %
    x: 82.74161735700197, // %
  };
  const start = {
    N: 34.05907,
    E: -118.02924,
    y: 86.12059158134243, // %
    x: 12.32741617357002, // %
  };
  var x = ((longi - end.E) / (start.E - end.E)) * (start.x - end.x) + end.x;
  var y = ((lati - end.N) / (start.N - end.N)) * (start.y - end.y) + end.y;
  return { x, y };
};
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0, time: "", latitude: 0, longitude: 0 };
  }
  componentDidMount() {
    var update = () =>
      axios.get(WA_URL).then(
        ({ data }) => {
          var tar = document.getElementById("map");

          var { time, latitude, longitude } = data.data;
          var { x, y } = translateCoord(latitude, longitude);

          x = (x * tar.offsetWidth) / 100 + getOffset(tar).left;
          y = (((y * tar.offsetWidth) / 1014) * 879) / 100 + 40;
          this.setState({
            x,
            y,
            time,
            latitude,
            longitude,
          });
        },
        (err) => console.error(err)
      );
    update();
    setInterval(update, 5000);
  }
  render() {
    return (
      <div id="content">
        <div id="title">Where is Forest?</div>
        <div id="mapContainer">
          <img id="map" src="./map.png" />
        </div>
        <svg
          id="pin"
          viewBox="0 0 100 200"
          fill="crimson"
          style={{ top: this.state.y + "px", left: this.state.x + "px" }}
        >
          <circle cx="50" cy="50" r="50" />
          <polygon points="0,50 100,50 50,200" />
        </svg>
        {/* <div id="test"/> */}
        <a
          id="button"
          target="_blank"
          href={`https://www.google.com/maps/place/${this.state.latitude},${this.state.longitude}`}
        >
          Check Google Map
        </a>
        <div id="date">Last update: {this.state.time}</div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
