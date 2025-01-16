package com.comphub.component.componentFile.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_EMPTY)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ComponentFileDto {

    private Long id;
    private String fileName;
    private Long fileSize;
    private byte[] content;
}
