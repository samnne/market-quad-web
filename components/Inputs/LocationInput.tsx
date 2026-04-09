"use client";
import { usePlaceKit } from "@placekit/autocomplete-react";
import "@placekit/autocomplete-js/dist/placekit-autocomplete.css";
import { useCallback, useEffect, useState } from "react";
import { PKAClient } from "@placekit/autocomplete-js";
import placekit, { PKResult } from "@placekit/client-js";
const API_KEY = process.env.NEXT_PUBLIC_PLACEKIT_API_KEY || "";
const pk = placekit(API_KEY);
const inputClass =
  "w-full bg-pill border border-[#c8f5e8] rounded-xl px-3.5 py-2.5 text-sm text-[#011d16] placeholder:text-[#6b9e8a] outline-none focus:border-[#17f3b5] transition-colors";

const LocationInput = (props: { llSetter: Function; ll: number[] }) => {
  const { target, client, state } = usePlaceKit(API_KEY, {
    maxResults: 3,
    timeout: 1000,
  });
 
  const [value, setValue] = useState("");
  const handleResultsPick = useCallback((item: PKResult) => {
    const cordsString = item.coordinates;
    const cordsStringArr = cordsString.split(",");
    const cleanedStringArr = cordsStringArr.map((str) => str.trim());
    const numberArr = cleanedStringArr.map((str) => Number.parseFloat(str));
    return numberArr;
  }, []);
  const handleSearch = async () => {
    if (value.length < 3) return;
    const results = await pk.search(value, {
      maxResults: 2,
    });
  

    if (results.results.length > 0) {
      const [lat, lng] = handleResultsPick(results.results[0]);
      props.llSetter([lat, lng]);
      console.log(`Lat: ${lat}, Lng: ${lng}`);
    }
  };
  async function mountEdit() {
    const results = await pk.reverse({
      maxResults: 2,
      coordinates: `${props.ll[0]},${props.ll[1]}`,
      language: "en",
    });
    console.log(results, props.ll);
    
    if (results.results.length > 0) {
      const [lat, lng] = handleResultsPick(results.results[0]);
      props.llSetter([lat, lng]);
      console.log(`Lat: ${lat}, Lng: ${lng}`);
    }
  }
  useEffect(() => {
    mountEdit()
  }, []);
  useEffect(() => {
    handleSearch();
  }, [value]);
  return (
    <input
      type="text"
      value={value}
      className={inputClass}
      onChange={(e) => setValue(e.target.value)}
      placeholder="V8<X>..."
    />
    // <PlaceKit
    //   onResults={(query, results) => {
    //     console.log(query, results, "hey");
    //   }}
    //   options={{
    //     maxResults: 5,
    //     timeout: 2000,
    //   }}
    //   apiKey={process.env.NEXT_PUBLIC_PLACEKIT_API_KEY || ""}
    // />
  );
};

export default LocationInput;
