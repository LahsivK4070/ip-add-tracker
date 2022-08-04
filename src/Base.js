import React, {useEffect, useState} from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import axios from "axios";
import markPnt from "./assets/icon-location.svg";
import L from "leaflet";

const Base = () => {

    useEffect(() => {
        fetchData();
    }, [])

    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('');
    const [region, setRegion] = useState('');
    const [zone, setZone] = useState('');
    const [isp, setIsp] = useState('');
    const [lati, setLat] = useState(0);
    const [lang, setLng] = useState(0);
    const [ip, setIp] = useState();

    const handelChange = (e) => {
        setAddress(e.target.value);
    }

    const SetViewOnClick = ({coords}) => {
        const map = useMap();
        map.setView(coords, map.getZoom());
    }

    const fetchData = async () => {
        try {
            const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_API_KEY}`;
            let res = await axios(url);
            setAddress(res.data.ip);
            setCountry(res.data.location.country);
            setRegion(res.data.location.city);
            setZone(res.data.location.timezone);
            setIsp(res.data.isp);
            setIp(res.data.ip);
            setLat(res.data.location.lat);
            setLng(res.data.location.lng);
            
        } catch (error) {
            console.log(error);
        }
    }

    const icon = L.icon({ iconUrl: markPnt });

    const handleClick = async () => {
        if (address.length !== 0) {
            try {
                const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_API_KEY}&ipAddress=${address}`;
                let res = await axios(url);
                setAddress(res.data.ip);
                setCountry(res.data.location.country);
                setRegion(res.data.location.city);
                setZone(res.data.location.timezone);
                setIsp(res.data.isp);
                setIp(res.data.ip);
                setLat(res.data.location.lat);
                setLng(res.data.location.lng);

            } catch (error) {
                console.log(error);
            }
        } else {
            alert("Enter something first");
        }
    }

  return (
    <div>
        <div className='top-component'>
              <div className='heading'>
                  <h1>IP Address Tracker</h1>
              </div>
              <div className='input-box'>
                  <input type="text" value={address} onChange={handelChange} name="ip-input" id="ip-input" placeholder='Search for any IP address or domain' autoFocus={ true } />
                  <button type='button' className='search-btn' onClick={handleClick}></button>
              </div>

              <div className='info-block'>
                  <div className='ip-info'>
                      <p className='info-head'>IP ADDRESS</p>
                      <h2 className='info-val'>{ ip }</h2>
                  </div>
                  <hr></hr>
                  <div className='loc-info'>
                      <p className='info-head'>LOCATION</p>
                      <h2 className='info-val'>{region}, { country }</h2>
                  </div>
                  <hr></hr>
                  <div className='zone-info'>
                      <p className='info-head'>TIMEZONE</p>
                      <h2 className='info-val'>UTC { zone }</h2>
                  </div>
                  <hr></hr>
                  <div className='isp-info'>
                      <p className='info-head'>ISP</p>
                      <h2 className='info-val'>{ isp }</h2>
                  </div>
              </div>
          </div>
          <div className='map-cont'>
          <MapContainer
              center={[lati, lang]}
              zoom={16}
            style={{zIndex: "0", width: "100%", minHeight: "100%", height:"100%"}}
          >
           <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <SetViewOnClick coords={[lati, lang]} />
              <Marker icon={icon} position={[lati, lang]}>
                  <Popup><p>Your IP Location</p></Popup>
              </Marker>
        </MapContainer>
          </div>
    </div>
  )
}

export default Base;
