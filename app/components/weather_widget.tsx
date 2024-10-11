"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardHeader, CardTitle,CardDescription,CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

interface weatherData {
    temperature: number;
    description: string;
    location: string;
    unit: string;
}

export default function weatherwidget(){
    const [location, setLocation] = useState<string>("");
    const [weather, setweather] = useState<weatherData | null>(null);
    const [error, seterror] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearch = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedLocation = location.trim();
        if(trimmedLocation === ""){
            seterror("Please Enter a Valid Location.");
            setweather(null);
            return;
        }
        setIsLoading(true);
        seterror(null);

        try{
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
            );
            if(!response.ok){
                throw new Error("city not found.");
            }
            const data = await response.json();
            const weatherData: weatherData = {
                temperature: data.current.temp_c,
                description: data.current.condition.text,
                unit: "C",
                location: ""
            };
            setweather(weatherData);
        }catch(error){
            seterror("city not found plz try again.");
            setweather(null);
        }finally{
            setIsLoading(false);
        }
    };
    function getTemperatureMessage(temperature: number, unit: string): string{
        if(unit === "C"){
            if(temperature < 0){
                return`It's freezing at ${temperature}°C! Bundle up!` ;
            }else if (temperature <10){
                return `It's quite cold at ${temperature}°C. wear warm cloths.`;
            }else if (temperature <20){
                return `The temperature is ${temperature}°C. confortable for a light jacket`;
            }else if (temperature < 30){
                return `It's hot at ${temperature}°C. enjoy tha nice weather!`;
            }else {
                return `It's hot at ${temperature}°C. stay hydrated!`;
            }
        }else {
            return`${temperature}°${unit}`;
        }
    }

 function getweatherMessage (description: string):string{
    switch (description.toLocaleLowerCase()){
        case "sunny":
            return "It's a beautyful sunny day!";
        case "Partly cloudy":
            return "Expect some clouds and sunshine.";
        case "cloudly":
            return "It's cloudy today.";
        case "overcast ":
            return "Tha skay is overcast.";
        case "rain":
            return "Don't forget your umbrella! It's raining.";
        case "thunderstorm":
            return "Thunderstorms are expected today.";
        case "snow":
            return "Bundle up! It's snowing.";
        case "mist":
             return "It's a misty outside.";
        case "fog":
            return "It's a foggy! Be carefull.";
        default:
            return description;
    }
 }

 function getLocationMessage (location:string):string{
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 18 || currentHour <6;
    return `${location} ${isNight ? "at Night": "During tha day"}`;
 }
 return (
    <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-md mx-auto text-center">
            <CardHeader>
                <CardTitle> weather app</CardTitle>
                <CardDescription>search for tha current weather conditions in your city.</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input
                type= "text"
                placeholder = "Enter a city name"
                value = {location}
                onChange={(e) => setLocation(e.target.value)}
                />
                <Button type= "submit" disabled={isLoading}>
                    {isLoading ? "loading..." : "search"}
                </Button>
            </form>
            {error && <div className="mt-4 text-red-500">{error}</div>}
            {weather && (
                <div className="mt-4 grid gap-2">
                    <div className="flex items-center gap-2">
                        <ThermometerIcon className="w-6 h-6" />
                        {getTemperatureMessage(weather.temperature, weather.unit)}
                    </div>
                    <div className="flex items-center gap-2">
                        <CloudIcon className="w-6 h-6" />
                        {getweatherMessage(weather.description)}
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPinIcon className="w-6 h-6" />
                        {getLocationMessage(weather.location)}
                    </div>
                </div>
            )}
            </CardContent>
        </Card>
    </div>
 )
}