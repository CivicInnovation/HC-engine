var styling = {'color': 'red', 'width': 10, 'lineType': 'solid', 'fillColor': '00000000'};
var style = {'color': 'yellow', 'width': 10, 'lineType': 'solid', 'fillColor': '00000080'};
var style_1 = {'color': 'green', 'width': 10, 'lineType': 'solid', 'fillColor': '00000080'};
var style_2 = {'color': 'pink', 'width': 10, 'lineType': 'solid', 'fillColor': '00000080'};
var style_3 = {'color': '#87CEEB', 'width': 10, 'lineType': 'solid', 'fillColor': '00000080'};
var style_4 = {'color': 'brown', 'width': 10, 'lineType': 'solid', 'fillColor': '00000080'};
var style_5 = {'color': '#CBC3E3', 'width': 10, 'lineType': 'solid', 'fillColor': '00000000'};
var style_6 = {'color': '#AA98A9', 'width': 10, 'lineType': 'solid', 'fillColor': '00000080'};
var style_7 = {'color': '#8B0000', 'width': 10, 'lineType': 'solid', 'fillColor': '00000080'};
var style_8 = {'color': 'pink', 'width': 10, 'lineType': 'solid', 'fillColor': '00000080'};
var style_9 = {'color': '#C0C0C0', 'width': 10, 'lineType': 'solid', 'fillColor': '00000080'};

var shp= ee.FeatureCollection('projects/ee-rhrt-hand/assets/Boundary-H');
var shp1= shp.geometry();

var drawingTools = Map.drawingTools();
var layers = drawingTools.layers();

drawingTools.setShown(true);

while (drawingTools.layers().length() > 0) {
  var layer = drawingTools.layers().get(0);
  drawingTools.layers().remove(layer);
}

var dummyGeometry =
    ui.Map.GeometryLayer({geometries: null, name: 'geometry', color: 'black',shown: false});

drawingTools.layers().set(0,dummyGeometry);

function clearGeometry() {
  var layers = drawingTools.layers();
  layers.get(0).geometries().remove(layers.get(0).geometries().get(0));
}



var symbol = {
  rectangle: '⬛',

};
function drawRectangle() {
  clearGeometry();
  drawingTools.setShape('rectangle');
  drawingTools.draw();
  
 

  
 
}


var resetButton =  ui.Button({label:'Reset Map', onClick:reset, style: {stretch: 'horizontal',
         textAlign: 'center', fontFamily:'monospace', color:'blue'
      }});

function reset(){
  
Map.clear();
  
var shp= ee.FeatureCollection(table);
shp= shp.geometry();

var drawingTools = Map.drawingTools();
var layers = drawingTools.layers();

drawingTools.setShown(true);

while (drawingTools.layers().length() > 0) {
  var layer = drawingTools.layers().get(0);
  drawingTools.layers().remove(layer);
}

var dummyGeometry =
    ui.Map.GeometryLayer({geometries: null, name: 'geometry', color: 'black',shown: false});

drawingTools.layers().set(0,dummyGeometry);

function clearGeometry() {
  var layers = drawingTools.layers();
  layers.get(0).geometries().remove(layers.get(0).geometries().get(0));
}



var symbol = {
  rectangle: '⬛',

};
function drawRectangle() {
  clearGeometry();
  drawingTools.setShape('rectangle');
  drawingTools.draw();
 

  
 
}


var resetButton = ui.Button({label:'Reset Map', onClick:reset, style: {stretch: 'horizontal',
         textAlign: 'center',fontFamily:'monospace', color:'blue'
      }});




Map.setOptions('HYBRID');

var results = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px',
    width: '270px'
  }
});

var subTextVis = {
  'margin':'0px 0px 2px 0px',
  'fontSize':'12px',
  'color':'grey',
  'fontFamily':'serif'
  };
var head = ui.Label({
        value:'HAZARD COMMUNICATION ENGINE FOR RURAL COUNTIES',
        style: {fontWeight:'bold', fontSize: '16px', margin: '10px 5px',color:'blue',fontFamily:'serif'}
      });
var text6 = ui.Label('Helping rural counties to enhance flooding and coastal disaster resilience and adaptation',subTextVis);




  results.add(ui.Panel({
    widgets:[
      head,
      ui.Label({

      value:'Select an area of interest:',
      style:{fontSize: '16px',fontFamily:'serif',color:'blue'}
      }), ui.Button({
      label: symbol.rectangle + ' AOI',
      onClick: drawRectangle(),
      style: {stretch: 'horizontal',
         textAlign: 'center',fontFamily:'monospace',fontSize: '17px', color:'blue'
      }}),
       ui.Label({

      value:'Select flood return period:',
      style:{fontSize: '16px',fontFamily:'serif',color:'blue'}
      }),
      ui.Button({
      label:  '10 year',
      onClick: hand_ten,
      style: {stretch: 'horizontal',
         textAlign: 'center',fontFamily:'monospace',fontSize: '17px',color:'blue'
      }}),
      ui.Button({
      label:  '100 year',
      onClick: hand_hd,
      style: {stretch: 'horizontal',
         textAlign: 'center',fontFamily:'monospace',fontSize: '17px',color:'blue'
      }}),
      ui.Button({
      label:  '500 year',
      onClick: hand_fhd,
      style: {stretch: 'horizontal',
         textAlign: 'center',fontFamily:'monospace',fontSize: '17px',color:'blue'
      }}),
      text6,
      resetButton
    ],
  
  }));
  


Map.add(results);
Map.centerObject(shp1, 12);
  
}





Map.setOptions('HYBRID');

var results = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px',
    width: '270px'
  }
});

var subTextVis = {
  'margin':'0px 0px 2px 0px',
  'fontSize':'12px',
  'color':'grey',
  'fontFamily':'serif'
  };
var head = ui.Label({
        value:'HAZARD COMMUNICATION ENGINE FOR RURAL COUNTIES',
        style: {fontWeight:'bold', fontSize: '16px', margin: '10px 5px', color:'blue',fontFamily:'serif'}
      });
var text6 = ui.Label('Helping rural counties to enhance flooding and coastal disaster resilience and adaptation',subTextVis);




  results.add(ui.Panel({
    widgets:[
      head,
      ui.Label({

      value:'Select an area of interest:',
      style:{fontSize: '16px',color:'blue',fontFamily:'serif'}
      }), ui.Button({
      label: symbol.rectangle + ' AOI',
      onClick: drawRectangle(),
      style: {stretch: 'horizontal',
         textAlign: 'center',
         fontFamily:'monospace',fontSize: '17px',color:'blue'
      }}),
       ui.Label({

      value:'Select flood return period:',
      style:{fontSize: '16px',color:'blue',fontFamily:'serif'}
      }),
      ui.Button({
      label:  '10 year',
      onClick: hand_ten,
      style: {stretch: 'horizontal',
         textAlign: 'center',fontFamily:'monospace',fontSize: '17px' , color:'blue'
      }}),
      ui.Button({
      label:  '100 year',
      onClick: hand_hd,
      style: {stretch: 'horizontal',
         textAlign: 'center',fontFamily:'monospace',fontSize: '17px', color:'blue'
      }}),
      ui.Button({
      label:  '500 year',
      onClick: hand_fhd,
      style: {stretch: 'horizontal',
         textAlign: 'center',fontFamily:'monospace',fontSize: '17px',color:'blue',
      }}),
      text6,
      resetButton
    ],
  
  }));
  

  


Map.add(results);
Map.centerObject(shp1, 12);




function hand_ten(){ 
  
 //drawingTools.stop();
 
  var aoi = drawingTools.layers().get(0).getEeObject();
  
  clearGeometry();

  // Set the drawing mode back to null; turns drawing off.
  drawingTools.setShape(null);

  var HAND= ee.Image("users/rhrt/Depth_5m");

  var reclassify = HAND.updateMask(HAND.gte(0)).clip(aoi);

 
  //var HAND_LAYER = ui.Map.Layer(reclassify.updateMask(reclassify.eq(1)),{min:0,max: 1,palette:['white','blue']});
  
var shp = ee.FeatureCollection("projects/ee-rhrt-hand/assets/Aggregate_Data-csv")
//var agg = shp.geometry()

var dbb = ee.FeatureCollection("projects/ee-rhrt-hand/assets/Dbb")
//var agg_dbb = dbb.geometry()

var ecbb = ee.FeatureCollection("projects/ee-rhrt-hand/assets/Ecbb")
//var agg_ecbb = ecbb.geometry()



//var swater = ee.Image('users/rhrt/Depth_5m').select('b1');
var swater = ee.Image(reclassify).select('b1');
var swater_mask = swater.gte(0).updateMask(swater.gte(0));
var connections = swater_mask.connectedPixelCount();
var flooded = swater_mask.updateMask(connections.gt(0));


var flood_pixelarea = swater_mask
  .multiply(ee.Image.pixelArea());

var flood_stats = flood_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(),              
  geometry: swater.geometry(),
  //scale: 10, // native resolution 
  //maxPixels: 1e9,
  bestEffort: true
  });

var flood_area_ha = flood_stats
  .getNumber('b1')
  .divide(10000)
  .round(); 

//LandUse and CropLand
var LC = ee.Image('users/rhrt/Farm_Land').select('b1').clip(swater.geometry());


/*var cropmask = LC
  .eq(12)
  .or(LC.eq(14))
var cropland = LC
  .updateMask(cropmask)*/

var crop_projection = LC.select('b1').projection();
//print('projection', crop_projection);
var flooded_res = flooded
    .reproject({
    crs: crop_projection
  });
  
var crop_land = LC.updateMask(LC);

var cropland_affected = (flooded_res)
  .updateMask(LC);

var crop_pixelarea = cropland_affected
  .multiply(ee.Image.pixelArea());
//print('crop_pixelarea', crop_pixelarea)
  
var crop_stats = crop_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(), //sum all pixels with area information                
  geometry: swater.geometry(),
  scale: 500,
  maxPixels: 1e9
});
//print('crop_stats', crop_stats);

var crop_area_ha = crop_stats
  .getNumber('b1')
  .divide(10000)
  .round();
  
var croplandVis = {
  min: 0,
  max: 14.0,
  palette: ['30b21c'],
};

//Population
var population_count = ee.Image('users/rhrt/GHS_POP_E2015_GLOBE_R2019A_4326_9ss_V1_0_9_3').select('b1').clip(swater.geometry());
var GHSLprojection = population_count.select('b1').projection();



var flooded_res1 = flooded
    .reproject({
    crs: GHSLprojection
  });


var population_exposed = population_count
  .updateMask(flooded_res1)
  .updateMask(population_count);


var stats = population_exposed.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: swater.geometry(),
  scale: 250,
  maxPixels:1e9 
});
//print('stats',  stats);

var number_pp_exposed = stats.getNumber('b1').round();
//print('PP_E', number_pp_exposed);

var populationCountVis = {
  min: 0,
  max: 200.0,
  palette: ['060606','337663','337663','ffffff'],
};


var populationExposedVis = {
  min: 0,
  max: 200.0,
  palette: ['yellow', 'orange', 'red'],
};

  
var results1 = ui.Panel({
  style: {
    position: 'bottom-right',
    
     width: '310px', height: '500px'
  }
});

var textVis = {
  'margin':'0px 8px 2px 0px',
  'fontSize': '15px',
  //'fontWeight':'bold',
  'fontFamily':'serif'
  };
var numberVIS = {
  'margin':'0px 0px 15px 0px', 
  'color':'blue',
  'fontWeight':'bold',
  'fontFamily':'monospace'
  };
var subTextVis = {
  'margin':'0px 0px 2px 0px',
  'fontSize':'12px',
  'color':'grey',
  'fontFamily':'serif'
  };

var titleTextVis = {
  'margin':'0px 0px 10px 0px',
  'fontSize': '17px', 
  'font-weight':'bold', 
  'color': '3333ff',
  'fontFamily':'monospace',
  'textDecoration':'underline'
  
  };
  
/*var text2 = ui.Label('Estimated flood extent:',textVis);
var number2 = ui.Label('Please wait...',numberVIS); 
flood_area_ha.evaluate(function(val){number2.setValue(val+' hectares')}),numberVIS;*/

