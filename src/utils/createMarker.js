import mapboxgl from "mapbox-gl";
import Mapbox from "../components/Mapbox";
import { createContext } from "react";

export default function createMarker(n, setClickedSpati) {
  // n are the spatis and el are the divs

  //const popup = new mapboxgl.Popup({ offset: 25 }).setHTML();
  //create marker
  const el = document.createElement("div");
  el.className = "marker";
  const marker = new mapboxgl.Marker(el);

  marker
    .setLngLat([n.geometry.coordinates[0], n.geometry.coordinates[1]])
  marker.getElement().addEventListener("click", () => {
    console.log(marker.getElement().className);
    setClickedSpati(n);
    //   marker.getElement().className = "marker2 mapboxgl-marker mapboxgl-marker-anchor-center";
    var x = document.getElementsByClassName("marker2");
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].className = "marker mapboxgl-marker mapboxgl-marker-anchor-center"; // set "marker" as the class for each of those elements
    }
    // at this point all markers are back to the original state

    // now you set the class of the current clicked marker
    marker.getElement().className =
      "marker2 mapboxgl-marker mapboxgl-marker-anchor-center"; //don't use
  });

  return marker;
}
