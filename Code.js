// Load datasets
var ab = ee.FeatureCollection('projects/ee-rhrt-fast/assets/ab_1904');
var Q = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Qp_Final_GEE_April');
var subbasinCollection = ee.FeatureCollection('projects/ee-rhrt-fast/assets/WUP_subbasins_MI_prj');
var Hand_Raster = ee.Image('projects/ee-rhrt-fast/assets/WUP_hand_prj')

// Define the inner join filter and perform the join
var toyFilter = ee.Filter.equals({ leftField: 'Gridcode', rightField: 'SUB_BASIN_ID' });
var toyJoin = ee.Join.inner().apply(ab, Q, toyFilter);

// Create a new feature collection with joined properties
var joinedCollection = toyJoin.map(function(pair) {
  var primary = ee.Feature(pair.get('primary'));
  var secondary = ee.Feature(pair.get('secondary'));
  return primary.copyProperties(secondary, ['SUB_BASIN_ID', 'Q25', 'Q50', 'Q100', 'Q500']);
});

// Compute H values for each feature
var computedCollection = joinedCollection.map(function(feature) {
  var a = ee.Number(feature.get('a'));
  var b = ee.Number(feature.get('b'));
  var Q25 = ee.Number(feature.get('Q25'));
  var Q50 = ee.Number(feature.get('Q50'));
  var Q100 = ee.Number(feature.get('Q100'));
  var Q500 = ee.Number(feature.get('Q500'));

  var H25 = a.multiply(Q25.pow(b));
  var H50 = a.multiply(Q50.pow(b));
  var H100 = a.multiply(Q100.pow(b));
  var H500 = a.multiply(Q500.pow(b));

  return feature.set({ 'H25': H25, 'H50': H50, 'H100': H100, 'H500': H500 });
});


// Perform an inner join with subbasinCollection
var joinedCollectionForInundation = ee.Join.inner().apply({
  primary: computedCollection,
  secondary: subbasinCollection,
  condition: ee.Filter.equals({ leftField: 'Gridcode', rightField: 'gridcode' })
});


var shp= ee.FeatureCollection('users/rhrt/Houghton').filter("NAME == 'Houghton'").first();

var shp1= shp;

var shp2 = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Baraga').geometry();
var shp3 = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Gogebic').geometry();
var shp4 = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Keweenaw').geometry();
var shp5 = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Ontonagon').geometry();

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
  
var shp= ee.FeatureCollection('users/rhrt/Houghton');
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
         textAlign: 'center',fontFamily:'monospace', color:'blue', fontWeight:'bold'
      }});




Map.setOptions('HYBRID');

var results = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px',
    width: '350px'
  }
});

var subTextVis = {
  'margin':'0px 0px 2px 0px',
  'fontSize':'12px',
  'color':'grey',
  'fontFamily':'monospace'
  };
var head = ui.Label({
        value:'Flood Hazard and Risk Assessment',
        style: {fontWeight:'bold', fontSize: '16px', margin: '10px 5px',color:'blue',fontFamily:'monospace'}
      });
var text6 = ui.Label('Helping rural counties to enhance flooding and coastal disaster resilience and adaptation',subTextVis);

var aoi;
var dropdown = ui.Select({
  items: ['Houghton', 'Baraga', 'Keweenaw','Ontonagon', 'Gogebic'],
  placeholder:'Choose a county',
  style: {stretch: 'horizontal',
         textAlign: 'center',
         fontFamily:'monospace',fontSize: '17px',color:'blue',fontWeight:'bold'
      }
});

// Define the link to open when the label is clicked
var link = ui.Label('i', {}, 'https://www.wuppdr.org/rhrt');
link.style().set({
  'color': 'white',
  'padding': '2px',
  'text-decoration': 'underline',
  'fontWeight': 'bold',
  'fontSize': '14px',
  'fontFamily': 'monospace',
  'backgroundColor': 'lightgrey' 
  
});

var headLinkPanel = ui.Panel({
  widgets: [head, link],
  layout: ui.Panel.Layout.Flow('horizontal')
});

var buttonPanel = ui.Panel({
  widgets: [
    ui.Button({
      label: '25 year',
      onClick: hand_tf,
      style: {
        fontFamily: 'monospace',
        fontSize: '17px',
        color: 'blue',
        width: '65px',
        fontWeight: 'bold'
      }
    }),
    ui.Button({
      label: '50 year',
      onClick: hand_ff,
      style: {
        fontFamily: 'monospace',
        fontSize: '17px',
        color: 'blue',
        width: '65px',
        fontWeight: 'bold'
      }
    }),
    ui.Button({
      label: '100 year',
      onClick: hand_hd,
      style: {
        fontFamily: 'monospace',
        fontSize: '17px',
        color: 'blue',
        width: '65px',
        fontWeight: 'bold'
      }
    }),
    ui.Button({
      label: '500 year',
      onClick: hand_fhd,
      style: {
        fontFamily: 'monospace',
        fontSize: '17px',
        color: 'blue',
        width: '65px',
        fontWeight: 'bold'
      }
    })
  ],
  layout: ui.Panel.Layout.Flow('horizontal')
});


  results.add(ui.Panel({
    widgets:[
      headLinkPanel,
      ui.Label({

      value:'Choose an area of interest (AOI):',
      style:{fontSize: '14px',color:'blue',fontFamily:'monospace',fontWeight:'bold'}
      }),
      dropdown,
      ui.Label({

      value:'or',
      style:{stretch: 'horizontal',fontSize: '14px',fontFamily:'monospace',color:'blue', fontWeight:'bold',textAlign: 'center'}
      }),
      ui.Button({
      label: symbol.rectangle + ' User-defined AOI',
      onClick: drawRectangle(),
      style: {stretch: 'horizontal',
         textAlign: 'center',
         fontFamily:'monospace',fontSize: '17px',color:'blue',fontWeight:'bold'
      }}),
      
       ui.Label({

      value:'Select flood return period:',
      style:{fontSize: '14px',color:'blue',fontFamily:'monospace', fontWeight:'bold'}
      }),
      buttonPanel,
      text6,
      resetButton
    ],
  
  }));
  


Map.add(results);
  
}





Map.setOptions('HYBRID');

var results = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px',
    width: '350px'
  }
});

var subTextVis = {
  'margin':'0px 0px 2px 0px',
  'fontSize':'12px',
  'color':'grey',
  'fontFamily':'monospace'
  };
var head = ui.Label({
        value:'Flood Hazard and Risk Assessment',
        style: {fontWeight:'bold', fontSize: '16px', margin: '10px 5px', color:'blue',fontFamily:'monospace'}
      });
var text6 = ui.Label('Helping rural counties to enhance flooding and coastal disaster resilience and adaptation',subTextVis);

var aoi;
var dropdown = ui.Select({
  items: ['Houghton', 'Baraga', 'Keweenaw','Ontonagon', 'Gogebic'],
  placeholder:'Choose a county',
  style: {stretch: 'horizontal',
         textAlign: 'center',
         fontFamily:'monospace',fontSize: '17px',color:'blue',fontWeight:'bold'
      }
});

// Define the link to open when the label is clicked
var link = ui.Label('i', {}, 'https://www.wuppdr.org/rhrt');
link.style().set({
  'color': 'white',
  'padding': '2px',
  'text-decoration': 'underline',
  'fontWeight': 'bold',
  'fontSize': '14px',
  'border':  '2px solid blue',
  'fontFamily': 'monospace',
  'backgroundColor': 'lightgrey' 
  
});

var headLinkPanel = ui.Panel({
  widgets: [head, link],
  layout: ui.Panel.Layout.Flow('horizontal')
});

var buttonPanel = ui.Panel({
  widgets: [
    ui.Button({
      label: '25 year',
      onClick: hand_tf,
      style: {
        fontFamily: 'monospace',
        fontSize: '17px',
        color: 'blue',
        width: '65px',
        fontWeight: 'bold'
      }
    }),
    ui.Button({
      label: '50 year',
      onClick: hand_fty,
      style: {
        fontFamily: 'monospace',
        fontSize: '17px',
        color: 'blue',
        width: '65px',
        fontWeight: 'bold'
      }
    }),
    ui.Button({
      label: '100 year',
      onClick: hand_hd,
      style: {
        fontFamily: 'monospace',
        fontSize: '17px',
        color: 'blue',
        width: '65px',
        fontWeight: 'bold'
      }
    }),
    ui.Button({
      label: '500 year',
      onClick: hand_fhd,
      style: {
        fontFamily: 'monospace',
        fontSize: '17px',
        color: 'blue',
        width: '65px',
        fontWeight: 'bold'
      }
    })
  ],
  layout: ui.Panel.Layout.Flow('horizontal')
});


  results.add(ui.Panel({
    widgets:[
      headLinkPanel,
      ui.Label({

      value:'Choose an area of interest (AOI):',
      style:{fontSize: '14px',color:'blue',fontFamily:'monospace',fontWeight:'bold'}
      }),
      dropdown,
      ui.Label({
      value:'or',
      style:{stretch: 'horizontal',fontSize: '14px',fontFamily:'monospace',color:'blue', fontWeight:'bold',textAlign: 'center'}
      }),
      ui.Button({
      label: symbol.rectangle + ' User-defined AOI',
      onClick: drawRectangle(),
      style: {stretch: 'horizontal',
         textAlign: 'center',
         fontFamily:'monospace',fontSize: '17px',color:'blue',fontWeight:'bold'
      }}),
       ui.Label({

      value:'Select flood return period:',
      style:{fontSize: '14px',color:'blue',fontFamily:'monospace', fontWeight:'bold'}
      }),
      buttonPanel,
      text6,
      resetButton
    ],
  
  }));
  

  


Map.add(results);


var results1 = ui.Panel({
  style: {
    position: 'bottom-right',
    
     width: '310px', height: '500px'
  }
});



// Create a legend
var legend = ui.Panel({
  style: {
    position: 'bottom-center',
    padding: '8px',
    backgroundColor: 'white',
    //border: '1px solid black'
  }
});

// Create and add labels to the legend
var legendTitle = ui.Label({
  value: 'Legend',
  style: {
    fontWeight: 'bold',
    fontSize: '12px',
    margin: '0 0 4px 0',
    padding: '0',
    fontFamily:'monospace',
    color:'blue'
  }
});
legend.add(legendTitle);

// Add items to the legend
var items = [
  {name: 'Residential', color: 'red'},
  {name: 'Agricultural', color: 'magenta'},
  {name: 'Commercial', color: 'cyan'},
  {name:'Buildings',color:'yellow'},
  // Add more items as needed
];

// Create a panel to hold legend items horizontally
var legendItemsPanel = ui.Panel({
  layout: ui.Panel.Layout.Flow('horizontal')
});

// Loop through each item and add colored boxes with labels to the panel
items.forEach(function(item) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: item.color,
      padding: '8px',
      margin: '0 8px 0 0' // Adjust margin for spacing between items
    }
  });

  var description = ui.Label({
    value: item.name,
    style: {margin: '0 8px 0 0',fontSize: '12px',fontFamily:'monospace'} // Adjust margin for spacing between items
  });

  var itemPanel = ui.Panel({
    widgets: [colorBox, description],
    style: {margin: '0 8px 0 0'} // Adjust margin for spacing between items
  });

  legendItemsPanel.add(itemPanel);
});

// Add the legend items panel to the legend
legend.add(legendItemsPanel);

// Add legend to the map
//Map.add(legend);



function hand_tf(){ 

// Map over the joined collection to compute inundation
var inundationList = joinedCollectionForInundation.map(function(pair) {
  var exportFeature = ee.Feature(pair.get('primary'));
  var subbasinFeature = ee.Feature(pair.get('secondary'));

  var clippedRaster = Hand_Raster.clip(subbasinFeature.geometry());
  var H25Value = ee.Number(exportFeature.get('H25'));

  var inundationRaster = ee.Image(H25Value).subtract(clippedRaster).updateMask(clippedRaster.lt(H25Value));
  return inundationRaster;
});

// Mosaic all the resulting rasters
var inundationMosaic = ee.ImageCollection(inundationList).mosaic();

// Reproject the mosaiced image to a standard CRS and reduce its resolution
var reprojectedImage = inundationMosaic
  .rename('b1')
  .reproject({
    crs: 'EPSG:4326',
    scale: 30 // Adjust the scale as needed to manage memory usage
  });

// Reduce the resolution of the raster for faster processing
var reducedResolutionImage = ee.Image('projects/ee-rhrt-fast/assets/WUP_Inund_25');/*reprojectedImage.reduceResolution({
  reducer: ee.Reducer.mean(),
  bestEffort: true,
  maxPixels: 1024  // Adjust as needed
});
*/

                
  var selectedValue = dropdown.getValue();
  var aoi;

if (selectedValue !== null) {
  aoi = ee.Algorithms.If(ee.String(selectedValue).equals('Houghton'), shp1, 
        ee.Algorithms.If(ee.String(selectedValue).equals('Baraga'),shp2, 
        ee.Algorithms.If(ee.String(selectedValue).equals('Gogebic'),shp3,
        ee.Algorithms.If(ee.String(selectedValue).equals('Keweenaw'),shp4,
        ee.Algorithms.If(ee.String(selectedValue).equals('Ontonagon'),shp5,
        drawingTools.layers().get(0).getEeObject())))));
} else {
  // set default AOI if selectedValue is null
  aoi = drawingTools.layers().get(0).getEeObject();
}
              
                
  

  //var aoi = drawingTools.layers().get(0).getEeObject();
  
  //clearGeometry();

  // Set the drawing mode back to null; turns drawing off.
  drawingTools.setShape(null);
  var HAND= reducedResolutionImage;//ee.Image("projects/ee-rhrt-fast/assets/Inland_Inundation_500yr");

  var reclassify = HAND.updateMask(HAND.gte(0)).clip(aoi);

  
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

// Import the NLCD collection.
var dataset = ee.ImageCollection('USGS/NLCD_RELEASES/2021_REL/NLCD');

// Filter the collection to the 2021 product.
var nlcd2021 = dataset.filter(ee.Filter.eq('system:index', '2021')).first();

// Select the land cover band.
var landcover = nlcd2021.select('landcover').rename('b1');

var LC = landcover.clip(aoi);

// Define the cropland classes (NLCD codes for cropland, e.g., 81 and 82 for pasture/hay and cultivated crops)
var croplandClasses = [81, 82];

// Create a mask for cropland areas.
var cropmask = LC.eq(croplandClasses[0]).or(LC.eq(croplandClasses[1]));
var cropland = LC.updateMask(cropmask);

// Reproject the flood raster to match the cropland projection.
/*var crop_projection = LC.projection();*/
var flooded_res = flooded/*.reproject({
  crs: crop_projection
});*/

// Intersect the cropland with the flood raster.
var cropland_affected = flooded_res.updateMask(cropland);

// Calculate the area of the affected cropland in hectares.
var crop_pixelarea = cropland_affected.multiply(ee.Image.pixelArea());
var crop_stats = crop_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: swater.geometry(),
  scale: 30,  // NLCD resolution is 30m
  //maxPixels: 1856997344,
  bestEffort: true,
});

// Convert the area to hectares.
var crop_area_ha = crop_stats.getNumber('b1').divide(10000).round();
print('Affected Cropland Area (hectares):', crop_area_ha);


  
var croplandVis = {
  min: 0,
  max: 1,
  palette: ['green'],
};

//Population

// Load the population count raster and clip it to the region of interest (swater.geometry()).
var population_count = ee.Image("projects/ee-rhrt-fast/assets/WUP_Popoulation").clip(aoi);

// Reproject the flood raster to match the population raster projection.
var GHSLprojection = population_count.select('b1').projection();
var flooded_res = flooded.reproject({
  crs: GHSLprojection,
  scale: population_count.projection().nominalScale()
});

// Load the Hansen et al. forest change dataset and select the land/water mask.
var hansenImage = ee.Image('UMD/hansen/global_forest_change_2015');
var datamask = hansenImage.select('datamask');

// Create a binary mask where datamask equals 1 (indicating land).
var mask = datamask.eq(1);

// Update the population count with the mask (assuming HAND is already defined).
var population_exposed = population_count.updateMask(flooded_res).updateMask(mask);

// Calculate the sum of the exposed population.
var stats = population_exposed.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: swater.geometry(),
  bestEffort: true,
  tileScale: 16
});

// Get the total number of exposed people and round it.
var number_pp_exposed = stats.getNumber('b1').round();
print('People Exposed:', number_pp_exposed);

// Visualization parameters.
var populationCountVis = {
  min: 0,
  max: 200.0,
  palette: ['060606', '337663', '337663', 'ffffff'],
};

var populationExposedVis = {
  min: 0,
  max: 8000.0,
  palette: ['yellow', 'orange', 'red'],
};


var textVis = {
  'margin':'0px 8px 2px 0px',
  'fontSize': '15px',
  //'fontWeight':'bold',
  'fontFamily':'monospace'
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
  'fontFamily':'monospace'
  };

var titleTextVis = {
  'margin':'0px 0px 10px 0px',
  'fontSize': '17px', 
  'font-weight':'bold', 
  'color': '3333ff',
  'fontFamily':'monospace',
  'textDecoration':'underline'
  
  };
  


var text4 = ui.Label('Affected cropland:',textVis);
var number4 = ui.Label('Please wait...',numberVIS);
crop_area_ha.evaluate(function(val){number4.setValue(val+' hectares')}),numberVIS;

var text3 = ui.Label('Estimated number of exposed people: ',textVis);
var number3 = ui.Label('Please wait...',numberVIS);
number_pp_exposed.evaluate(function(val){number3.setValue(val)}),numberVIS;


var flood_stats_ten = flood_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(),              
  geometry: bound3,
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


var img = reclassify;

//Airports
var airport = ee.FeatureCollection('projects/ee-rhrt-fast/assets/CF_airports');


var airportSamp = img.sampleRegions({
  collection: airport,
  //scale: 10,
  geometries: true
});
var airport_sz = airportSamp.size();
var air_aff = ui.Label('Airport facilities:',textVis);
var air_aff1 = ui.Label('Please Wait', numberVIS);
airport_sz.evaluate(function(val){air_aff1.setValue(val)}),numberVIS;


//Hospitals and Nursing
var fcPolygon2 = ee.FeatureCollection('projects/ee-rhrt-fast/assets/WUP_Hospitals_and_Nursing');
var fcPolygonSamp2 = img.sampleRegions({
  collection: fcPolygon2,
  //scale: 10,
  geometries: true
});
var bf = fcPolygonSamp2.size();
var bff = ui.Label('Hospitals and Nursing Homes affected:',textVis);
var bfff = ui.Label('Please Wait', numberVIS);
bf.evaluate(function(val){bfff.setValue(val)}),numberVIS;

//Adult foster Care
var fcPolygon4 = ee.FeatureCollection('projects/ee-rhrt-fast/assets/CF-WUPAdultFosterCare');
var fcPolygonSamp4 = img.sampleRegions({
  collection: fcPolygon4,
  //scale: 10,
  geometries: true
});
var eoc = fcPolygonSamp4.size();
var eocf = ui.Label('Adult Foster care Centers:',textVis);
var eocff = ui.Label('Please Wait', numberVIS);
eoc.evaluate(function(val){eocff.setValue(val)}),numberVIS;

//Ports
var fcPolygon9 = ee.FeatureCollection('projects/ee-rhrt-fast/assets/CF_ports');
var fcPolygonSamp9 = img.sampleRegions({
  collection: fcPolygon9,
  //scale: 10,
  geometries: true
});
var port = fcPolygonSamp9.size();
var portf = ui.Label('Port facilities:',textVis);
var portff = ui.Label('Please Wait', numberVIS);
port.evaluate(function(val){portff.setValue(val)}),numberVIS;



var number = ui.Label(" ")




//Bounding box3
var bound3 = reclassify.geometry()

//Riverine

// Import flood depth raster and UDF data
var floodDepth = /*ee.Image('projects/ee-rhrt-fast/assets/Inland_Inundation_500yr')*/reducedResolutionImage.clip(bound3);
var udf = ee.FeatureCollection('projects/ee-rhrt-fast/assets/FAST_build_UDF_280624').filterBounds(bound3);


//print("UDF:",udf.first() )
//print('Raster:',floodDepth)


// Load the raster at a resolution of 30 meters
var raster = floodDepth.resample('bilinear').reproject({
  crs: floodDepth.projection(),//'EPSG:4326',
  scale: floodDepth.projection().nominalScale()
});


// Project the UDF dataset to the same projection as the raster
var projectedUDF = udf.map(function(feature) {
  return feature.setGeometry(feature.geometry().transform(reducedResolutionImage.projection()));
});

// Sample the raster values at the UDF feature locations
var sampledUDF = reducedResolutionImage.reduceRegions({
  collection: projectedUDF,
  reducer: ee.Reducer.anyNonZero(),
  scale: 30, // Match the scale of the reprojected raster
});

// Function to check if a feature is flooded
var checkFlooded = function(feature) {
  var flooded = feature.get('any');
  return feature.set('flooded', ee.Algorithms.If(flooded, true, false));
};

// Apply the checkFlooded function to the sampled UDF features
var udfFlood = sampledUDF.map(checkFlooded);

// Filter the UDF records that are exposed to flood
var udfExposed = udfFlood.filter(ee.Filter.eq('flooded', true));

// Get the total number of UDF records exposed to flood
var udfExposedCount = udfExposed.size();

// Print the result
//print('Number of UDF records exposed to flood (Riverine):', udfExposedCount);