var text4 = ui.Label('Estimated affected cropland:',textVis);
var number4 = ui.Label('Please wait...',numberVIS);
crop_area_ha.evaluate(function(val){number4.setValue(val+' hectares')}),numberVIS;

var text3 = ui.Label('Estimated number of exposed people: ',textVis);
var number3 = ui.Label('Please wait...',numberVIS);
number_pp_exposed.evaluate(function(val){number3.setValue(val)}),numberVIS;


var flood_stats_ten = flood_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(),              
  geometry: denver,
  scale: 10, // native resolution 
  maxPixels: 1e9,
  bestEffort: true
  });
  
var flood_area_ha_ten = flood_stats_ten
  .getNumber('b1')
  .divide(10000)
  .round(); 
  
//print('Flooded Area (Ha)',flood_area_ha_ten );

var text = ui.Label('Summary ',titleTextVis);
var text1 = ui.Label('Flood extent ',textVis);
//var number1 = ui.Label(flood_area_ha);
var number1 = ui.Label('Please wait...',numberVIS); 
flood_area_ha_ten.evaluate(function(val){number1.setValue(val+' hectares')}),numberVIS;

//var img = ee.Image('users/rhrt/Depth_5m');
var img = reclassify;
//Map.addLayer(img, {palette:"0000FF"}, 'img',0);

var airport = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Airport_Facilities');


var airportSamp = img.sampleRegions({
  collection: airport,
  //scale: 10,
  geometries: true
});
var airport_sz = airportSamp.size();
var air_aff = ui.Label('Airport facilities:',textVis);
var air_aff1 = ui.Label('Please Wait', numberVIS);
airport_sz.evaluate(function(val){air_aff1.setValue(val)}),numberVIS;


var fcPolygon1 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Airpot_runaways');
var fcPolygonSamp1 = img.sampleRegions({
  collection: fcPolygon1,
  //scale: 10,
  geometries: true
});
var airport_run = fcPolygonSamp1.size();
var air_run = ui.Label('Airport runaways:',textVis);
var air_run1 = ui.Label('Please Wait', numberVIS);
airport_run.evaluate(function(val){air_run1.setValue(val)}),numberVIS;

var fcPolygon2 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Bus_Facilities');
var fcPolygonSamp2 = img.sampleRegions({
  collection: fcPolygon2,
  //scale: 10,
  geometries: true
});
var bf = fcPolygonSamp2.size();
var bff = ui.Label('Bus facilities affected:',textVis);
var bfff = ui.Label('Please Wait', numberVIS);
bf.evaluate(function(val){bfff.setValue(val)}),numberVIS;

var fcPolygon4 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/EOC');
var fcPolygonSamp4 = img.sampleRegions({
  collection: fcPolygon4,
  //scale: 10,
  geometries: true
});
var eoc = fcPolygonSamp4.size();
var eocf = ui.Label('Emergency Operation Centeres:',textVis);
var eocff = ui.Label('Please Wait', numberVIS);
eoc.evaluate(function(val){eocff.setValue(val)}),numberVIS;

var fcPolygon5 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Ferry_Facilities');
var fcPolygonSamp5 = img.sampleRegions({
  collection: fcPolygon5,
  //scale: 10,
  geometries: true
});
var ff = fcPolygonSamp5.size();
var fff = ui.Label('Ferry facilities:',textVis);
var ffff = ui.Label('Please Wait', numberVIS);
ff.evaluate(function(val){ffff.setValue(val)}),numberVIS;

var fcPolygon6 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/High_Potential_Loss_Facilities-csv');
var fcPolygonSamp6 = img.sampleRegions({
  collection: fcPolygon6,
  //scale: 10,
  geometries: true
});
var hp = fcPolygonSamp6.size();
var hpf = ui.Label('High potential facilities:',textVis);
var hpff = ui.Label('Please Wait', numberVIS);
hp.evaluate(function(val){hpff.setValue(val)}),numberVIS;

var fcPolygon7 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Highway_bridges');
var fcPolygonSamp7 = img.sampleRegions({
  collection: fcPolygon7,
  //scale: 10,
  geometries: true
});
var hb = fcPolygonSamp7.size();
var hbf = ui.Label('Highway bridges:',textVis);
var hbff = ui.Label('Please Wait', numberVIS);
hb.evaluate(function(val){hbff.setValue(val)}),numberVIS;

var fcPolygon8 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/PS');
var fcPolygonSamp8 = img.sampleRegions({
  collection: fcPolygon8,
  //scale: 10,
  geometries: true
});
var ps = fcPolygonSamp8.size();
var psf = ui.Label('Police stations:',textVis);
var psff = ui.Label('Please Wait', numberVIS);
ps.evaluate(function(val){psff.setValue(val)}),numberVIS;

var fcPolygon9 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Port_facilities');
var fcPolygonSamp9 = img.sampleRegions({
  collection: fcPolygon9,
  //scale: 10,
  geometries: true
});
var port = fcPolygonSamp9.size();
var portf = ui.Label('Port facilities:',textVis);
var portff = ui.Label('Please Wait', numberVIS);
port.evaluate(function(val){portff.setValue(val)}),numberVIS;

var fcPolygon10 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Railway_bridges');
var fcPolygonSamp10 = img.sampleRegions({
  collection: fcPolygon10,
  //scale: 10,
  geometries: true
});
var rb = fcPolygonSamp10.size();
var rbf = ui.Label('Railway bridges:',textVis);
var rbff = ui.Label('Please Wait', numberVIS);
rb.evaluate(function(val){rbff.setValue(val)}),numberVIS;

var fcPolygon11 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/EPF-csv');
var fcPolygonSamp11 = img.sampleRegions({
  collection: fcPolygon11,
  //scale: 10,
  geometries: true
});
var epf = fcPolygonSamp11.size();
var epff = ui.Label('Electric power facilities:',textVis);
var epfff = ui.Label('Please Wait', numberVIS);
epf.evaluate(function(val){epfff.setValue(val)}),numberVIS;

var fcPolygon13 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Waste-Water-csv');
var fcPolygonSamp13 = img.sampleRegions({
  collection: fcPolygon13,
  //scale: 10,
  geometries: true
});
var wwf = fcPolygonSamp13.size();
var wwff = ui.Label('Waste water facilities:',textVis);
var wwfff = ui.Label('Please Wait', numberVIS);
wwf.evaluate(function(val){wwfff.setValue(val)}),numberVIS;

var fcPolygon14 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/MC1');
var fcPolygonSamp14 = img.sampleRegions({
  collection: fcPolygon14,
  //scale: 10,
  geometries: true
});

var mcf = fcPolygonSamp14.size();
var mcff = ui.Label('Medical care facilities:',textVis);
var mcfff = ui.Label('Please Wait', numberVIS);
mcf.evaluate(function(val){mcfff.setValue(val)}),numberVIS;

var fcPolygon15 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/FSF1');
var fcPolygonSamp15 = img.sampleRegions({
  collection: fcPolygon15,
  //scale: 10,
  geometries: true
});

var fsf = fcPolygonSamp14.size();
var fsff = ui.Label('Fire station facilities:',textVis);
var fsfff = ui.Label('Please Wait', numberVIS);
fsf.evaluate(function(val){fsfff.setValue(val)}),numberVIS;


var number = ui.Label(" ")

var area_m2 = shp.aggregate_sum("Cars").getInfo()
var area_km = (area_m2 /1207)
var text16 = ui.Label("Estimated number of Cars affected:",textVis);
var number16 = ui.Label('Please wait...', numberVIS);
var ncars = ee.Number(area_km).toInt();
ncars.evaluate(function(val){number16.setValue(val)}),numberVIS;

var ht = shp.aggregate_sum("Heavy Trucks").getInfo()
var ht2 = ht / 1207
var text17 = ui.Label("Estimated number of affected Heavy Trucks: ",textVis);
var number17 = ui.Label('Please wait...', numberVIS);
var nhtrucks = ee.Number(ht2).toInt();
nhtrucks.evaluate(function(val){number17.setValue(val)}),numberVIS;

var lt = shp.aggregate_sum("Light Trucks").getInfo()
var lt2 = lt / 1207
var text18 = ui.Label("Estimated number of affected Light Trucks: ",textVis);
var number18 = ui.Label('Please wait...', numberVIS);
var nltrucks = ee.Number(lt2).toInt();
nltrucks.evaluate(function(val){number18.setValue(val)}),numberVIS;

var tv  = shp.aggregate_sum("Total Vehicles").getInfo()
var tv2 = tv / 1207
var text19 = ui.Label("Estimated number of Total Vehicles affected: ",textVis);
var number19 = ui.Label('Please wait...', numberVIS);
var ntv = ee.Number(tv2).toInt();
ntv.evaluate(function(val){number19.setValue(val)}),numberVIS;

var fp = dbb.aggregate_sum("Total Female Population").getInfo()
var fp2 = 2401;
var text20 = ui.Label("Estimated number of Females affected: ",textVis);
var number20 = ui.Label('Please wait...', numberVIS);
var nfp = ee.Number(fp2).toInt();
nfp.evaluate(function(val){number20.setValue(val)}),numberVIS;

var mp = dbb.aggregate_sum("Total Male Population").getInfo()
var mp2 = 2834
var text21 = ui.Label("Estimated number of Males affected: ",textVis);
var number21 = ui.Label('Please wait...', numberVIS);
var nmp = ee.Number(mp2).toInt();
nmp.evaluate(function(val){number21.setValue(val)}),numberVIS;



/*var img = ee.Image('users/rhrt/Depth_5m');
Map.addLayer(img, {}, 'img',0);

//var fcPolygon = ee.FeatureCollection('projects/ee-rhrt-hand/assets/H-UDF_Depth_5m1_sorted');
//Map.addLayer(fcPolygon, {color: 'yellow'}, 'fcPolygon');

var fcPolygonSamp = img.sampleRegions({
  collection: fcPolygon,
  scale: 10,
  geometries: true
});*/

var five_met = ee.FeatureCollection('projects/ee-rhrt-hand/assets/H-UDF_Depth_5m1_sorted');
var leftProperty = 'BDDF_ID';
var rightProperty = '0';
//var fcPolygon = five_met.filter(ee.Filter.notEquals({leftField: leftProperty, rightValue: 0}))
var fcPolygon = img.sampleRegions({
  collection: five_met,
  //scale: 10,
  geometries: true
});


var tb = fcPolygon.size();
var tb_h = ui.Label('Total number of buildings affected :',textVis);
var tb_v = ui.Label('Please Wait', numberVIS);
tb.evaluate(function(val){tb_v.setValue(val)}),numberVIS;

var BldgLossUSD = fcPolygon.aggregate_sum('BldgLossUSD')
var cost_total = BldgLossUSD.toInt()
var cost_total_h = ui.Label('Cost estimated (Total):',textVis);
var cost_total_v = ui.Label('Please Wait', numberVIS);
cost_total.evaluate(function(val){cost_total_v.setValue('$ '+val)}),numberVIS;

var InventoryLossUSD = fcPolygon.aggregate_sum('InventoryLossUSD')
var cost_inv = InventoryLossUSD.toInt()
var cost_inv_h = ui.Label('Cost estimated (Inventory):',textVis);
var cost_inv_v = ui.Label('Please Wait', numberVIS);
cost_inv.evaluate(function(val){cost_inv_v.setValue('$ '+val)}),numberVIS;

var ContentLossUSD = fcPolygon.aggregate_sum('ContentLossUSD')
var cost_cont = ContentLossUSD.toInt()
var cost_cont_h = ui.Label('Cost estimated (Content):',textVis);
var cost_cont_v = ui.Label('Please Wait', numberVIS);
cost_cont.evaluate(function(val){cost_cont_v.setValue('$ '+val)}),numberVIS;


