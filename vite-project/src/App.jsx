import React, { useState } from 'react';
import MapComponent from './Component/MapComponent/MapComponent';
import './App.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    const [center, setCenter] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        college: '',
        image: null,
        position: null,
        address: ''
    });

    const parseDMS = (dms) => {
        const [deg, min, sec, dir] = dms.split(/[\s°'"]+/).filter(Boolean);
        const decimal = parseFloat(deg) + parseFloat(min) / 60 + parseFloat(sec) / 3600;
        return dir === 'S' || dir === 'W' ? -decimal : decimal;
    };

    const handleLocationSearch = async () => {
        const location = document.getElementById('locationInput').value;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
        const data = await response.json();

        if (data.length > 0) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            setCenter([lat, lon]);
            setFormData({ ...formData, position: [lat, lon] });
            toast.success('Location found and position set'); // Testing success toast
        } else {
            toast.error('Location not found');
        }
    };

    const handleLatLonSubmit = () => {
        const latDMS = document.getElementById('latDMSInput').value;
        const lonDMS = document.getElementById('lonDMSInput').value;

        const latDecimal = parseDMS(latDMS);
        const lonDecimal = parseDMS(lonDMS);

        if (!isNaN(latDecimal) && !isNaN(lonDecimal)) {
            setCenter([latDecimal, lonDecimal]);
            setFormData({ ...formData, position: [latDecimal, lonDecimal] });
            toast.success('Position set');
        } else {
            toast.error('Invalid latitude or longitude');
        }
    };

    const handleSaveMarker = () => {
        if (formData.position) {
            setMarkers([...markers, {
                position: formData.position,
                name: formData.name,
                college: formData.college,
                image: formData.image,
                address: formData.address
            }]);
            setFormData({ name: '', college: '', image: null, position: null, address: '' });
            toast.success('Marker saved successfully');
        } else {
            toast.error('No position to save');
        }
    };

    const handleAddressChange = (e) => {
        setFormData({ ...formData, address: e.target.value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="App">
            <div className="navbar">
                <div className="navbar-content">
                    <h1>Map Application</h1>
                </div>
            </div>
            <div className="inputContainer">
                <input type="text" id="locationInput" placeholder="Enter location" />
                <button onClick={handleLocationSearch}>Show Location</button>
                <div className="latLonInputs">
                    <input type="text" id="latDMSInput" placeholder="Latitude (DMS format)" />
                    <input type="text" id="lonDMSInput" placeholder="Longitude (DMS format)" />
                    <button onClick={handleLatLonSubmit}>Fetch location</button>
                </div>
                {center && (
                    <div className="formContainer">
                        <input
                            type="text"
                            placeholder="Enter name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Enter college name"
                            value={formData.college}
                            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <textarea
                            placeholder="Enter address"
                            value={formData.address}
                            onChange={handleAddressChange}
                        />
                        <button onClick={handleSaveMarker}>save data</button>
                    </div>
                )}
            </div>
            <MapComponent
                center={center}
                markers={markers}
                onMapClick={() => {}}
                onMarkerClick={() => {}}
            />
            <ToastContainer />
        </div>
    );
};

export default App;
