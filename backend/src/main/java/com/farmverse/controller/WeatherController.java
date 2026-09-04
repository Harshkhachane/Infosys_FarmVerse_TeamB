package com.farmverse.controller;

import com.farmverse.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "*") // Allows React frontend connection
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getWeather(@RequestParam(value = "location", required = false) String location) {
        try {
            // Weather Data fetch request (Defaults to Nagpur if location is null/empty)
            String weatherData = weatherService.getWeatherDataByCity(location);
            return ResponseEntity.ok(weatherData);

        } catch (IllegalArgumentException e) {
            // Returns 404 when Levenshtein distance < 80% (e.g. typos, "hi", "hello")
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");

        } catch (Exception e) {
            // Generic exception handling for API connection timeouts
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Unable to fetch weather data right now.\"}");
        }
    }
}