var RES3C = fcPolygon.filter('Occ == "RES3C"').size()
var res3c_h = ui.Label('Appartments, Group care homes :',textVis);
var res3c_v = ui.Label('Please Wait', numberVIS);
RES3C.evaluate(function(val){res3c_v.setValue(val)}),numberVIS;
var COM1 = fcPolygon.filter('Occ == "COM1"').size()
var com1_h = ui.Label('Armouries, shopping centres, kennels :',textVis);
var com1_v = ui.Label('Please Wait', numberVIS);
COM1.evaluate(function(val){com1_v.setValue(val)}),numberVIS;
var COM5 = fcPolygon.filter('Occ == "COM5"').size()
var com5_h = ui.Label('Banks affected:',textVis);
var com5_v = ui.Label('Please Wait', numberVIS);
COM5.evaluate(function(val){com5_v.setValue(val)}),numberVIS;
var IND3 = fcPolygon.filter('Occ == "IND3"').size()
var ind3_h = ui.Label('Creameries, bars, oil storage and cold storage:',textVis);
var ind3_v = ui.Label('Please Wait', numberVIS);
IND3.evaluate(function(val){ind3_v.setValue(val)}),numberVIS;
var COM8 = fcPolygon.filter('Occ == "COM8"').size()
var com8_h = ui.Label('Fitness centres, Recreation centres, clubs and pavillions:',textVis);
var com8_v = ui.Label('Please Wait', numberVIS);
COM8.evaluate(function(val){com8_v.setValue(val)}),numberVIS;
var COM9 = fcPolygon.filter('Occ == "COM9"').size()
var com9_h = ui.Label('Broadcasting facilities, convention centres, cafeteria and theatres:',textVis);
var com9_v = ui.Label('Please Wait', numberVIS);
COM9.evaluate(function(val){com9_v.setValue(val)}),numberVIS;
var COM4 = fcPolygon.filter('Occ == "COM4"').size()
var com4_h = ui.Label('Computer centres:',textVis);
var com4_v = ui.Label('Please Wait', numberVIS);
COM4.evaluate(function(val){com4_v.setValue(val)}),numberVIS;
var RES5 = fcPolygon.filter('Occ == "RES5"').size()
var res5_h = ui.Label('Dormitories:',textVis);
var res5_v = ui.Label('Please Wait', numberVIS);
RES5.evaluate(function(val){res5_v.setValue(val)}),numberVIS;
var RES1 = fcPolygon.filter('Occ == "RES1"').size()
var res1_h = ui.Label('Field Houses:',textVis);
var res1_v = ui.Label('Please Wait', numberVIS);
RES1.evaluate(function(val){res1_v.setValue(val)}),numberVIS;
var RES4 = fcPolygon.filter('Occ == "RES4"').size()
var res4_h = ui.Label('Hotels, lodges, motels, greenhouses, hangars and restrooms:',textVis);
var res4_v = ui.Label('Please Wait', numberVIS);
RES4.evaluate(function(val){res4_v.setValue(val)}),numberVIS;
var RES3B = fcPolygon.filter('Occ == "RES3B"').size()
var res3b_h = ui.Label('Affected fraternity homes and town houses:',textVis);
var res3b_v = ui.Label('Please Wait', numberVIS);
RES3B.evaluate(function(val){res3b_v.setValue(val)}),numberVIS;
var COM10 = fcPolygon.filter('Occ == "COM10"').size()
var com10_h = ui.Label('Garages and Fast Food:',textVis);
var com10_v = ui.Label('Please Wait', numberVIS);
COM10.evaluate(function(val){com10_v.setValue(val)}),numberVIS;
var RES6 = fcPolygon.filter('Occ == "RES6"').size()
var res6_h = ui.Label('Nursing Homes:',textVis);
var res6_v = ui.Label('Please Wait', numberVIS);
RES6.evaluate(function(val){res6_v.setValue(val)}),numberVIS;
var COM6 = fcPolygon.filter('Occ == "COM6"').size()
var com6_h = ui.Label('Hospitals:',textVis);
var com6_v = ui.Label('Please Wait', numberVIS);
COM6.evaluate(function(val){com6_v.setValue(val)}),numberVIS;
var IND5 = fcPolygon.filter('Occ == "IND5"').size()
var ind5_h = ui.Label('Industrial Engg:',textVis);
var ind5_v = ui.Label('Please Wait', numberVIS);
IND5.evaluate(function(val){ind5_v.setValue(val)}),numberVIS;
var EDU1 = fcPolygon.filter('Occ == "EDU1"').size()
var edu1_h = ui.Label('Schools:',textVis);
var edu1_v = ui.Label('Please Wait', numberVIS);
EDU1.evaluate(function(val){edu1_v.setValue(val)}),numberVIS;
var IND2 = fcPolygon.filter('Occ == "IND2"').size()
var ind2_h = ui.Label('Flex mall Light manufacturing:',textVis);
var ind2_v = ui.Label('Please Wait', numberVIS);
IND2.evaluate(function(val){ind2_v.setValue(val)}),numberVIS;
var COM3 = fcPolygon.filter('Occ == "COM3"').size()
var com3_h = ui.Label('Laundry, laundromats and visitor centres:',textVis);
var com3_v = ui.Label('Please Wait', numberVIS);
COM3.evaluate(function(val){com3_v.setValue(val)}),numberVIS;
var COM2 = fcPolygon.filter('Occ == "COM2"').size()
var com2_h = ui.Label('Maintanence, markets, material shelter,warehouses,sheds:',textVis);
var com2_v = ui.Label('Please Wait', numberVIS);
COM2.evaluate(function(val){com2_v.setValue(val)}),numberVIS;
var COM7 = fcPolygon.filter('Occ == "COM7"').size()
var com7_h = ui.Label('Clinics, Mortuaries, drug stores:',textVis);
var com7_v = ui.Label('Please Wait', numberVIS);
COM7.evaluate(function(val){com7_v.setValue(val)}),numberVIS;
var RES3A= fcPolygon.filter('Occ == "RES3A"').size()
var res3a_h = ui.Label('Multiple Residences:',textVis);
var res3a_v = ui.Label('Please Wait', numberVIS);
RES3A.evaluate(function(val){res3a_v.setValue(val)}),numberVIS;
var REL1 = fcPolygon.filter('Occ == "REL1"').size()
var rel1_h = ui.Label('Religious Buildings:',textVis);
var rel1_v = ui.Label('Please Wait', numberVIS);
REL1.evaluate(function(val){rel1_v.setValue(val)}),numberVIS;
var COM11= fcPolygon.filter('Occ == "COM11"').size()
var com11_h = ui.Label('Restaurant:Snackbars:',textVis);
var com11_v = ui.Label('Please Wait', numberVIS);
COM11.evaluate(function(val){com11_v.setValue(val)}),numberVIS;
var GOV1 = fcPolygon.filter('Occ == "GOV1"').size()
var gov1_h = ui.Label('Governmental institutions:',textVis);
var gov1_v = ui.Label('Please Wait', numberVIS);
GOV1.evaluate(function(val){gov1_v.setValue(val)}),numberVIS;

var  totcom_5 =  ee.FeatureCollection('projects/ee-rhrt-hand/assets/Commercial_Industrial_Depth_5m1_sorted');
//var commercial = totcom_5.filter(ee.Filter.notEquals({leftField: leftProperty, rightValue: 0}))
var commercial = img.sampleRegions({
  collection: totcom_5,
  //scale: 10,
  geometries: true
});

var BldgLossUSD_comm = commercial.aggregate_sum('BldgLossUSD')
var cost_comm = BldgLossUSD_comm.toInt()
var cost_comm_h = ui.Label('Cost estimated (commercial):',textVis);
var cost_comm_v = ui.Label('Please Wait', numberVIS);
cost_comm.evaluate(function(val){cost_comm_v.setValue('$ '+ val)}),numberVIS;
var comm = commercial.size();
var comm_h = ui.Label('Total number of commercial buildings:',textVis);
var comm_v = ui.Label('Please Wait', numberVIS);
comm.evaluate(function(val){comm_v.setValue(val)}),numberVIS;


var totagr_5= ee.FeatureCollection('projects/ee-rhrt-hand/assets/Agriculture_Depth_5m1_sorted');
//var agriculture = totagr_5.filter(ee.Filter.notEquals({leftField: leftProperty, rightValue: 0}))
//print('Total number of agricultural buildings affected:', agriculture)
var agriculture = img.sampleRegions({
  collection: totagr_5,
  //scale: 10,
  geometries: true
});

var BldgLossUSD_agri = agriculture.aggregate_sum('BldgLossUSD')
var cost_agri =  BldgLossUSD_agri.toInt()
var cost_agri_h = ui.Label('Cost estimated (agriculture):',textVis);
var cost_agri_v = ui.Label('Please Wait', numberVIS);
cost_agri.evaluate(function(val){cost_agri_v.setValue('$ '+ val)}),numberVIS;
var agri = agriculture.size();
var agri_h = ui.Label('Total number of agricultural buildings:',textVis);
var agri_v = ui.Label('Please Wait', numberVIS);
agri.evaluate(function(val){agri_v.setValue(val)}),numberVIS;



var totres_5= ee.FeatureCollection('projects/ee-rhrt-hand/assets/Residential_Depth_5m1_sorted');
//var residential = totres_5.filter(ee.Filter.notEquals({leftField: leftProperty, rightValue: 0}))
//print('Total number of residential buildings affected:', residential)
var residential = img.sampleRegions({
  collection: totres_5,
  //scale: 10,
  geometries: true
});

var BldgLossUSD_res = residential.aggregate_sum('BldgLossUSD')
var cost_res= BldgLossUSD_res.toInt()
var cost_res_h = ui.Label('Cost estimated (residential):',textVis);
var cost_res_v = ui.Label('Please Wait', numberVIS);
cost_res.evaluate(function(val){cost_res_v.setValue('$ '+ val)}),numberVIS;
var res =  residential.size();
var res_h = ui.Label('Total number of residential buildings:',textVis);
var res_v = ui.Label('Please Wait', numberVIS);
res.evaluate(function(val){res_v.setValue(val)}),numberVIS;



results1.add(ui.Panel([
        text,
        number,
        text1,
        number1,
        text4,
        number4,
        text3,
        number3,
        tb_h,
        tb_v,
        cost_total_h,
        cost_total_v,
        cost_inv_h,
        cost_inv_v,
        cost_cont_h,
        cost_cont_v,
        res_h,
        res_v,
        cost_res_h,
        cost_res_v,
        comm_h,
        comm_v,
        cost_comm_h,
        cost_comm_v,
        agri_h,
        agri_v,
        cost_agri_h,
        cost_agri_v,
        res3c_h,
        res3c_v,
        com1_h,
        com1_v,
        com5_h,
        com5_v,
        ind3_h,
        ind3_v,
        com8_h,
        com8_v,
        com9_h,
        com9_v,
        com4_h,
        com4_v,
        res5_h,
        res5_v,
        gov1_h,
        gov1_v,
        res1_h,
        res1_v,
        res4_h,
        res4_v,
        res3b_h,
        res3b_v,
        res6_h,
        res6_v,
        com6_h,
        com6_v,
        ind5_h,
        ind5_v,
        edu1_h,
        edu1_v,
        ind2_h,
        ind2_v,
        com3_h,
        com3_v,
        com2_h,
        com2_v,
        com7_h,
        com7_v,
        res3a_h,
        res3a_v,
        rel1_h,
        rel1_v,
        com11_h,
        com11_v,
        air_aff,
        air_aff1,
        air_run,
        air_run1,
        bff,
        bfff,
        eocf,
        eocff,
        fff,
        ffff,
        hpf,
        hpff,
        hbf,
        hbff,
        psf,
        psff,
        portf,
        portff,
        rbf,
        rbff,
        epff,
        epfff,
        wwff,
        wwfff,
        mcff,
        mcfff,
        fsff,
        fsfff,
        text16,
        number16,
        text17,
        number17,
        text18,
        number18,
        text19,
        number19,
        text20,
        number20,
        text21,
        number21,
        
      ]
      ));
      




  
/*var houghton_popu = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Houghton_Census_Block').filterBounds(swater.geometry());
Map.addLayer(houghton_popu,{},'Houghton-Affected_population',0);*/


var denver = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level2')
    .filter("ADM2_NAME == 'Houghton'")
    .filter(ee.Filter.eq('ADM2_NAME', 'Houghton'))  // Exactly the same as above.
    .first()
    .geometry();

//Map.centerObject(denver, 9);
//Map.addLayer(denver, null, 'Houghton')

/*var houghton_c = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Houghton_Census_Block');
var filtered = houghton_c.filterBounds(denver);
Map.addLayer(filtered,{},'Filtered',0);

var geometry = houghton_c.geometry();*/

