package com.comphub.component;

import com.comphub.common.PageResponse;
import com.comphub.component.dto.ComponentRequest;
import com.comphub.component.dto.ComponentResponse;
import com.comphub.component.dto.ComponentShowcase;
import com.comphub.component.userComponentVote.UserComponentVote;
import com.comphub.user.User;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/components")
public class ComponentController {

    private final ComponentService componentService;

    @PostMapping
    public ResponseEntity<ComponentResponse> createComponent(
            @Valid @RequestBody ComponentRequest componentRequest,
            @AuthenticationPrincipal User user
    ) {
        var response = componentService.createComponent(componentRequest, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{componentId}")
    public ResponseEntity<ComponentResponse> getComponentById(
            @PathVariable("componentId") Long componentId
    ) {
        var response = componentService.getComponentById(componentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<PageResponse<ComponentShowcase>> getUserComponents(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            @RequestParam(name = "sortBy", defaultValue = "createdAt", required = false) String sortBy,
            @RequestParam(name = "descending", defaultValue = "true", required = false) boolean descending,
            @RequestParam(name = "sortByUpvotes", defaultValue = "false", required = false) boolean sortByUpvotes,
            @PathVariable String username
    ) {
        PageResponse<ComponentShowcase> showcase = componentService.getComponentsByUsername(page, size, sortBy, descending, sortByUpvotes, username);
        return ResponseEntity.ok(showcase);
    }

    // Get components by category
    @GetMapping("/categories")
    public ResponseEntity<PageResponse<ComponentShowcase>> getComponentsByCategories(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            @RequestParam(name = "sortBy", defaultValue = "createdAt", required = false) String sortBy,
            @RequestParam(name = "descending", defaultValue = "true", required = false) boolean descending,
            @RequestParam(name = "categories") Set<Long> categoryIds
    ) {
        PageResponse<ComponentShowcase> showcase = componentService.getComponentsByCategories(page, size, sortBy, descending, categoryIds);
        return ResponseEntity.ok(showcase);
    }

    @GetMapping("/user/{username}/comp-names")
    public ResponseEntity<List<String>> getUserComponentNames(
            @PathVariable String username
    ) {
        return ResponseEntity.ok(componentService.getUserComponentNames(username));
    }

    @PostMapping("/copy/{componentId}")
    public ResponseEntity<ComponentResponse> copyComponent(
            @PathVariable("componentId") Long componentId,
            @AuthenticationPrincipal User user
    ) {
        ComponentResponse response = componentService.copyComponentToUser(componentId, user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/vote/{componentId}")
    public ResponseEntity<Void> voteComponent(
            @PathVariable Long componentId,
            @RequestParam("voteType") UserComponentVote.VoteType voteType,
            @AuthenticationPrincipal User user
    ) {
        componentService.voteOnComponent(componentId, voteType, user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{componentId}")
    public ResponseEntity<ComponentResponse> updateComponent(
            @PathVariable("componentId") Long componentId,
            @RequestBody ComponentRequest updateRequest,
            @AuthenticationPrincipal User user
    ) {
        ComponentResponse response = componentService.updateComponent(componentId, updateRequest, user);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{componentId}")
    public ResponseEntity<Void> deleteComponent(
            @PathVariable("componentId") Long componentId,
            @AuthenticationPrincipal User user
    ) {
        componentService.deleteComponent(componentId, user);
        return ResponseEntity.noContent().build();
    }

}
