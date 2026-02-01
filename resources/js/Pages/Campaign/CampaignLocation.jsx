import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { Input } from "@/Components/ui/input";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet/dist/leaflet.css';
import { Label } from "@/Components/ui/label";

const CampaignLocation = ({ open, setCampaignLocation, onClose, locationData }) => {
    const [address, setAddress] = useState("");
    const [coords, setCoords] = useState({ lat:-6.200284252332842, lng: 106.78547062682863});

    // if locationData exists, set initial location and coords
    useEffect(() => {
        if(locationData != null){
            setLocation(locationData)
            setCoords({lat: locationData.lat, lng: locationData.lon})
        }
    }, [locationData])

    // location picker search bar
function SearchBar() {
    const map = useMap();
    useEffect(() => {
        const provider = new OpenStreetMapProvider();
        const searchControl = new GeoSearchControl({
            provider,
            style: "bar",
            showMarker: true,
            showPopup: false,
            autoClose: true,
            retainZoomLevel: false,
            searchLabel: "Search for location...",
            keepResult: false,
        });

        map.addControl(searchControl);

        return () => {
            map.removeControl(searchControl);
        };

    }, [map]);

    return null;
}

    const [location, setLocation] = useState({
        lat:0,
        lon:0,
        address: "",
        city_block: "", // rw
        village: "", // kelurahan
        suburb: "", // kecamatan
        city: "",
        region: "", // provinsi
        postcode: "",
        country: "",
    });

    const API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY

    function SearchLocation() {
        const map = useMap();
        useEffect(() => {
            map.on("geosearch/showlocation", (result) => {
                if (result.location != null || result.location != undefined) {
                    const { y, x } = result.location;
                    setCoords({ lat: y, lng: x });
                } else {
                    console.warn("returned undefined data!");
                }
            });

        }, [map, setCoords]);
        return null;
    }

     useEffect(() => {
         if (!coords.lat || !coords.lng) return;

         const getLocation = async () => {
             setLocation({});
             const strUrl = `https://us1.locationiq.com/v1/reverse?key=${API_KEY}&lat=${coords.lat}&lon=${coords.lng}&format=json&addressdetails=1`;
             const result = await fetch(strUrl);
             const data = await result.json();
             setAddress(data.display_name);
             setLocation(data.address);
         };
         const controller = new AbortController();
         const delayDebounce = setTimeout(async () => {
             getLocation();
         }, 500);

         return () => {
             clearTimeout(delayDebounce);
             controller.abort();
         };
     }, [coords]);

    const markerIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    const LocationMarker = ({ setCoords }) => {
        useMapEvents({
            click(e) {
                setCoords(e.latlng)
            },
        });
        return null;
    };


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="min-w-4xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-purple-700">
                        Choose your Business Location
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                <div className="flex flex-row gap-6 mt-4 h-[400px]">
                    <div className="flex flex-col w-1/2 h-full gap-4">
                        <div className="rounded overflow-hidden border h-full">
                            <MapContainer
                                center={[coords.lat, coords.lng]}
                                zoom={13}
                                style={{ height: "450px", width: "100%" }}
                            >
                                <TileLayer
                                    attribution="© ToGather"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker
                                    position={[coords.lat, coords.lng]}
                                    icon={markerIcon}
                                />
                                <LocationMarker setCoords={setCoords} />
                                <SearchLocation />
                                <SearchBar />
                            </MapContainer>
                        </div>
                        <div className="flex text-center  p-2 border-1 rounded">
                            <p className="dark:text-gray-100 text-sm">{address.split(",").slice(0, 6).join(",").trim() }</p>
                        </div>
                    </div>

                    <div className="flex flex-col w-1/2 justify-between">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-row gap-4">
                                <div className="grid w-full max-w-sm items-center gap-2">
                                    <Label className="dark:text-gray-100" htmlFor="cb">City Block</Label>
                                    <Input
                                        type="cb"
                                        placeholder={"enter city block"}
                                        value={location.city_block ?? ""}
                                        onChange={(e) =>
                                            setLocation(prev => ({
                                                ...prev,
                                                city_block: e.target.value,
                                            }))}
                                    />
                                </div>
                                <div className="grid w-full max-w-sm items-center gap-2">
                                    <Label className="dark:text-gray-100" htmlFor="vl">Village</Label>
                                    <Input
                                        type="vl"
                                        placeholder={"enter city block"}
                                        value={location.village ?? ""}
                                        onChange={(e) =>
                                            setLocation(prev => ({
                                                ...prev,
                                                village: e.target.value,
                                            }))}
                                    />
                                </div>
                            </div>
                            <div className="grid w-full items-center gap-2">
                                <Label className="dark:text-gray-100" htmlFor="sb">Suburb</Label>
                                <Input
                                className={"w-full"}
                                    type="sb"
                                    placeholder={"enter suburb"}
                                    value={location.suburb ?? ""}
                                    onChange={(e) =>
                                            setLocation(prev => ({
                                                ...prev,
                                                suburb: e.target.value,
                                            }))}
                                />
                            </div>
                            <div className="grid w-full items-center gap-2">
                                <Label className="dark:text-gray-100" htmlFor="ct">City</Label>
                                <Input
                                    type="ct"
                                    placeholder={"enter city"}
                                    value={location.city ?? ""}
                                    onChange={(e) =>
                                            setLocation(prev => ({
                                                ...prev,
                                                city: e.target.value,
                                            }))}
                                />
                            </div>

                            <div className="flex flex-row gap-4">
                                <div className="grid w-full items-center gap-3">
                                    <Label className="dark:text-gray-100" htmlFor="rg">Region</Label>
                                    <Input
                                        type="rg"
                                        placeholder={"enter region"}
                                        value={location.region ?? ""}
                                        onChange={(e) =>
                                            setLocation(prev => ({
                                                ...prev,
                                                region: e.target.value,
                                            }))}
                                    />
                                </div>
                                <div className="grid w-full max-w-sm items-center gap-3">
                                    <Label className="dark:text-gray-100" htmlFor="pc">Postal Code</Label>
                                    <Input
                                        type="pc"
                                        placeholder={"enter region"}
                                        value={location.postcode ?? ""}
                                        onChange={(e) =>
                                            setLocation(prev => ({
                                                ...prev,
                                                postcode: e.target.value,
                                            }))}
                                    />
                                </div>
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-3">
                                <Label className="dark:text-gray-100" htmlFor="rg">Country</Label>
                                <Input
                                    type="rg"
                                    placeholder={"enter region"}
                                    value={location.country}
                                    onChange={(e) =>
                                            setLocation(prev => ({
                                                ...prev,
                                                country: e.target.value,
                                            }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={() => setCampaignLocation({...location, lat: coords.lat, lon: coords.lng}, address)}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CampaignLocation;
