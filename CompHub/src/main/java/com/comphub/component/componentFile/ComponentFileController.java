package com.comphub.component.componentFile;

import com.comphub.component.componentFile.dto.ComponentFileDto;
import com.comphub.user.User;
import lombok.RequiredArgsConstructor;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/components/files")
@RequiredArgsConstructor
public class ComponentFileController {

    private final ComponentFileService componentFileService;

    @GetMapping("/{fileId}")
    public ResponseEntity<ComponentFileDto> getComponentFile(
            @PathVariable("fileId") Long fileId
    ) {
        var response = componentFileService.getComponentFileById(fileId);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ComponentFileDto> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("componentId") Long componentId,
            @AuthenticationPrincipal User user
    ) {
        var response = componentFileService.uploadFileToComponent(file, componentId, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{fileId}")
    public ResponseEntity<ComponentFileDto> updateComponentFile(
            @RequestParam("file") MultipartFile file,
            @PathVariable("fileId") Long fileId,
            @AuthenticationPrincipal User user
    ){
        var response = componentFileService.updateFile(file,fileId,user);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteComponentFile(
            @PathVariable("fileId") Long fileId,
            @AuthenticationPrincipal User user
    ) {
        componentFileService.deleteComponent(fileId, user);
        return ResponseEntity.noContent().build();
    }
}