// Add a new property to the UDF dataset indicating the flood depth at the location of the building
var udfDepth = udfExposed.map(function(feature) {
  var depth = raster.reduceRegion({
    reducer: ee.Reducer.first(),
    geometry: feature.geometry(),
    scale: floodDepth.projection().nominalScale()
  }).values().get(0);
  // If depth is null or None, assign it a value of zero
  depth = ee.Algorithms.If(ee.Algorithms.IsEqual(depth, null), 0, depth);
  depth = ee.Algorithms.If(ee.Algorithms.IsEqual(depth, 'None'), 0, depth);
  return feature.set('flood_depth', depth);
});



//Coastal


// Import flood depth raster and UDF data
var floodDepth_c = ee.Image('projects/ee-rhrt-fast/assets/Coast_Inund_25yr').clip(bound3);


// Load the raster at a resolution of 30 meters
var raster_c = floodDepth_c.resample('bilinear').reproject({
  crs: floodDepth_c.projection(),//'EPSG:4326',
  scale: 30//floodDepth_c.projection().nominalScale()
});



var projectedUDF_c = udf.map(function(feature) {
  return feature.setGeometry(feature.geometry().transform(raster_c.projection()));
});

// Sample the raster values at the UDF feature locations
var sampledUDF_c = raster_c.reduceRegions({
  collection: projectedUDF_c,
  reducer: ee.Reducer.anyNonZero(),
  scale: 30, // Match the scale of the reprojected raster
});

// Function to check if a feature is flooded
var checkFlooded_c = function(feature) {
  var flooded = feature.get('any');
  return feature.set('coastal_flooded', ee.Algorithms.If(flooded, true, false));
};

// Apply the checkFlooded function to the sampled UDF features
var udfFlood_c = sampledUDF_c.map(checkFlooded_c);

// Filter the UDF records that are exposed to flood
var udfExposed_c = udfFlood_c.filter(ee.Filter.eq('coastal_flooded', true));

// Get the total number of UDF records exposed to flood
var udfExposedCount_c = udfExposed_c.size();

// Print the result
//print('Number of UDF records exposed to flood (Coastal):', udfExposedCount_c);




// Add a new property to the UDF dataset indicating the flood depth at the location of the building
var udfDepth_c = udfExposed_c.map(function(feature) {
  var depth_c = raster_c.reduceRegion({
    reducer: ee.Reducer.first(),
    geometry: feature.geometry(),
    scale: floodDepth_c.projection().nominalScale()
  }).values().get(0);
  // If depth is null or None, assign it a value of zero
  depth_c = ee.Algorithms.If(ee.Algorithms.IsEqual(depth_c, null), 0, depth_c);
  depth_c = ee.Algorithms.If(ee.Algorithms.IsEqual(depth_c, 'None'), 0, depth_c);
  return feature.set('coastal_flood_depth', depth_c);
});


// Find buildings exposed to both types of floods and calculate the maximum flood depth
var udfBoth = udfDepth.filter(ee.Filter.inList('system:index', udfDepth_c.aggregate_array('system:index')));
var udfBothMaxDepth = udfBoth.map(function(feature) {
  var riverineDepth = feature.get('flood_depth');
  var coastalDepth = feature.get('coastal_flood_depth');
  var maxDepth = ee.Algorithms.If(ee.Number(riverineDepth).gt(coastalDepth), riverineDepth, coastalDepth);
  return feature.set('max_flood_depth', maxDepth);
});

// Find buildings exposed to both types of floods and calculate the maximum flood depth
var coastalIndices = udfExposed_c.aggregate_array('system:index');
var riverineIndices = udfExposed.aggregate_array('system:index');

var udfBoth = udfDepth.filter(ee.Filter.inList('system:index', coastalIndices));
var udfBoth_c = udfDepth_c.filter(ee.Filter.inList('system:index', riverineIndices));

var udfBothMaxDepth = udfBoth.map(function(feature) {
  var coastalFeature = udfBoth_c.filter(ee.Filter.eq('system:index', feature.get('system:index'))).first();
  var riverineDepth = feature.get('flood_depth');
  var coastalDepth = coastalFeature.get('coastal_flood_depth');
  var maxDepth = ee.Algorithms.If(ee.Number(riverineDepth).gt(coastalDepth), riverineDepth, coastalDepth);
  return feature.set('depth_vfd', maxDepth);
});

// Identify buildings exposed to only riverine floods and only coastal floods and set 'depth_vfd'
var udfRiverineOnly = udfDepth.filter(ee.Filter.inList('system:index', coastalIndices).not()).map(function(feature) {
  return feature.set('depth_vfd', feature.get('flood_depth'));
});

var udfCoastalOnly = udfDepth_c.filter(ee.Filter.inList('system:index', riverineIndices).not()).map(function(feature) {
  return feature.set('depth_vfd', feature.get('coastal_flood_depth'));
});

// Combine the three feature collections into a single collection
var combinedUDF = udfRiverineOnly
  .merge(udfCoastalOnly)
  .merge(udfBothMaxDepth);

// Print results
var udfBothCount = udfBoth.size();
var udfRiverineOnlyCount = udfRiverineOnly.size();
var udfCoastalOnlyCount = udfCoastalOnly.size();
var totalAffectedBuildings = udfBothCount.add(udfRiverineOnlyCount).add(udfCoastalOnlyCount);

print('Number of UDF records exposed to both riverine and coastal floods:', udfBothCount);
print('Number of UDF records exposed to riverine only floods:', udfRiverineOnlyCount);
print('Number of UDF records exposed to coastal only floods:', udfCoastalOnlyCount);
print('Total number of affected buildings:', totalAffectedBuildings);



// Iterate over each feature in the riverine dataset
var udfDepthMax = combinedUDF; /*udfDepth.map(function(feature) {
  var geometry = feature.geometry();
  var riverineDepth = ee.Number(feature.get('flood_depth'));

  // Filter the coastal dataset to features intersecting the current riverine feature
  var intersectingFeatures = udfDepth_c.filterBounds(geometry);

  // Iterate over each intersecting feature and compare flood depth values
  var maxDepth = intersectingFeatures.iterate(function(coastalFeature, currentMax) {
    coastalFeature = ee.Feature(coastalFeature);
    var coastalDepth = ee.Number(coastalFeature.get('coastal_flood_depth'));
    return ee.Algorithms.If(coastalDepth.gt(ee.Number(currentMax)), coastalDepth, currentMax);
  }, riverineDepth);

  // Add the maximum flood depth as a new property
  return feature.set('max_flood_depth', maxDepth);
});*/

// Print the resulting FeatureCollection
//print('UDF with max flood depth:', udfDepthMax);

// Compute the depth_vfd property and add it to the feature collection
var udfDepthVFD = udfDepthMax;/*.map(function(feature) {
  var firstFloorHt = feature.get('FirstFloor');
  var floodDepth = feature.get('max_flood_depth');
  var depthVFD = ee.Number(floodDepth).subtract(ee.Number(firstFloorHt));
  depthVFD = ee.Algorithms.If(ee.Algorithms.IsEqual(depthVFD, null), 0, depthVFD);
  depthVFD = ee.Algorithms.If(ee.Algorithms.IsEqual(depthVFD, 'None'), 0, depthVFD);
  return feature.set('depth_vfd', depthVFD);
});*/


// Print the updated UDF dataset
print('UDF dataset with max flood depth:', udfDepthVFD);
// Get the total number of UDF records exposed to flood
var udfExposedCount_udfDepthVFD = udfDepthVFD.size();

// Print the result
print('Number of UDF records exposed to flood (MaxDepth):', udfExposedCount_udfDepthVFD);


// Apply the filter directly to the FeatureCollection
var nonEmptyOccClassUdf = udfDepthVFD;/*.filter(ee.Filter.and(
  ee.Filter.neq('OccClass', 'null'),
  ee.Filter.neq('OccClass', '')
));
print('N.o of Filtered UDF with non-empty OccClass:', nonEmptyOccClassUdf.size());*/



var calculateSOID = function(feature) {
  // Get properties from feature
  var occupancy = ee.String(feature.get('OccClass'));
  var foundationType = feature.getNumber('FoundType');
  var numStories = feature.getNumber('NumStories');

  // Prefix: First and last character of occupancy
  
  var sopre = ee.Algorithms.If(occupancy.equals('REL1'), ee.String('RE1'), occupancy.slice(0, 1).cat(occupancy.slice(3, occupancy.length())) );


  // Suffix: Easy - Basement or no Basement
  var sosuf = ee.Algorithms.If(ee.Number(foundationType).neq(4),
                               'N',
                               'B');

  var somid = ee.Algorithms.If(occupancy.slice(0, 4).equals('RES3'),
                               ee.Algorithms.If(numStories.gt(4),
                                                '5',
                                                ee.Algorithms.If(numStories.gt(2),
                                                                 '3',
                                                                 '1')),
                               ee.Algorithms.If(occupancy.slice(0, 4).equals('RES1'),
                                                ee.Algorithms.If(numStories.gt(3.0),
                                                                 ee.Algorithms.If(ee.Number(3).subtract(ee.Number(3).round()).eq(0),
                                                                                  ee.String(ee.Number(3).round()),'S'),
                                                                 ee.Algorithms.If(ee.Number(numStories).subtract(ee.Number(numStories).round()).eq(0),
                                                                                  ee.String(ee.Number(numStories).round().toInt()),'S')),
                                                ee.Algorithms.If(occupancy.slice(0, 4).equals('RES2'),
                                                                 '1',
                                                                 ee.Algorithms.If(numStories.gt(6),
                                                                                  'H',
                                                                                  ee.Algorithms.If(numStories.gt(3),
                                                                                                   'M',
                                                                                                   'L')))));                                                                                                 
       


  // Calculate specific occupancy id
  var SpecificOccupId = ee.String(sopre).cat(ee.String(somid)).cat(ee.String(sosuf));

  // Set the specific occupancy id as property of the feature and return the feature
  return feature.set('SpecificOccupId', SpecificOccupId);
};


// Apply the function to the FeatureCollection
var udfWithSOID1 = nonEmptyOccClassUdf.map(calculateSOID);
//print('UDF dataset with SOID:', udfWithSOID1);

// Add a new column 'flc' with value 'CAE' to each feature in the FeatureCollection
var udfWithSOID = udfWithSOID1.map(function(feature) {
  return feature.set('flc', 'CAE');
});






// Load two feature collections
var fc1 = udfWithSOID;



// Map the addBldgLoss function over the udfData FeatureCollection

  // Define the bddf_lut_riverine and bddf_lut_coastalA as Feature Collections
  var bddf_lut_riverine = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Building_DDF_Riverine_LUT_Hazus4p0');
  var bddf_lut_coastalA = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Building_DDF_CoastalA_LUT_Hazus4p0');
  var bddf_lut_coastalV = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Building_DDF_CoastalV_LUT_Hazus4p0');

var addBldgLoss = fc1.map(function(feature) {

  var depth1 = feature.getNumber('depth_vfd');
  var OC = ee.String(feature.get('OccClass'));
  var CoastalZoneCode = ee.String(feature.get('flc'));
  // Initialize the blut variable
  var blut = bddf_lut_riverine;

  // Check the conditions
  if (OC.slice(0,3) == 'RES') {
  if (CoastalZoneCode == 'CAE') {
      blut = bddf_lut_coastalA;
    } else if (CoastalZoneCode == 'VE' || CoastalZoneCode == 'V') {
      blut = bddf_lut_coastalV;
    }
  }

  

  var ddf = blut;
  var soid1 = feature.get('SpecificOccupId');
  var soid2 = ee.Filter.eq('SpecificOccupId', soid1);
  
  var fc3 = ddf.filter(soid2).first();
  
  // Clamp the depth value to the range [-4, 24]
  var depth = ee.Algorithms.If(depth1.gt(24), 24, ee.Algorithms.If(depth1.lt(-4), -4, depth1));


  var suffix_l = ee.String(((ee.Number(depth).floor()).abs()).int());
  var suffix_u = ee.String(((ee.Number(depth).ceil()).abs()).int());
  var prefix_l = ee.String(ee.Algorithms.If(ee.Number(depth).floor().lt(0), 'm', 'p'));
  var prefix_u = ee.String(ee.Algorithms.If(ee.Number(depth).ceil().lt(0), 'm', 'p'));
  var l_index = prefix_l.cat(suffix_l);
  var u_index = prefix_u.cat(suffix_u);
  
  //Building Loss Calculation
  // Get the lower and upper values from the ddf1 dictionary
  var d_lower = ee.Number(fc3.get(l_index)).toFloat();
  var d_upper = ee.Number(fc3.get(u_index)).toFloat();

  // Compute the fractional amount of depth for interpolation
  var frac = ee.Number(depth).subtract(ee.Number(depth).floor());

  // Compute the damage using linear interpolation
  var damage = (d_lower.add(frac.multiply(d_upper.subtract(d_lower)))).divide(100);
  //var bldg_loss = damage.multiply(ee.Number(feature.get('Cost')));
  //return feature.copyProperties(bldg_loss);
  
 // var bldg_loss = damage.multiply(ee.Number(feature.get('Cost')).toInt());
  var bldg_loss = damage.multiply(ee.Number.parse(feature.get('Cost')));
  var cost1 = ee.Number.parse(feature.get('Cost'));
  return feature.set('bldg_loss', bldg_loss).set('New_Cost',cost1);
});

//var udfDataWithLoss = merged.map(addBldgLoss);
print('Total cost (Earth Engine):', addBldgLoss.aggregate_sum('bldg_loss'));
print('Total Cost:', addBldgLoss.aggregate_sum('New_Cost'));
//print('Building Loss', addBldgLoss);

var Content_x_0p5 = ['RES1','RES2','RES3A','RES3B','RES3C','RES3D','RES3E','RES3F','RES4','RES5','RES6','COM10'];
var Content_x_1p0 = ['COM1','COM2','COM3','COM4','COM5','COM8','COM9','IND6','AGR1','REL1','GOV1','EDU1'];
var Content_x_1p5 = ['COM6','COM7','IND1','IND2','IND3','IND4','IND5','GOV2','EDU2'];

  var cddf_lut_riverine = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Content_DDF_Riverine_LUT_Hazus4p0');
  var cddf_lut_coastalA = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Content_DDF_CoastalA_LUT_Hazus4p0');
  var cddf_lut_coastalV = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Content_DDF_CoastalV_LUT_Hazus4p0');

var addContLoss1 = addBldgLoss.map(function(feature){
  var OC = feature.get('OccClass');
  var ccost = feature.get('New_Cost');
  var CMult = ee.Algorithms.If(
    ee.List(Content_x_0p5).contains(OC),
    0.5,
    ee.Algorithms.If(
      ee.List(Content_x_1p0).contains(OC),
      1.0,
      ee.Algorithms.If(
        ee.List(Content_x_1p5).contains(OC),
        1.5,
        0
      )
    )
  );
  var ccost_new = ee.Number(ccost).multiply(CMult);
  return feature.set('ccost_new', ccost_new);
  
});

var addContLoss = addContLoss1.map(function(feature) {

  var depth1 = feature.getNumber('depth_vfd');
  var OC = ee.String(feature.get('OccClass'));
  var CoastalZoneCode = ee.String(feature.get('flc'));
  // Initialize the blut variable
  var blut = cddf_lut_riverine;

  // Check the conditions
  if (OC.slice(0,3) == 'RES') {
  if (CoastalZoneCode == 'CAE') {
      blut = bddf_lut_coastalA;
    } else if (CoastalZoneCode == 'VE' || CoastalZoneCode == 'V') {
      blut = bddf_lut_coastalV;
    }
  }

  

  var ddf = blut;
  
  var soid1 = feature.get('SpecificOccupId')
  var soid2 = ee.Filter.eq('SpecificOccupId', soid1);
  
  var fc3 = ddf.filter(soid2).first();
  
  
  var depth = ee.Algorithms.If(depth1.gt(24), 24, ee.Algorithms.If(depth1.lt(-4), -4, depth1))


  var suffix_l = ee.String(((ee.Number(depth).floor()).abs()).int());
  var suffix_u = ee.String(((ee.Number(depth).ceil()).abs()).int());
  var prefix_l = ee.String(ee.Algorithms.If(ee.Number(depth).floor().lt(0), 'm', 'p'));
  var prefix_u = ee.String(ee.Algorithms.If(ee.Number(depth).ceil().lt(0), 'm', 'p'));
  var l_index = prefix_l.cat(suffix_l);
  var u_index = prefix_u.cat(suffix_u);
  
  // Content Loss Calculation
  // Get the lower and upper values from the ddf1 dictionary
  var d_lower = ee.Number(fc3.get(l_index)).toFloat();
  var d_upper = ee.Number(fc3.get(u_index)).toFloat();

  // Compute the fractional amount of depth for interpolation
  var frac = ee.Number(depth).subtract(ee.Number(depth).floor());

  // Compute the damage using linear interpolation
  var damage = (d_lower.add(frac.multiply(d_upper.subtract(d_lower)))).divide(100);

  
  var cont_loss = damage.multiply(ee.Number(feature.get('ccost_new')));

  return feature.set('cont_loss', cont_loss);
});

print('Total content cost (Earth Engine):', addContLoss.aggregate_sum('cont_loss'));
//print('Content Loss', addContLoss);





//Basement
var bsmf = addContLoss.map(function(feature) {

  var OC = ee.String(feature.get('OccClass'));
  var foundationType = feature.getNumber('FoundType');
  var bsm = ee.Algorithms.If(OC.equals('RES1'), ee.Algorithms.If(foundationType.eq(4),'B','NB'), 'NB');
  return feature.set('bsm', bsm);
});

//print('bsm', bsmf)

//Debris calculation

var debris_key = bsmf.map(function(feature) {

  var depth1 = feature.getNumber('depth_vfd');
  var OC = ee.String(feature.get('OccClass'));
  var foundationType = feature.getNumber('FoundType');
  var debriskey, ddf1, dfin, dstruc, dfound, dtot;
  var bsm =  ee.String(feature.get('bsm')); // default value for no basement
  var fnd = ee.Algorithms.If(foundationType.eq(4).or(foundationType.eq(7)),'SG','FT'); // default value for slab on grade foundation
  
  var depth = ee.Algorithms.If(depth1.gt(24), 24, ee.Algorithms.If(depth1.lt(-4), -4, depth1))
  
  var ddf = ee.FeatureCollection('projects/ee-rhrt-fast/assets/flDebris_LUT')
  

  
  var dsuf = ee.Algorithms.If(foundationType.eq(4),
  ee.Algorithms.If(
    OC.equals('RES1'),
    ee.Algorithms.If(ee.Number(depth).lt(-4), '-8',
      ee.Algorithms.If(ee.Number(depth).lt(0), '-4',
        ee.Algorithms.If(ee.Number(depth).lt(4), '0',
          ee.Algorithms.If(ee.Number(depth).lt(6), '4',
            ee.Algorithms.If(ee.Number(depth).lt(8), '6', '8'))))),
    ee.Algorithms.If(
      OC.equals('COM6'),
      ee.Algorithms.If(ee.Number(depth).lt(-4), '-8',
        ee.Algorithms.If(ee.Number(depth).lt(0), '-4',
          ee.Algorithms.If(ee.Number(depth).lt(4), '0',
            ee.Algorithms.If(ee.Number(depth).lt(6), '4',
              ee.Algorithms.If(ee.Number(depth).lt(8), '6', '8'))))),
      ee.Algorithms.If(
        OC.equals('RES2'),
        ee.Algorithms.If(ee.Number(depth).lt(0), '0', 
        ee.Algorithms.If(
        ee.Number(depth).lt(1), '0',
          ee.Algorithms.If(ee.Number(depth).lt(4), '1',
            ee.Algorithms.If(ee.Number(depth).lt(8), '4',
              ee.Algorithms.If(ee.Number(depth).lt(12), '8', '12')))
          )),
        ee.Algorithms.If(
          ee.Number(depth).lt(1), '0',
            ee.Algorithms.If(ee.Number(depth).lt(4), '1',
              ee.Algorithms.If(ee.Number(depth).lt(8), '4',
                ee.Algorithms.If(ee.Number(depth).lt(12), '8', '12')))
          )
       )
    )
  ),
  ee.Algorithms.If(
    ee.Number(depth).lt(1), '0',
    ee.Algorithms.If(ee.Number(depth).lt(4), '1',
      ee.Algorithms.If(ee.Number(depth).lt(8), '4',
        ee.Algorithms.If(ee.Number(depth).lt(12), '8', '12')))
  )
)


  

  debriskey = OC.cat(bsm).cat(fnd).cat(dsuf);
  
  
 
  return feature.set('DebrisID', debriskey);
});

//print('DebrisID',debris_key);

var debris = debris_key.map(function(feature) {
    
  var ddf = ee.FeatureCollection('projects/ee-rhrt-fast/assets/flDebris_LUT')
  var area = ee.Number.parse(feature.get('Area')).toFloat()
  
  
  var soid1 = feature.get('DebrisID')
  var soid2 = ee.Filter.eq('DebrisID', soid1);
  
  var fc3 = ddf.filter(soid2).first();
  
  var dfin_rate    = (ee.Number(fc3.get('Finishes'))).toFloat();
  var dstruc_rate  =  (ee.Number(fc3.get('Structure'))).toFloat();
  var dfound_rate  =  (ee.Number(fc3.get('Foundation'))).toFloat();
                                    
  var dfin      = ee.Number(area.multiply(dfin_rate).divide(1000));
  var dstruc    = ee.Number(area.multiply(dstruc_rate).divide(1000));
  var dfound    = ee.Number(area.multiply(dfound_rate).divide(1000));
  var dtot      = ee.Number(dfin.add(dstruc).add(dfound));
  
  return feature.set('Debris', dtot);
});