//Map.addLayer(flooded, {palette:"0000FF"},'Flooded areas',0);

//Map.addLayer(shp,{},'Houghton',0)

Map.addLayer(flooded, {palette:"0000FF"},'Flooded areas');

Map.add(results1);
//Map.addLayer(shp1,{},'Houghton');

//Map.addLayer(population_count, populationCountVis, 'Population Density',0);

Map.addLayer(population_exposed, populationExposedVis, 'Exposed Population',0);

//Map.addLayer(crop_land,  croplandVis, 'Cropland',0);

Map.addLayer(cropland_affected, croplandVis, 'Affected Cropland',0); 

/*var discharge = ee.FeatureCollection('projects/ee-rhrt-hand/assets/file_name1');
Map.addLayer(discharge.style(style),{},'Discharge',0)*/

Map.addLayer(fcPolygon, {color: 'yellow'},'Buildings',0);
Map.addLayer(agriculture, {color: 'lightgreen'},'Agricultural',0);
Map.addLayer(commercial, {color: 'cyan'},'Commercial',0);
Map.addLayer(residential, {color: 'pink'},'Residential',0);

  

}

function hand_hd(){ 

//drawingTools.stop();


  var aoi = drawingTools.layers().get(0).getEeObject();
  
  clearGeometry();

  // Set the drawing mode back to null; turns drawing off.
  drawingTools.setShape(null);

  var HAND= ee.Image("users/rhrt/Depth_6m");

  var reclassify = HAND.updateMask(HAND.gte(0)).clip(aoi);

  
var shp = ee.FeatureCollection("projects/ee-rhrt-hand/assets/Aggregate_Data-csv")
//var agg = shp.geometry()

var dbb = ee.FeatureCollection("projects/ee-rhrt-hand/assets/Dbb")
//var agg_dbb = dbb.geometry()

var ecbb = ee.FeatureCollection("projects/ee-rhrt-hand/assets/Ecbb")
//var agg_ecbb = ecbb.geometry()



var swater = ee.Image(reclassify).select('b1');
var swater_mask = swater.gte(0).updateMask(swater.gte(0));
var connections = swater_mask.connectedPixelCount();
var flooded = swater_mask.updateMask(connections.gt(0));


var flood_pixelarea = swater_mask
  .multiply(ee.Image.pixelArea());

var flood_stats = flood_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(),              
  geometry: swater.geometry(),
  //scale: 10, // native resolution 
  //maxPixels: 1e9,
  bestEffort: true
  });

var flood_area_ha = flood_stats
  .getNumber('b1')
  .divide(10000)
  .round(); 

//LandUse and CropLand
var LC = ee.Image('users/rhrt/Farm_Land').select('b1').clip(swater.geometry());


/*var cropmask = LC
  .eq(12)
  .or(LC.eq(14))
var cropland = LC
  .updateMask(cropmask)*/

var crop_projection = LC.select('b1').projection();
//print('projection', crop_projection);
var flooded_res = flooded
    .reproject({
    crs: crop_projection
  });
  
var crop_land = LC.updateMask(LC);

var cropland_affected = (flooded_res)
  .updateMask(LC);

var crop_pixelarea = cropland_affected
  .multiply(ee.Image.pixelArea());
//print('crop_pixelarea', crop_pixelarea)
  
var crop_stats = crop_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(), //sum all pixels with area information                
  geometry: swater.geometry(),
  scale: 500,
  maxPixels: 1e9
});
//print('crop_stats', crop_stats);

var crop_area_ha = crop_stats
  .getNumber('b1')
  .divide(10000)
  .round();
  
var croplandVis = {
  min: 0,
  max: 14.0,
  palette: ['30b21c'],
};

//Population
var population_count = ee.Image('users/rhrt/GHS_POP_E2015_GLOBE_R2019A_4326_9ss_V1_0_9_3').select('b1').clip(swater.geometry());
var GHSLprojection = population_count.select('b1').projection();



var flooded_res1 = flooded
    .reproject({
    crs: GHSLprojection
  });


var population_exposed = population_count
  .updateMask(flooded_res1)
  .updateMask(population_count);


var stats = population_exposed.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: swater.geometry(),
  scale: 250,
  maxPixels:1e9 
});
//print('stats',  stats);

var number_pp_exposed = stats.getNumber('b1').round();
//print('PP_E', number_pp_exposed);

var populationCountVis = {
  min: 0,
  max: 200.0,
  palette: ['060606','337663','337663','ffffff'],
};


var populationExposedVis = {
  min: 0,
  max: 200.0,
  palette: ['yellow', 'orange', 'red'],
};

  
var results1 = ui.Panel({
  style: {
    position: 'bottom-right',
    
     width: '310px', height: '500px'
  }
});

var textVis = {
  'margin':'0px 8px 2px 0px',
  'fontSize': '15px',
  //'fontWeight':'bold',
  'fontFamily':'serif'
  };
var numberVIS = {
  'margin':'0px 0px 15px 0px', 
  'color':'blue',
  'fontWeight':'bold',
  'fontFamily':'monospace'
  };
var subTextVis = {
  'margin':'0px 0px 2px 0px',
  'fontSize':'12px',
  'color':'grey',
  'fontFamily':'serif'
  };

var titleTextVis = {
  'margin':'0px 0px 10px 0px',
  'fontSize': '17px', 
  'font-weight':'bold', 
  'color': '3333ff',
  'fontFamily':'monospace',
  'textDecoration':'underline'
  
  };
  
/*var text2 = ui.Label('Estimated flood extent:',textVis);
var number2 = ui.Label('Please wait...',numberVIS); 
flood_area_ha.evaluate(function(val){number2.setValue(val+' hectares')}),numberVIS;*/

var text4 = ui.Label('Estimated affected cropland:',textVis);
var number4 = ui.Label('Please wait...',numberVIS);
crop_area_ha.evaluate(function(val){number4.setValue(val+' hectares')}),numberVIS;

var text3 = ui.Label('Estimated number of exposed people: ',textVis);
var number3 = ui.Label('Please wait...',numberVIS);
number_pp_exposed.evaluate(function(val){number3.setValue(val)}),numberVIS;


var flood_stats_ten = flood_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(),              
  geometry: denver,
  //scale: 10, // native resolution 
  maxPixels: 1e9,
  bestEffort: true
  });
  
var flood_area_ha_ten = flood_stats_ten
  .getNumber('b1')
  .divide(10000)
  .round(); 
  
//print('Flooded Area (Ha)',flood_area_ha_ten );

var text = ui.Label('Summary ',titleTextVis);
var text1 = ui.Label('Flood extent ',textVis);
//var number1 = ui.Label(flood_area_ha);
var number1 = ui.Label('Please wait...',numberVIS); 
flood_area_ha_ten.evaluate(function(val){number1.setValue(val+' hectares')}),numberVIS;

//var img = ee.Image('users/rhrt/Depth_6m');
var img = reclassify;
//Map.addLayer(img, {palette:"0000FF"}, 'img',0);

var airport = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Airport_Facilities');


var airportSamp = img.sampleRegions({
  collection: airport,
  //scale: 10,
  geometries: true
});
var airport_sz = airportSamp.size();
var air_aff = ui.Label('Airport facilities:',textVis);
var air_aff1 = ui.Label('Please Wait', numberVIS);
airport_sz.evaluate(function(val){air_aff1.setValue(val)}),numberVIS;


var fcPolygon1 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Airpot_runaways');
var fcPolygonSamp1 = img.sampleRegions({
  collection: fcPolygon1,
  //scale: 10,
  geometries: true
});
var airport_run = fcPolygonSamp1.size();
var air_run = ui.Label('Airport runaways:',textVis);
var air_run1 = ui.Label('Please Wait', numberVIS);
airport_run.evaluate(function(val){air_run1.setValue(val)}),numberVIS;

var fcPolygon2 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Bus_Facilities');
var fcPolygonSamp2 = img.sampleRegions({
  collection: fcPolygon2,
  //scale: 10,
  geometries: true
});
var bf = fcPolygonSamp2.size();
var bff = ui.Label('Bus facilities affected:',textVis);
var bfff = ui.Label('Please Wait', numberVIS);
bf.evaluate(function(val){bfff.setValue(val)}),numberVIS;

var fcPolygon4 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/EOC');
var fcPolygonSamp4 = img.sampleRegions({
  collection: fcPolygon4,
  //scale: 10,
  geometries: true
});
var eoc = fcPolygonSamp4.size();
var eocf = ui.Label('Emergency Operation Centeres:',textVis);
var eocff = ui.Label('Please Wait', numberVIS);
eoc.evaluate(function(val){eocff.setValue(val)}),numberVIS;

var fcPolygon5 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Ferry_Facilities');
var fcPolygonSamp5 = img.sampleRegions({
  collection: fcPolygon5,
  //scale: 10,
  geometries: true
});
var ff = fcPolygonSamp5.size();
var fff = ui.Label('Ferry facilities:',textVis);
var ffff = ui.Label('Please Wait', numberVIS);
ff.evaluate(function(val){ffff.setValue(val)}),numberVIS;

var fcPolygon6 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/High_Potential_Loss_Facilities-csv');
var fcPolygonSamp6 = img.sampleRegions({
  collection: fcPolygon6,
  //scale: 10,
  geometries: true
});
var hp = fcPolygonSamp6.size();
var hpf = ui.Label('High potential facilities:',textVis);
var hpff = ui.Label('Please Wait', numberVIS);
hp.evaluate(function(val){hpff.setValue(val)}),numberVIS;

var fcPolygon7 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Highway_bridges');
var fcPolygonSamp7 = img.sampleRegions({
  collection: fcPolygon7,
  //scale: 10,
  geometries: true
});
var hb = fcPolygonSamp7.size();
var hbf = ui.Label('Highway bridges:',textVis);
var hbff = ui.Label('Please Wait', numberVIS);
hb.evaluate(function(val){hbff.setValue(val)}),numberVIS;

var fcPolygon8 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/PS');
var fcPolygonSamp8 = img.sampleRegions({
  collection: fcPolygon8,
  //scale: 10,
  geometries: true
});
var ps = fcPolygonSamp8.size();
var psf = ui.Label('Police stations:',textVis);
var psff = ui.Label('Please Wait', numberVIS);
ps.evaluate(function(val){psff.setValue(val)}),numberVIS;

var fcPolygon9 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Port_facilities');
var fcPolygonSamp9 = img.sampleRegions({
  collection: fcPolygon9,
  //scale: 10,
  geometries: true
});
var port = fcPolygonSamp9.size();
var portf = ui.Label('Port facilities:',textVis);
var portff = ui.Label('Please Wait', numberVIS);
port.evaluate(function(val){portff.setValue(val)}),numberVIS;

var fcPolygon10 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Railway_bridges');
var fcPolygonSamp10 = img.sampleRegions({
  collection: fcPolygon10,
  //scale: 10,
  geometries: true
});
var rb = fcPolygonSamp10.size();
var rbf = ui.Label('Railway bridges:',textVis);
var rbff = ui.Label('Please Wait', numberVIS);
rb.evaluate(function(val){rbff.setValue(val)}),numberVIS;

var fcPolygon11 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/EPF-csv');
var fcPolygonSamp11 = img.sampleRegions({
  collection: fcPolygon11,
  //scale: 10,
  geometries: true
});
var epf = fcPolygonSamp11.size();
var epff = ui.Label('Electric power facilities:',textVis);
var epfff = ui.Label('Please Wait', numberVIS);
epf.evaluate(function(val){epfff.setValue(val)}),numberVIS;

var fcPolygon13 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Waste-Water-csv');
var fcPolygonSamp13 = img.sampleRegions({
  collection: fcPolygon13,
  //scale: 10,
  geometries: true
});
var wwf = fcPolygonSamp13.size();
var wwff = ui.Label('Waste water facilities:',textVis);
var wwfff = ui.Label('Please Wait', numberVIS);
wwf.evaluate(function(val){wwfff.setValue(val)}),numberVIS;

var fcPolygon14 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/MC1');
var fcPolygonSamp14 = img.sampleRegions({
  collection: fcPolygon14,
  //scale: 10,
  geometries: true
});

