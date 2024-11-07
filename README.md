# Hazard Communication Engine for Rural Counties

This Google Earth Engine (GEE) tool is designed for rural communities for approximate mapping of flood inundation and associated economic losses due to building-level impacts in the Western Upper Peninsula (Michigan) of the Great Lakes region. By combining multiple datasets, the tool helps users estimate flood exposure for specific areas, identify affected assets, and gauge potential economic losses. This tool implements risk analysis methods from the FEMA FAST and HAZUS flood assessment models, which are widely used for hazard and vulnerability assessments. By adapting these established methodologies, the tool offers accurate and relevant predictions for potential flood impacts. This assessment tool provides a powerful way for rural planning agencies to understand and mitigate flood risks, supporting the development of targeted resilience strategies and informing resource allocation for flood preparedness.

 Key Features

The tool integrates various datasets, joining features based on location and ID to create a comprehensive view of flood exposure. Users can select an area of interest (AOI) by choosing from predefined counties or drawing a custom region on the map. Once an AOI is defined, users can analyze flood impacts across different return periods (e.g., 25, 50, 100, and 500 years). 

The tool estimates a wide range of impacts, including:
- Flooded Area: Calculates the flooded land area in hectares.
- Affected Cropland: Identifies cropland within flood zones.
- Exposed Population: Estimates the number of people at risk in flooded areas.
- Economic Losses: Provides assessments for building and content losses based on depth of flooding.
- Debris Generation: Estimates the volume of debris resulting from the flood.
- Restoration Timeframes: Predicts the days required for restoring affected areas.

Each of these metrics can be visualized on the map, with the tool providing color-coded overlays to distinguish between affected asset types, such as residential, agricultural, and commercial properties.

 Usage Instructions

1. Select an AOI: Users can select a county from a dropdown list or define a custom AOI by drawing on the map.
2. Choose Flood Scenario: Click the button corresponding to a desired flood return period (e.g., 25, 50, 100, or 500 years).
3. View Results: The tool presents a summary of impacts, including flood extent, building and content losses, population exposure, debris, and restoration days. Results are shown in an interactive panel.
4. Export Data: An export option allows users to download the results as a CSV file for further analysis.

 Datasets and Customization

The tool is preconfigured with specific datasets, including:
- Hydrological Data: Inundation depth and flood extent layers.
- Infrastructure Data: Locations and details for buildings, hospitals, airports, and ports.
- Land Use: NLCD data to classify cropland.
- Population: Gridded population data for exposure analysis.

However, all datasets can be replaced with user-specific data to provide customized results for other areas or counties of interest.




