package com.farmverse.controller;

import com.farmverse.dto.DTOChatRequest;
import com.farmverse.dto.DTOChatResponse;
import com.farmverse.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final AiService aiService;

    // Constructor Injection
    public ChatController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping
    public ResponseEntity<DTOChatResponse> handleChat(@RequestBody DTOChatRequest request) {
        if (request == null || request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new DTOChatResponse("<div>Message required</div>"));
        }
        
        String aiReply = this.aiService.getAiResponse(request.getMessage());
        return ResponseEntity.ok(new DTOChatResponse(aiReply));
    }
}