print('Debris', debris)


// Restoration
 

var restorf1 = debris.map(function(feature) {

  var depth = feature.getNumber('depth_vfd');
  var OC = ee.String(feature.get('OccClass'));
  
  var dsuf = ee.Algorithms.If(
  ee.Number(depth).lt(0), '0',
  ee.Algorithms.If(
    ee.Number(depth).lt(1), '1',
    ee.Algorithms.If(
      ee.Number(depth).lt(4), '4',
      ee.Algorithms.If(
        ee.Number(depth).lt(8), '8',
        ee.Algorithms.If(
          ee.Number(depth).lt(12), '12',
          '24'
        )
      )
    )
  )
);
  var RsFnkey = OC.cat(ee.String(dsuf))
  
 
  return feature.set('RestFnID', RsFnkey);
  
});


var restorf2 = restorf1.map(function(feature) {
    
  var ddf = ee.FeatureCollection('projects/ee-rhrt-fast/assets/flRsFnGBS_LUT')
  
  
  var soid1 = feature.get('RestFnID')
  var soid2 = ee.Filter.eq('RestFnID', soid1);
  
  var fc3 = ddf.filter(soid2).first();
  
  var restdays_min =  ee.Number(fc3.get('Min_Restor_Days')).toInt() //This is the maximum days out (flRsFnGBS has a min and a max)
  var restdays_max =  ee.Number(fc3.get('Max_Restor_Days')).toInt() //This is the maximum days out (flRsFnGBS has a min and a max)
  
  return feature.set('restdays_max', restdays_max);
});

//print('Restoration', restorf2)

print('Total no of days taken for Restoration: (Earth Engine):', restorf2.aggregate_sum('restdays_max'));


var fcPolygon = combinedUDF;

var tb = fcPolygon.size();
var tb_h = ui.Label('Total number of buildings affected :',textVis);
var tb_v = ui.Label('Please Wait', numberVIS);
tb.evaluate(function(val){tb_v.setValue(val)}),numberVIS;

var BldgLossUSD = addBldgLoss.aggregate_sum('bldg_loss')
var cost_total = BldgLossUSD.toInt()
var cost_total_h = ui.Label('Cost estimated (Building loss):',textVis);
var cost_total_v = ui.Label('Please Wait', numberVIS);
cost_total.evaluate(function(val){cost_total_v.setValue('$ '+val)}),numberVIS;

var ContentLossUSD = addContLoss.aggregate_sum('cont_loss')
var cost_cont = ContentLossUSD.toInt()
var cost_cont_h = ui.Label('Cost estimated (Content loss):',textVis);
var cost_cont_v = ui.Label('Please Wait', numberVIS);
cost_cont.evaluate(function(val){cost_cont_v.setValue('$ '+val)}),numberVIS;

var Debrisamount = debris.aggregate_sum('Debris');
var deb_cont = Debrisamount.toInt();
var deb_cont_h = ui.Label('Debris (Ton):',textVis);
var deb_cont_v = ui.Label('Please Wait', numberVIS);
deb_cont.evaluate(function(val){deb_cont_v.setValue(val)}),numberVIS;

var Restamount = restorf2.aggregate_sum('restdays_max');
var resto_cont = Restamount.toInt();
var resto_cont_h = ui.Label('Restoration (No of days):',textVis);
var resto_cont_v = ui.Label('Please Wait', numberVIS);
resto_cont.evaluate(function(val){resto_cont_v.setValue(val)}),numberVIS;



var fc = combinedUDF;

var res = fc.filter(ee.Filter.stringStartsWith('OccClass', 'RES'));
var residential = res;

var com =  fc.filter(ee.Filter.stringStartsWith('OccClass', 'CO'));
var commercial = com;

var agri =  fc.filter(ee.Filter.stringStartsWith('OccClass', 'AGR1'));
var agricultural = agri;

var rel = fc.filter(ee.Filter.stringStartsWith('OccClass', 'REL'));
var gov = fc.filter(ee.Filter.stringStartsWith('OccClass', 'GOV'));
var edu = fc.filter(ee.Filter.stringStartsWith('OccClass', 'EDU'));
var ind = fc.filter(ee.Filter.stringStartsWith('OccClass', 'IND'));



var comm = com.size();
var comm_h = ui.Label('Total number of commercial buildings:',textVis);
var comm_v = ui.Label('Please Wait', numberVIS);
comm.evaluate(function(val){comm_v.setValue(val)}),numberVIS;

res =  res.size();
var res_h = ui.Label('Total number of residential buildings:',textVis);
var res_v = ui.Label('Please Wait', numberVIS);
res.evaluate(function(val){res_v.setValue(val)}),numberVIS;

agri = agri.size();
var agri_h = ui.Label('Total number of agricultural buildings :',textVis);
var agri_v = ui.Label('Please Wait', numberVIS);
agri.evaluate(function(val){agri_v.setValue(val)}),numberVIS;

var rell = rel.size();
var rel_h = ui.Label('Total number of religious buildings:',textVis);
var rel_v = ui.Label('Please Wait', numberVIS);
rell.evaluate(function(val){rel_v.setValue(val)}),numberVIS;

var govv =  gov.size();
var gov_h = ui.Label('Total number of governmental buildings:',textVis);
var gov_v = ui.Label('Please Wait', numberVIS);
govv.evaluate(function(val){gov_v.setValue(val)}),numberVIS;

var eduu = edu.size();
var edu_h = ui.Label('Total number of educational buildings :',textVis);
var edu_v = ui.Label('Please Wait', numberVIS);
eduu.evaluate(function(val){edu_v.setValue(val)}),numberVIS;

var indd = ind.size();
var ind_h = ui.Label('Total number of industrial buildings :',textVis);
var ind_v = ui.Label('Please Wait', numberVIS);
indd.evaluate(function(val){ind_v.setValue(val)}),numberVIS;


var downloadLink = ui.Label({value:'Export the results',
  style: {
  color: 'blue',
  fontSize: '16px',
  fontWeight:'bold',
  textAlign: 'center',
  fontFamily:'monospace',
  border: '2px solid lightgray',
  stretch:'horizontal'
  }
});



downloadLink.setUrl(restorf2.getDownloadURL({format: 'csv'}));

results1.clear();


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
        deb_cont_h,
        deb_cont_v,
        resto_cont_h,
        resto_cont_v,
        cost_total_h,
        cost_total_v,
        //cost_inv_h,
        //cost_inv_v,
        cost_cont_h,
        cost_cont_v,
        res_h,
        res_v,
        
        comm_h,
        comm_v,
        
        agri_h,
        agri_v,
        
        rel_h,
        rel_v,
        
        gov_h,
        gov_v,
        
        edu_h,
        edu_v,
        
        ind_h,
        ind_v,
      

        air_aff,
        air_aff1,
        portf,
        portff,
        bff,
        bfff,
        eocf,
        eocff,
        
        downloadLink
        
      ]
      ));
    




var denver = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level2')
    .filter("ADM2_NAME == 'Houghton'")
    .filter(ee.Filter.eq('ADM2_NAME', 'Houghton'))  // Exactly the same as above.
    .first()
    .geometry();
    
// Create an image collection from the two images.
var floodCollection = ee.ImageCollection([
  floodDepth_c,//.set('system:index', 'Coastal Inundation'),
  flooded//.set('system:index', 'Riverine Flooding')
]).mosaic();



Map.clear();
Map.centerObject(swater.geometry(), 9);
Map.addLayer(floodCollection, {palette:"0000FF"},'Flooded areas');
Map.add(results);
Map.add(results1);
Map.add(legend);
Map.addLayer(population_exposed, populationExposedVis, 'Exposed Population',0);
Map.addLayer(cropland_affected, croplandVis, 'Affected Cropland',0); 
Map.addLayer(fcPolygon, {color: 'yellow'},'Buildings',0);
Map.addLayer(agricultural, {color: 'magenta'},'Agricultural',0);
Map.addLayer(commercial, {color: 'cyan', pointSize: 100},'Commercial',0);
Map.addLayer(residential, {color: 'red'},'Residential',0);



}





function hand_fty(){ 
  
// Map over the joined collection to compute inundation
var inundationList = joinedCollectionForInundation.map(function(pair) {
  var exportFeature = ee.Feature(pair.get('primary'));
  var subbasinFeature = ee.Feature(pair.get('secondary'));

  var clippedRaster = Hand_Raster.clip(subbasinFeature.geometry());
  var H25Value = ee.Number(exportFeature.get('H50'));

  var inundationRaster = ee.Image(H25Value).subtract(clippedRaster).updateMask(clippedRaster.lt(H25Value));
  return inundationRaster;
});

// Mosaic all the resulting rasters
var inundationMosaic = ee.ImageCollection(inundationList).mosaic();

// Reproject the mosaiced image to a standard CRS and reduce its resolution
var reprojectedImage = inundationMosaic
  .rename('b1')
  .reproject({
    crs: 'EPSG:4326',
    scale: 30 // Adjust the scale as needed to manage memory usage
  });

// Reduce the resolution of the raster for faster processing
var reducedResolutionImage = ee.Image('projects/ee-rhrt-fast/assets/WUP_Inund_50');/*reprojectedImage.reduceResolution({
  reducer: ee.Reducer.mean(),
  bestEffort: true,
  maxPixels: 1024  // Adjust as needed
});*/


                
  var selectedValue = dropdown.getValue();
  var aoi;

if (selectedValue !== null) {
  aoi = ee.Algorithms.If(ee.String(selectedValue).equals('Houghton'), shp1, 
        ee.Algorithms.If(ee.String(selectedValue).equals('Baraga'),shp2, 
        ee.Algorithms.If(ee.String(selectedValue).equals('Gogebic'),shp3,
        ee.Algorithms.If(ee.String(selectedValue).equals('Keweenaw'),shp4,
        ee.Algorithms.If(ee.String(selectedValue).equals('Ontonagon'),shp5,
        drawingTools.layers().get(0).getEeObject())))));
} else {
  // set default AOI if selectedValue is null
  aoi = drawingTools.layers().get(0).getEeObject();
}

  // Set the drawing mode back to null; turns drawing off.
  drawingTools.setShape(null);
  var HAND= reducedResolutionImage;//ee.Image("projects/ee-rhrt-fast/assets/Inland_Inundation_500yr");

  var reclassify = HAND.updateMask(HAND.gte(0)).clip(aoi);

  
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

// Import the NLCD collection.
var dataset = ee.ImageCollection('USGS/NLCD_RELEASES/2021_REL/NLCD');

// Filter the collection to the 2021 product.
var nlcd2021 = dataset.filter(ee.Filter.eq('system:index', '2021')).first();

// Select the land cover band.
var landcover = nlcd2021.select('landcover').rename('b1');

var LC = landcover.clip(aoi);

// Define the cropland classes (NLCD codes for cropland, e.g., 81 and 82 for pasture/hay and cultivated crops)
var croplandClasses = [81, 82];

// Create a mask for cropland areas.
var cropmask = LC.eq(croplandClasses[0]).or(LC.eq(croplandClasses[1]));
var cropland = LC.updateMask(cropmask);

// Reproject the flood raster to match the cropland projection.
var flooded_res = flooded/*.reproject({
  crs: crop_projection
});*/

// Intersect the cropland with the flood raster.
var cropland_affected = flooded_res.updateMask(cropland);

// Calculate the area of the affected cropland in hectares.
var crop_pixelarea = cropland_affected.multiply(ee.Image.pixelArea());
var crop_stats = crop_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: swater.geometry(),
  scale: 30,  // NLCD resolution is 30m
  //maxPixels: 1856997344,
  bestEffort: true,
});

// Convert the area to hectares.
var crop_area_ha = crop_stats.getNumber('b1').divide(10000).round();
print('Affected Cropland Area (hectares):', crop_area_ha);


  
var croplandVis = {
  min: 0,
  max: 1,
  palette: ['green'],
};

//Population


// Load the population count raster and clip it to the region of interest (swater.geometry()).
var population_count = ee.Image("projects/ee-rhrt-fast/assets/WUP_Popoulation").clip(aoi);

// Reproject the flood raster to match the population raster projection.
var GHSLprojection = population_count.select('b1').projection();
var flooded_res = flooded.reproject({
  crs: GHSLprojection,
  scale: population_count.projection().nominalScale()
});

// Load the Hansen et al. forest change dataset and select the land/water mask.
var hansenImage = ee.Image('UMD/hansen/global_forest_change_2015');
var datamask = hansenImage.select('datamask');

// Create a binary mask where datamask equals 1 (indicating land).
var mask = datamask.eq(1);

// Update the population count with the mask (assuming HAND is already defined).
var population_exposed = population_count.updateMask(flooded_res).updateMask(mask);

// Calculate the sum of the exposed population.
var stats = population_exposed.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: swater.geometry(),
  bestEffort: true,
  tileScale: 16
});

// Get the total number of exposed people and round it.
var number_pp_exposed = stats.getNumber('b1').round();
print('People Exposed:', number_pp_exposed);

// Visualization parameters.
var populationCountVis = {
  min: 0,
  max: 200.0,
  palette: ['060606', '337663', '337663', 'ffffff'],
};

var populationExposedVis = {
  min: 0,
  max: 8000.0,
  palette: ['yellow', 'orange', 'red'],
};

var textVis = {
  'margin':'0px 8px 2px 0px',
  'fontSize': '15px',
  //'fontWeight':'bold',
  'fontFamily':'monospace'
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
  'fontFamily':'monospace'
  };

var titleTextVis = {
  'margin':'0px 0px 10px 0px',
  'fontSize': '17px', 
  'font-weight':'bold', 
  'color': '3333ff',
  'fontFamily':'monospace',
  'textDecoration':'underline'
  
  };
  


var text4 = ui.Label('Affected cropland:',textVis);
var number4 = ui.Label('Please wait...',numberVIS);
crop_area_ha.evaluate(function(val){number4.setValue(val+' hectares')}),numberVIS;

var text3 = ui.Label('Estimated number of exposed people: ',textVis);
var number3 = ui.Label('Please wait...',numberVIS);
number_pp_exposed.evaluate(function(val){number3.setValue(val)}),numberVIS;


var flood_stats_ten = flood_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(),              
  geometry: bound3,
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

//Airports
var airport = ee.FeatureCollection('projects/ee-rhrt-fast/assets/CF_airports');


var airportSamp = img.sampleRegions({
  collection: airport,
  //scale: 10,
  geometries: true
});
var airport_sz = airportSamp.size();
var air_aff = ui.Label('Airport facilities:',textVis);
var air_aff1 = ui.Label('Please Wait', numberVIS);
airport_sz.evaluate(function(val){air_aff1.setValue(val)}),numberVIS;


//Hospitals and Nursing
var fcPolygon2 = ee.FeatureCollection('projects/ee-rhrt-fast/assets/WUP_Hospitals_and_Nursing');
var fcPolygonSamp2 = img.sampleRegions({
  collection: fcPolygon2,
  //scale: 10,
  geometries: true
});
var bf = fcPolygonSamp2.size();
var bff = ui.Label('Hospitals and Nursing Homes affected:',textVis);
var bfff = ui.Label('Please Wait', numberVIS);
bf.evaluate(function(val){bfff.setValue(val)}),numberVIS;

//Adult foster Care
var fcPolygon4 = ee.FeatureCollection('projects/ee-rhrt-fast/assets/CF-WUPAdultFosterCare');
var fcPolygonSamp4 = img.sampleRegions({
  collection: fcPolygon4,
  //scale: 10,
  geometries: true
});
var eoc = fcPolygonSamp4.size();
var eocf = ui.Label('Adult Foster care Centers:',textVis);
var eocff = ui.Label('Please Wait', numberVIS);
eoc.evaluate(function(val){eocff.setValue(val)}),numberVIS;

//Ports
var fcPolygon9 = ee.FeatureCollection('projects/ee-rhrt-fast/assets/CF_ports');
var fcPolygonSamp9 = img.sampleRegions({
  collection: fcPolygon9,
  //scale: 10,
  geometries: true
});
var port = fcPolygonSamp9.size();
var portf = ui.Label('Port facilities:',textVis);
var portff = ui.Label('Please Wait', numberVIS);
port.evaluate(function(val){portff.setValue(val)}),numberVIS;



var number = ui.Label(" ")




//Bounding box3
var bound3 = reclassify.geometry()

//Riverine

// Import flood depth raster and UDF data
var floodDepth = /*ee.Image('projects/ee-rhrt-fast/assets/Inland_Inundation_500yr')*/reducedResolutionImage.clip(bound3);
var udf = ee.FeatureCollection('projects/ee-rhrt-fast/assets/FAST_build_UDF_280624').filterBounds(bound3);


//print("UDF:",udf.first() )
//print('Raster:',floodDepth)


// Load the raster at a resolution of 30 meters
var raster = floodDepth.resample('bilinear').reproject({
  crs: floodDepth.projection(),//'EPSG:4326',
  scale: floodDepth.projection().nominalScale()
});


// Project the UDF dataset to the same projection as the raster
var projectedUDF = udf.map(function(feature) {
  return feature.setGeometry(feature.geometry().transform(reducedResolutionImage.projection()));
});

// Sample the raster values at the UDF feature locations
var sampledUDF = reducedResolutionImage.reduceRegions({
  collection: projectedUDF,
  reducer: ee.Reducer.anyNonZero(),
  scale: 30, // Match the scale of the reprojected raster
});

// Function to check if a feature is flooded
var checkFlooded = function(feature) {
  var flooded = feature.get('any');
  return feature.set('flooded', ee.Algorithms.If(flooded, true, false));
};

// Apply the checkFlooded function to the sampled UDF features
var udfFlood = sampledUDF.map(checkFlooded);

// Filter the UDF records that are exposed to flood
var udfExposed = udfFlood.filter(ee.Filter.eq('flooded', true));

// Get the total number of UDF records exposed to flood
var udfExposedCount = udfExposed.size();

// Print the result
//print('Number of UDF records exposed to flood (Riverine):', udfExposedCount);


// Add a new property to the UDF dataset indicating the flood depth at the location of the building
var udfDepth = udfExposed.map(function(feature) {
  var depth = raster.reduceRegion({
    reducer: ee.Reducer.first(),
    geometry: feature.geometry(),
    scale: floodDepth.projection().nominalScale()
  }).values().get(0);
  // If depth is null or None, assign it a value of zero
  depth = ee.Algorithms.If(ee.Algorithms.IsEqual(depth, null), 0, depth);
  depth = ee.Algorithms.If(ee.Algorithms.IsEqual(depth, 'None'), 0, depth);
  return feature.set('flood_depth', depth);
});



//Coastal


// Import flood depth raster and UDF data
var floodDepth_c = ee.Image('projects/ee-rhrt-fast/assets/Coast_Inund_50yr').clip(bound3);


// Load the raster at a resolution of 30 meters
var raster_c = floodDepth_c.resample('bilinear').reproject({
  crs: floodDepth_c.projection(),//'EPSG:4326',
  scale: 30//floodDepth_c.projection().nominalScale()
});



var projectedUDF_c = udf.map(function(feature) {
  return feature.setGeometry(feature.geometry().transform(raster_c.projection()));
});

// Sample the raster values at the UDF feature locations
var sampledUDF_c = raster_c.reduceRegions({
  collection: projectedUDF_c,
  reducer: ee.Reducer.anyNonZero(),
  scale: 30, // Match the scale of the reprojected raster
});

// Function to check if a feature is flooded
var checkFlooded_c = function(feature) {
  var flooded = feature.get('any');
  return feature.set('coastal_flooded', ee.Algorithms.If(flooded, true, false));
};

// Apply the checkFlooded function to the sampled UDF features
var udfFlood_c = sampledUDF_c.map(checkFlooded_c);

// Filter the UDF records that are exposed to flood
var udfExposed_c = udfFlood_c.filter(ee.Filter.eq('coastal_flooded', true));

// Get the total number of UDF records exposed to flood
var udfExposedCount_c = udfExposed_c.size();

// Print the result
//print('Number of UDF records exposed to flood (Coastal):', udfExposedCount_c);




// Add a new property to the UDF dataset indicating the flood depth at the location of the building
var udfDepth_c = udfExposed_c.map(function(feature) {
  var depth_c = raster_c.reduceRegion({
    reducer: ee.Reducer.first(),
    geometry: feature.geometry(),
    scale: floodDepth_c.projection().nominalScale()
  }).values().get(0);
  // If depth is null or None, assign it a value of zero
  depth_c = ee.Algorithms.If(ee.Algorithms.IsEqual(depth_c, null), 0, depth_c);
  depth_c = ee.Algorithms.If(ee.Algorithms.IsEqual(depth_c, 'None'), 0, depth_c);
  return feature.set('coastal_flood_depth', depth_c);
});


// Find buildings exposed to both types of floods and calculate the maximum flood depth
var udfBoth = udfDepth.filter(ee.Filter.inList('system:index', udfDepth_c.aggregate_array('system:index')));
var udfBothMaxDepth = udfBoth.map(function(feature) {
  var riverineDepth = feature.get('flood_depth');
  var coastalDepth = feature.get('coastal_flood_depth');
  var maxDepth = ee.Algorithms.If(ee.Number(riverineDepth).gt(coastalDepth), riverineDepth, coastalDepth);
  return feature.set('max_flood_depth', maxDepth);
});

