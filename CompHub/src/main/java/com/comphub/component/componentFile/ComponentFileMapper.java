package com.comphub.component.componentFile;

import com.comphub.component.Component;
import com.comphub.component.componentFile.dto.ComponentFileResponse;
import com.comphub.component.componentFile.dto.ComponentFileSummary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ComponentFileMapper {

    public ComponentFileResponse toResponse(ComponentFile file) {
        return ComponentFileResponse.builder()
                .id(file.getId())
                .fileName(file.getFilename())
                .content(file.getFileContent())
                .size(file.getSize())
                .build();
    }

    public ComponentFileSummary toSummary(ComponentFile file) {
        return ComponentFileSummary.builder()
                .id(file.getId())
                .build();
    }

    public ComponentFile toEntity(MultipartFile file, Component component) throws IOException {
        return ComponentFile.builder()
                .filename(file.getOriginalFilename())
                .size(file.getSize())
                .fileContent(file.getBytes())
                .component(component)
                .build();
    }

}
