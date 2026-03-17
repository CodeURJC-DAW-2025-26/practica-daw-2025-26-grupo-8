package com.aparizzio.pizzeria.controller;

import java.io.IOException;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aparizzio.pizzeria.dto.ImageDTO;
import com.aparizzio.pizzeria.dto.ImageMapper;
import com.aparizzio.pizzeria.service.ImageService;

@RestController
@RequestMapping("/api/v1/images")
public class ImageRestController {

    @Autowired
    private ImageService imageService;

    @Autowired
    private ImageMapper mapper;

    // GET basic image info (JSON)
    @GetMapping("/{id}")
    public ImageDTO getImage(@PathVariable long id) {
        return mapper.toDTO(imageService.getImage(id));
    }

    // GET the actual binary image file
    @GetMapping("/{id}/media")
    public ResponseEntity<Object> getImageFile(@PathVariable long id)
            throws SQLException, IOException {

        Resource imageFile = imageService.getImageFile(id);

        // Try to guess the media type based on the file, fallback to JPEG
        MediaType mediaType = MediaTypeFactory
                .getMediaType(imageFile)
                .orElse(MediaType.IMAGE_JPEG);

        return ResponseEntity
                .ok()
                .contentType(mediaType)
                .body(imageFile);
    }

    // PUT to replace the existing binary image file
    @PutMapping("/{id}/media")
    public ResponseEntity<Object> replaceImageFile(@PathVariable long id,
            @RequestParam MultipartFile imageFile) throws IOException {

        // Uses the existing service to update the Blob in the DB
        imageService.replaceImageFile(id, imageFile.getInputStream());

        // Returns 204 No Content as expected for successful PUT updates
        return ResponseEntity.noContent().build();
    }
}