//Find buildings exposed to both types of floods and calculate the maximum flood depth
var coastalIndices = udfExposed_c.aggregate_array('system:index');
var riverineIndices = udfExposed.aggregate_array('system:index');

var udfBoth = udfDepth.filter(ee.Filter.inList('system:index', coastalIndices));
var udfBoth_c = udfDepth_c.filter(ee.Filter.inList('system:index', riverineIndices));

var udfBothMaxDepth = udfBoth.map(function(feature) {
  var coastalFeature = udfBoth_c.filter(ee.Filter.eq('system:index', feature.get('system:index'))).first();
  var riverineDepth = feature.get('flood_depth');
  var coastalDepth = coastalFeature.get('coastal_flood_depth');
  var maxDepth = ee.Algorithms.If(ee.Number(riverineDepth).gt(coastalDepth), riverineDepth, coastalDepth);
  return feature.set('depth_vfd', maxDepth);
});

//Identify buildings exposed to only riverine floods and only coastal floods and set 'depth_vfd'
var udfRiverineOnly = udfDepth.filter(ee.Filter.inList('system:index', coastalIndices).not()).map(function(feature) {
  return feature.set('depth_vfd', feature.get('flood_depth'));
});

var udfCoastalOnly = udfDepth_c.filter(ee.Filter.inList('system:index', riverineIndices).not()).map(function(feature) {
  return feature.set('depth_vfd', feature.get('coastal_flood_depth'));
});

// Combine the three feature collections into a single collection
var combinedUDF = udfRiverineOnly
  .merge(udfCoastalOnly)
  .merge(udfBothMaxDepth);

// Print results
var udfBothCount = udfBoth.size();
var udfRiverineOnlyCount = udfRiverineOnly.size();
var udfCoastalOnlyCount = udfCoastalOnly.size();
var totalAffectedBuildings = udfBothCount.add(udfRiverineOnlyCount).add(udfCoastalOnlyCount);

print('Number of UDF records exposed to both riverine and coastal floods:', udfBothCount);
print('Number of UDF records exposed to riverine only floods:', udfRiverineOnlyCount);
print('Number of UDF records exposed to coastal only floods:', udfCoastalOnlyCount);
print('Total number of affected buildings:', totalAffectedBuildings);





// Iterate over each feature in the riverine dataset
var udfDepthMax = combinedUDF; /*udfDepth.map(function(feature) {
  var geometry = feature.geometry();
  var riverineDepth = ee.Number(feature.get('flood_depth'));

  // Filter the coastal dataset to features intersecting the current riverine feature
  var intersectingFeatures = udfDepth_c.filterBounds(geometry);

  // Iterate over each intersecting feature and compare flood depth values
  var maxDepth = intersectingFeatures.iterate(function(coastalFeature, currentMax) {
    coastalFeature = ee.Feature(coastalFeature);
    var coastalDepth = ee.Number(coastalFeature.get('coastal_flood_depth'));
    return ee.Algorithms.If(coastalDepth.gt(ee.Number(currentMax)), coastalDepth, currentMax);
  }, riverineDepth);

  // Add the maximum flood depth as a new property
  return feature.set('max_flood_depth', maxDepth);
});*/

// Print the resulting FeatureCollection
//print('UDF with max flood depth:', udfDepthMax);

// Compute the depth_vfd property and add it to the feature collection
var udfDepthVFD = udfDepthMax;/*.map(function(feature) {
  var firstFloorHt = feature.get('FirstFloor');
  var floodDepth = feature.get('max_flood_depth');
  var depthVFD = ee.Number(floodDepth).subtract(ee.Number(firstFloorHt));
  depthVFD = ee.Algorithms.If(ee.Algorithms.IsEqual(depthVFD, null), 0, depthVFD);
  depthVFD = ee.Algorithms.If(ee.Algorithms.IsEqual(depthVFD, 'None'), 0, depthVFD);
  return feature.set('depth_vfd', depthVFD);
});*/


// Print the updated UDF dataset
print('UDF dataset with max flood depth:', udfDepthVFD);
// Get the total number of UDF records exposed to flood
var udfExposedCount_udfDepthVFD = udfDepthVFD.size();

// Print the result
print('Number of UDF records exposed to flood (MaxDepth):', udfExposedCount_udfDepthVFD);


// Apply the filter directly to the FeatureCollection
var nonEmptyOccClassUdf = udfDepthVFD;/*.filter(ee.Filter.and(
  ee.Filter.neq('OccClass', 'null'),
  ee.Filter.neq('OccClass', '')
));
print('N.o of Filtered UDF with non-empty OccClass:', nonEmptyOccClassUdf.size());*/



var calculateSOID = function(feature) {
  // Get properties from feature
  var occupancy = ee.String(feature.get('OccClass'));
  var foundationType = feature.getNumber('FoundType');
  var numStories = feature.getNumber('NumStories');

  // Prefix: First and last character of occupancy
  
  var sopre = ee.Algorithms.If(occupancy.equals('REL1'), ee.String('RE1'), occupancy.slice(0, 1).cat(occupancy.slice(3, occupancy.length())) );


  // Suffix: Easy - Basement or no Basement
  var sosuf = ee.Algorithms.If(ee.Number(foundationType).neq(4),
                               'N',
                               'B');

  var somid = ee.Algorithms.If(occupancy.slice(0, 4).equals('RES3'),
                               ee.Algorithms.If(numStories.gt(4),
                                                '5',
                                                ee.Algorithms.If(numStories.gt(2),
                                                                 '3',
                                                                 '1')),
                               ee.Algorithms.If(occupancy.slice(0, 4).equals('RES1'),
                                                ee.Algorithms.If(numStories.gt(3.0),
                                                                 ee.Algorithms.If(ee.Number(3).subtract(ee.Number(3).round()).eq(0),
                                                                                  ee.String(ee.Number(3).round()),'S'),
                                                                 ee.Algorithms.If(ee.Number(numStories).subtract(ee.Number(numStories).round()).eq(0),
                                                                                  ee.String(ee.Number(numStories).round().toInt()),'S')),
                                                ee.Algorithms.If(occupancy.slice(0, 4).equals('RES2'),
                                                                 '1',
                                                                 ee.Algorithms.If(numStories.gt(6),
                                                                                  'H',
                                                                                  ee.Algorithms.If(numStories.gt(3),
                                                                                                   'M',
                                                                                                   'L')))));                                                                                                 
       


  // Calculate specific occupancy id
  var SpecificOccupId = ee.String(sopre).cat(ee.String(somid)).cat(ee.String(sosuf));

  // Set the specific occupancy id as property of the feature and return the feature
  return feature.set('SpecificOccupId', SpecificOccupId);
};


// Apply the function to the FeatureCollection
var udfWithSOID1 = nonEmptyOccClassUdf.map(calculateSOID);
//print('UDF dataset with SOID:', udfWithSOID1);

// Add a new column 'flc' with value 'CAE' to each feature in the FeatureCollection
var udfWithSOID = udfWithSOID1.map(function(feature) {
  return feature.set('flc', 'CAE');
});






// Load two feature collections
var fc1 = udfWithSOID;



// Map the addBldgLoss function over the udfData FeatureCollection

  // Define the bddf_lut_riverine and bddf_lut_coastalA as Feature Collections
  var bddf_lut_riverine = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Building_DDF_Riverine_LUT_Hazus4p0');
  var bddf_lut_coastalA = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Building_DDF_CoastalA_LUT_Hazus4p0');
  var bddf_lut_coastalV = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Building_DDF_CoastalV_LUT_Hazus4p0');

var addBldgLoss = fc1.map(function(feature) {

  var depth1 = feature.getNumber('depth_vfd');
  var OC = ee.String(feature.get('OccClass'));
  var CoastalZoneCode = ee.String(feature.get('flc'));
  // Initialize the blut variable
  var blut = bddf_lut_riverine;

  // Check the conditions
  if (OC.slice(0,3) == 'RES') {
  if (CoastalZoneCode == 'CAE') {
      blut = bddf_lut_coastalA;
    } else if (CoastalZoneCode == 'VE' || CoastalZoneCode == 'V') {
      blut = bddf_lut_coastalV;
    }
  }

  

  var ddf = blut;
  var soid1 = feature.get('SpecificOccupId');
  var soid2 = ee.Filter.eq('SpecificOccupId', soid1);
  
  var fc3 = ddf.filter(soid2).first();
  
  // Clamp the depth value to the range [-4, 24]
  var depth = ee.Algorithms.If(depth1.gt(24), 24, ee.Algorithms.If(depth1.lt(-4), -4, depth1));


  var suffix_l = ee.String(((ee.Number(depth).floor()).abs()).int());
  var suffix_u = ee.String(((ee.Number(depth).ceil()).abs()).int());
  var prefix_l = ee.String(ee.Algorithms.If(ee.Number(depth).floor().lt(0), 'm', 'p'));
  var prefix_u = ee.String(ee.Algorithms.If(ee.Number(depth).ceil().lt(0), 'm', 'p'));
  var l_index = prefix_l.cat(suffix_l);
  var u_index = prefix_u.cat(suffix_u);
  
  //Building Loss Calculation
  // Get the lower and upper values from the ddf1 dictionary
  var d_lower = ee.Number(fc3.get(l_index)).toFloat();
  var d_upper = ee.Number(fc3.get(u_index)).toFloat();

  // Compute the fractional amount of depth for interpolation
  var frac = ee.Number(depth).subtract(ee.Number(depth).floor());

  // Compute the damage using linear interpolation
  var damage = (d_lower.add(frac.multiply(d_upper.subtract(d_lower)))).divide(100);
  var bldg_loss = damage.multiply(ee.Number.parse(feature.get('Cost')));

  var cost1 = ee.Number.parse(feature.get('Cost'));
  return feature.set('bldg_loss', bldg_loss).set('New_Cost',cost1);
});


print('Total cost (Earth Engine):', addBldgLoss.aggregate_sum('bldg_loss'));
print('Total Cost:', addBldgLoss.aggregate_sum('New_Cost'));
//print('Building Loss', addBldgLoss);

var Content_x_0p5 = ['RES1','RES2','RES3A','RES3B','RES3C','RES3D','RES3E','RES3F','RES4','RES5','RES6','COM10'];
var Content_x_1p0 = ['COM1','COM2','COM3','COM4','COM5','COM8','COM9','IND6','AGR1','REL1','GOV1','EDU1'];
var Content_x_1p5 = ['COM6','COM7','IND1','IND2','IND3','IND4','IND5','GOV2','EDU2'];

  var cddf_lut_riverine = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Content_DDF_Riverine_LUT_Hazus4p0');
  var cddf_lut_coastalA = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Content_DDF_CoastalA_LUT_Hazus4p0');
  var cddf_lut_coastalV = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Content_DDF_CoastalV_LUT_Hazus4p0');

var addContLoss1 = addBldgLoss.map(function(feature){
  var OC = feature.get('OccClass');
  var ccost = feature.get('New_Cost');
  var CMult = ee.Algorithms.If(
    ee.List(Content_x_0p5).contains(OC),
    0.5,
    ee.Algorithms.If(
      ee.List(Content_x_1p0).contains(OC),
      1.0,
      ee.Algorithms.If(
        ee.List(Content_x_1p5).contains(OC),
        1.5,
        0
      )
    )
  );
  var ccost_new = ee.Number(ccost).multiply(CMult);
  return feature.set('ccost_new', ccost_new);
  
});

var addContLoss = addContLoss1.map(function(feature) {

  var depth1 = feature.getNumber('depth_vfd');
  var OC = ee.String(feature.get('OccClass'));
  var CoastalZoneCode = ee.String(feature.get('flc'));
  // Initialize the blut variable
  var blut = cddf_lut_riverine;

  // Check the conditions
  if (OC.slice(0,3) == 'RES') {
  if (CoastalZoneCode == 'CAE') {
      blut = bddf_lut_coastalA;
    } else if (CoastalZoneCode == 'VE' || CoastalZoneCode == 'V') {
      blut = bddf_lut_coastalV;
    }
  }

  

  var ddf = blut;
  
  var soid1 = feature.get('SpecificOccupId')
  var soid2 = ee.Filter.eq('SpecificOccupId', soid1);
  
  var fc3 = ddf.filter(soid2).first();
  
  
  var depth = ee.Algorithms.If(depth1.gt(24), 24, ee.Algorithms.If(depth1.lt(-4), -4, depth1))


  var suffix_l = ee.String(((ee.Number(depth).floor()).abs()).int());
  var suffix_u = ee.String(((ee.Number(depth).ceil()).abs()).int());
  var prefix_l = ee.String(ee.Algorithms.If(ee.Number(depth).floor().lt(0), 'm', 'p'));
  var prefix_u = ee.String(ee.Algorithms.If(ee.Number(depth).ceil().lt(0), 'm', 'p'));
  var l_index = prefix_l.cat(suffix_l);
  var u_index = prefix_u.cat(suffix_u);
  
  // Content Loss Calculation
  // Get the lower and upper values from the ddf1 dictionary
  var d_lower = ee.Number(fc3.get(l_index)).toFloat();
  var d_upper = ee.Number(fc3.get(u_index)).toFloat();

  // Compute the fractional amount of depth for interpolation
  var frac = ee.Number(depth).subtract(ee.Number(depth).floor());

  // Compute the damage using linear interpolation
  var damage = (d_lower.add(frac.multiply(d_upper.subtract(d_lower)))).divide(100);

  
  var cont_loss = damage.multiply(ee.Number(feature.get('ccost_new')));

  return feature.set('cont_loss', cont_loss);
});

print('Total content cost (Earth Engine):', addContLoss.aggregate_sum('cont_loss'));
//print('Content Loss', addContLoss);


//Basement
var bsmf = addContLoss.map(function(feature) {

  var OC = ee.String(feature.get('OccClass'));
  var foundationType = feature.getNumber('FoundType');
  var bsm = ee.Algorithms.If(OC.equals('RES1'), ee.Algorithms.If(foundationType.eq(4),'B','NB'), 'NB');
  return feature.set('bsm', bsm);
});

//print('bsm', bsmf)

//Debris calculation

var debris_key = bsmf.map(function(feature) {

  var depth1 = feature.getNumber('depth_vfd');
  var OC = ee.String(feature.get('OccClass'));
  var foundationType = feature.getNumber('FoundType');
  var debriskey, ddf1, dfin, dstruc, dfound, dtot;
  var bsm =  ee.String(feature.get('bsm')); // default value for no basement
  var fnd = ee.Algorithms.If(foundationType.eq(4).or(foundationType.eq(7)),'SG','FT'); // default value for slab on grade foundation
  
  var depth = ee.Algorithms.If(depth1.gt(24), 24, ee.Algorithms.If(depth1.lt(-4), -4, depth1))
  
  var ddf = ee.FeatureCollection('projects/ee-rhrt-fast/assets/flDebris_LUT')
  

  
  var dsuf = ee.Algorithms.If(foundationType.eq(4),
  ee.Algorithms.If(
    OC.equals('RES1'),
    ee.Algorithms.If(ee.Number(depth).lt(-4), '-8',
      ee.Algorithms.If(ee.Number(depth).lt(0), '-4',
        ee.Algorithms.If(ee.Number(depth).lt(4), '0',
          ee.Algorithms.If(ee.Number(depth).lt(6), '4',
            ee.Algorithms.If(ee.Number(depth).lt(8), '6', '8'))))),
    ee.Algorithms.If(
      OC.equals('COM6'),
      ee.Algorithms.If(ee.Number(depth).lt(-4), '-8',
        ee.Algorithms.If(ee.Number(depth).lt(0), '-4',
          ee.Algorithms.If(ee.Number(depth).lt(4), '0',
            ee.Algorithms.If(ee.Number(depth).lt(6), '4',
              ee.Algorithms.If(ee.Number(depth).lt(8), '6', '8'))))),
      ee.Algorithms.If(
        OC.equals('RES2'),
        ee.Algorithms.If(ee.Number(depth).lt(0), '0', 
        ee.Algorithms.If(
        ee.Number(depth).lt(1), '0',
          ee.Algorithms.If(ee.Number(depth).lt(4), '1',
            ee.Algorithms.If(ee.Number(depth).lt(8), '4',
              ee.Algorithms.If(ee.Number(depth).lt(12), '8', '12')))
          )),
        ee.Algorithms.If(
          ee.Number(depth).lt(1), '0',
            ee.Algorithms.If(ee.Number(depth).lt(4), '1',
              ee.Algorithms.If(ee.Number(depth).lt(8), '4',
                ee.Algorithms.If(ee.Number(depth).lt(12), '8', '12')))
          )
       )
    )
  ),
  ee.Algorithms.If(
    ee.Number(depth).lt(1), '0',
    ee.Algorithms.If(ee.Number(depth).lt(4), '1',
      ee.Algorithms.If(ee.Number(depth).lt(8), '4',
        ee.Algorithms.If(ee.Number(depth).lt(12), '8', '12')))
  )
)


  

  debriskey = OC.cat(bsm).cat(fnd).cat(dsuf);
  
  
 
  return feature.set('DebrisID', debriskey);
});

//print('DebrisID',debris_key);

var debris = debris_key.map(function(feature) {
    
  var ddf = ee.FeatureCollection('projects/ee-rhrt-fast/assets/flDebris_LUT')
  var area = ee.Number.parse(feature.get('Area')).toFloat()
  
  
  var soid1 = feature.get('DebrisID')
  var soid2 = ee.Filter.eq('DebrisID', soid1);
  
  var fc3 = ddf.filter(soid2).first();
  
  var dfin_rate    = (ee.Number(fc3.get('Finishes'))).toFloat();
  var dstruc_rate  =  (ee.Number(fc3.get('Structure'))).toFloat();
  var dfound_rate  =  (ee.Number(fc3.get('Foundation'))).toFloat();
                                    
  var dfin      = ee.Number(area.multiply(dfin_rate).divide(1000));
  var dstruc    = ee.Number(area.multiply(dstruc_rate).divide(1000));
  var dfound    = ee.Number(area.multiply(dfound_rate).divide(1000));
  var dtot      = ee.Number(dfin.add(dstruc).add(dfound));
  
  return feature.set('Debris', dtot);
});

print('Debris', debris)


// Restoration
 

var restorf1 = debris.map(function(feature) {

  var depth = feature.getNumber('depth_vfd');
  var OC = ee.String(feature.get('OccClass'));
  
  var dsuf = ee.Algorithms.If(
  ee.Number(depth).lt(0), '0',
  ee.Algorithms.If(
    ee.Number(depth).lt(1), '1',
    ee.Algorithms.If(
      ee.Number(depth).lt(4), '4',
      ee.Algorithms.If(
        ee.Number(depth).lt(8), '8',
        ee.Algorithms.If(
          ee.Number(depth).lt(12), '12',
          '24'
        )
      )
    )
  )
);
  var RsFnkey = OC.cat(ee.String(dsuf))
  
 
  return feature.set('RestFnID', RsFnkey);
  
});


var restorf2 = restorf1.map(function(feature) {
    
  var ddf = ee.FeatureCollection('projects/ee-rhrt-fast/assets/flRsFnGBS_LUT')
  
  
  var soid1 = feature.get('RestFnID')
  var soid2 = ee.Filter.eq('RestFnID', soid1);
  
  var fc3 = ddf.filter(soid2).first();
  
  var restdays_min =  ee.Number(fc3.get('Min_Restor_Days')).toInt() //This is the maximum days out (flRsFnGBS has a min and a max)
  var restdays_max =  ee.Number(fc3.get('Max_Restor_Days')).toInt() //This is the maximum days out (flRsFnGBS has a min and a max)
  
  return feature.set('restdays_max', restdays_max);
});

//print('Restoration', restorf2)

print('Total no of days taken for Restoration: (Earth Engine):', restorf2.aggregate_sum('restdays_max'));


var fcPolygon = combinedUDF;

var tb = fcPolygon.size();
var tb_h = ui.Label('Total number of buildings affected :',textVis);
var tb_v = ui.Label('Please Wait', numberVIS);
tb.evaluate(function(val){tb_v.setValue(val)}),numberVIS;

var BldgLossUSD = addBldgLoss.aggregate_sum('bldg_loss')
var cost_total = BldgLossUSD.toInt()
var cost_total_h = ui.Label('Cost estimated (Building loss):',textVis);
var cost_total_v = ui.Label('Please Wait', numberVIS);
cost_total.evaluate(function(val){cost_total_v.setValue('$ '+val)}),numberVIS;

/*var InventoryLossUSD = fcPolygon.aggregate_sum('icost')
var cost_inv = InventoryLossUSD.toInt()
var cost_inv_h = ui.Label('Cost estimated (Inventory):',textVis);
var cost_inv_v = ui.Label('Please Wait', numberVIS);
cost_inv.evaluate(function(val){cost_inv_v.setValue('$ '+val)}),numberVIS;*/

var ContentLossUSD = addContLoss.aggregate_sum('cont_loss')
var cost_cont = ContentLossUSD.toInt()
var cost_cont_h = ui.Label('Cost estimated (Content loss):',textVis);
var cost_cont_v = ui.Label('Please Wait', numberVIS);
cost_cont.evaluate(function(val){cost_cont_v.setValue('$ '+val)}),numberVIS;

var Debrisamount = debris.aggregate_sum('Debris');
var deb_cont = Debrisamount.toInt();
var deb_cont_h = ui.Label('Debris (Ton):',textVis);
var deb_cont_v = ui.Label('Please Wait', numberVIS);
deb_cont.evaluate(function(val){deb_cont_v.setValue(val)}),numberVIS;

