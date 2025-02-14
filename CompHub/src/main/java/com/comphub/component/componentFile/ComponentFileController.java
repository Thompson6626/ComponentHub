package com.comphub.component.componentFile;

import com.comphub.component.componentFile.dto.ComponentFileMetaData;
import com.comphub.component.componentFile.dto.ComponentFileResponse;
import com.comphub.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/components/files")
@RequiredArgsConstructor
@Slf4j
public class ComponentFileController {

    private final ComponentFileService componentFileService;

    @GetMapping("/{fileId}")
    public ResponseEntity<ComponentFileResponse> getComponentFile(
            @PathVariable Long fileId
    ) {
        var response = componentFileService.getComponentFileById(fileId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{componentId}")
    public ResponseEntity<ComponentFileResponse> uploadFile(
            @RequestPart("file") MultipartFile file,
            @PathVariable Long componentId,
            @AuthenticationPrincipal User user
    ) {
        log.info("Uploading file {}", file.getOriginalFilename());
        log.info("Id: {}", componentId);
        log.info("File size: {}", file.getSize());
        var response = componentFileService.uploadFileToComponent(file, componentId, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{fileId}")
    public ResponseEntity<ComponentFileResponse> updateComponentFile(
            @PathVariable Long fileId,
            @RequestPart("file") MultipartFile file,
            @AuthenticationPrincipal User user
    ){
        var response = componentFileService.updateFile(file,fileId,user);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteComponentFile(
            @PathVariable Long fileId,
            @AuthenticationPrincipal User user
    ) {
        componentFileService.deleteFile(fileId, user);
        return ResponseEntity.noContent().build();
    }
}