var mcf = fcPolygonSamp14.size();
var mcff = ui.Label('Medical care facilities:',textVis);
var mcfff = ui.Label('Please Wait', numberVIS);
mcf.evaluate(function(val){mcfff.setValue(val)}),numberVIS;

var fcPolygon15 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/FSF1');
var fcPolygonSamp15 = img.sampleRegions({
  collection: fcPolygon15,
  //scale: 10,
  geometries: true
});

var fsf = fcPolygonSamp14.size();
var fsff = ui.Label('Fire station facilities:',textVis);
var fsfff = ui.Label('Please Wait', numberVIS);
fsf.evaluate(function(val){fsfff.setValue(val)}),numberVIS;


var number = ui.Label(" ")

var area_m2 = shp.aggregate_sum("Cars").getInfo()
var area_km = (area_m2 /1207)
var text16 = ui.Label("Estimated number of Cars affected:",textVis);
var number16 = ui.Label('Please wait...', numberVIS);
var ncars = ee.Number(area_km).toInt();
ncars.evaluate(function(val){number16.setValue(val)}),numberVIS;

var ht = shp.aggregate_sum("Heavy Trucks").getInfo()
var ht2 = ht / 1207
var text17 = ui.Label("Estimated number of affected Heavy Trucks: ",textVis);
var number17 = ui.Label('Please wait...', numberVIS);
var nhtrucks = ee.Number(ht2).toInt();
nhtrucks.evaluate(function(val){number17.setValue(val)}),numberVIS;

var lt = shp.aggregate_sum("Light Trucks").getInfo()
var lt2 = lt / 1207
var text18 = ui.Label("Estimated number of affected Light Trucks: ",textVis);
var number18 = ui.Label('Please wait...', numberVIS);
var nltrucks = ee.Number(lt2).toInt();
nltrucks.evaluate(function(val){number18.setValue(val)}),numberVIS;

var tv  = shp.aggregate_sum("Total Vehicles").getInfo()
var tv2 = tv / 1207
var text19 = ui.Label("Estimated number of Total Vehicles affected: ",textVis);
var number19 = ui.Label('Please wait...', numberVIS);
var ntv = ee.Number(tv2).toInt();
ntv.evaluate(function(val){number19.setValue(val)}),numberVIS;

var fp = dbb.aggregate_sum("Total Female Population").getInfo()
var fp2 = 2401;
var text20 = ui.Label("Estimated number of Females affected: ",textVis);
var number20 = ui.Label('Please wait...', numberVIS);
var nfp = ee.Number(fp2).toInt();
nfp.evaluate(function(val){number20.setValue(val)}),numberVIS;

var mp = dbb.aggregate_sum("Total Male Population").getInfo()
var mp2 = 2834
var text21 = ui.Label("Estimated number of Males affected: ",textVis);
var number21 = ui.Label('Please wait...', numberVIS);
var nmp = ee.Number(mp2).toInt();
nmp.evaluate(function(val){number21.setValue(val)}),numberVIS;



/*var img = ee.Image('users/rhrt/Depth_5m');
Map.addLayer(img, {}, 'img',0);

//var fcPolygon = ee.FeatureCollection('projects/ee-rhrt-hand/assets/H-UDF_Depth_5m1_sorted');
//Map.addLayer(fcPolygon, {color: 'yellow'}, 'fcPolygon');

var fcPolygonSamp = img.sampleRegions({
  collection: fcPolygon,
  scale: 10,
  geometries: true
});*/

var six_met = ee.FeatureCollection('projects/ee-rhrt-hand/assets/H-UDF_Depth_6m1_sorted');
var leftProperty = 'BDDF_ID';
var rightProperty = '0';
//var fcPolygon = five_met.filter(ee.Filter.notEquals({leftField: leftProperty, rightValue: 0}))
var fcPolygon = img.sampleRegions({
  collection: six_met,
  //scale: 10,
  geometries: true
});


var tb = fcPolygon.size();
var tb_h = ui.Label('Total number of buildings affected :',textVis);
var tb_v = ui.Label('Please Wait', numberVIS);
tb.evaluate(function(val){tb_v.setValue(val)}),numberVIS;

var BldgLossUSD = fcPolygon.aggregate_sum('BldgLossUSD')
var cost_total = BldgLossUSD.toInt()
var cost_total_h = ui.Label('Cost estimated (Total):',textVis);
var cost_total_v = ui.Label('Please Wait', numberVIS);
cost_total.evaluate(function(val){cost_total_v.setValue('$ '+val)}),numberVIS;

var InventoryLossUSD = fcPolygon.aggregate_sum('InventoryLossUSD')
var cost_inv = InventoryLossUSD.toInt()
var cost_inv_h = ui.Label('Cost estimated (Inventory):',textVis);
var cost_inv_v = ui.Label('Please Wait', numberVIS);
cost_inv.evaluate(function(val){cost_inv_v.setValue('$ '+val)}),numberVIS;

var ContentLossUSD = fcPolygon.aggregate_sum('ContentLossUSD')
var cost_cont = ContentLossUSD.toInt()
var cost_cont_h = ui.Label('Cost estimated (Content):',textVis);
var cost_cont_v = ui.Label('Please Wait', numberVIS);
cost_cont.evaluate(function(val){cost_cont_v.setValue('$ '+val)}),numberVIS;


var RES3C = fcPolygon.filter('Occ == "RES3C"').size()
var res3c_h = ui.Label('Appartments, Group care homes :',textVis);
var res3c_v = ui.Label('Please Wait', numberVIS);
RES3C.evaluate(function(val){res3c_v.setValue(val)}),numberVIS;
var COM1 = fcPolygon.filter('Occ == "COM1"').size()
var com1_h = ui.Label('Armouries, shopping centres, kennels :',textVis);
var com1_v = ui.Label('Please Wait', numberVIS);
COM1.evaluate(function(val){com1_v.setValue(val)}),numberVIS;
var COM5 = fcPolygon.filter('Occ == "COM5"').size()
var com5_h = ui.Label('Banks affected:',textVis);
var com5_v = ui.Label('Please Wait', numberVIS);
COM5.evaluate(function(val){com5_v.setValue(val)}),numberVIS;
var IND3 = fcPolygon.filter('Occ == "IND3"').size()
var ind3_h = ui.Label('Creameries, bars, oil storage and cold storage:',textVis);
var ind3_v = ui.Label('Please Wait', numberVIS);
IND3.evaluate(function(val){ind3_v.setValue(val)}),numberVIS;
var COM8 = fcPolygon.filter('Occ == "COM8"').size()
var com8_h = ui.Label('Fitness centres, Recreation centres, clubs and pavillions:',textVis);
var com8_v = ui.Label('Please Wait', numberVIS);
COM8.evaluate(function(val){com8_v.setValue(val)}),numberVIS;
var COM9 = fcPolygon.filter('Occ == "COM9"').size()
var com9_h = ui.Label('Broadcasting facilities, convention centres, cafeteria and theatres:',textVis);
var com9_v = ui.Label('Please Wait', numberVIS);
COM9.evaluate(function(val){com9_v.setValue(val)}),numberVIS;
var COM4 = fcPolygon.filter('Occ == "COM4"').size()
var com4_h = ui.Label('Computer centres:',textVis);
var com4_v = ui.Label('Please Wait', numberVIS);
COM4.evaluate(function(val){com4_v.setValue(val)}),numberVIS;
var RES5 = fcPolygon.filter('Occ == "RES5"').size()
var res5_h = ui.Label('Dormitories:',textVis);
var res5_v = ui.Label('Please Wait', numberVIS);
RES5.evaluate(function(val){res5_v.setValue(val)}),numberVIS;
var RES1 = fcPolygon.filter('Occ == "RES1"').size()
var res1_h = ui.Label('Field Houses:',textVis);
var res1_v = ui.Label('Please Wait', numberVIS);
RES1.evaluate(function(val){res1_v.setValue(val)}),numberVIS;
var RES4 = fcPolygon.filter('Occ == "RES4"').size()
var res4_h = ui.Label('Hotels, lodges, motels, greenhouses, hangars and restrooms:',textVis);
var res4_v = ui.Label('Please Wait', numberVIS);
RES4.evaluate(function(val){res4_v.setValue(val)}),numberVIS;
var RES3B = fcPolygon.filter('Occ == "RES3B"').size()
var res3b_h = ui.Label('Affected fraternity homes and town houses:',textVis);
var res3b_v = ui.Label('Please Wait', numberVIS);
RES3B.evaluate(function(val){res3b_v.setValue(val)}),numberVIS;
var COM10 = fcPolygon.filter('Occ == "COM10"').size()
var com10_h = ui.Label('Garages and Fast Food:',textVis);
var com10_v = ui.Label('Please Wait', numberVIS);
COM10.evaluate(function(val){com10_v.setValue(val)}),numberVIS;
var RES6 = fcPolygon.filter('Occ == "RES6"').size()
var res6_h = ui.Label('Nursing Homes:',textVis);
var res6_v = ui.Label('Please Wait', numberVIS);
RES6.evaluate(function(val){res6_v.setValue(val)}),numberVIS;
var COM6 = fcPolygon.filter('Occ == "COM6"').size()
var com6_h = ui.Label('Hospitals:',textVis);
var com6_v = ui.Label('Please Wait', numberVIS);
COM6.evaluate(function(val){com6_v.setValue(val)}),numberVIS;
var IND5 = fcPolygon.filter('Occ == "IND5"').size()
var ind5_h = ui.Label('Industrial Engg:',textVis);
var ind5_v = ui.Label('Please Wait', numberVIS);
IND5.evaluate(function(val){ind5_v.setValue(val)}),numberVIS;
var EDU1 = fcPolygon.filter('Occ == "EDU1"').size()
var edu1_h = ui.Label('Schools:',textVis);
var edu1_v = ui.Label('Please Wait', numberVIS);
EDU1.evaluate(function(val){edu1_v.setValue(val)}),numberVIS;
var IND2 = fcPolygon.filter('Occ == "IND2"').size()
var ind2_h = ui.Label('Flex mall Light manufacturing:',textVis);
var ind2_v = ui.Label('Please Wait', numberVIS);
IND2.evaluate(function(val){ind2_v.setValue(val)}),numberVIS;
var COM3 = fcPolygon.filter('Occ == "COM3"').size()
var com3_h = ui.Label('Laundry, laundromats and visitor centres:',textVis);
var com3_v = ui.Label('Please Wait', numberVIS);
COM3.evaluate(function(val){com3_v.setValue(val)}),numberVIS;
var COM2 = fcPolygon.filter('Occ == "COM2"').size()
var com2_h = ui.Label('Maintanence, markets, material shelter,warehouses,sheds:',textVis);
var com2_v = ui.Label('Please Wait', numberVIS);
COM2.evaluate(function(val){com2_v.setValue(val)}),numberVIS;
var COM7 = fcPolygon.filter('Occ == "COM7"').size()
var com7_h = ui.Label('Clinics, Mortuaries, drug stores:',textVis);
var com7_v = ui.Label('Please Wait', numberVIS);
COM7.evaluate(function(val){com7_v.setValue(val)}),numberVIS;
var RES3A= fcPolygon.filter('Occ == "RES3A"').size()
var res3a_h = ui.Label('Multiple Residences:',textVis);
var res3a_v = ui.Label('Please Wait', numberVIS);
RES3A.evaluate(function(val){res3a_v.setValue(val)}),numberVIS;
var REL1 = fcPolygon.filter('Occ == "REL1"').size();
var rel1_h = ui.Label('Religious Buildings:',textVis);
var rel1_v = ui.Label('Please Wait', numberVIS);
REL1.evaluate(function(val){rel1_v.setValue(val)}),numberVIS;
var COM11= fcPolygon.filter('Occ == "COM11"').size();
var com11_h = ui.Label('Restaurant:Snackbars:',textVis);
var com11_v = ui.Label('Please Wait', numberVIS);
COM11.evaluate(function(val){com11_v.setValue(val)}),numberVIS;
var GOV1 = fcPolygon.filter('Occ == "GOV1"').size();
var gov1_h = ui.Label('Governmental institutions:',textVis);
var gov1_v = ui.Label('Please Wait', numberVIS);
GOV1.evaluate(function(val){gov1_v.setValue(val)}),numberVIS;

