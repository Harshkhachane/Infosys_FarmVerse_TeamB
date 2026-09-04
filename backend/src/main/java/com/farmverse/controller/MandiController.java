package com.farmverse.controller;

import com.farmverse.service.MandiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/mandi")
@CrossOrigin(origins = "*")
public class MandiController {

    @Autowired
    private MandiService mandiService;

    @GetMapping
    public Map<String, Object> getMandiPrices(
            @RequestParam(defaultValue = "Gujarat") String state,
            @RequestParam(required = false) String search) {
        return mandiService.getLiveMandiData(state, search);
    }
}