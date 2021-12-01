// Based on https://makeshiftinsights.com/blog/heatmaps-leaflet-heatmap-js/

const url = new URL(document.location);
var src = url.searchParams.get('src');
var freq = url.searchParams.get('freq');

console.log(`src = <${src}>`);
console.log(`freq = <${freq}>`);

if(src==null){
  var userId = Math.floor(Math.random()*6) + 1;
  src= "/u/"+userId+".json";
}
  

if(freq==null)
  freq = 10;

freq = freq*1000;



render();
setInterval(render, freq);



function render(){

  console.log("Requesting data...");
  axios.get(src)
    .then(response => {

      console.log(`Received ${response.data.length} points`);
    
      let data = response.data;
      
      // Create the base Leaflet layer (the map itself)
      let baseLayer = L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
        }
      )
      
      // Configure and create the heatmap.js layer
      let cfg = {
        "radius": 40,
        "useLocalExtrema": true,
        "valueField": 'frequency'
      }
      
      if(data[0].lat == null)
          if(data[0].latitude != null)
            cfg.latField = "latitude";      
      
      if(data[0].lng == null)
          if(data[0].longitude != null)
            cfg.latField = "longitude";      
      
      
      let heatmapLayer = new HeatmapOverlay(cfg);

      // Determine min/max  for the heatmap.js plugin
      let min = Math.min(...data.map(data => data.value))
      let max = Math.max(...data.map(data => data.value))


      var element = document.getElementById("map");
  
      if (element)
        element.parentNode.removeChild(element);

      g = document.createElement('div');
      g.setAttribute("id", "map");
      document.body.appendChild(g);

      // Create the overall Leaflet map using the two layers we created
      let propertyHeatMap = new L.Map('map', {
        center: new L.LatLng(data[0].lat, data[0].lng),
        zoom: 14,
        layers: [baseLayer, heatmapLayer]
      })

      // Add data  to the heatmap.js layer
      heatmapLayer.setData({
        min: min,
        max: max,
        data: data
      });
    
    
    })
      .catch(error => {
      console.log(error)
    });

  }