var  totcom_6 =  ee.FeatureCollection('projects/ee-rhrt-hand/assets/Commercial_Industrial_Depth_6m_1_sorted');
//var commercial = totcom_5.filter(ee.Filter.notEquals({leftField: leftProperty, rightValue: 0}))
var commercial = img.sampleRegions({
  collection: totcom_6,
  //scale: 10,
  geometries: true
});

var BldgLossUSD_comm = commercial.aggregate_sum('BldgLossUSD');
var cost_comm = BldgLossUSD_comm.toInt();
var cost_comm_h = ui.Label('Cost estimated (commercial):',textVis);
var cost_comm_v = ui.Label('Please Wait', numberVIS);
cost_comm.evaluate(function(val){cost_comm_v.setValue('$ '+val)}),numberVIS;
var comm = commercial.size();
var comm_h = ui.Label('Total number of commercial buildings:',textVis);
var comm_v = ui.Label('Please Wait', numberVIS);
comm.evaluate(function(val){comm_v.setValue(val)}),numberVIS;


var totagr_6= ee.FeatureCollection('projects/ee-rhrt-hand/assets/Agriculture_Depth_6m_1_sorted');
//var agriculture = totagr_5.filter(ee.Filter.notEquals({leftField: leftProperty, rightValue: 0}))
//print('Total number of agricultural buildings affected:', agriculture)
var agriculture = img.sampleRegions({
  collection: totagr_6,
  //scale: 10,
  geometries: true
});

var BldgLossUSD_agri = agriculture.aggregate_sum('BldgLossUSD');
var cost_agri =  BldgLossUSD_agri.toInt();
var cost_agri_h = ui.Label('Cost estimated (agriculture):',textVis);
var cost_agri_v = ui.Label('Please Wait', numberVIS);
cost_agri.evaluate(function(val){cost_agri_v.setValue('$ '+val)}),numberVIS;
var agri = agriculture.size();
var agri_h = ui.Label('Total number of agricultural buildings:',textVis);
var agri_v = ui.Label('Please Wait', numberVIS);
agri.evaluate(function(val){agri_v.setValue(val)}),numberVIS;



var totres_6= ee.FeatureCollection('projects/ee-rhrt-hand/assets/Residential_Depth_6m_1_sorted');
//var residential = totres_5.filter(ee.Filter.notEquals({leftField: leftProperty, rightValue: 0}))
//print('Total number of residential buildings affected:', residential)
var residential = img.sampleRegions({
  collection: totres_6,
  //scale: 10,
  geometries: true
});

var BldgLossUSD_res = residential.aggregate_sum('BldgLossUSD');
var cost_res= BldgLossUSD_res.toInt();
var cost_res_h = ui.Label('Cost estimated (residential):',textVis);
var cost_res_v = ui.Label('Please Wait', numberVIS);
cost_res.evaluate(function(val){cost_res_v.setValue('$ '+val)}),numberVIS;
var res =  residential.size();
var res_h = ui.Label('Total number of residential buildings:',textVis);
var res_v = ui.Label('Please Wait', numberVIS);
res.evaluate(function(val){res_v.setValue(val)}),numberVIS;



results1.add(ui.Panel([
        text,
        number,
        text1,
        number1,
        text4,
        number4,
        text3,
        number3,
        tb_h,
        tb_v,
        cost_total_h,
        cost_total_v,
        cost_inv_h,
        cost_inv_v,
        cost_cont_h,
        cost_cont_v,
        res_h,
        res_v,
        cost_res_h,
        cost_res_v,
        comm_h,
        comm_v,
        cost_comm_h,
        cost_comm_v,
        agri_h,
        agri_v,
        cost_agri_h,
        cost_agri_v,
        res3c_h,
        res3c_v,
        com1_h,
        com1_v,
        com5_h,
        com5_v,
        ind3_h,
        ind3_v,
        com8_h,
        com8_v,
        com9_h,
        com9_v,
        com4_h,
        com4_v,
        res5_h,
        res5_v,
        gov1_h,
        gov1_v,
        res1_h,
        res1_v,
        res4_h,
        res4_v,
        res3b_h,
        res3b_v,
        res6_h,
        res6_v,
        com6_h,
        com6_v,
        ind5_h,
        ind5_v,
        edu1_h,
        edu1_v,
        ind2_h,
        ind2_v,
        com3_h,
        com3_v,
        com2_h,
        com2_v,
        com7_h,
        com7_v,
        res3a_h,
        res3a_v,
        rel1_h,
        rel1_v,
        com11_h,
        com11_v,
        air_aff,
        air_aff1,
        air_run,
        air_run1,
        bff,
        bfff,
        eocf,
        eocff,
        fff,
        ffff,
        hpf,
        hpff,
        hbf,
        hbff,
        psf,
        psff,
        portf,
        portff,
        rbf,
        rbff,
        epff,
        epfff,
        wwff,
        wwfff,
        mcff,
        mcfff,
        fsff,
        fsfff,
        text16,
        number16,
        text17,
        number17,
        text18,
        number18,
        text19,
        number19,
        text20,
        number20,
        text21,
        number21,
        
      ]
      ));
      




  
/*var houghton_popu = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Houghton_Census_Block').filterBounds(swater.geometry());
Map.addLayer(houghton_popu,{},'Houghton-Affected_population',0);*/


var denver = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level2')
    .filter("ADM2_NAME == 'Houghton'")
    .filter(ee.Filter.eq('ADM2_NAME', 'Houghton'))  // Exactly the same as above.
    .first()
    .geometry();

//Map.centerObject(denver, 9);
//Map.addLayer(denver, null, 'Houghton')

/*var houghton_c = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Houghton_Census_Block');
var filtered = houghton_c.filterBounds(denver);
Map.addLayer(filtered,{},'Filtered',0);

var geometry = houghton_c.geometry();*/

//Map.addLayer(flooded, {palette:"0000FF"},'Flooded areas',0);

//Map.addLayer(shp,{},'Houghton',0)

Map.addLayer(flooded, {palette:"0000FF"},'Flooded areas');

Map.add(results1);
//Map.addLayer(shp1,{},'Houghton');

//Map.addLayer(population_count, populationCountVis, 'Population Density',0);

Map.addLayer(population_exposed, populationExposedVis, 'Exposed Population',0);

//Map.addLayer(crop_land,  croplandVis, 'Cropland',0);

Map.addLayer(cropland_affected, croplandVis, 'Affected Cropland',0); 

/*var discharge = ee.FeatureCollection('projects/ee-rhrt-hand/assets/file_name1');
Map.addLayer(discharge.style(style),{},'Discharge',0);*/

Map.addLayer(fcPolygon, {color: 'yellow'},'Buildings',0);
Map.addLayer(agriculture, {color: 'lightgreen'},'Agricultural',0);
Map.addLayer(commercial, {color: 'cyan'},'Commercial',0);
Map.addLayer(residential, {color: 'pink'},'Residential',0);

  

}

function hand_fhd(){ 
  
 //drawingTools.stop();

  var aoi = drawingTools.layers().get(0).getEeObject();
  
  clearGeometry();

  // Set the drawing mode back to null; turns drawing off.
  drawingTools.setShape(null);

  var HAND= ee.Image("users/rhrt/Depth_7m");

  var reclassify = HAND.updateMask(HAND.gte(0)).clip(aoi);
  
var shp = ee.FeatureCollection("projects/ee-rhrt-hand/assets/Aggregate_Data-csv");
//var agg = shp.geometry()

var dbb = ee.FeatureCollection("projects/ee-rhrt-hand/assets/Dbb");
//var agg_dbb = dbb.geometry()

var ecbb = ee.FeatureCollection("projects/ee-rhrt-hand/assets/Ecbb");
//var agg_ecbb = ecbb.geometry()

var swater = ee.Image(reclassify).select('b1');
var swater_mask = swater.gte(0).updateMask(swater.gte(0));
var connections = swater_mask.connectedPixelCount();
var flooded = swater_mask.updateMask(connections.gt(0));


var flood_pixelarea = swater_mask
  .multiply(ee.Image.pixelArea());

var flood_stats = flood_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(),              
  geometry: swater.geometry(),
  //scale: 10, // native resolution 
  //maxPixels: 1e9,
  bestEffort: true
  });

var flood_area_ha = flood_stats
  .getNumber('b1')
  .divide(10000)
  .round(); 

//LandUse and CropLand
var LC = ee.Image('users/rhrt/Farm_Land').select('b1').clip(swater.geometry());


/*var cropmask = LC
  .eq(12)
  .or(LC.eq(14))
var cropland = LC
  .updateMask(cropmask)*/

var crop_projection = LC.select('b1').projection();
//print('projection', crop_projection);
var flooded_res = flooded
    .reproject({
    crs: crop_projection
  });
  
var crop_land = LC.updateMask(LC);

var cropland_affected = (flooded_res)
  .updateMask(LC);

var crop_pixelarea = cropland_affected
  .multiply(ee.Image.pixelArea());
//print('crop_pixelarea', crop_pixelarea)
  
var crop_stats = crop_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(), //sum all pixels with area information                
  geometry: swater.geometry(),
  scale: 500,
  maxPixels: 1e9
});
//print('crop_stats', crop_stats);

var crop_area_ha = crop_stats
  .getNumber('b1')
  .divide(10000)
  .round();
  
var croplandVis = {
  min: 0,
  max: 14.0,
  palette: ['30b21c'],
};

//Population
var population_count = ee.Image('users/rhrt/GHS_POP_E2015_GLOBE_R2019A_4326_9ss_V1_0_9_3').select('b1').clip(swater.geometry());
var GHSLprojection = population_count.select('b1').projection();



var flooded_res1 = flooded
    .reproject({
    crs: GHSLprojection
  });


var population_exposed = population_count
  .updateMask(flooded_res1)
  .updateMask(population_count);


var stats = population_exposed.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: swater.geometry(),
  scale: 250,
  maxPixels:1e9 
});
//print('stats',  stats);

var number_pp_exposed = stats.getNumber('b1').round();
//print('PP_E', number_pp_exposed);

var populationCountVis = {
  min: 0,
  max: 200.0,
  palette: ['060606','337663','337663','ffffff'],
};


var populationExposedVis = {
  min: 0,
  max: 200.0,
  palette: ['yellow', 'orange', 'red'],
};

  
var results1 = ui.Panel({
  style: {
    position: 'bottom-right',
    
     width: '310px', height: '500px'
  }
});

var textVis = {
  'margin':'0px 8px 2px 0px',
  'fontSize': '15px',
  //'fontWeight':'bold',
  'fontFamily':'serif'
  };
var numberVIS = {
  'margin':'0px 0px 15px 0px', 
  'color':'blue',
  'fontWeight':'bold',
  'fontFamily':'monospace'
  };
var subTextVis = {
  'margin':'0px 0px 2px 0px',
  'fontSize':'12px',
  'color':'grey',
  'fontFamily':'serif'
  };

var titleTextVis = {
  'margin':'0px 0px 10px 0px',
  'fontSize': '17px', 
  'font-weight':'bold', 
  'color': '3333ff',
  'fontFamily':'monospace',
  'textDecoration':'underline'
  
  };
  
/*var text2 = ui.Label('Estimated flood extent:',textVis);
var number2 = ui.Label('Please wait...',numberVIS); 
flood_area_ha.evaluate(function(val){number2.setValue(val+' hectares')}),numberVIS;*/

var text4 = ui.Label('Estimated affected cropland:',textVis);
var number4 = ui.Label('Please wait...',numberVIS);
crop_area_ha.evaluate(function(val){number4.setValue(val+' hectares')}),numberVIS;

var text3 = ui.Label('Estimated number of exposed people: ',textVis);
var number3 = ui.Label('Please wait...',numberVIS);
number_pp_exposed.evaluate(function(val){number3.setValue(val)}),numberVIS;

var flood_stats_fhd = flood_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(),              
  geometry: denver,
  //scale: 10, // native resolution 
  maxPixels: 1e9,
  bestEffort: true
  });
  
var flood_area_ha_fhd = flood_stats_fhd
  .getNumber('b1')
  .divide(10000)
  .round(); 
  
