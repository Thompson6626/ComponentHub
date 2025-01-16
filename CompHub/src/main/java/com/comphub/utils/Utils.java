package com.comphub.utils;

import com.comphub.common.PageResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

public class Utils {

    public static <T, R> PageResponse<R> generatePageResponse(
            Page<T> page,
            Function<T, R> mapper
    ){
        List<R> mapped = page.stream()
                .map(mapper)
                .collect(Collectors.toList());

        return PageResponse.<R>builder()
                .content(mapped)
                .number(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}
