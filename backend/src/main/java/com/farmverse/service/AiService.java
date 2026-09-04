package com.farmverse.service;

import com.farmverse.model.Farm;
import com.farmverse.repository.FarmRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    private final FarmRepository farmRepository;
    private final String apiKey;

    private final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();

    // Constructor Injection for Repository and API Key from application.properties
    public AiService(FarmRepository farmRepository, @Value("${groq.api.key:}") String apiKey) {
        this.farmRepository = farmRepository;
        this.apiKey = apiKey;
    }

    public String getAiResponse(String userMessage) {

        String cleanApiKey = (apiKey != null && !apiKey.trim().isEmpty()) 
                ? apiKey.trim().replace("\"", "") 
                : "";

        if (cleanApiKey.isEmpty()) {
            return "<div>Error: Groq API Key application.properties me set nahi hai!</div>";
        }

        try {
            StringBuilder dbContext = new StringBuilder();
            String lowerUserMsg = (userMessage != null) ? userMessage.toLowerCase() : "";

            try {
                List<Farm> allFarms = farmRepository.findAll();
                
                if (allFarms != null && !allFarms.isEmpty()) {
                    for (Farm farm : allFarms) {
                        boolean matchesName = farm.getName() != null && lowerUserMsg.contains(farm.getName().toLowerCase());
                        boolean matchesCrop = farm.getCrop() != null && lowerUserMsg.contains(farm.getCrop().toLowerCase());

                        if (matchesName || matchesCrop) {
                            dbContext.append("Farm: ").append(farm.getName())
                                     .append(" | Crop: ").append(farm.getCrop())
                                     .append(" | Moisture: ").append(farm.getMoisture()).append("%")
                                     .append(" | Pest Risk: ").append(farm.getPestRisk())
                                     .append(" | Yield: ").append(farm.getYieldEstimation()).append("\n");
                        }
                    }

                    if (dbContext.length() == 0) {
                        for (Farm farm : allFarms) {
                            dbContext.append("Farm: ").append(farm.getName() != null ? farm.getName() : "Unknown")
                                     .append(" (Crop: ").append(farm.getCrop() != null ? farm.getCrop() : "N/A")
                                     .append(", Moisture: ").append(farm.getMoisture()).append("%)\n");
                        }
                    }
                }
            } catch (Exception dbEx) {
                System.err.println("Database fetch failed in AI Service: " + dbEx.getMessage());
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + cleanApiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "llama3-8b-8192");
            requestBody.put("temperature", 0.2);
            requestBody.put("max_tokens", 400);

            List<Map<String, String>> messages = new ArrayList<>();

            Map<String, String> systemMsg = new HashMap<>();
            systemMsg.put("role", "system");
            systemMsg.put("content",
                "You are FarmVerse AI (Kisan Mitra), an accurate digital farming assistant.\n\n" +
                "STRICT INSTRUCTIONS:\n" +
                "1. Answer ONLY what the user specifically asked about.\n" +
                "2. Keep answers short, direct, and limited to 2-3 crisp lines or bullet points.\n" +
                "3. Speak in simple, friendly Hinglish.\n" +
                "4. Output strictly clean HTML wrapped inside a single <div> tag using <p> and <ul><li>.\n\n" +
                (dbContext.length() > 0 ? "AVAILABLE USER FARM DATA IN DATABASE:\n" + dbContext.toString() : "NO SPECIFIC FARM DATA FOUND.")
            );

            messages.add(systemMsg);

            Map<String, String> userMsg = new HashMap<>();
            userMsg.put("role", "user");
            userMsg.put("content", userMessage);
            messages.add(userMsg);

            requestBody.put("messages", messages);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(GROQ_API_URL, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<?> choices = (List<?>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<?, ?> firstChoice = (Map<?, ?>) choices.get(0);
                    Map<?, ?> message = (Map<?, ?>) firstChoice.get("message");
                    String content = (String) message.get("content");

                    return content.replaceAll("```html|```", "").trim();
                }
            }       

            return "<div>I can't understand what you say.</div>";

        } catch (Exception e) {
            System.err.println("Groq Exception Details: " + e.getMessage());
            e.printStackTrace();
            return "<div>Error: " + e.getMessage() + "</div>";
        }
    }
}