var Restamount = restorf2.aggregate_sum('restdays_max');
var resto_cont = Restamount.toInt();
var resto_cont_h = ui.Label('Restoration (No of days):',textVis);
var resto_cont_v = ui.Label('Please Wait', numberVIS);
resto_cont.evaluate(function(val){resto_cont_v.setValue(val)}),numberVIS;



var fc = combinedUDF;

var res = fc.filter(ee.Filter.stringStartsWith('OccClass', 'RES'));
var residential = res;

var com =  fc.filter(ee.Filter.stringStartsWith('OccClass', 'CO'));
var commercial = com;

var agri =  fc.filter(ee.Filter.stringStartsWith('OccClass', 'AGR1'));
var agricultural = agri;

var rel = fc.filter(ee.Filter.stringStartsWith('OccClass', 'REL'));
var gov = fc.filter(ee.Filter.stringStartsWith('OccClass', 'GOV'));
var edu = fc.filter(ee.Filter.stringStartsWith('OccClass', 'EDU'));
var ind = fc.filter(ee.Filter.stringStartsWith('OccClass', 'IND'));



var comm = com.size();
var comm_h = ui.Label('Total number of commercial buildings:',textVis);
var comm_v = ui.Label('Please Wait', numberVIS);
comm.evaluate(function(val){comm_v.setValue(val)}),numberVIS;

res =  res.size();
var res_h = ui.Label('Total number of residential buildings:',textVis);
var res_v = ui.Label('Please Wait', numberVIS);
res.evaluate(function(val){res_v.setValue(val)}),numberVIS;

agri = agri.size();
var agri_h = ui.Label('Total number of agricultural buildings :',textVis);
var agri_v = ui.Label('Please Wait', numberVIS);
agri.evaluate(function(val){agri_v.setValue(val)}),numberVIS;

var rell = rel.size();
var rel_h = ui.Label('Total number of religious buildings:',textVis);
var rel_v = ui.Label('Please Wait', numberVIS);
rell.evaluate(function(val){rel_v.setValue(val)}),numberVIS;

var govv =  gov.size();
var gov_h = ui.Label('Total number of governmental buildings:',textVis);
var gov_v = ui.Label('Please Wait', numberVIS);
govv.evaluate(function(val){gov_v.setValue(val)}),numberVIS;

var eduu = edu.size();
var edu_h = ui.Label('Total number of educational buildings :',textVis);
var edu_v = ui.Label('Please Wait', numberVIS);
eduu.evaluate(function(val){edu_v.setValue(val)}),numberVIS;

var indd = ind.size();
var ind_h = ui.Label('Total number of industrial buildings :',textVis);
var ind_v = ui.Label('Please Wait', numberVIS);
indd.evaluate(function(val){ind_v.setValue(val)}),numberVIS;


var downloadLink = ui.Label({value:'Export the results',
  style: {
  color: 'blue',
  fontSize: '16px',
  fontWeight:'bold',
  textAlign: 'center',
  fontFamily:'monospace',
  border: '2px solid lightgray',
  stretch:'horizontal'
  }
});



downloadLink.setUrl(restorf2.getDownloadURL({format: 'csv'}));

results1.clear();
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
        deb_cont_h,
        deb_cont_v,
        resto_cont_h,
        resto_cont_v,
        cost_total_h,
        cost_total_v,
        //cost_inv_h,
        //cost_inv_v,
        cost_cont_h,
        cost_cont_v,
        res_h,
        res_v,
        
        comm_h,
        comm_v,
        
        agri_h,
        agri_v,
        
        rel_h,
        rel_v,
        
        gov_h,
        gov_v,
        
        edu_h,
        edu_v,
        
        ind_h,
        ind_v,
      

        air_aff,
        air_aff1,
        portf,
        portff,
        bff,
        bfff,
        eocf,
        eocff,
        
        downloadLink
        
      ]
      ));
    




var denver = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level2')
    .filter("ADM2_NAME == 'Houghton'")
    .filter(ee.Filter.eq('ADM2_NAME', 'Houghton'))  // Exactly the same as above.
    .first()
    .geometry();
    
// Create an image collection from the two images.
var floodCollection = ee.ImageCollection([
  floodDepth_c,//.set('system:index', 'Coastal Inundation'),
  flooded//.set('system:index', 'Riverine Flooding')
]).mosaic();

Map.clear();
Map.centerObject(swater.geometry(), 9);
Map.addLayer(floodCollection, {palette:"0000FF"},'Flooded areas');
Map.add(results);
Map.add(legend);
Map.add(results1);
Map.addLayer(population_exposed, populationExposedVis, 'Exposed Population',0);
Map.addLayer(cropland_affected, croplandVis, 'Affected Cropland',0); 
Map.addLayer(fcPolygon, {color: 'yellow'},'Buildings',0);
Map.addLayer(agricultural, {color: 'magenta'},'Agricultural',0);
Map.addLayer(commercial, {color: 'cyan', pointSize: 100},'Commercial',0);
Map.addLayer(residential, {color: 'red'},'Residential',0);




}





function hand_hd(){ 
  
// Map over the joined collection to compute inundation
var inundationList = joinedCollectionForInundation.map(function(pair) {
  var exportFeature = ee.Feature(pair.get('primary'));
  var subbasinFeature = ee.Feature(pair.get('secondary'));

  var clippedRaster = Hand_Raster.clip(subbasinFeature.geometry());
  var H25Value = ee.Number(exportFeature.get('H100'));

  var inundationRaster = ee.Image(H25Value).subtract(clippedRaster).updateMask(clippedRaster.lt(H25Value));
  return inundationRaster;
});

// Mosaic all the resulting rasters
var inundationMosaic = ee.ImageCollection(inundationList).mosaic();

// Reproject the mosaiced image to a standard CRS and reduce its resolution
var reprojectedImage = inundationMosaic
  .rename('b1')
  .reproject({
    crs: 'EPSG:4326',
    scale: 30 // Adjust the scale as needed to manage memory usage
  });

// Reduce the resolution of the raster for faster processing
var reducedResolutionImage = ee.Image('projects/ee-rhrt-fast/assets/WUP_Inund_100'); /*reprojectedImage.reduceResolution({
  reducer: ee.Reducer.mean(),
  bestEffort: true,
  maxPixels: 1024  // Adjust as needed
});*/


                
  var selectedValue = dropdown.getValue();
  var aoi;

if (selectedValue !== null) {
  aoi = ee.Algorithms.If(ee.String(selectedValue).equals('Houghton'), shp1, 
        ee.Algorithms.If(ee.String(selectedValue).equals('Baraga'),shp2, 
        ee.Algorithms.If(ee.String(selectedValue).equals('Gogebic'),shp3,
        ee.Algorithms.If(ee.String(selectedValue).equals('Keweenaw'),shp4,
        ee.Algorithms.If(ee.String(selectedValue).equals('Ontonagon'),shp5,
        drawingTools.layers().get(0).getEeObject())))));
} else {
  // set default AOI if selectedValue is null
  aoi = drawingTools.layers().get(0).getEeObject();
}
              
  drawingTools.setShape(null);
  var HAND= reducedResolutionImage;

  var reclassify = HAND.updateMask(HAND.gte(0)).clip(aoi);

  
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

// Import the NLCD collection.
var dataset = ee.ImageCollection('USGS/NLCD_RELEASES/2021_REL/NLCD');

// Filter the collection to the 2021 product.
var nlcd2021 = dataset.filter(ee.Filter.eq('system:index', '2021')).first();

// Select the land cover band.
var landcover = nlcd2021.select('landcover').rename('b1');

var LC = landcover.clip(aoi);

// Define the cropland classes (NLCD codes for cropland, e.g., 81 and 82 for pasture/hay and cultivated crops)
var croplandClasses = [81, 82];

// Create a mask for cropland areas.
var cropmask = LC.eq(croplandClasses[0]).or(LC.eq(croplandClasses[1]));
var cropland = LC.updateMask(cropmask);

// Reproject the flood raster to match the cropland projection.
/*var crop_projection = LC.projection();*/
var flooded_res = flooded/*.reproject({
  crs: crop_projection
});*/

// Intersect the cropland with the flood raster.
var cropland_affected = flooded_res.updateMask(cropland);

// Calculate the area of the affected cropland in hectares.
var crop_pixelarea = cropland_affected.multiply(ee.Image.pixelArea());
var crop_stats = crop_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: swater.geometry(),
  scale: 30,  // NLCD resolution is 30m
  //maxPixels: 1856997344,
  bestEffort: true,
});

// Convert the area to hectares.
var crop_area_ha = crop_stats.getNumber('b1').divide(10000).round();
print('Affected Cropland Area (hectares):', crop_area_ha);


  
var croplandVis = {
  min: 0,
  max: 1,
  palette: ['green'],
};

//Population
// Load the population count raster and clip it to the region of interest (swater.geometry()).
var population_count = ee.Image("projects/ee-rhrt-fast/assets/WUP_Popoulation").clip(aoi);

// Reproject the flood raster to match the population raster projection.
var GHSLprojection = population_count.select('b1').projection();
var flooded_res = flooded.reproject({
  crs: GHSLprojection,
  scale: population_count.projection().nominalScale()
});

// Load the Hansen et al. forest change dataset and select the land/water mask.
var hansenImage = ee.Image('UMD/hansen/global_forest_change_2015');
var datamask = hansenImage.select('datamask');

// Create a binary mask where datamask equals 1 (indicating land).
var mask = datamask.eq(1);

// Update the population count with the mask (assuming HAND is already defined).
var population_exposed = population_count.updateMask(flooded_res).updateMask(mask);

// Calculate the sum of the exposed population.
var stats = population_exposed.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: swater.geometry(),
  bestEffort: true,
  tileScale: 16
});

// Get the total number of exposed people and round it.
var number_pp_exposed = stats.getNumber('b1').round();
print('People Exposed:', number_pp_exposed);

// Visualization parameters.
var populationCountVis = {
  min: 0,
  max: 200.0,
  palette: ['060606', '337663', '337663', 'ffffff'],
};

var populationExposedVis = {
  min: 0,
  max: 8000.0,
  palette: ['yellow', 'orange', 'red'],
};


var textVis = {
  'margin':'0px 8px 2px 0px',
  'fontSize': '15px',
  //'fontWeight':'bold',
  'fontFamily':'monospace'
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
  'fontFamily':'monospace'
  };

var titleTextVis = {
  'margin':'0px 0px 10px 0px',
  'fontSize': '17px', 
  'font-weight':'bold', 
  'color': '3333ff',
  'fontFamily':'monospace',
  'textDecoration':'underline'
  
  };
  


var text4 = ui.Label('Affected cropland:',textVis);
var number4 = ui.Label('Please wait...',numberVIS);
crop_area_ha.evaluate(function(val){number4.setValue(val+' hectares')}),numberVIS;

var text3 = ui.Label('Estimated number of exposed people: ',textVis);
var number3 = ui.Label('Please wait...',numberVIS);
number_pp_exposed.evaluate(function(val){number3.setValue(val)}),numberVIS;


var flood_stats_ten = flood_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(),              
  geometry: bound3,
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
var img = reclassify;


//Airports
var airport = ee.FeatureCollection('projects/ee-rhrt-fast/assets/CF_airports');


var airportSamp = img.sampleRegions({
  collection: airport,
  //scale: 10,
  geometries: true
});
var airport_sz = airportSamp.size();
var air_aff = ui.Label('Airport facilities:',textVis);
var air_aff1 = ui.Label('Please Wait', numberVIS);
airport_sz.evaluate(function(val){air_aff1.setValue(val)}),numberVIS;


//Hospitals and Nursing
var fcPolygon2 = ee.FeatureCollection('projects/ee-rhrt-fast/assets/WUP_Hospitals_and_Nursing');
var fcPolygonSamp2 = img.sampleRegions({
  collection: fcPolygon2,
  //scale: 10,
  geometries: true
});
var bf = fcPolygonSamp2.size();
var bff = ui.Label('Hospitals and Nursing Homes affected:',textVis);
var bfff = ui.Label('Please Wait', numberVIS);
bf.evaluate(function(val){bfff.setValue(val)}),numberVIS;

//Adult foster Care
var fcPolygon4 = ee.FeatureCollection('projects/ee-rhrt-fast/assets/CF-WUPAdultFosterCare');
var fcPolygonSamp4 = img.sampleRegions({
  collection: fcPolygon4,
  //scale: 10,
  geometries: true
});
var eoc = fcPolygonSamp4.size();
var eocf = ui.Label('Adult Foster care Centers:',textVis);
var eocff = ui.Label('Please Wait', numberVIS);
eoc.evaluate(function(val){eocff.setValue(val)}),numberVIS;

//Ports
var fcPolygon9 = ee.FeatureCollection('projects/ee-rhrt-fast/assets/CF_ports');
var fcPolygonSamp9 = img.sampleRegions({
  collection: fcPolygon9,
  //scale: 10,
  geometries: true
});
var port = fcPolygonSamp9.size();
var portf = ui.Label('Port facilities:',textVis);
var portff = ui.Label('Please Wait', numberVIS);
port.evaluate(function(val){portff.setValue(val)}),numberVIS;



var number = ui.Label(" ")




//Bounding box3
var bound3 = reclassify.geometry()

//Riverine

// Import flood depth raster and UDF data
var floodDepth = reducedResolutionImage.clip(bound3);
// Import the UDF dataset
var udf = ee.FeatureCollection('projects/ee-rhrt-fast/assets/FAST_build_UDF_280624').filterBounds(bound3);


//print("UDF:",udf.first() )
//print('Raster:',floodDepth)


// Load the raster at a resolution of 30 meters
var raster = floodDepth.resample('bilinear').reproject({
  crs: floodDepth.projection(),//'EPSG:4326',
  scale: floodDepth.projection().nominalScale()
});


// Project the UDF dataset to the same projection as the raster
var projectedUDF = udf.map(function(feature) {
  return feature.setGeometry(feature.geometry().transform(reducedResolutionImage.projection()));
});

// Sample the raster values at the UDF feature locations
var sampledUDF = reducedResolutionImage.reduceRegions({
  collection: projectedUDF,
  reducer: ee.Reducer.anyNonZero(),
  scale: 30, // Match the scale of the reprojected raster
});

// Function to check if a feature is flooded
var checkFlooded = function(feature) {
  var flooded = feature.get('any');
  return feature.set('flooded', ee.Algorithms.If(flooded, true, false));
};

// Apply the checkFlooded function to the sampled UDF features
var udfFlood = sampledUDF.map(checkFlooded);

// Filter the UDF records that are exposed to flood
var udfExposed = udfFlood.filter(ee.Filter.eq('flooded', true));

// Get the total number of UDF records exposed to flood
var udfExposedCount = udfExposed.size();

// Print the result
//print('Number of UDF records exposed to flood (Riverine):', udfExposedCount);


// Add a new property to the UDF dataset indicating the flood depth at the location of the building
var udfDepth = udfExposed.map(function(feature) {
  var depth = raster.reduceRegion({
    reducer: ee.Reducer.first(),
    geometry: feature.geometry(),
    scale: floodDepth.projection().nominalScale()
  }).values().get(0);
  // If depth is null or None, assign it a value of zero
  depth = ee.Algorithms.If(ee.Algorithms.IsEqual(depth, null), 0, depth);
  depth = ee.Algorithms.If(ee.Algorithms.IsEqual(depth, 'None'), 0, depth);
  return feature.set('flood_depth', depth);
});



//Coastal


// Import flood depth raster and UDF data
var floodDepth_c = ee.Image('projects/ee-rhrt-fast/assets/Coast_Inund_100yr').clip(bound3);


// Load the raster at a resolution of 30 meters
var raster_c = floodDepth_c.resample('bilinear').reproject({
  crs: floodDepth_c.projection(),//'EPSG:4326',
  scale: 30//floodDepth_c.projection().nominalScale()
});



var projectedUDF_c = udf.map(function(feature) {
  return feature.setGeometry(feature.geometry().transform(raster_c.projection()));
});

// Sample the raster values at the UDF feature locations
var sampledUDF_c = raster_c.reduceRegions({
  collection: projectedUDF_c,
  reducer: ee.Reducer.anyNonZero(),
  scale: 30, // Match the scale of the reprojected raster
});

// Function to check if a feature is flooded
var checkFlooded_c = function(feature) {
  var flooded = feature.get('any');
  return feature.set('coastal_flooded', ee.Algorithms.If(flooded, true, false));
};

// Apply the checkFlooded function to the sampled UDF features
var udfFlood_c = sampledUDF_c.map(checkFlooded_c);

// Filter the UDF records that are exposed to flood
var udfExposed_c = udfFlood_c.filter(ee.Filter.eq('coastal_flooded', true));

// Get the total number of UDF records exposed to flood
var udfExposedCount_c = udfExposed_c.size();

// Print the result
//print('Number of UDF records exposed to flood (Coastal):', udfExposedCount_c);




// Add a new property to the UDF dataset indicating the flood depth at the location of the building
var udfDepth_c = udfExposed_c.map(function(feature) {
  var depth_c = raster_c.reduceRegion({
    reducer: ee.Reducer.first(),
    geometry: feature.geometry(),
    scale: floodDepth_c.projection().nominalScale()
  }).values().get(0);
  // If depth is null or None, assign it a value of zero
  depth_c = ee.Algorithms.If(ee.Algorithms.IsEqual(depth_c, null), 0, depth_c);
  depth_c = ee.Algorithms.If(ee.Algorithms.IsEqual(depth_c, 'None'), 0, depth_c);
  return feature.set('coastal_flood_depth', depth_c);
});


//Find buildings exposed to both types of floods and calculate the maximum flood depth
var udfBoth = udfDepth.filter(ee.Filter.inList('system:index', udfDepth_c.aggregate_array('system:index')));
var udfBothMaxDepth = udfBoth.map(function(feature) {
  var riverineDepth = feature.get('flood_depth');
  var coastalDepth = feature.get('coastal_flood_depth');
  var maxDepth = ee.Algorithms.If(ee.Number(riverineDepth).gt(coastalDepth), riverineDepth, coastalDepth);
  return feature.set('max_flood_depth', maxDepth);
});

//Find buildings exposed to both types of floods and calculate the maximum flood depth
var coastalIndices = udfExposed_c.aggregate_array('system:index');
var riverineIndices = udfExposed.aggregate_array('system:index');

var udfBoth = udfDepth.filter(ee.Filter.inList('system:index', coastalIndices));
var udfBoth_c = udfDepth_c.filter(ee.Filter.inList('system:index', riverineIndices));

var udfBothMaxDepth = udfBoth.map(function(feature) {
  var coastalFeature = udfBoth_c.filter(ee.Filter.eq('system:index', feature.get('system:index'))).first();
  var riverineDepth = feature.get('flood_depth');
  var coastalDepth = coastalFeature.get('coastal_flood_depth');
  var maxDepth = ee.Algorithms.If(ee.Number(riverineDepth).gt(coastalDepth), riverineDepth, coastalDepth);
  return feature.set('depth_vfd', maxDepth);
});

//Identify buildings exposed to only riverine floods and only coastal floods and set 'depth_vfd'
var udfRiverineOnly = udfDepth.filter(ee.Filter.inList('system:index', coastalIndices).not()).map(function(feature) {
  return feature.set('depth_vfd', feature.get('flood_depth'));
});

var udfCoastalOnly = udfDepth_c.filter(ee.Filter.inList('system:index', riverineIndices).not()).map(function(feature) {
  return feature.set('depth_vfd', feature.get('coastal_flood_depth'));
});

// Combine the three feature collections into a single collection
var combinedUDF = udfRiverineOnly
  .merge(udfCoastalOnly)
  .merge(udfBothMaxDepth);

// Print results
var udfBothCount = udfBoth.size();
var udfRiverineOnlyCount = udfRiverineOnly.size();
var udfCoastalOnlyCount = udfCoastalOnly.size();
var totalAffectedBuildings = udfBothCount.add(udfRiverineOnlyCount).add(udfCoastalOnlyCount);

print('Number of UDF records exposed to both riverine and coastal floods:', udfBothCount);
print('Number of UDF records exposed to riverine only floods:', udfRiverineOnlyCount);
print('Number of UDF records exposed to coastal only floods:', udfCoastalOnlyCount);
print('Total number of affected buildings:', totalAffectedBuildings);




// Iterate over each feature in the riverine dataset
var udfDepthMax = combinedUDF; /*udfDepth.map(function(feature) {
  var geometry = feature.geometry();
  var riverineDepth = ee.Number(feature.get('flood_depth'));

  // Filter the coastal dataset to features intersecting the current riverine feature
  var intersectingFeatures = udfDepth_c.filterBounds(geometry);

  // Iterate over each intersecting feature and compare flood depth values
  var maxDepth = intersectingFeatures.iterate(function(coastalFeature, currentMax) {
    coastalFeature = ee.Feature(coastalFeature);
    var coastalDepth = ee.Number(coastalFeature.get('coastal_flood_depth'));
    return ee.Algorithms.If(coastalDepth.gt(ee.Number(currentMax)), coastalDepth, currentMax);
  }, riverineDepth);

  // Add the maximum flood depth as a new property
  return feature.set('max_flood_depth', maxDepth);
});*/

// Print the resulting FeatureCollection
//print('UDF with max flood depth:', udfDepthMax);

