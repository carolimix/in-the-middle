# Spati near me

## Overview

"In the Middle" is a web application designed to simplify the process of finding a convenient and equitable meeting point between two addresses in a city. Living in a bustling urban environment like Berlin, the struggle to find a central meetup spot for friends living in different areas inspired the creation of this project.

## Features

- **Address Input:** Users can input two addresses to determine their starting points.
- **Category Selection:** Users can select a category (e.g., cafe, park, museum) for their meeting point, adding a personalized touch to the meetup location.
- **Map Visualization:** Utilizes MapTiler SDK for an interactive and dynamic map display, enhancing user experience.
- **Geocoding API Integration:** Leverages the MapTiler Geocoding API to convert addresses into precise geographical coordinates for accurate mapping.
- **Midpoint Calculation:** The application calculates the midpoint between the two entered addresses, providing a fair and central location for both parties.
- **Google Maps Integration:** Directs users to a Google Maps search with recommendations near the calculated midpoint, further facilitating the planning process.

## Technology Stack

- **React:** JavaScript library for building user interfaces.
- **Vite:** Build tool that provides a fast development experience for modern web projects.
- **MapTiler SDK:** JavaScript library for mapping features and dynamic map visualization.
- **MapTiler Geocoding API:** Converts addresses into geographical coordinates for accurate mapping.

## Dependencies

- `react`
- `react-dom`
- `react-router-dom` (if routing is used)
- `leaflet` (if using Leaflet for mapping)
- `@maptiler/maptiler-geocoding-control` (if using MapTiler Geocoding API)
- Other dependencies as required for specific features

## Usage

1. Input two addresses in the "Point A" and "Point B" sections.
2. Select a category from the dropdown menu for the meeting point.
3. Click the "Find a Middle Point" button.
4. Explore the suggested meeting point on the map.
5. Click the map marker for recommendations near the midpoint.

## Future Enhancements

- [ ] Additional categories for meeting points.
- [ ] User accounts to save and revisit meeting points.
- [ ] Integration with more mapping and geolocation features.

## Contributing

Contributions are welcome!

# License

This project is licensed under the [GNU Affero General Public License (AGPL)](LICENSE).

## Acknowledgments

- Thank you to the developers of MapTiler for providing powerful geospatial tools.
