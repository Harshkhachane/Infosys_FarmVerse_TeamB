package com.farmverse.dto;

public class DTOChatResponse {
    private String response;

    public DTOChatResponse() {}

    public DTOChatResponse(String response) {
        this.response = response;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }
}