// Compute the depth_vfd property and add it to the feature collection
var udfDepthVFD = udfDepthMax;/*.map(function(feature) {
  var firstFloorHt = feature.get('FirstFloor');
  var floodDepth = feature.get('max_flood_depth');
  var depthVFD = ee.Number(floodDepth).subtract(ee.Number(firstFloorHt));
  depthVFD = ee.Algorithms.If(ee.Algorithms.IsEqual(depthVFD, null), 0, depthVFD);
  depthVFD = ee.Algorithms.If(ee.Algorithms.IsEqual(depthVFD, 'None'), 0, depthVFD);
  return feature.set('depth_vfd', depthVFD);
});*/


// Print the updated UDF dataset
print('UDF dataset with max flood depth:', udfDepthVFD);
// Get the total number of UDF records exposed to flood
var udfExposedCount_udfDepthVFD = udfDepthVFD.size();

// Print the result
print('Number of UDF records exposed to flood (MaxDepth):', udfExposedCount_udfDepthVFD);


// Apply the filter directly to the FeatureCollection
var nonEmptyOccClassUdf = udfDepthVFD;/*.filter(ee.Filter.and(
  ee.Filter.neq('OccClass', 'null'),
  ee.Filter.neq('OccClass', '')
));
print('N.o of Filtered UDF with non-empty OccClass:', nonEmptyOccClassUdf.size());*/



var calculateSOID = function(feature) {
  // Get properties from feature
  var occupancy = ee.String(feature.get('OccClass'));
  var foundationType = feature.getNumber('FoundType');
  var numStories = feature.getNumber('NumStories');

  // Prefix: First and last character of occupancy
  
  var sopre = ee.Algorithms.If(occupancy.equals('REL1'), ee.String('RE1'), occupancy.slice(0, 1).cat(occupancy.slice(3, occupancy.length())) );


  // Suffix: Easy - Basement or no Basement
  var sosuf = ee.Algorithms.If(ee.Number(foundationType).neq(4),
                               'N',
                               'B');

  var somid = ee.Algorithms.If(occupancy.slice(0, 4).equals('RES3'),
                               ee.Algorithms.If(numStories.gt(4),
                                                '5',
                                                ee.Algorithms.If(numStories.gt(2),
                                                                 '3',
                                                                 '1')),
                               ee.Algorithms.If(occupancy.slice(0, 4).equals('RES1'),
                                                ee.Algorithms.If(numStories.gt(3.0),
                                                                 ee.Algorithms.If(ee.Number(3).subtract(ee.Number(3).round()).eq(0),
                                                                                  ee.String(ee.Number(3).round()),'S'),
                                                                 ee.Algorithms.If(ee.Number(numStories).subtract(ee.Number(numStories).round()).eq(0),
                                                                                  ee.String(ee.Number(numStories).round().toInt()),'S')),
                                                ee.Algorithms.If(occupancy.slice(0, 4).equals('RES2'),
                                                                 '1',
                                                                 ee.Algorithms.If(numStories.gt(6),
                                                                                  'H',
                                                                                  ee.Algorithms.If(numStories.gt(3),
                                                                                                   'M',
                                                                                                   'L')))));                                                                                                 
       


  // Calculate specific occupancy id
  var SpecificOccupId = ee.String(sopre).cat(ee.String(somid)).cat(ee.String(sosuf));

  // Set the specific occupancy id as property of the feature and return the feature
  return feature.set('SpecificOccupId', SpecificOccupId);
};


// Apply the function to the FeatureCollection
var udfWithSOID1 = nonEmptyOccClassUdf.map(calculateSOID);
//print('UDF dataset with SOID:', udfWithSOID1);

// Add a new column 'flc' with value 'CAE' to each feature in the FeatureCollection
var udfWithSOID = udfWithSOID1.map(function(feature) {
  return feature.set('flc', 'CAE');
});






// Load two feature collections
var fc1 = udfWithSOID;



// Map the addBldgLoss function over the udfData FeatureCollection

  // Define the bddf_lut_riverine and bddf_lut_coastalA as Feature Collections
  var bddf_lut_riverine = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Building_DDF_Riverine_LUT_Hazus4p0');
  var bddf_lut_coastalA = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Building_DDF_CoastalA_LUT_Hazus4p0');
  var bddf_lut_coastalV = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Building_DDF_CoastalV_LUT_Hazus4p0');

var addBldgLoss = fc1.map(function(feature) {

  var depth1 = feature.getNumber('depth_vfd');
  var OC = ee.String(feature.get('OccClass'));
  var CoastalZoneCode = ee.String(feature.get('flc'));
  // Initialize the blut variable
  var blut = bddf_lut_riverine;

  // Check the conditions
  if (OC.slice(0,3) == 'RES') {
  if (CoastalZoneCode == 'CAE') {
      blut = bddf_lut_coastalA;
    } else if (CoastalZoneCode == 'VE' || CoastalZoneCode == 'V') {
      blut = bddf_lut_coastalV;
    }
  }

  

  var ddf = blut;
  var soid1 = feature.get('SpecificOccupId');
  var soid2 = ee.Filter.eq('SpecificOccupId', soid1);
  
  var fc3 = ddf.filter(soid2).first();
  
  // Clamp the depth value to the range [-4, 24]
  var depth = ee.Algorithms.If(depth1.gt(24), 24, ee.Algorithms.If(depth1.lt(-4), -4, depth1));


  var suffix_l = ee.String(((ee.Number(depth).floor()).abs()).int());
  var suffix_u = ee.String(((ee.Number(depth).ceil()).abs()).int());
  var prefix_l = ee.String(ee.Algorithms.If(ee.Number(depth).floor().lt(0), 'm', 'p'));
  var prefix_u = ee.String(ee.Algorithms.If(ee.Number(depth).ceil().lt(0), 'm', 'p'));
  var l_index = prefix_l.cat(suffix_l);
  var u_index = prefix_u.cat(suffix_u);
  
  //Building Loss Calculation
  // Get the lower and upper values from the ddf1 dictionary
  var d_lower = ee.Number(fc3.get(l_index)).toFloat();
  var d_upper = ee.Number(fc3.get(u_index)).toFloat();

  // Compute the fractional amount of depth for interpolation
  var frac = ee.Number(depth).subtract(ee.Number(depth).floor());

  // Compute the damage using linear interpolation
  var damage = (d_lower.add(frac.multiply(d_upper.subtract(d_lower)))).divide(100);
  //var bldg_loss = damage.multiply(ee.Number(feature.get('Cost')));
  //return feature.copyProperties(bldg_loss);
  
 // var bldg_loss = damage.multiply(ee.Number(feature.get('Cost')).toInt());
  var bldg_loss = damage.multiply(ee.Number.parse(feature.get('Cost')));
  /*var lossFeature = ee.Feature(null, {'bldg_loss': bldg_loss});
  var updatedFeature = ee.Feature(feature).copyProperties(lossFeature);
  return updatedFeature;*/
  var cost1 = ee.Number.parse(feature.get('Cost'));
  return feature.set('bldg_loss', bldg_loss).set('New_Cost',cost1);
});

//var udfDataWithLoss = merged.map(addBldgLoss);
print('Total cost (Earth Engine):', addBldgLoss.aggregate_sum('bldg_loss'));
print('Total Cost:', addBldgLoss.aggregate_sum('New_Cost'));
//print('Building Loss', addBldgLoss);

var Content_x_0p5 = ['RES1','RES2','RES3A','RES3B','RES3C','RES3D','RES3E','RES3F','RES4','RES5','RES6','COM10'];
var Content_x_1p0 = ['COM1','COM2','COM3','COM4','COM5','COM8','COM9','IND6','AGR1','REL1','GOV1','EDU1'];
var Content_x_1p5 = ['COM6','COM7','IND1','IND2','IND3','IND4','IND5','GOV2','EDU2'];

  var cddf_lut_riverine = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Content_DDF_Riverine_LUT_Hazus4p0');
  var cddf_lut_coastalA = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Content_DDF_CoastalA_LUT_Hazus4p0');
  var cddf_lut_coastalV = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Content_DDF_CoastalV_LUT_Hazus4p0');

var addContLoss1 = addBldgLoss.map(function(feature){
  var OC = feature.get('OccClass');
  var ccost = feature.get('New_Cost');
  var CMult = ee.Algorithms.If(
    ee.List(Content_x_0p5).contains(OC),
    0.5,
    ee.Algorithms.If(
      ee.List(Content_x_1p0).contains(OC),
      1.0,
      ee.Algorithms.If(
        ee.List(Content_x_1p5).contains(OC),
        1.5,
        0
      )
    )
  );
  var ccost_new = ee.Number(ccost).multiply(CMult);
  return feature.set('ccost_new', ccost_new);
  
});

var addContLoss = addContLoss1.map(function(feature) {

  var depth1 = feature.getNumber('depth_vfd');
  var OC = ee.String(feature.get('OccClass'));
  var CoastalZoneCode = ee.String(feature.get('flc'));
  // Initialize the blut variable
  var blut = cddf_lut_riverine;

  // Check the conditions
  if (OC.slice(0,3) == 'RES') {
  if (CoastalZoneCode == 'CAE') {
      blut = bddf_lut_coastalA;
    } else if (CoastalZoneCode == 'VE' || CoastalZoneCode == 'V') {
      blut = bddf_lut_coastalV;
    }
  }

  

  var ddf = blut;
  
  var soid1 = feature.get('SpecificOccupId')
  var soid2 = ee.Filter.eq('SpecificOccupId', soid1);
  
  var fc3 = ddf.filter(soid2).first();
  
  
  var depth = ee.Algorithms.If(depth1.gt(24), 24, ee.Algorithms.If(depth1.lt(-4), -4, depth1))


  var suffix_l = ee.String(((ee.Number(depth).floor()).abs()).int());
  var suffix_u = ee.String(((ee.Number(depth).ceil()).abs()).int());
  var prefix_l = ee.String(ee.Algorithms.If(ee.Number(depth).floor().lt(0), 'm', 'p'));
  var prefix_u = ee.String(ee.Algorithms.If(ee.Number(depth).ceil().lt(0), 'm', 'p'));
  var l_index = prefix_l.cat(suffix_l);
  var u_index = prefix_u.cat(suffix_u);
  
  // Content Loss Calculation
  // Get the lower and upper values from the ddf1 dictionary
  var d_lower = ee.Number(fc3.get(l_index)).toFloat();
  var d_upper = ee.Number(fc3.get(u_index)).toFloat();

  // Compute the fractional amount of depth for interpolation
  var frac = ee.Number(depth).subtract(ee.Number(depth).floor());

  // Compute the damage using linear interpolation
  var damage = (d_lower.add(frac.multiply(d_upper.subtract(d_lower)))).divide(100);

  
  var cont_loss = damage.multiply(ee.Number(feature.get('ccost_new')));

  return feature.set('cont_loss', cont_loss);
});

print('Total content cost (Earth Engine):', addContLoss.aggregate_sum('cont_loss'));
//print('Content Loss', addContLoss);





//Basement
var bsmf = addContLoss.map(function(feature) {

  var OC = ee.String(feature.get('OccClass'));
  var foundationType = feature.getNumber('FoundType');
  var bsm = ee.Algorithms.If(OC.equals('RES1'), ee.Algorithms.If(foundationType.eq(4),'B','NB'), 'NB');
  return feature.set('bsm', bsm);
});

//print('bsm', bsmf)

//Debris calculation

var debris_key = bsmf.map(function(feature) {

  var depth1 = feature.getNumber('depth_vfd');
  var OC = ee.String(feature.get('OccClass'));
  var foundationType = feature.getNumber('FoundType');
  var debriskey, ddf1, dfin, dstruc, dfound, dtot;
  var bsm =  ee.String(feature.get('bsm')); // default value for no basement
  var fnd = ee.Algorithms.If(foundationType.eq(4).or(foundationType.eq(7)),'SG','FT'); // default value for slab on grade foundation
  
  var depth = ee.Algorithms.If(depth1.gt(24), 24, ee.Algorithms.If(depth1.lt(-4), -4, depth1))
  
  var ddf = ee.FeatureCollection('projects/ee-rhrt-fast/assets/flDebris_LUT')
  

  
  var dsuf = ee.Algorithms.If(foundationType.eq(4),
  ee.Algorithms.If(
    OC.equals('RES1'),
    ee.Algorithms.If(ee.Number(depth).lt(-4), '-8',
      ee.Algorithms.If(ee.Number(depth).lt(0), '-4',
        ee.Algorithms.If(ee.Number(depth).lt(4), '0',
          ee.Algorithms.If(ee.Number(depth).lt(6), '4',
            ee.Algorithms.If(ee.Number(depth).lt(8), '6', '8'))))),
    ee.Algorithms.If(
      OC.equals('COM6'),
      ee.Algorithms.If(ee.Number(depth).lt(-4), '-8',
        ee.Algorithms.If(ee.Number(depth).lt(0), '-4',
          ee.Algorithms.If(ee.Number(depth).lt(4), '0',
            ee.Algorithms.If(ee.Number(depth).lt(6), '4',
              ee.Algorithms.If(ee.Number(depth).lt(8), '6', '8'))))),
      ee.Algorithms.If(
        OC.equals('RES2'),
        ee.Algorithms.If(ee.Number(depth).lt(0), '0', 
        ee.Algorithms.If(
        ee.Number(depth).lt(1), '0',
          ee.Algorithms.If(ee.Number(depth).lt(4), '1',
            ee.Algorithms.If(ee.Number(depth).lt(8), '4',
              ee.Algorithms.If(ee.Number(depth).lt(12), '8', '12')))
          )),
        ee.Algorithms.If(
          ee.Number(depth).lt(1), '0',
            ee.Algorithms.If(ee.Number(depth).lt(4), '1',
              ee.Algorithms.If(ee.Number(depth).lt(8), '4',
                ee.Algorithms.If(ee.Number(depth).lt(12), '8', '12')))
          )
       )
    )
  ),
  ee.Algorithms.If(
    ee.Number(depth).lt(1), '0',
    ee.Algorithms.If(ee.Number(depth).lt(4), '1',
      ee.Algorithms.If(ee.Number(depth).lt(8), '4',
        ee.Algorithms.If(ee.Number(depth).lt(12), '8', '12')))
  )
)


  

  debriskey = OC.cat(bsm).cat(fnd).cat(dsuf);
  
  
 
  return feature.set('DebrisID', debriskey);
});

//print('DebrisID',debris_key);

var debris = debris_key.map(function(feature) {
    
  var ddf = ee.FeatureCollection('projects/ee-rhrt-fast/assets/flDebris_LUT')
  var area = ee.Number.parse(feature.get('Area')).toFloat()
  
  
  var soid1 = feature.get('DebrisID')
  var soid2 = ee.Filter.eq('DebrisID', soid1);
  
  var fc3 = ddf.filter(soid2).first();
  
  var dfin_rate    = (ee.Number(fc3.get('Finishes'))).toFloat();
  var dstruc_rate  =  (ee.Number(fc3.get('Structure'))).toFloat();
  var dfound_rate  =  (ee.Number(fc3.get('Foundation'))).toFloat();
                                    
  var dfin      = ee.Number(area.multiply(dfin_rate).divide(1000));
  var dstruc    = ee.Number(area.multiply(dstruc_rate).divide(1000));
  var dfound    = ee.Number(area.multiply(dfound_rate).divide(1000));
  var dtot      = ee.Number(dfin.add(dstruc).add(dfound));
  
  return feature.set('Debris', dtot);
});

print('Debris', debris)


// Restoration
 

var restorf1 = debris.map(function(feature) {

  var depth = feature.getNumber('depth_vfd');
  var OC = ee.String(feature.get('OccClass'));
  
  var dsuf = ee.Algorithms.If(
  ee.Number(depth).lt(0), '0',
  ee.Algorithms.If(
    ee.Number(depth).lt(1), '1',
    ee.Algorithms.If(
      ee.Number(depth).lt(4), '4',
      ee.Algorithms.If(
        ee.Number(depth).lt(8), '8',
        ee.Algorithms.If(
          ee.Number(depth).lt(12), '12',
          '24'
        )
      )
    )
  )
);
  var RsFnkey = OC.cat(ee.String(dsuf))
  
 
  return feature.set('RestFnID', RsFnkey);
  
});


var restorf2 = restorf1.map(function(feature) {
    
  var ddf = ee.FeatureCollection('projects/ee-rhrt-fast/assets/flRsFnGBS_LUT')
  
  
  var soid1 = feature.get('RestFnID')
  var soid2 = ee.Filter.eq('RestFnID', soid1);
  
  var fc3 = ddf.filter(soid2).first();
  
  var restdays_min =  ee.Number(fc3.get('Min_Restor_Days')).toInt() //This is the maximum days out (flRsFnGBS has a min and a max)
  var restdays_max =  ee.Number(fc3.get('Max_Restor_Days')).toInt() //This is the maximum days out (flRsFnGBS has a min and a max)
  
  return feature.set('restdays_max', restdays_max);
});

//print('Restoration', restorf2)

print('Total no of days taken for Restoration: (Earth Engine):', restorf2.aggregate_sum('restdays_max'));


var fcPolygon = combinedUDF;

var tb = fcPolygon.size();
var tb_h = ui.Label('Total number of buildings affected :',textVis);
var tb_v = ui.Label('Please Wait', numberVIS);
tb.evaluate(function(val){tb_v.setValue(val)}),numberVIS;

var BldgLossUSD = addBldgLoss.aggregate_sum('bldg_loss')
var cost_total = BldgLossUSD.toInt()
var cost_total_h = ui.Label('Cost estimated (Building loss):',textVis);
var cost_total_v = ui.Label('Please Wait', numberVIS);
cost_total.evaluate(function(val){cost_total_v.setValue('$ '+val)}),numberVIS;

/*var InventoryLossUSD = fcPolygon.aggregate_sum('icost')
var cost_inv = InventoryLossUSD.toInt()
var cost_inv_h = ui.Label('Cost estimated (Inventory):',textVis);
var cost_inv_v = ui.Label('Please Wait', numberVIS);
cost_inv.evaluate(function(val){cost_inv_v.setValue('$ '+val)}),numberVIS;*/

var ContentLossUSD = addContLoss.aggregate_sum('cont_loss')
var cost_cont = ContentLossUSD.toInt()
var cost_cont_h = ui.Label('Cost estimated (Content loss):',textVis);
var cost_cont_v = ui.Label('Please Wait', numberVIS);
cost_cont.evaluate(function(val){cost_cont_v.setValue('$ '+val)}),numberVIS;

var Debrisamount = debris.aggregate_sum('Debris');
var deb_cont = Debrisamount.toInt();
var deb_cont_h = ui.Label('Debris (Ton):',textVis);
var deb_cont_v = ui.Label('Please Wait', numberVIS);
deb_cont.evaluate(function(val){deb_cont_v.setValue(val)}),numberVIS;

var Restamount = restorf2.aggregate_sum('restdays_max');
var resto_cont = Restamount.toInt();
var resto_cont_h = ui.Label('Restoration (No of days):',textVis);
var resto_cont_v = ui.Label('Please Wait', numberVIS);
resto_cont.evaluate(function(val){resto_cont_v.setValue(val)}),numberVIS;



var fc = combinedUDF;

var res = fc.filter(ee.Filter.stringStartsWith('OccClass', 'RES'));
var residential = res;

var com =  fc.filter(ee.Filter.stringStartsWith('OccClass', 'CO'));
var commercial = com;

var agri =  fc.filter(ee.Filter.stringStartsWith('OccClass', 'AGR1'));
var agricultural = agri;

var rel = fc.filter(ee.Filter.stringStartsWith('OccClass', 'REL'));
var gov = fc.filter(ee.Filter.stringStartsWith('OccClass', 'GOV'));
var edu = fc.filter(ee.Filter.stringStartsWith('OccClass', 'EDU'));
var ind = fc.filter(ee.Filter.stringStartsWith('OccClass', 'IND'));



var comm = com.size();
var comm_h = ui.Label('Total number of commercial buildings:',textVis);
var comm_v = ui.Label('Please Wait', numberVIS);
comm.evaluate(function(val){comm_v.setValue(val)}),numberVIS;

res =  res.size();
var res_h = ui.Label('Total number of residential buildings:',textVis);
var res_v = ui.Label('Please Wait', numberVIS);
res.evaluate(function(val){res_v.setValue(val)}),numberVIS;

agri = agri.size();
var agri_h = ui.Label('Total number of agricultural buildings :',textVis);
var agri_v = ui.Label('Please Wait', numberVIS);
agri.evaluate(function(val){agri_v.setValue(val)}),numberVIS;

var rell = rel.size();
var rel_h = ui.Label('Total number of religious buildings:',textVis);
var rel_v = ui.Label('Please Wait', numberVIS);
rell.evaluate(function(val){rel_v.setValue(val)}),numberVIS;

var govv =  gov.size();
var gov_h = ui.Label('Total number of governmental buildings:',textVis);
var gov_v = ui.Label('Please Wait', numberVIS);
govv.evaluate(function(val){gov_v.setValue(val)}),numberVIS;

var eduu = edu.size();
var edu_h = ui.Label('Total number of educational buildings :',textVis);
var edu_v = ui.Label('Please Wait', numberVIS);
eduu.evaluate(function(val){edu_v.setValue(val)}),numberVIS;

var indd = ind.size();
var ind_h = ui.Label('Total number of industrial buildings :',textVis);
var ind_v = ui.Label('Please Wait', numberVIS);
indd.evaluate(function(val){ind_v.setValue(val)}),numberVIS;


var downloadLink = ui.Label({value:'Export the results',
  style: {
  color: 'blue',
  fontSize: '16px',
  fontWeight:'bold',
  textAlign: 'center',
  fontFamily:'monospace',
  border: '2px solid lightgray',
  stretch:'horizontal'
  }
});



