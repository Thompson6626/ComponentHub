package com.comphub.component;

import com.comphub.common.PageResponse;
import com.comphub.component.dto.ComponentQueryParams;
import com.comphub.component.dto.ComponentRequest;
import com.comphub.component.dto.ComponentResponse;
import com.comphub.component.dto.ComponentShowcase;
import com.comphub.component.userComponentVote.VoteRequest;
import com.comphub.user.User;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/components")
public class ComponentController {

    private final ComponentService componentService;

    @GetMapping
    public ResponseEntity<PageResponse<ComponentShowcase>> getAll(
            ComponentQueryParams queryParams
    ){
        var showcase = componentService.getAllComponents(queryParams);
        return ResponseEntity.ok(showcase);
    }

    @PostMapping
    public ResponseEntity<ComponentResponse> createComponent(
            @Valid @RequestBody ComponentRequest componentRequest,
            @AuthenticationPrincipal User user
    ) {
        var response = componentService.createComponent(componentRequest, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @GetMapping("/user/{username}/component/{componentName}")
    public ResponseEntity<ComponentResponse> getComponentByUsernameAndName(
            @PathVariable String username,
            @PathVariable String componentName
    ) {
        var response = componentService.getComponentByUsernameAndName(username,componentName);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{componentId}")
    public ResponseEntity<ComponentResponse> getComponentById(
            @PathVariable Long componentId
    ) {
        var response = componentService.getComponentById(componentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<ComponentShowcase>> searchComponent(
            ComponentQueryParams queryParams,
            @RequestParam(name = "q") String querySearch
    ){
        PageResponse<ComponentShowcase> showcase = componentService.getComponentsByQuery(queryParams ,querySearch);
        return ResponseEntity.ok(showcase);
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<PageResponse<ComponentShowcase>> getUserComponents(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "q", defaultValue = "") String querySearch,
            @PathVariable String username
    ) {
        PageResponse<ComponentShowcase> showcase = componentService.getComponentsByUsername(page, querySearch, username);
        return ResponseEntity.ok(showcase);
    }

    @GetMapping("/user/{userId}/names")
    public ResponseEntity<List<String>> getUserComponentNames(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(componentService.getUserComponentNames(userId));
    }

    @PostMapping("/vote/{componentId}")
    public ResponseEntity<Void> voteComponent(
            @PathVariable Long componentId,
            @RequestBody VoteRequest request,
            @AuthenticationPrincipal User user
    ) {
        componentService.voteOnComponent(componentId, request, user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{componentId}")
    public ResponseEntity<ComponentResponse> updateComponent(
            @PathVariable Long componentId,
            @RequestBody ComponentRequest updateRequest, // Without @Valid annotation
            @AuthenticationPrincipal User user
    ) {
        ComponentResponse response = componentService.updateComponent(componentId, updateRequest, user);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{componentId}")
    public ResponseEntity<Void> deleteComponent(
            @PathVariable Long componentId,
            @AuthenticationPrincipal User user
    ) {
        componentService.deleteComponent(componentId, user);
        return ResponseEntity.noContent().build();
    }

}
