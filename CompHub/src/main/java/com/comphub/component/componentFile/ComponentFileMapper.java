package com.comphub.component.componentFile;

import com.comphub.component.componentFile.dto.ComponentFileDto;
import org.springframework.stereotype.Service;

@Service
public class ComponentFileMapper {

    public ComponentFileDto toShowcase(ComponentFile file){
        return ComponentFileDto.builder()
                .id(file.getId())
                .fileName(file.getFilename())
                .build();
    }

    public ComponentFileDto toResponse(ComponentFile file) {
        return ComponentFileDto.builder()
                .fileName(file.getFilename())
                .content(file.getFileContent())
                .fileSize(file.getSize())
                .build();
    }
}
