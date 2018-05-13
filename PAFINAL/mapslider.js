
document.body.style.zoom="80%";

var width = 460;
var height = 1100;
var inputValue = null;
var month = ["1-2012","2-2012","3-2012","4-2012","5-2012","6-2012","7-2012","8-2012","9-2012","10-2012","11-2012","12-2012","1-2013","2-2013","3-2013","4-2013","5-2013","6-2013","7-2013","8-2013","9-2013","10-2013","11-2013","12-2013","1-2014","2-2014","3-2014","4-2014","5-2014","6-2014","7-2014","8-2014","9-2014","10-2014","11-2014","12-2014","1-2015","2-2015","3-2015","4-2015","5-2015","6-2015","7-2015","8-2015","9-2015","10-2015","11-2015","12-2015","1-2016","2-2016","3-2016","4-2016","5-2016","6-2016","7-2016","8-2016","9-2016","10-2016","11-2016","12-2016"];


  var age_distr = [ 0, -10.4, -20.8, -26.0, -16.4]

  var sex_distr = [ 0, -5.6, -12.0, -19.1, -18.1]


// This variable defines the SVG
var svg = d3.select( "body" )
    .append("svg")
    .attr("position", "absolute")
    .attr("left", 328)
    .attr("top", 225)
    .attr("y", 156)
    .attr( "width", width )
    .attr( "height", height );
    //.style("border", "1px solid red");


var g = svg.append( "g" );

// This variable defines Germany map and size
var albersProjection = d3.geo.albers()
.center([9.9, 48.9])
.rotate([0, 0])
.scale(900 * 4)
.translate([width / 2, height / 2]);

var geoPath = d3.geo.path()
    .projection( albersProjection )
    .pointRadius(function(d) { return 4 + (d.properties.FATALITIES + d.properties.INJURED / 2); });


g.selectAll( "path" )
    .data( germany_json.features )
    .enter()
    .append( "path" )
    .attr( "fill", "black")
    .attr( "d", geoPath )
    .attr( "opacity", function (d){

        var state_migrations = [12.9,	15.3,	5,	3.1,	0.9,	2.6,	7.3,	2.1,	9.4,	21.2,	4.8,	1.2,	2.9,	5.1,	3.4,	2.8]
        id = d.properties.ID_1 -1;
        density = String((state_migrations[id]/30));
        //console.log(density);
        return density;

     })
     .attr( "stroke-width", "5")
     .attr( "stroke-opacity", "1");


//germany_json.features[0].
//germany_json.features[0].properties.NAME_1 = "Pakistan";
//germany_json.features[0].setStyle()
//console.log(germany_json.features[0].properties.NAME_1);

  var attacks = svg.append( "g" );

  attacks.selectAll( "path" )
      .data( attacks_json.features )
      .enter()
      .append( "path" )
      .attr("fill", "white")
      .attr("opacity", 0.3)
      .attr( "stroke", "grey" )
      .attr( "d", geoPath )
      .attr( "class", "incident")
      .on("mouseover", function(d){
        date = d.properties.DATE;
        city = d.properties.CITY;
        suspect = d.properties.PERPETRATOR;
        killed = d.properties.FATALITIES;
        injured = d.properties.INJURED;
        coord = d.geometry.coordinates;

        d3.select("h2").text(date + " | " + city + " | " + suspect + "| Fatalities: " +  killed + " | Injured: " + injured);
        //d3.select("h3").text("Fatalities:" +  killed + " | Injured: " + injured)
        d3.select(this).attr("class","incident hover");
      })
      .on("mouseout", function(d){
        d3.select("h2").text("(hover over an attack to find out more)");
        //d3.select("h3").text(" ");
        d3.select(this).attr("class","incident");
      });


// Trying to implement updating text

// when the input range changes update the value
d3.select("#timeslide").on("input", function() {
    update(+this.value);
    });

// update the fill of each SVG of class "incident" with value
function update(value) {


    //if (value==3){document.write("value is 3!")}
    document.getElementById("range").innerHTML=month[value];
    inputValue = month[value];
    console.log("Timeslide value: ", value);
    //d3.select("#hider_svg").attr(opacity=1.0);
    //console.log("Shrinking width: ", 650+value)
    document.getElementById('hider_svg').style.width= 600 - (value*10.0);

    remainder = value % 12;
    index = value / 12;
    //console.log(remainder, value, index);

    if ( remainder == 0){
      //console.log("CHANGING SIZE. SUBTRACTING: ", sex_distr[index], "at index: ", index);
      document.getElementById('female').style.height = 121.1 + sex_distr[index];
      document.getElementById('old').style.height = 134 + age_distr[index];

      //console.log("FINAL HEIGHT: ", document.getElementById('female').style.height);
    }


    d3.csv("./datasets/immigration3.csv", function(data) {
          total = data[value]["Total"];
          african = data[value]["West_Africa"];
          mideast = data[value]["Arab_World"];
          southAsian = data[value]["South_Asia"];
          southEuropean = data[value]["Southern_Europe"];

          //console.log("Mideast: ", mideast );
          //console.log(data[0]);
      });

    document.getElementById("pointer_value1").innerHTML = "Total: " + String(total);
    document.getElementById("pointer_value2").innerHTML = "Sub Saharan: " + String(african);
    document.getElementById("pointer_value3").innerHTML = "Middle Eastern: " + String(mideast);
    document.getElementById("pointer_value4").innerHTML = "South Asia " + String(southAsian);
    document.getElementById("pointer_value5").innerHTML = "Southern Europe: " + String(southEuropean);


    //document.getElementById("pointer_value") = "stroke: blue";

    //d3.selectAll("#immigration")
    //  .text(total);

    d3.selectAll(".incident")
        .attr("fill", dateMatch)
        .attr("opacity", opacityOn);
}

function dateMatch(data, value) {
  var d = new Date(data.properties.DATE);
  //console.log("d variable: ", d);
  var year = parseInt(20 + '' + (d.getYear()).toString().substring(1,3));
  var tempMonth = d.getMonth() + 1;
  var m = tempMonth+"-"+year;

  console.log(document.getElementById("radio1").checked);

  if (m == inputValue) {
      //document.write("match!")
      this.parentElement.appendChild(this);
      //console.log(data.properties.TYPE);

      if (document.getElementById("radio1").checked){

        if (data.properties.TYPE == "Left-wing extremists") {return "blue";}
        if (data.properties.TYPE == "Right-wing extremists") {return "maroon";}
        if (data.properties.TYPE == "Muslim extremists") {return "green";}
        if (data.properties.TYPE == "Foreign national groups") {return "brown";}
        if (data.properties.TYPE == "Neo-Nazi extremists") {return "black";}

      }

      if (document.getElementById("radio2").checked){

        return "green";

      }

      if (document.getElementById("radio3").checked){

        return "red";

      }



      else{return "grey";}

  } else {
      //document.write("no match!")
      return "#999";
  };
}

function opacityOn (data, value){
  var d = new Date(data.properties.DATE);
  var year = parseInt(20 + '' + (d.getYear()).toString().substring(1,3));
  var tempMonth = d.getMonth() + 1;
  var m = tempMonth+"-"+year;

  if (m == inputValue) {
    this.parentElement.appendChild(this);
    if (document.getElementById("radio1").checked){
      return 1.0;
    }
    else if (document.getElementById("radio2").checked && (data.properties.REFUGEE == 1)) {
      return 1.0;
    }
    else if (document.getElementById("radio3").checked && (data.properties.ANTIIMIGRANT == 1)) {
      return 1.0;
    }
    else { return 0;}
    //console.log("turning on opacity...")
  }

  else {return 0.0;}
}