downloadLink.setUrl(restorf2.getDownloadURL({format: 'csv'}));

results1.clear();
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
        deb_cont_h,
        deb_cont_v,
        resto_cont_h,
        resto_cont_v,
        cost_total_h,
        cost_total_v,
        //cost_inv_h,
        //cost_inv_v,
        cost_cont_h,
        cost_cont_v,
        res_h,
        res_v,
        
        comm_h,
        comm_v,
        
        agri_h,
        agri_v,
        
        rel_h,
        rel_v,
        
        gov_h,
        gov_v,
        
        edu_h,
        edu_v,
        
        ind_h,
        ind_v,
      

        air_aff,
        air_aff1,
        portf,
        portff,
        bff,
        bfff,
        eocf,
        eocff,
        
        downloadLink
        
      ]
      ));
    




var denver = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level2')
    .filter("ADM2_NAME == 'Houghton'")
    .filter(ee.Filter.eq('ADM2_NAME', 'Houghton'))  // Exactly the same as above.
    .first()
    .geometry();
    
// Create an image collection from the two images.
var floodCollection = ee.ImageCollection([
  floodDepth_c,//.set('system:index', 'Coastal Inundation'),
  flooded//.set('system:index', 'Riverine Flooding')
]).mosaic();

Map.clear();
Map.centerObject(swater.geometry(), 9);
Map.addLayer(floodCollection, {palette:"0000FF"},'Flooded areas');
Map.add(results);
Map.add(legend);
Map.add(results1);
Map.addLayer(population_exposed, populationExposedVis, 'Exposed Population',0);
Map.addLayer(cropland_affected, croplandVis, 'Affected Cropland',0); 
Map.addLayer(fcPolygon, {color: 'yellow'},'Buildings',0);
Map.addLayer(agricultural, {color: 'magenta'},'Agricultural',0);
Map.addLayer(commercial, {color: 'cyan', pointSize: 100},'Commercial',0);
Map.addLayer(residential, {color: 'red'},'Residential',0);
}





function hand_fhd(){ 
  
// Map over the joined collection to compute inundation
var inundationList = joinedCollectionForInundation.map(function(pair) {
  var exportFeature = ee.Feature(pair.get('primary'));
  var subbasinFeature = ee.Feature(pair.get('secondary'));

  var clippedRaster = Hand_Raster.clip(subbasinFeature.geometry());
  var H25Value = ee.Number(exportFeature.get('H500'));

  var inundationRaster = ee.Image(H25Value).subtract(clippedRaster).updateMask(clippedRaster.lt(H25Value));
  return inundationRaster;
});

// Mosaic all the resulting rasters
var inundationMosaic = ee.ImageCollection(inundationList).mosaic();

// Reproject the mosaiced image to a standard CRS and reduce its resolution
var reprojectedImage = inundationMosaic
  .rename('b1')
  .reproject({
    crs: 'EPSG:4326',
    scale: 30 // Adjust the scale as needed to manage memory usage
  });

// Reduce the resolution of the raster for faster processing
var reducedResolutionImage = ee.Image('projects/ee-rhrt-fast/assets/WUP_Inund_500'); /*reprojectedImage.reduceResolution({
  reducer: ee.Reducer.mean(),
  bestEffort: true,
  maxPixels: 1024  // Adjust as needed
});
*/

                
  var selectedValue = dropdown.getValue();
  var aoi;

if (selectedValue !== null) {
  aoi = ee.Algorithms.If(ee.String(selectedValue).equals('Houghton'), shp1, 
        ee.Algorithms.If(ee.String(selectedValue).equals('Baraga'),shp2, 
        ee.Algorithms.If(ee.String(selectedValue).equals('Gogebic'),shp3,
        ee.Algorithms.If(ee.String(selectedValue).equals('Keweenaw'),shp4,
        ee.Algorithms.If(ee.String(selectedValue).equals('Ontonagon'),shp5,
        drawingTools.layers().get(0).getEeObject())))));
} else {
  // set default AOI if selectedValue is null
  aoi = drawingTools.layers().get(0).getEeObject();
}

  // Set the drawing mode back to null; turns drawing off.
  drawingTools.setShape(null);
  var HAND= reducedResolutionImage;//ee.Image("projects/ee-rhrt-fast/assets/Inland_Inundation_500yr");

  var reclassify = HAND.updateMask(HAND.gte(0)).clip(aoi);

  
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

// Import the NLCD collection.
var dataset = ee.ImageCollection('USGS/NLCD_RELEASES/2021_REL/NLCD');

// Filter the collection to the 2021 product.
var nlcd2021 = dataset.filter(ee.Filter.eq('system:index', '2021')).first();

// Select the land cover band.
var landcover = nlcd2021.select('landcover').rename('b1');

var LC = landcover.clip(aoi);

// Define the cropland classes (NLCD codes for cropland, e.g., 81 and 82 for pasture/hay and cultivated crops)
var croplandClasses = [81, 82];

// Create a mask for cropland areas.
var cropmask = LC.eq(croplandClasses[0]).or(LC.eq(croplandClasses[1]));
var cropland = LC.updateMask(cropmask);

// Reproject the flood raster to match the cropland projection.
/*var crop_projection = LC.projection();*/
var flooded_res = flooded/*.reproject({
  crs: crop_projection
});*/

// Intersect the cropland with the flood raster.
var cropland_affected = flooded_res.updateMask(cropland);

// Calculate the area of the affected cropland in hectares.
var crop_pixelarea = cropland_affected.multiply(ee.Image.pixelArea());
var crop_stats = crop_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: swater.geometry(),
  scale: 30,  // NLCD resolution is 30m
  //maxPixels: 1856997344,
  bestEffort: true,
});

// Convert the area to hectares.
var crop_area_ha = crop_stats.getNumber('b1').divide(10000).round();
print('Affected Cropland Area (hectares):', crop_area_ha);


  
var croplandVis = {
  min: 0,
  max: 1,
  palette: ['green'],
};

//Population

// Load the population count raster and clip it to the region of interest (swater.geometry()).
var population_count = ee.Image("projects/ee-rhrt-fast/assets/WUP_Popoulation").clip(aoi);

// Reproject the flood raster to match the population raster projection.
var GHSLprojection = population_count.select('b1').projection();
var flooded_res = flooded.reproject({
  crs: GHSLprojection,
  scale: population_count.projection().nominalScale()
});

// Load the Hansen et al. forest change dataset and select the land/water mask.
var hansenImage = ee.Image('UMD/hansen/global_forest_change_2015');
var datamask = hansenImage.select('datamask');

// Create a binary mask where datamask equals 1 (indicating land).
var mask = datamask.eq(1);

// Update the population count with the mask (assuming HAND is already defined).
var population_exposed = population_count.updateMask(flooded_res).updateMask(mask);

// Calculate the sum of the exposed population.
var stats = population_exposed.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: swater.geometry(),
  bestEffort: true,
  tileScale: 16
});

// Get the total number of exposed people and round it.
var number_pp_exposed = stats.getNumber('b1').round();
print('People Exposed:', number_pp_exposed);

// Visualization parameters.
var populationCountVis = {
  min: 0,
  max: 200.0,
  palette: ['060606', '337663', '337663', 'ffffff'],
};

var populationExposedVis = {
  min: 0,
  max: 8000.0,
  palette: ['yellow', 'orange', 'red'],
};


var textVis = {
  'margin':'0px 8px 2px 0px',
  'fontSize': '15px',
  //'fontWeight':'bold',
  'fontFamily':'monospace'
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
  'fontFamily':'monospace'
  };

var titleTextVis = {
  'margin':'0px 0px 10px 0px',
  'fontSize': '17px', 
  'font-weight':'bold', 
  'color': '3333ff',
  'fontFamily':'monospace',
  'textDecoration':'underline'
  
  };
  


var text4 = ui.Label('Affected cropland:',textVis);
var number4 = ui.Label('Please wait...',numberVIS);
crop_area_ha.evaluate(function(val){number4.setValue(val+' hectares')}),numberVIS;

var text3 = ui.Label('Estimated number of exposed people: ',textVis);
var number3 = ui.Label('Please wait...',numberVIS);
number_pp_exposed.evaluate(function(val){number3.setValue(val)}),numberVIS;


var flood_stats_ten = flood_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(),              
  geometry: bound3,
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

//Airports
var airport = ee.FeatureCollection('projects/ee-rhrt-fast/assets/CF_airports');


var airportSamp = img.sampleRegions({
  collection: airport,
  //scale: 10,
  geometries: true
});
var airport_sz = airportSamp.size();
var air_aff = ui.Label('Airport facilities:',textVis);
var air_aff1 = ui.Label('Please Wait', numberVIS);
airport_sz.evaluate(function(val){air_aff1.setValue(val)}),numberVIS;


//Hospitals and Nursing
var fcPolygon2 = ee.FeatureCollection('projects/ee-rhrt-fast/assets/WUP_Hospitals_and_Nursing');
var fcPolygonSamp2 = img.sampleRegions({
  collection: fcPolygon2,
  //scale: 10,
  geometries: true
});
var bf = fcPolygonSamp2.size();
var bff = ui.Label('Hospitals and Nursing Homes affected:',textVis);
var bfff = ui.Label('Please Wait', numberVIS);
bf.evaluate(function(val){bfff.setValue(val)}),numberVIS;

//Adult foster Care
var fcPolygon4 = ee.FeatureCollection('projects/ee-rhrt-fast/assets/CF-WUPAdultFosterCare');
var fcPolygonSamp4 = img.sampleRegions({
  collection: fcPolygon4,
  //scale: 10,
  geometries: true
});
var eoc = fcPolygonSamp4.size();
var eocf = ui.Label('Adult Foster care Centers:',textVis);
var eocff = ui.Label('Please Wait', numberVIS);
eoc.evaluate(function(val){eocff.setValue(val)}),numberVIS;

//Ports
var fcPolygon9 = ee.FeatureCollection('projects/ee-rhrt-fast/assets/CF_ports');
var fcPolygonSamp9 = img.sampleRegions({
  collection: fcPolygon9,
  //scale: 10,
  geometries: true
});
var port = fcPolygonSamp9.size();
var portf = ui.Label('Port facilities:',textVis);
var portff = ui.Label('Please Wait', numberVIS);
port.evaluate(function(val){portff.setValue(val)}),numberVIS;

var number = ui.Label(" ")

//Bounding box3
var bound3 = reclassify.geometry()

//Riverine

// Import flood depth raster and UDF data
var floodDepth = /*ee.Image('projects/ee-rhrt-fast/assets/Inland_Inundation_500yr')*/reducedResolutionImage.clip(bound3);



// Import the UDF dataset
var udf = ee.FeatureCollection('projects/ee-rhrt-fast/assets/FAST_build_UDF_280624').filterBounds(bound3);


//print("UDF:",udf.first() )
//print('Raster:',floodDepth)


// Load the raster at a resolution of 30 meters
var raster = floodDepth.resample('bilinear').reproject({
  crs: floodDepth.projection(),//'EPSG:4326',
  scale: floodDepth.projection().nominalScale()
});



// Add a property to the UDF dataset indicating whether or not it intersects the flood extent
/*var udfFlood = udf.map(function(feature) {
  var flooded = raster.reduceRegion({
    reducer: ee.Reducer.anyNonZero(),
    geometry: feature.geometry(),
    //scale: 1.385
    scale: floodDepth.projection().nominalScale()
  }).values().get(0);
  return feature.set('flooded', ee.Algorithms.If(flooded, true, false));
});

// Filter the UDF records that are exposed to flood
var udfExposed = udfFlood.filter(ee.Filter.eq('flooded', true));

// Get the total number of UDF records exposed to flood
var udfExposedCount = udfExposed.size();*/

// Project the UDF dataset to the same projection as the raster
var projectedUDF = udf.map(function(feature) {
  return feature.setGeometry(feature.geometry().transform(reducedResolutionImage.projection()));
});

// Sample the raster values at the UDF feature locations
var sampledUDF = reducedResolutionImage.reduceRegions({
  collection: projectedUDF,
  reducer: ee.Reducer.anyNonZero(),
  scale: 30, // Match the scale of the reprojected raster
});

// Function to check if a feature is flooded
var checkFlooded = function(feature) {
  var flooded = feature.get('any');
  return feature.set('flooded', ee.Algorithms.If(flooded, true, false));
};

// Apply the checkFlooded function to the sampled UDF features
var udfFlood = sampledUDF.map(checkFlooded);

// Filter the UDF records that are exposed to flood
var udfExposed = udfFlood.filter(ee.Filter.eq('flooded', true));

// Get the total number of UDF records exposed to flood
var udfExposedCount = udfExposed.size();

// Print the result
//print('Number of UDF records exposed to flood (Riverine):', udfExposedCount);


// Add a new property to the UDF dataset indicating the flood depth at the location of the building
var udfDepth = udfExposed.map(function(feature) {
  var depth = raster.reduceRegion({
    reducer: ee.Reducer.first(),
    geometry: feature.geometry(),
    scale: floodDepth.projection().nominalScale()
  }).values().get(0);
  // If depth is null or None, assign it a value of zero
  depth = ee.Algorithms.If(ee.Algorithms.IsEqual(depth, null), 0, depth);
  depth = ee.Algorithms.If(ee.Algorithms.IsEqual(depth, 'None'), 0, depth);
  return feature.set('flood_depth', depth);
});



//Coastal


// Import flood depth raster and UDF data
var floodDepth_c = ee.Image('projects/ee-rhrt-fast/assets/Coast_Inund_500yr').clip(bound3);


// Load the raster at a resolution of 30 meters
var raster_c = floodDepth_c.resample('bilinear').reproject({
  crs: floodDepth_c.projection(),//'EPSG:4326',
  scale: 30//floodDepth_c.projection().nominalScale()
});



var projectedUDF_c = udf.map(function(feature) {
  return feature.setGeometry(feature.geometry().transform(raster_c.projection()));
});

// Sample the raster values at the UDF feature locations
var sampledUDF_c = raster_c.reduceRegions({
  collection: projectedUDF_c,
  reducer: ee.Reducer.anyNonZero(),
  scale: 30, // Match the scale of the reprojected raster
});

// Function to check if a feature is flooded
var checkFlooded_c = function(feature) {
  var flooded = feature.get('any');
  return feature.set('coastal_flooded', ee.Algorithms.If(flooded, true, false));
};

// Apply the checkFlooded function to the sampled UDF features
var udfFlood_c = sampledUDF_c.map(checkFlooded_c);

// Filter the UDF records that are exposed to flood
var udfExposed_c = udfFlood_c.filter(ee.Filter.eq('coastal_flooded', true));

// Get the total number of UDF records exposed to flood
var udfExposedCount_c = udfExposed_c.size();

// Print the result
//print('Number of UDF records exposed to flood (Coastal):', udfExposedCount_c);




// Add a new property to the UDF dataset indicating the flood depth at the location of the building
var udfDepth_c = udfExposed_c.map(function(feature) {
  var depth_c = raster_c.reduceRegion({
    reducer: ee.Reducer.first(),
    geometry: feature.geometry(),
    scale: floodDepth_c.projection().nominalScale()
  }).values().get(0);
  // If depth is null or None, assign it a value of zero
  depth_c = ee.Algorithms.If(ee.Algorithms.IsEqual(depth_c, null), 0, depth_c);
  depth_c = ee.Algorithms.If(ee.Algorithms.IsEqual(depth_c, 'None'), 0, depth_c);
  return feature.set('coastal_flood_depth', depth_c);
});

//Find buildings exposed to both types of floods and calculate the maximum flood depth
var udfBoth = udfDepth.filter(ee.Filter.inList('system:index', udfDepth_c.aggregate_array('system:index')));
var udfBothMaxDepth = udfBoth.map(function(feature) {
  var riverineDepth = feature.get('flood_depth');
  var coastalDepth = feature.get('coastal_flood_depth');
  var maxDepth = ee.Algorithms.If(ee.Number(riverineDepth).gt(coastalDepth), riverineDepth, coastalDepth);
  return feature.set('max_flood_depth', maxDepth);
});

//Find buildings exposed to both types of floods and calculate the maximum flood depth
var coastalIndices = udfExposed_c.aggregate_array('system:index');
var riverineIndices = udfExposed.aggregate_array('system:index');

var udfBoth = udfDepth.filter(ee.Filter.inList('system:index', coastalIndices));
var udfBoth_c = udfDepth_c.filter(ee.Filter.inList('system:index', riverineIndices));

var udfBothMaxDepth = udfBoth.map(function(feature) {
  var coastalFeature = udfBoth_c.filter(ee.Filter.eq('system:index', feature.get('system:index'))).first();
  var riverineDepth = feature.get('flood_depth');
  var coastalDepth = coastalFeature.get('coastal_flood_depth');
  var maxDepth = ee.Algorithms.If(ee.Number(riverineDepth).gt(coastalDepth), riverineDepth, coastalDepth);
  return feature.set('depth_vfd', maxDepth);
});

//Identify buildings exposed to only riverine floods and only coastal floods and set 'depth_vfd'
var udfRiverineOnly = udfDepth.filter(ee.Filter.inList('system:index', coastalIndices).not()).map(function(feature) {
  return feature.set('depth_vfd', feature.get('flood_depth'));
});

var udfCoastalOnly = udfDepth_c.filter(ee.Filter.inList('system:index', riverineIndices).not()).map(function(feature) {
  return feature.set('depth_vfd', feature.get('coastal_flood_depth'));
});

// Combine the three feature collections into a single collection
var combinedUDF = udfRiverineOnly
  .merge(udfCoastalOnly)
  .merge(udfBothMaxDepth);

// Print results
var udfBothCount = udfBoth.size();
var udfRiverineOnlyCount = udfRiverineOnly.size();
var udfCoastalOnlyCount = udfCoastalOnly.size();
var totalAffectedBuildings = udfBothCount.add(udfRiverineOnlyCount).add(udfCoastalOnlyCount);

print('Number of UDF records exposed to both riverine and coastal floods:', udfBothCount);
print('Number of UDF records exposed to riverine only floods:', udfRiverineOnlyCount);
print('Number of UDF records exposed to coastal only floods:', udfCoastalOnlyCount);
print('Total number of affected buildings:', totalAffectedBuildings);



// Iterate over each feature in the riverine dataset
var udfDepthMax = combinedUDF; /*udfDepth.map(function(feature) {
  var geometry = feature.geometry();
  var riverineDepth = ee.Number(feature.get('flood_depth'));

  // Filter the coastal dataset to features intersecting the current riverine feature
  var intersectingFeatures = udfDepth_c.filterBounds(geometry);

  // Iterate over each intersecting feature and compare flood depth values
  var maxDepth = intersectingFeatures.iterate(function(coastalFeature, currentMax) {
    coastalFeature = ee.Feature(coastalFeature);
    var coastalDepth = ee.Number(coastalFeature.get('coastal_flood_depth'));
    return ee.Algorithms.If(coastalDepth.gt(ee.Number(currentMax)), coastalDepth, currentMax);
  }, riverineDepth);

  // Add the maximum flood depth as a new property
  return feature.set('max_flood_depth', maxDepth);
});*/

// Print the resulting FeatureCollection
//print('UDF with max flood depth:', udfDepthMax);

// Compute the depth_vfd property and add it to the feature collection
var udfDepthVFD = udfDepthMax;/*.map(function(feature) {
  var firstFloorHt = feature.get('FirstFloor');
  var floodDepth = feature.get('max_flood_depth');
  var depthVFD = ee.Number(floodDepth).subtract(ee.Number(firstFloorHt));
  depthVFD = ee.Algorithms.If(ee.Algorithms.IsEqual(depthVFD, null), 0, depthVFD);
  depthVFD = ee.Algorithms.If(ee.Algorithms.IsEqual(depthVFD, 'None'), 0, depthVFD);
  return feature.set('depth_vfd', depthVFD);
});*/


// Print the updated UDF dataset
print('UDF dataset with max flood depth:', udfDepthVFD);
// Get the total number of UDF records exposed to flood
var udfExposedCount_udfDepthVFD = udfDepthVFD.size();

// Print the result
print('Number of UDF records exposed to flood (MaxDepth):', udfExposedCount_udfDepthVFD);


// Apply the filter directly to the FeatureCollection
var nonEmptyOccClassUdf = udfDepthVFD;/*.filter(ee.Filter.and(
  ee.Filter.neq('OccClass', 'null'),
  ee.Filter.neq('OccClass', '')
));
print('N.o of Filtered UDF with non-empty OccClass:', nonEmptyOccClassUdf.size());*/



var calculateSOID = function(feature) {
  // Get properties from feature
  var occupancy = ee.String(feature.get('OccClass'));
  var foundationType = feature.getNumber('FoundType');
  var numStories = feature.getNumber('NumStories');

  // Prefix: First and last character of occupancy
  
  var sopre = ee.Algorithms.If(occupancy.equals('REL1'), ee.String('RE1'), occupancy.slice(0, 1).cat(occupancy.slice(3, occupancy.length())) );


  // Suffix: Easy - Basement or no Basement
  var sosuf = ee.Algorithms.If(ee.Number(foundationType).neq(4),
                               'N',
                               'B');

  var somid = ee.Algorithms.If(occupancy.slice(0, 4).equals('RES3'),
                               ee.Algorithms.If(numStories.gt(4),
                                                '5',
                                                ee.Algorithms.If(numStories.gt(2),
                                                                 '3',
                                                                 '1')),
                               ee.Algorithms.If(occupancy.slice(0, 4).equals('RES1'),
                                                ee.Algorithms.If(numStories.gt(3.0),
                                                                 ee.Algorithms.If(ee.Number(3).subtract(ee.Number(3).round()).eq(0),
                                                                                  ee.String(ee.Number(3).round()),'S'),
                                                                 ee.Algorithms.If(ee.Number(numStories).subtract(ee.Number(numStories).round()).eq(0),
                                                                                  ee.String(ee.Number(numStories).round().toInt()),'S')),
                                                ee.Algorithms.If(occupancy.slice(0, 4).equals('RES2'),
                                                                 '1',
                                                                 ee.Algorithms.If(numStories.gt(6),
                                                                                  'H',
                                                                                  ee.Algorithms.If(numStories.gt(3),
                                                                                                   'M',
                                                                                                   'L')))));                                                                                                 
       


  // Calculate specific occupancy id
  var SpecificOccupId = ee.String(sopre).cat(ee.String(somid)).cat(ee.String(sosuf));

  // Set the specific occupancy id as property of the feature and return the feature
  return feature.set('SpecificOccupId', SpecificOccupId);
};


