# Hazard Communication Engine for Rural Counties

# Overview:
This flood risk assessment tool in Google Earth Engine (GEE) tool is one of the three components of the Rural Hazard Resilience Tools (RHRT). The flood risk assessment tool facilitates the approximate mapping of flood inundation and the estimation of economic losses resulting from fluvial and coastal flooding. The other tools of the RHRT include a citizen science-based web application for collecting crowdsourced data, such as flood inundation depth and photographs of flood events, and a geospatial visualization platform for communicating information on flood risk, critical infrastructure, and community resilience. These tools are developed to enhance flooding and coastal disaster resilience and adaptation in rural communities across the Great Lakes region. The RHRT is currently operational in five counties of the Western Upper Peninsula (Michigan). By combining multiple datasets, the flood risk assessment tool helps users estimate flood inundation extent and depth for specific return periods (25-, 50-, 100- and 500-year floods), identify affected assets, and compute potential economic losses due to building-level impacts.


The tool uses a model chain for flood inundation mapping, including the Height Above the Nearest Drainage (HAND), Synthetic Rating Curves (SRCs), Simulating WAves Nearshore (SWAN) model, United States Geological Survey (USGS) regional regression equations. For estimating flood losses due to building-level impacts, the tool utilizes the depth-damage functions of the HAZUS-MH flood model and HAZUS Flood Assessment Structure Tool (FAST). The tool also incorporates ancillary datasets, such as gridded dasymetric population data and the National Land Cover Database (NLCD) 2021 to estimate the affected population and agricultural areas quantitatively. By integrating these established models and methodologies, this tool provides reasonably accurate predictions of potential flood impacts. The RHRT serves as a crucial platform for communicating situational awareness, devising response plans, implementing targeted mitigation measures in development planning, allocating adequate resources, making informed decisions, and enhancing disaster resilience, and ultimately building sustainable, climate-resilient communities across the Great Lakes region.


# Key Features: 
The flood risk assessment tool integrates various datasets to generate a comprehensive overview of flood risk. Users can select an area of interest (AOI) either by choosing the predefined counties of the Western Upper Peninsula or drawing a custom region on the map. Once an AOI is defined, users can analyze flood risk across different return periods (25-, 50-, 100-, and 500-years). The tool computes various flood inundation characteristics and economic losses, including:
  - Inundation area and depth: Calculates the areal extent (in hectares) and average depth (in feet) of the flooded area.
  - Economic Losses: Estimates economic losses (in US$) due to building-level impacts.
  - Affected Cropland: Computes the areal coverage (in hectares) of cropland within the flood zone.
  - Exposed Population: Estimates the number of people at risk in flooded areas.
  - Debris Generation: Estimates the debris generated (in tons) because of flood events.
  - Restoration Time: Predicts the number of days required to restore the buildings.
The tool also provides color-coded overlays to distinguish between affected assets, such as residential, agricultural, and commercial buildings.


# Usage Instructions:
  1. Select an AOI: Users can choose a county from the dropdown list or define a custom AOI by drawing a polygon on the map.
  2. Choose flood return period: Click the button corresponding to the desired flood return period (25-, 50-, 100-, and 500-years). This action executes the tool and generates results in a widget panel.
  3. View Results: The tool displays a summary of impacts, including flood extent, building and content losses, population exposure, debris, and restoration days in the panel.
  4. Export Data: Users can download the results as a CSV file for further analysis using the export option.

# Datasets and Customization:
The tool is preconfigured with specific datasets, including:
  - Flood inundation data: Raster layers, indicating extent and depth indicating flood extent and depth, generated using HAND-SRC and SWAN models.
  - Building and other infrastructure data: Location and attributes for buildings and other critical infrastructure. Building attributes include occupancy type, replacement cost (in US$), area (in square feet), number of stories, foundation type, first-floor elevation       or height above grade of finished first floor (in feet). Refer to the HAZUS-MH technical manual for data formats and details.
  - Land use: NLCD 2021 data to identify agricultural areas and cropland.
  - Population: Gridded dasymetric population data for exposure analysis.


Users can replace these datasets with their own specific data to adapt the tool for other geographical areas. 
The RHRT was developed with the financial support from the US National Science Foundation. For more details about the RHRT, you may visit this: https://www.wuppdr.org/rhrt. A detailed description of the flood risk assessment tool, its methodological framework and model performance evaluation can be found at these articles: https://doi.org/10.1016/j.jglr.2025.102510 and https://doi.org/10.1007/s12145-023-01218-x. The analytical capabilities of the RHRT are being expanded under the Center for Climate-driven Hazard Adaptation, Resilience, and Mitigation (C-CHRAM), a climate resilience center funded by the US Department of Energy at Michigan Technological University. You can learn more about C-CHRAM here: https://c-charm.org

# Publications and other web resources:

  1. https://doi.org/10.1016/j.jglr.2025.102510
  2. https://doi.org/10.1007/s12145-023-01218-x
  3. https://doi.org/10.37099/mtu.dc.etdr/1735
  4. https://www.wrri.msstate.edu/conference/wrri_conference_2024.pdf
  5. https://hazards.colorado.edu/uploads/poster_session/Rai_2023NHWPoster-min.pdf
  6. https://www.acsp.org/resource/collection/59C8DA2D-F881-4A31-8980-FC9A8E83D780/ACSP2023_Book_of_Abstracts.pdf
  7. https://cdn.ymaws.com/www.acsp.org/resource/collection/59C8DA2D-F881-4A31-8980-FC9A8E83D780/ACSP2023_Book_of_Abstracts.pdf
  8. https://agu.confex.com/agu/fm22/meetingapp.cgi/Paper/1100238
  9. https://agu.confex.com/agu/fm22/meetingapp.cgi/Paper/1164701
  10. https://www.wuppdr.org/rhrt
  11. https://survey123.arcgis.com/share/dfe8032771644213b4fe96774b4c11d7
  12. https://rhrt.users.earthengine.app/view/hazard-communication-engine-for-rural-counties
  13. https://experience.arcgis.com/experience/fe4b7cd74dae4c928302ba1bcd040a11
  14. https://c-charm.org
  15. https://m.facebook.com/RuralHazardResilienceTools/
  16.https://www.instagram.com/ruralhazardresiliencetools/?hl=en
  17. https://twitter.com/ruralhaztools?lang=en

The tools in the Data Processing toolbox are developed to derive the watershed attributes necessary for the USGS regional regression equations used in computing flood frequency statistics. The Catchment tool identifies the upstream contributing area of a given reach using the DEM-derived stream network and sub-basins, while the Mainstream tool identifies the mainstream of the contributing area from the stream network.







