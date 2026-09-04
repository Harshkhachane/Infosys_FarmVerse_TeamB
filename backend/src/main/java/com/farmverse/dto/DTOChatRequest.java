package com.farmverse.dto;

public class DTOChatRequest {
    private String message;

    public DTOChatRequest() {}

    public DTOChatRequest(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}