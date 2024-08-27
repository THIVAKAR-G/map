// src/Component/MapComponent/MapComponent.jsx

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';

const MapUpdater = ({ center }) => {
    const map = useMap();
    React.useEffect(() => {
        if (center) {
            map.setView(center, 13);
        }
    }, [center, map]);
    return null;
};

const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        }
    });
    return null;
};

const MapComponent = ({ center, markers, onMapClick, onMarkerClick }) => {
    return (
        <MapContainer
            center={center || [11.0168, 76.9558]} // Default to Coimbatore
            zoom={13}
            className="mapContainer"
        >
            <MapUpdater center={center} />
            <MapClickHandler onMapClick={onMapClick} />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {markers.map((marker, index) => (
                <Marker
                    key={index}
                    position={marker.position}
                    eventHandlers={{
                        click: () => onMarkerClick(index),
                    }}
                >
                    <Popup>
                        <div className="popupContent">
                            {marker.image && (
                                <img
                                    src={marker.image}
                                    alt="Marker"
                                    className="popupImage"
                                />
                            )}
                            <div className="popupDetails">
                                <h4>{marker.name || 'Unnamed'}</h4>
                                <p><strong>College:</strong> {marker.college || 'Not Provided'}</p>
                                <p><strong>Address:</strong></p>
                                <p>{marker.address || 'Not Provided'}</p>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