//print('Flooded Area (Ha)',flood_area_ha_fhd );

var text = ui.Label('Summary ',titleTextVis);
var text1 = ui.Label('Flood extent ',textVis);
//var number1 = ui.Label(flood_area_ha);
var number1 = ui.Label('Please wait...',numberVIS); 
flood_area_ha_fhd.evaluate(function(val){number1.setValue(val+' hectares')}),numberVIS;

//var img = ee.Image('users/rhrt/Depth_7m');
var img = reclassify;
//Map.addLayer(img, {palette:"0000FF"}, 'img',0);

var airport = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Airport_Facilities');


var airportSamp = img.sampleRegions({
  collection: airport,
  //scale: 10,
  geometries: true
});
var airport_sz = airportSamp.size();
var air_aff = ui.Label('Airport facilities:',textVis);
var air_aff1 = ui.Label('Please Wait', numberVIS);
airport_sz.evaluate(function(val){air_aff1.setValue(val)}),numberVIS;


var fcPolygon1 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Airpot_runaways');
var fcPolygonSamp1 = img.sampleRegions({
  collection: fcPolygon1,
  //scale: 10,
  geometries: true
});
var airport_run = fcPolygonSamp1.size();
var air_run = ui.Label('Airport runaways:',textVis);
var air_run1 = ui.Label('Please Wait', numberVIS);
airport_run.evaluate(function(val){air_run1.setValue(val)}),numberVIS;

var fcPolygon2 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Bus_Facilities');
var fcPolygonSamp2 = img.sampleRegions({
  collection: fcPolygon2,
  //scale: 10,
  geometries: true
});
var bf = fcPolygonSamp2.size();
var bff = ui.Label('Bus facilities affected:',textVis);
var bfff = ui.Label('Please Wait', numberVIS);
bf.evaluate(function(val){bfff.setValue(val)}),numberVIS;

var fcPolygon4 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/EOC');
var fcPolygonSamp4 = img.sampleRegions({
  collection: fcPolygon4,
  //scale: 10,
  geometries: true
});
var eoc = fcPolygonSamp4.size();
var eocf = ui.Label('Emergency Operation Centeres:',textVis);
var eocff = ui.Label('Please Wait', numberVIS);
eoc.evaluate(function(val){eocff.setValue(val)}),numberVIS;

var fcPolygon5 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Ferry_Facilities');
var fcPolygonSamp5 = img.sampleRegions({
  collection: fcPolygon5,
  //scale: 10,
  geometries: true
});
var ff = fcPolygonSamp5.size();
var fff = ui.Label('Ferry facilities:',textVis);
var ffff = ui.Label('Please Wait', numberVIS);
ff.evaluate(function(val){ffff.setValue(val)}),numberVIS;

var fcPolygon6 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/High_Potential_Loss_Facilities-csv');
var fcPolygonSamp6 = img.sampleRegions({
  collection: fcPolygon6,
  //scale: 10,
  geometries: true
});
var hp = fcPolygonSamp6.size();
var hpf = ui.Label('High potential facilities:',textVis);
var hpff = ui.Label('Please Wait', numberVIS);
hp.evaluate(function(val){hpff.setValue(val)}),numberVIS;

var fcPolygon7 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Highway_bridges');
var fcPolygonSamp7 = img.sampleRegions({
  collection: fcPolygon7,
  //scale: 10,
  geometries: true
});
var hb = fcPolygonSamp7.size();
var hbf = ui.Label('Highway bridges:',textVis);
var hbff = ui.Label('Please Wait', numberVIS);
hb.evaluate(function(val){hbff.setValue(val)}),numberVIS;

var fcPolygon8 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/PS');
var fcPolygonSamp8 = img.sampleRegions({
  collection: fcPolygon8,
  //scale: 10,
  geometries: true
});
var ps = fcPolygonSamp8.size();
var psf = ui.Label('Police stations:',textVis);
var psff = ui.Label('Please Wait', numberVIS);
ps.evaluate(function(val){psff.setValue(val)}),numberVIS;

var fcPolygon9 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Port_facilities');
var fcPolygonSamp9 = img.sampleRegions({
  collection: fcPolygon9,
  //scale: 10,
  geometries: true
});
var port = fcPolygonSamp9.size();
var portf = ui.Label('Port facilities:',textVis);
var portff = ui.Label('Please Wait', numberVIS);
port.evaluate(function(val){portff.setValue(val)}),numberVIS;

var fcPolygon10 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Railway_bridges');
var fcPolygonSamp10 = img.sampleRegions({
  collection: fcPolygon10,
  //scale: 10,
  geometries: true
});
var rb = fcPolygonSamp10.size();
var rbf = ui.Label('Railway bridges:',textVis);
var rbff = ui.Label('Please Wait', numberVIS);
rb.evaluate(function(val){rbff.setValue(val)}),numberVIS;

var fcPolygon11 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/EPF-csv');
var fcPolygonSamp11 = img.sampleRegions({
  collection: fcPolygon11,
 // scale: 10,
  geometries: true
});
var epf = fcPolygonSamp11.size();
var epff = ui.Label('Electric power facilities:',textVis);
var epfff = ui.Label('Please Wait', numberVIS);
epf.evaluate(function(val){epfff.setValue(val)}),numberVIS;

var fcPolygon13 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Waste-Water-csv');
var fcPolygonSamp13 = img.sampleRegions({
  collection: fcPolygon13,
  //scale: 10,
  geometries: true
});
var wwf = fcPolygonSamp13.size();
var wwff = ui.Label('Waste water facilities:',textVis);
var wwfff = ui.Label('Please Wait', numberVIS);
wwf.evaluate(function(val){wwfff.setValue(val)}),numberVIS;

var fcPolygon14 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/MC1');
var fcPolygonSamp14 = img.sampleRegions({
  collection: fcPolygon14,
  //scale: 10,
  geometries: true
});

var mcf = fcPolygonSamp14.size();
var mcff = ui.Label('Medical care facilities:',textVis);
var mcfff = ui.Label('Please Wait', numberVIS);
mcf.evaluate(function(val){mcfff.setValue(val)}),numberVIS;

var fcPolygon15 = ee.FeatureCollection('projects/ee-rhrt-hand/assets/FSF1');
var fcPolygonSamp15 = img.sampleRegions({
  collection: fcPolygon15,
  //scale: 10,
  geometries: true
});

var fsf = fcPolygonSamp14.size();
var fsff = ui.Label('Fire station facilities:',textVis);
var fsfff = ui.Label('Please Wait', numberVIS);
fsf.evaluate(function(val){fsfff.setValue(val)}),numberVIS;


var number = ui.Label(" ");

var area_m2 = shp.aggregate_sum("Cars").getInfo()
var area_km = (area_m2 /1041)
var text16 = ui.Label("Estimated number of Cars affected:",textVis);
var number16 = ui.Label('Please wait...', numberVIS);
var ncars = ee.Number(area_km).toInt();
ncars.evaluate(function(val){number16.setValue(val)}),numberVIS;

var ht = shp.aggregate_sum("Heavy Trucks").getInfo()
var ht2 = ht / 1041
var text17 = ui.Label("Estimated number of affected Heavy Trucks: ",textVis);
var number17 = ui.Label('Please wait...', numberVIS);
var nhtrucks = ee.Number(ht2).toInt();
nhtrucks.evaluate(function(val){number17.setValue(val)}),numberVIS;

var lt = shp.aggregate_sum("Light Trucks").getInfo()
var lt2 = lt / 1041
var text18 = ui.Label("Estimated number of affected Light Trucks: ",textVis);
var number18 = ui.Label('Please wait...', numberVIS);
var nltrucks = ee.Number(lt2).toInt();
nltrucks.evaluate(function(val){number18.setValue(val)}),numberVIS;

var tv  = shp.aggregate_sum("Total Vehicles").getInfo()
var tv2 = tv / 1041
var text19 = ui.Label("Estimated number of Total Vehicles affected: ",textVis);
var number19 = ui.Label('Please wait...', numberVIS);
var ntv = ee.Number(tv2).toInt();
ntv.evaluate(function(val){number19.setValue(val)}),numberVIS;

var fp = dbb.aggregate_sum("Total Female Population").getInfo()
var fp2 = 3361
var text20 = ui.Label("Estimated number of Females affected: ",textVis);
var number20 = ui.Label('Please wait...', numberVIS);
var nfp = ee.Number(fp2).toInt();
nfp.evaluate(function(val){number20.setValue(val)}),numberVIS;

var mp = dbb.aggregate_sum("Total Male Population").getInfo()
var mp2 = 3965
var text21 = ui.Label("Estimated number of Males affected: ",textVis);
var number21 = ui.Label('Please wait...', numberVIS);
var nmp = ee.Number(mp2).toInt();
nmp.evaluate(function(val){number21.setValue(val)}),numberVIS;



var seven_met = ee.FeatureCollection('projects/ee-rhrt-hand/assets/H-UDF_Depth_7m1_sorted');
/*var leftProperty = 'BDDF_ID';
var rightProperty = '0';
var fcPolygon = seven_met.filter(ee.Filter.notEquals({leftField: leftProperty, rightValue: 0}))*/
var fcPolygon = img.sampleRegions({
  collection: seven_met,
  //scale: 10,
  geometries: true
});


var tb = fcPolygon.size();
var tb_h = ui.Label('Total number of buildings affected :',textVis);
var tb_v = ui.Label('Please Wait', numberVIS);
tb.evaluate(function(val){tb_v.setValue(val)}),numberVIS;

var BldgLossUSD = fcPolygon.aggregate_sum('BldgLossUSD')
var cost_total = BldgLossUSD.toInt();
var cost_total_h = ui.Label('Cost estimated (Total):',textVis);
var cost_total_v = ui.Label('Please Wait', numberVIS);
cost_total.evaluate(function(val){cost_total_v.setValue('$ '+ val)}),numberVIS;

var InventoryLossUSD = fcPolygon.aggregate_sum('InventoryLossUSD');
var cost_inv = InventoryLossUSD.toInt();
var cost_inv_h = ui.Label('Cost estimated (Inventory):',textVis);
var cost_inv_v = ui.Label('Please Wait', numberVIS);
cost_inv.evaluate(function(val){cost_inv_v.setValue('$ '+ val)}),numberVIS;

var ContentLossUSD = fcPolygon.aggregate_sum('ContentLossUSD');
var cost_cont = ContentLossUSD.toInt();
var cost_cont_h = ui.Label('Cost estimated (Content):',textVis);
var cost_cont_v = ui.Label('Please Wait', numberVIS);
cost_cont.evaluate(function(val){cost_cont_v.setValue('$ '+ val)}),numberVIS;



