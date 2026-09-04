package com.farmverse.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class MandiService {

    // 1. Apni generated API key yahan double quotes ke andar paste karo
    private static final String API_KEY = "579b464db66ec23bdd000001355eebdf75bd41e663da095bdc19668f";
    
    private static final String GOVT_API_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> getLiveMandiData(String state, String search) {
        Map<String, Object> responseMap = new HashMap<>();
        List<Map<String, Object>> resultList = new ArrayList<>();

        try {
            String url = GOVT_API_URL + "?api-key=" + API_KEY + "&format=json&limit=500";
            
            if (state != null && !state.trim().isEmpty()) {
                url += "&filters[state]=" + state.trim();
            }

            String rawJsonResponse = restTemplate.getForObject(url, String.class);
            JsonNode rootNode = objectMapper.readTree(rawJsonResponse);
            JsonNode recordsArray = rootNode.path("records");

            if (recordsArray.isArray()) {
                String targetQuery = (search != null) ? search.trim().toLowerCase() : "";

                for (JsonNode node : recordsArray) {
                    String commodity = node.path("commodity").asText("").toLowerCase();
                    String market = node.path("market").asText("").toLowerCase();

                    if (targetQuery.isEmpty() || commodity.contains(targetQuery) || market.contains(targetQuery)) {
                        Map<String, Object> recordMap = objectMapper.convertValue(node, Map.class);
                        resultList.add(recordMap);
                    }
                }
            }

            responseMap.put("status", "success");
            responseMap.put("records", resultList);

        } catch (Exception e) {
            e.printStackTrace();
            responseMap.put("status", "error");
            responseMap.put("records", Collections.emptyList());
        }

        return responseMap;
    }
}