// Apply the function to the FeatureCollection
var udfWithSOID1 = nonEmptyOccClassUdf.map(calculateSOID);
//print('UDF dataset with SOID:', udfWithSOID1);

// Add a new column 'flc' with value 'CAE' to each feature in the FeatureCollection
var udfWithSOID = udfWithSOID1.map(function(feature) {
  return feature.set('flc', 'CAE');
});






// Load two feature collections
var fc1 = udfWithSOID;



// Map the addBldgLoss function over the udfData FeatureCollection

  // Define the bddf_lut_riverine and bddf_lut_coastalA as Feature Collections
  var bddf_lut_riverine = ee.FeatureCollection('projects/ee-rhrt-hand/assets/Building_DDF_Riverine_LUT_Hazus4p0');
  var bddf_lut_coastalA = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Building_DDF_CoastalA_LUT_Hazus4p0');
  var bddf_lut_coastalV = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Building_DDF_CoastalV_LUT_Hazus4p0');

var addBldgLoss = fc1.map(function(feature) {

  var depth1 = feature.getNumber('depth_vfd');
  var OC = ee.String(feature.get('OccClass'));
  var CoastalZoneCode = ee.String(feature.get('flc'));
  // Initialize the blut variable
  var blut = bddf_lut_riverine;

  // Check the conditions
  if (OC.slice(0,3) == 'RES') {
  if (CoastalZoneCode == 'CAE') {
      blut = bddf_lut_coastalA;
    } else if (CoastalZoneCode == 'VE' || CoastalZoneCode == 'V') {
      blut = bddf_lut_coastalV;
    }
  }

  

  var ddf = blut;
  var soid1 = feature.get('SpecificOccupId');
  var soid2 = ee.Filter.eq('SpecificOccupId', soid1);
  
  var fc3 = ddf.filter(soid2).first();
  
  // Clamp the depth value to the range [-4, 24]
  var depth = ee.Algorithms.If(depth1.gt(24), 24, ee.Algorithms.If(depth1.lt(-4), -4, depth1));


  var suffix_l = ee.String(((ee.Number(depth).floor()).abs()).int());
  var suffix_u = ee.String(((ee.Number(depth).ceil()).abs()).int());
  var prefix_l = ee.String(ee.Algorithms.If(ee.Number(depth).floor().lt(0), 'm', 'p'));
  var prefix_u = ee.String(ee.Algorithms.If(ee.Number(depth).ceil().lt(0), 'm', 'p'));
  var l_index = prefix_l.cat(suffix_l);
  var u_index = prefix_u.cat(suffix_u);
  
  //Building Loss Calculation
  // Get the lower and upper values from the ddf1 dictionary
  var d_lower = ee.Number(fc3.get(l_index)).toFloat();
  var d_upper = ee.Number(fc3.get(u_index)).toFloat();

  // Compute the fractional amount of depth for interpolation
  var frac = ee.Number(depth).subtract(ee.Number(depth).floor());

  // Compute the damage using linear interpolation
  var damage = (d_lower.add(frac.multiply(d_upper.subtract(d_lower)))).divide(100);
  //var bldg_loss = damage.multiply(ee.Number(feature.get('Cost')));
  //return feature.copyProperties(bldg_loss);
  
 // var bldg_loss = damage.multiply(ee.Number(feature.get('Cost')).toInt());
  var bldg_loss = damage.multiply(ee.Number.parse(feature.get('Cost')));
  /*var lossFeature = ee.Feature(null, {'bldg_loss': bldg_loss});
  var updatedFeature = ee.Feature(feature).copyProperties(lossFeature);
  return updatedFeature;*/
  var cost1 = ee.Number.parse(feature.get('Cost'));
  return feature.set('bldg_loss', bldg_loss).set('New_Cost',cost1);
});

//var udfDataWithLoss = merged.map(addBldgLoss);
print('Total cost (Earth Engine):', addBldgLoss.aggregate_sum('bldg_loss'));
print('Total Cost:', addBldgLoss.aggregate_sum('New_Cost'));
//print('Building Loss', addBldgLoss);

var Content_x_0p5 = ['RES1','RES2','RES3A','RES3B','RES3C','RES3D','RES3E','RES3F','RES4','RES5','RES6','COM10'];
var Content_x_1p0 = ['COM1','COM2','COM3','COM4','COM5','COM8','COM9','IND6','AGR1','REL1','GOV1','EDU1'];
var Content_x_1p5 = ['COM6','COM7','IND1','IND2','IND3','IND4','IND5','GOV2','EDU2'];

  var cddf_lut_riverine = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Content_DDF_Riverine_LUT_Hazus4p0');
  var cddf_lut_coastalA = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Content_DDF_CoastalA_LUT_Hazus4p0');
  var cddf_lut_coastalV = ee.FeatureCollection('projects/ee-rhrt-fast/assets/Content_DDF_CoastalV_LUT_Hazus4p0');

var addContLoss1 = addBldgLoss.map(function(feature){
  var OC = feature.get('OccClass');
  var ccost = feature.get('New_Cost');
  var CMult = ee.Algorithms.If(
    ee.List(Content_x_0p5).contains(OC),
    0.5,
    ee.Algorithms.If(
      ee.List(Content_x_1p0).contains(OC),
      1.0,
      ee.Algorithms.If(
        ee.List(Content_x_1p5).contains(OC),
        1.5,
        0
      )
    )
  );
  var ccost_new = ee.Number(ccost).multiply(CMult);
  return feature.set('ccost_new', ccost_new);
  
});

var addContLoss = addContLoss1.map(function(feature) {

  var depth1 = feature.getNumber('depth_vfd');
  var OC = ee.String(feature.get('OccClass'));
  var CoastalZoneCode = ee.String(feature.get('flc'));
  // Initialize the blut variable
  var blut = cddf_lut_riverine;

  // Check the conditions
  if (OC.slice(0,3) == 'RES') {
  if (CoastalZoneCode == 'CAE') {
      blut = bddf_lut_coastalA;
    } else if (CoastalZoneCode == 'VE' || CoastalZoneCode == 'V') {
      blut = bddf_lut_coastalV;
    }
  }

  

  var ddf = blut;
  
  var soid1 = feature.get('SpecificOccupId')
  var soid2 = ee.Filter.eq('SpecificOccupId', soid1);
  
  var fc3 = ddf.filter(soid2).first();
  
  
  var depth = ee.Algorithms.If(depth1.gt(24), 24, ee.Algorithms.If(depth1.lt(-4), -4, depth1))


  var suffix_l = ee.String(((ee.Number(depth).floor()).abs()).int());
  var suffix_u = ee.String(((ee.Number(depth).ceil()).abs()).int());
  var prefix_l = ee.String(ee.Algorithms.If(ee.Number(depth).floor().lt(0), 'm', 'p'));
  var prefix_u = ee.String(ee.Algorithms.If(ee.Number(depth).ceil().lt(0), 'm', 'p'));
  var l_index = prefix_l.cat(suffix_l);
  var u_index = prefix_u.cat(suffix_u);
  
  // Content Loss Calculation
  // Get the lower and upper values from the ddf1 dictionary
  var d_lower = ee.Number(fc3.get(l_index)).toFloat();
  var d_upper = ee.Number(fc3.get(u_index)).toFloat();

  // Compute the fractional amount of depth for interpolation
  var frac = ee.Number(depth).subtract(ee.Number(depth).floor());

  // Compute the damage using linear interpolation
  var damage = (d_lower.add(frac.multiply(d_upper.subtract(d_lower)))).divide(100);

  
  var cont_loss = damage.multiply(ee.Number(feature.get('ccost_new')));

  return feature.set('cont_loss', cont_loss);
});

print('Total content cost (Earth Engine):', addContLoss.aggregate_sum('cont_loss'));
//print('Content Loss', addContLoss);





//Basement
var bsmf = addContLoss.map(function(feature) {

  var OC = ee.String(feature.get('OccClass'));
  var foundationType = feature.getNumber('FoundType');
  var bsm = ee.Algorithms.If(OC.equals('RES1'), ee.Algorithms.If(foundationType.eq(4),'B','NB'), 'NB');
  return feature.set('bsm', bsm);
});

//print('bsm', bsmf)

//Debris calculation

var debris_key = bsmf.map(function(feature) {

  var depth1 = feature.getNumber('depth_vfd');
  var OC = ee.String(feature.get('OccClass'));
  var foundationType = feature.getNumber('FoundType');
  var debriskey, ddf1, dfin, dstruc, dfound, dtot;
  var bsm =  ee.String(feature.get('bsm')); // default value for no basement
  var fnd = ee.Algorithms.If(foundationType.eq(4).or(foundationType.eq(7)),'SG','FT'); // default value for slab on grade foundation
  
  var depth = ee.Algorithms.If(depth1.gt(24), 24, ee.Algorithms.If(depth1.lt(-4), -4, depth1))
  
  var ddf = ee.FeatureCollection('projects/ee-rhrt-fast/assets/flDebris_LUT')
  

  
  var dsuf = ee.Algorithms.If(foundationType.eq(4),
  ee.Algorithms.If(
    OC.equals('RES1'),
    ee.Algorithms.If(ee.Number(depth).lt(-4), '-8',
      ee.Algorithms.If(ee.Number(depth).lt(0), '-4',
        ee.Algorithms.If(ee.Number(depth).lt(4), '0',
          ee.Algorithms.If(ee.Number(depth).lt(6), '4',
            ee.Algorithms.If(ee.Number(depth).lt(8), '6', '8'))))),
    ee.Algorithms.If(
      OC.equals('COM6'),
      ee.Algorithms.If(ee.Number(depth).lt(-4), '-8',
        ee.Algorithms.If(ee.Number(depth).lt(0), '-4',
          ee.Algorithms.If(ee.Number(depth).lt(4), '0',
            ee.Algorithms.If(ee.Number(depth).lt(6), '4',
              ee.Algorithms.If(ee.Number(depth).lt(8), '6', '8'))))),
      ee.Algorithms.If(
        OC.equals('RES2'),
        ee.Algorithms.If(ee.Number(depth).lt(0), '0', 
        ee.Algorithms.If(
        ee.Number(depth).lt(1), '0',
          ee.Algorithms.If(ee.Number(depth).lt(4), '1',
            ee.Algorithms.If(ee.Number(depth).lt(8), '4',
              ee.Algorithms.If(ee.Number(depth).lt(12), '8', '12')))
          )),
        ee.Algorithms.If(
          ee.Number(depth).lt(1), '0',
            ee.Algorithms.If(ee.Number(depth).lt(4), '1',
              ee.Algorithms.If(ee.Number(depth).lt(8), '4',
                ee.Algorithms.If(ee.Number(depth).lt(12), '8', '12')))
          )
       )
    )
  ),
  ee.Algorithms.If(
    ee.Number(depth).lt(1), '0',
    ee.Algorithms.If(ee.Number(depth).lt(4), '1',
      ee.Algorithms.If(ee.Number(depth).lt(8), '4',
        ee.Algorithms.If(ee.Number(depth).lt(12), '8', '12')))
  )
)


  

  debriskey = OC.cat(bsm).cat(fnd).cat(dsuf);
  
  
 
  return feature.set('DebrisID', debriskey);
});

//print('DebrisID',debris_key);

var debris = debris_key.map(function(feature) {
    
  var ddf = ee.FeatureCollection('projects/ee-rhrt-fast/assets/flDebris_LUT')
  var area = ee.Number.parse(feature.get('Area')).toFloat()
  
  
  var soid1 = feature.get('DebrisID')
  var soid2 = ee.Filter.eq('DebrisID', soid1);
  
  var fc3 = ddf.filter(soid2).first();
  
  var dfin_rate    = (ee.Number(fc3.get('Finishes'))).toFloat();
  var dstruc_rate  =  (ee.Number(fc3.get('Structure'))).toFloat();
  var dfound_rate  =  (ee.Number(fc3.get('Foundation'))).toFloat();
                                    
  var dfin      = ee.Number(area.multiply(dfin_rate).divide(1000));
  var dstruc    = ee.Number(area.multiply(dstruc_rate).divide(1000));
  var dfound    = ee.Number(area.multiply(dfound_rate).divide(1000));
  var dtot      = ee.Number(dfin.add(dstruc).add(dfound));
  
  return feature.set('Debris', dtot);
});

print('Debris', debris)


// Restoration
 

var restorf1 = debris.map(function(feature) {

  var depth = feature.getNumber('depth_vfd');
  var OC = ee.String(feature.get('OccClass'));
  
  var dsuf = ee.Algorithms.If(
  ee.Number(depth).lt(0), '0',
  ee.Algorithms.If(
    ee.Number(depth).lt(1), '1',
    ee.Algorithms.If(
      ee.Number(depth).lt(4), '4',
      ee.Algorithms.If(
        ee.Number(depth).lt(8), '8',
        ee.Algorithms.If(
          ee.Number(depth).lt(12), '12',
          '24'
        )
      )
    )
  )
);
  var RsFnkey = OC.cat(ee.String(dsuf))
  
 
  return feature.set('RestFnID', RsFnkey);
  
});


var restorf2 = restorf1.map(function(feature) {
    
  var ddf = ee.FeatureCollection('projects/ee-rhrt-fast/assets/flRsFnGBS_LUT')
  
  
  var soid1 = feature.get('RestFnID')
  var soid2 = ee.Filter.eq('RestFnID', soid1);
  
  var fc3 = ddf.filter(soid2).first();
  
  var restdays_min =  ee.Number(fc3.get('Min_Restor_Days')).toInt() //This is the maximum days out (flRsFnGBS has a min and a max)
  var restdays_max =  ee.Number(fc3.get('Max_Restor_Days')).toInt() //This is the maximum days out (flRsFnGBS has a min and a max)
  
  return feature.set('restdays_max', restdays_max);
});

//print('Restoration', restorf2)

print('Total no of days taken for Restoration: (Earth Engine):', restorf2.aggregate_sum('restdays_max'));


var fcPolygon = combinedUDF;

var tb = fcPolygon.size();
var tb_h = ui.Label('Total number of buildings affected :',textVis);
var tb_v = ui.Label('Please Wait', numberVIS);
tb.evaluate(function(val){tb_v.setValue(val)}),numberVIS;

var BldgLossUSD = addBldgLoss.aggregate_sum('bldg_loss')
var cost_total = BldgLossUSD.toInt()
var cost_total_h = ui.Label('Cost estimated (Building loss):',textVis);
var cost_total_v = ui.Label('Please Wait', numberVIS);
cost_total.evaluate(function(val){cost_total_v.setValue('$ '+val)}),numberVIS;

/*var InventoryLossUSD = fcPolygon.aggregate_sum('icost')
var cost_inv = InventoryLossUSD.toInt()
var cost_inv_h = ui.Label('Cost estimated (Inventory):',textVis);
var cost_inv_v = ui.Label('Please Wait', numberVIS);
cost_inv.evaluate(function(val){cost_inv_v.setValue('$ '+val)}),numberVIS;*/

var ContentLossUSD = addContLoss.aggregate_sum('cont_loss')
var cost_cont = ContentLossUSD.toInt()
var cost_cont_h = ui.Label('Cost estimated (Content loss):',textVis);
var cost_cont_v = ui.Label('Please Wait', numberVIS);
cost_cont.evaluate(function(val){cost_cont_v.setValue('$ '+val)}),numberVIS;

var Debrisamount = debris.aggregate_sum('Debris');
var deb_cont = Debrisamount.toInt();
var deb_cont_h = ui.Label('Debris (Ton):',textVis);
var deb_cont_v = ui.Label('Please Wait', numberVIS);
deb_cont.evaluate(function(val){deb_cont_v.setValue(val)}),numberVIS;

var Restamount = restorf2.aggregate_sum('restdays_max');
var resto_cont = Restamount.toInt();
var resto_cont_h = ui.Label('Restoration (No of days):',textVis);
var resto_cont_v = ui.Label('Please Wait', numberVIS);
resto_cont.evaluate(function(val){resto_cont_v.setValue(val)}),numberVIS;



var fc = combinedUDF;

var res = fc.filter(ee.Filter.stringStartsWith('OccClass', 'RES'));
var residential = res;

var com =  fc.filter(ee.Filter.stringStartsWith('OccClass', 'CO'));
var commercial = com;

var agri =  fc.filter(ee.Filter.stringStartsWith('OccClass', 'AGR1'));
var agricultural = agri;

var rel = fc.filter(ee.Filter.stringStartsWith('OccClass', 'REL'));
var gov = fc.filter(ee.Filter.stringStartsWith('OccClass', 'GOV'));
var edu = fc.filter(ee.Filter.stringStartsWith('OccClass', 'EDU'));
var ind = fc.filter(ee.Filter.stringStartsWith('OccClass', 'IND'));



var comm = com.size();
var comm_h = ui.Label('Total number of commercial buildings:',textVis);
var comm_v = ui.Label('Please Wait', numberVIS);
comm.evaluate(function(val){comm_v.setValue(val)}),numberVIS;

res =  res.size();
var res_h = ui.Label('Total number of residential buildings:',textVis);
var res_v = ui.Label('Please Wait', numberVIS);
res.evaluate(function(val){res_v.setValue(val)}),numberVIS;

agri = agri.size();
var agri_h = ui.Label('Total number of agricultural buildings :',textVis);
var agri_v = ui.Label('Please Wait', numberVIS);
agri.evaluate(function(val){agri_v.setValue(val)}),numberVIS;

var rell = rel.size();
var rel_h = ui.Label('Total number of religious buildings:',textVis);
var rel_v = ui.Label('Please Wait', numberVIS);
rell.evaluate(function(val){rel_v.setValue(val)}),numberVIS;

var govv =  gov.size();
var gov_h = ui.Label('Total number of governmental buildings:',textVis);
var gov_v = ui.Label('Please Wait', numberVIS);
govv.evaluate(function(val){gov_v.setValue(val)}),numberVIS;

var eduu = edu.size();
var edu_h = ui.Label('Total number of educational buildings :',textVis);
var edu_v = ui.Label('Please Wait', numberVIS);
eduu.evaluate(function(val){edu_v.setValue(val)}),numberVIS;

var indd = ind.size();
var ind_h = ui.Label('Total number of industrial buildings :',textVis);
var ind_v = ui.Label('Please Wait', numberVIS);
indd.evaluate(function(val){ind_v.setValue(val)}),numberVIS;


var downloadLink = ui.Label({value:'Export the results',
  style: {
  color: 'blue',
  fontSize: '16px',
  fontWeight:'bold',
  textAlign: 'center',
  fontFamily:'monospace',
  border: '2px solid lightgray',
  stretch:'horizontal'
  }
});



downloadLink.setUrl(restorf2.getDownloadURL({format: 'csv'}));

results1.clear();
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
        deb_cont_h,
        deb_cont_v,
        resto_cont_h,
        resto_cont_v,
        cost_total_h,
        cost_total_v,
        //cost_inv_h,
        //cost_inv_v,
        cost_cont_h,
        cost_cont_v,
        res_h,
        res_v,
        
        comm_h,
        comm_v,
        
        agri_h,
        agri_v,
        
        rel_h,
        rel_v,
        
        gov_h,
        gov_v,
        
        edu_h,
        edu_v,
        
        ind_h,
        ind_v,
      

        air_aff,
        air_aff1,
        portf,
        portff,
        bff,
        bfff,
        eocf,
        eocff,
        
        downloadLink
        
      ]
      ));
    




var denver = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level2')
    .filter("ADM2_NAME == 'Houghton'")
    .filter(ee.Filter.eq('ADM2_NAME', 'Houghton'))  // Exactly the same as above.
    .first()
    .geometry();
    
// Create an image collection from the two images.
var floodCollection = ee.ImageCollection([
  floodDepth_c,//.set('system:index', 'Coastal Inundation'),
  flooded//.set('system:index', 'Riverine Flooding')
]).mosaic();


Map.clear();
Map.centerObject(swater.geometry(), 9);
Map.addLayer(floodCollection, {palette:"0000FF"},'Flooded areas');
Map.add(results);
Map.add(legend);
Map.add(results1);
Map.addLayer(population_exposed, populationExposedVis, 'Exposed Population',0);
Map.addLayer(cropland_affected, croplandVis, 'Affected Cropland',0); 
Map.addLayer(fcPolygon, {color: 'yellow'},'Buildings',0);
Map.addLayer(agricultural, {color: 'magenta'},'Agricultural',0);
Map.addLayer(commercial, {color: 'cyan', pointSize: 100},'Commercial',0);
Map.addLayer(residential, {color: 'red'},'Residential',0);



}

