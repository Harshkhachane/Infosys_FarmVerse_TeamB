package com.farmverse.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class WeatherService {

    @Value("${weather.api.base-url:https://api.open-meteo.com/v1/forecast}")
    private String baseUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public WeatherService() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(8000);
        factory.setReadTimeout(8000);
        this.restTemplate = new RestTemplate(factory);
        this.objectMapper = new ObjectMapper();
    }

    public String getWeatherDataByCoordinates(double latitude, double longitude, String resolvedName) throws Exception {
    String url = String.format(
        Locale.US,
        "https://api.open-meteo.com/v1/forecast?latitude=%.4f&longitude=%.4f&current_weather=true&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,weathercode&timezone=auto",
        latitude, longitude
    );

    String rawJson = restTemplate.getForObject(url, String.class);
    ObjectNode jsonNode = (ObjectNode) objectMapper.readTree(rawJson);
    jsonNode.put("resolvedCityName", resolvedName != null ? resolvedName : "NAGPUR");

    return objectMapper.writeValueAsString(jsonNode);
}
    public String getWeatherDataByCity(String cityName) throws Exception {
        // Fallback to default city if location param is null/empty
        if (cityName == null || cityName.trim().isEmpty()) {
            cityName = "Nagpur";
        }

        String cleanedCity = cityName.trim();
        String encodedCity = URLEncoder.encode(cleanedCity, StandardCharsets.UTF_8);
        
        String geoUrl = "https://geocoding-api.open-meteo.com/v1/search?name=" + encodedCity + "&count=5&countrycode=IN&language=en&format=json";
        Map<?, ?> geoResponse = restTemplate.getForObject(geoUrl, Map.class);

        if (geoResponse != null && geoResponse.containsKey("results")) {
            List<?> results = (List<?>) geoResponse.get("results");
            if (results != null && !results.isEmpty()) {
                Map<?, ?> firstResult = (Map<?, ?>) results.get(0);
                String officialName = firstResult.get("name") != null ? firstResult.get("name").toString() : "";

                // Calculate exact similarity percentage (>= 80% requirement)
                double matchPercentage = calculateSimilarity(cleanedCity, officialName);
                if (matchPercentage < 0.80) {
                    throw new IllegalArgumentException("Location '" + cityName + "' is invalid or not found.");
                }

                double lat = Double.parseDouble(firstResult.get("latitude").toString());
                double lon = Double.parseDouble(firstResult.get("longitude").toString());

                return getWeatherDataByCoordinates(lat, lon, officialName);
            }
        }

        throw new IllegalArgumentException("Location '" + cityName + "' not found.");
    }

    // Levenshtein Distance similarity calculation for 80% threshold matching
    private double calculateSimilarity(String s1, String s2) {
        String str1 = s1.toLowerCase().trim();
        String str2 = s2.toLowerCase().trim();

        if (str1.equals(str2)) return 1.0;
        if (str2.startsWith(str1) || str1.startsWith(str2)) return 0.9;

        int distance = computeLevenshteinDistance(str1, str2);
        int maxLength = Math.max(str1.length(), str2.length());

        if (maxLength == 0) return 1.0;
        return 1.0 - ((double) distance / maxLength);
    }

    private int computeLevenshteinDistance(String lhs, String rhs) {
        int[] costs = new int[rhs.length() + 1];
        for (int j = 0; j <= rhs.length(); j++) costs[j] = j;

        for (int i = 1; i <= lhs.length(); i++) {
            costs[0] = i;
            int nw = i - 1;
            for (int j = 1; j <= rhs.length(); j++) {
                int cj = Math.min(1 + Math.min(costs[j], costs[j - 1]), 
                        lhs.charAt(i - 1) == rhs.charAt(j - 1) ? nw : nw + 1);
                nw = costs[j];
                costs[j] = cj;
            }
        }
        return costs[rhs.length()];
    }
}