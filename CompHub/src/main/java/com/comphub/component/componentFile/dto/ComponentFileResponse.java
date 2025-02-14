package com.comphub.component.componentFile.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ComponentFileResponse {

    private Long id;
    private String fileName;
    private byte[] content;
    private Long size;

}