var RES3C = fcPolygon.filter('Occ == "RES3C"').size();
var res3c_h = ui.Label('Appartments, Group care homes :',textVis);
var res3c_v = ui.Label('Please Wait', numberVIS);
RES3C.evaluate(function(val){res3c_v.setValue(val)}),numberVIS;
var COM1 = fcPolygon.filter('Occ == "COM1"').size();
var com1_h = ui.Label('Armouries, shopping centres, kennels :',textVis);
var com1_v = ui.Label('Please Wait', numberVIS);
COM1.evaluate(function(val){com1_v.setValue(val)}),numberVIS;
var COM5 = fcPolygon.filter('Occ == "COM5"').size();
var com5_h = ui.Label('Banks affected:',textVis);
var com5_v = ui.Label('Please Wait', numberVIS);
COM5.evaluate(function(val){com5_v.setValue(val)}),numberVIS;
var IND3 = fcPolygon.filter('Occ == "IND3"').size();
var ind3_h = ui.Label('Creameries, bars, oil storage and cold storage:',textVis);
var ind3_v = ui.Label('Please Wait', numberVIS);
IND3.evaluate(function(val){ind3_v.setValue(val)}),numberVIS;
var COM8 = fcPolygon.filter('Occ == "COM8"').size();
var com8_h = ui.Label('Fitness centres, Recreation centres, clubs and pavillions:',textVis);
var com8_v = ui.Label('Please Wait', numberVIS);
COM8.evaluate(function(val){com8_v.setValue(val)}),numberVIS;
var COM9 = fcPolygon.filter('Occ == "COM9"').size();
var com9_h = ui.Label('Broadcasting facilities, convention centres, cafeteria and theatres:',textVis);
var com9_v = ui.Label('Please Wait', numberVIS);
COM9.evaluate(function(val){com9_v.setValue(val)}),numberVIS;
var COM4 = fcPolygon.filter('Occ == "COM4"').size();
var com4_h = ui.Label('Computer centres:',textVis);
var com4_v = ui.Label('Please Wait', numberVIS);
COM4.evaluate(function(val){com4_v.setValue(val)}),numberVIS;
var RES5 = fcPolygon.filter('Occ == "RES5"').size();
var res5_h = ui.Label('Dormitories:',textVis);
var res5_v = ui.Label('Please Wait', numberVIS);
RES5.evaluate(function(val){res5_v.setValue(val)}),numberVIS;
var RES1 = fcPolygon.filter('Occ == "RES1"').size();
var res1_h = ui.Label('Field Houses:',textVis);
var res1_v = ui.Label('Please Wait', numberVIS);
RES1.evaluate(function(val){res1_v.setValue(val)}),numberVIS;
var RES4 = fcPolygon.filter('Occ == "RES4"').size();
var res4_h = ui.Label('Hotels, lodges, motels, greenhouses, hangars and restrooms:',textVis);
var res4_v = ui.Label('Please Wait', numberVIS);
RES4.evaluate(function(val){res4_v.setValue(val)}),numberVIS;
var RES3B = fcPolygon.filter('Occ == "RES3B"').size();
var res3b_h = ui.Label('Affected fraternity homes and town houses:',textVis);
var res3b_v = ui.Label('Please Wait', numberVIS);
RES3B.evaluate(function(val){res3b_v.setValue(val)}),numberVIS;
var COM10 = fcPolygon.filter('Occ == "COM10"').size();
var com10_h = ui.Label('Garages and Fast Food:',textVis);
var com10_v = ui.Label('Please Wait', numberVIS);
COM10.evaluate(function(val){com10_v.setValue(val)}),numberVIS;
var RES6 = fcPolygon.filter('Occ == "RES6"').size();
var res6_h = ui.Label('Nursing Homes:',textVis);
var res6_v = ui.Label('Please Wait', numberVIS);
RES6.evaluate(function(val){res6_v.setValue(val)}),numberVIS;
var COM6 = fcPolygon.filter('Occ == "COM6"').size();
var com6_h = ui.Label('Hospitals:',textVis);
var com6_v = ui.Label('Please Wait', numberVIS);
COM6.evaluate(function(val){com6_v.setValue(val)}),numberVIS;
var IND5 = fcPolygon.filter('Occ == "IND5"').size();
var ind5_h = ui.Label('Industrial Engg:',textVis);
var ind5_v = ui.Label('Please Wait', numberVIS);
IND5.evaluate(function(val){ind5_v.setValue(val)}),numberVIS;
var EDU1 = fcPolygon.filter('Occ == "EDU1"').size();
var edu1_h = ui.Label('Schools:',textVis);
var edu1_v = ui.Label('Please Wait', numberVIS);
EDU1.evaluate(function(val){edu1_v.setValue(val)}),numberVIS;
var IND2 = fcPolygon.filter('Occ == "IND2"').size();
var ind2_h = ui.Label('Flex mall Light manufacturing:',textVis);
var ind2_v = ui.Label('Please Wait', numberVIS);
IND2.evaluate(function(val){ind2_v.setValue(val)}),numberVIS;
var COM3 = fcPolygon.filter('Occ == "COM3"').size();
var com3_h = ui.Label('Laundry, laundromats and visitor centres:',textVis);
var com3_v = ui.Label('Please Wait', numberVIS);
COM3.evaluate(function(val){com3_v.setValue(val)}),numberVIS;
var COM2 = fcPolygon.filter('Occ == "COM2"').size();
var com2_h = ui.Label('Maintanence, markets, material shelter,warehouses,sheds:',textVis);
var com2_v = ui.Label('Please Wait', numberVIS);
COM2.evaluate(function(val){com2_v.setValue(val)}),numberVIS;
var COM7 = fcPolygon.filter('Occ == "COM7"').size();
var com7_h = ui.Label('Clinics, Mortuaries, drug stores:',textVis);
var com7_v = ui.Label('Please Wait', numberVIS);
COM7.evaluate(function(val){com7_v.setValue(val)}),numberVIS;
var RES3A= fcPolygon.filter('Occ == "RES3A"').size();
var res3a_h = ui.Label('Multiple Residences:',textVis);
var res3a_v = ui.Label('Please Wait', numberVIS);
RES3A.evaluate(function(val){res3a_v.setValue(val)}),numberVIS;
var REL1 = fcPolygon.filter('Occ == "REL1"').size();
var rel1_h = ui.Label('Religious Buildings:',textVis);
var rel1_v = ui.Label('Please Wait', numberVIS);
REL1.evaluate(function(val){rel1_v.setValue(val)}),numberVIS;
var COM11= fcPolygon.filter('Occ == "COM11"').size();
var com11_h = ui.Label('Restaurant:Snackbars:',textVis);
var com11_v = ui.Label('Please Wait', numberVIS);
COM11.evaluate(function(val){com11_v.setValue(val)}),numberVIS;
var GOV1 = fcPolygon.filter('Occ == "GOV1"').size();
var gov1_h = ui.Label('Governmental institutions:',textVis);
var gov1_v = ui.Label('Please Wait', numberVIS);
GOV1.evaluate(function(val){gov1_v.setValue(val)}),numberVIS;

var  totcom_7 =  ee.FeatureCollection('projects/ee-rhrt-hand/assets/Commercial_Industrial_Depth_7m1_sorted');
//var commercial = totcom_7.filter(ee.Filter.notEquals({leftField: leftProperty, rightValue: 0}));
var commercial = img.sampleRegions({
  collection: totcom_7,
  //scale: 10,
  geometries: true
});

var BldgLossUSD_comm = commercial.aggregate_sum('BldgLossUSD');
var cost_comm = BldgLossUSD_comm.toInt();
var cost_comm_h = ui.Label('Cost estimated (commercial):',textVis);
var cost_comm_v = ui.Label('Please Wait', numberVIS);
cost_comm.evaluate(function(val){cost_comm_v.setValue('$ '+val)}),numberVIS;
var comm = commercial.size();
var comm_h = ui.Label('Total number of commercial buildings:',textVis);
var comm_v = ui.Label('Please Wait', numberVIS);
comm.evaluate(function(val){comm_v.setValue(val)}),numberVIS;


var totagr_7= ee.FeatureCollection('projects/ee-rhrt-hand/assets/Agriculture_Depth_7m1_sorted');
//var agriculture = totagr_7.filter(ee.Filter.notEquals({leftField: leftProperty, rightValue: 0}))
//print('Total number of agricultural buildings affected:', agriculture)
var agriculture = img.sampleRegions({
  collection: totagr_7,
  //scale: 10,
  geometries: true
});

var BldgLossUSD_agri = agriculture.aggregate_sum('BldgLossUSD');
var cost_agri =  BldgLossUSD_agri.toInt();
var cost_agri_h = ui.Label('Cost estimated (agriculture):',textVis);
var cost_agri_v = ui.Label('Please Wait', numberVIS);
cost_agri.evaluate(function(val){cost_agri_v.setValue('$ '+val)}),numberVIS;
var agri = agriculture.size();
var agri_h = ui.Label('Total number of agricultural buildings:',textVis);
var agri_v = ui.Label('Please Wait', numberVIS);
agri.evaluate(function(val){agri_v.setValue(val)}),numberVIS;



var totres_7= ee.FeatureCollection('projects/ee-rhrt-hand/assets/Residential_Depth_7m1_sorted');
//var residential = totres_7.filter(ee.Filter.notEquals({leftField: leftProperty, rightValue: 0}))
//print('Total number of residential buildings affected:', residential)
var residential = img.sampleRegions({
  collection: totres_7,
  //scale: 10,
  geometries: true
});

var BldgLossUSD_res = residential.aggregate_sum('BldgLossUSD');
var cost_res= BldgLossUSD_res.toInt();
var cost_res_h = ui.Label('Cost estimated (residential):',textVis);
var cost_res_v = ui.Label('Please Wait', numberVIS);
cost_res.evaluate(function(val){cost_res_v.setValue('$ '+val)}),numberVIS;
var res =  residential.size();
var res_h = ui.Label('Total number of residential buildings:',textVis);
var res_v = ui.Label('Please Wait', numberVIS);
res.evaluate(function(val){res_v.setValue(val)}),numberVIS;





results1.add(ui.Panel([
        text,
        number,
        text1,number1,
        text4,number4,
        text3,number3,
        tb_h,
        tb_v,
        cost_total_h,
        cost_total_v,
        cost_inv_h,
        cost_inv_v,
        cost_cont_h,
        cost_cont_v,
        res_h,
        res_v,
        cost_res_h,
        cost_res_v,
        comm_h,
        comm_v,
        cost_comm_h,
        cost_comm_v,
        agri_h,
        agri_v,
        cost_agri_h,
        cost_agri_v,
        res3c_h,
        res3c_v,
        com1_h,
        com1_v,
        com5_h,
        com5_v,
        ind3_h,
        ind3_v,
        com8_h,
        com8_v,
        com9_h,
        com9_v,
        com4_h,
        com4_v,
        res5_h,
        res5_v,
        gov1_h,
        gov1_v,
        res1_h,
        res1_v,
        res4_h,
        res4_v,
        res3b_h,
        res3b_v,
        res6_h,
        res6_v,
        com6_h,
        com6_v,
        ind5_h,
        ind5_v,
        edu1_h,
        edu1_v,
        ind2_h,
        ind2_v,
        com3_h,
        com3_v,
        com2_h,
        com2_v,
        com7_h,
        com7_v,
        res3a_h,
        res3a_v,
        rel1_h,
        rel1_v,
        com11_h,
        com11_v,
        air_aff,
        air_aff1,
        air_run,
        air_run1,
        bff,
        bfff,
        eocf,
        eocff,
        fff,
        ffff,
        hpf,
        hpff,
        hbf,
        hbff,
        psf,
        psff,
        portf,
        portff,
        rbf,
        rbff,
        epff,
        epfff,
        wwff,
        wwfff,
        mcff,
        mcfff,
        fsff,
        fsfff,
        text16,
        number16,
        text17,
        number17,
        text18,
        number18,
        text19,
        number19,
        text20,
        number20,
        text21,
        number21,
        
      ]
      ));
      




  
/*var houghton_popu = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Houghton_Census_Block').filterBounds(swater.geometry());
Map.addLayer(houghton_popu,{},'Houghton-Affected_population',0);*/


var denver = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level2')
    .filter("ADM2_NAME == 'Houghton'")
    .filter(ee.Filter.eq('ADM2_NAME', 'Houghton'))  // Exactly the same as above.
    .first()
    .geometry();

//Map.centerObject(denver, 9);
//Map.addLayer(denver, null, 'Houghton')

/*var houghton_c = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Houghton_Census_Block');
var filtered = houghton_c.filterBounds(denver);
Map.addLayer(filtered,{},'Filtered',0);

var geometry = houghton_c.geometry();*/

//Map.addLayer(flooded, {palette:"0000FF"},'Flooded areas',0);









Map.addLayer(flooded, {palette:"0000FF"},'Flooded areas');

Map.add(results1);

//Map.addLayer(population_count, populationCountVis, 'Population Density',0);

Map.addLayer(population_exposed, populationExposedVis, 'Exposed Population',0);

//Map.addLayer(crop_land,  croplandVis, 'Cropland',0);

Map.addLayer(cropland_affected, croplandVis, 'Affected Cropland',0); 

/*var discharge = ee.FeatureCollection('projects/ee-rhrt-hand/assets/file_name1');
Map.addLayer(discharge.style(style),{},'Discharge',0);*/

Map.addLayer(fcPolygon, {color: 'yellow'},'Buildings',0);
Map.addLayer(agriculture, {color: 'lightgreen'},'Agricultural',0);
Map.addLayer(commercial, {color: 'cyan'},'Commercial',0);
Map.addLayer(residential, {color: 'pink'},'Residential',0);

  

  

}

  
