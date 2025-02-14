package com.comphub.component.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ComponentQueryParams {

    private Integer page = 0;
    private Integer size = 12;
    private String sortBy = "upVotes";
    private String order = "desc";
    private Set<String> categories = new HashSet<>();



}
