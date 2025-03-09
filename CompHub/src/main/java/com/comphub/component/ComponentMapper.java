package com.comphub.component;

import com.comphub.component.category.CategoryMapper;
import com.comphub.component.componentFile.ComponentFileMapper;
import com.comphub.component.dto.ComponentRequest;
import com.comphub.component.dto.ComponentResponse;
import com.comphub.component.dto.ComponentShowcase;
import com.comphub.component.dto.Creator;
import com.comphub.component.userComponentVote.VoteType;
import com.comphub.user.User;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class ComponentMapper {

    public Component toEntity(ComponentRequest request, User user) {
        return Component.builder()
                .user(user)
                .name(request.name())
                .description(request.description())
                .build();
    }

    public ComponentShowcase toShowcase(Component component, CategoryMapper mapper) {
        final var owner = component.getUser();
        return ComponentShowcase.builder()
                .id(component.getId())
                .name(component.getName())
                .creator(Creator.builder()
                        .id(owner.getId())
                        .username(owner.getUsername())
                        .build())
                .categories(
                        component.getCategories().stream()
                                .map(mapper::toShowCase)
                                .collect(Collectors.toSet())
                )
                .createdAt(component.getCreatedAt().toLocalDate())
                .updatedAt(component.getUpdatedAt().toLocalDate())
                .description(component.getDescription())
                .build();
    }

    public ComponentResponse toResponse(Component component, CategoryMapper categoryMapper) {
        return ComponentResponse.builder()
                .id(component.getId())
                .name(component.getName())
                .description(component.getDescription())
                .creator(
                        Creator.builder()
                                .id(component.getUser().getId())
                                .username(component.getUser().getUsername())
                                .build()
                )
                .categories(
                        component.getCategories().stream()
                                .map(categoryMapper::toResponse)
                                .collect(Collectors.toSet())
                )
                .createdAt(component.getCreatedAt())
                .updatedAt(component.getUpdatedAt())
                .upVotes(countVotes(component, VoteType.UPVOTE))
                .downVotes(countVotes(component, VoteType.DOWNVOTE))
                .build();
    }

    public ComponentResponse toResponse(Component component, CategoryMapper categoryMapper, ComponentFileMapper fileMapper) {
        var response = toResponse(component, categoryMapper);
        if (component.getFile() != null) {
            response.setFile(
                    fileMapper.toSummary(component.getFile())
            );
        } else {
            response.setFile(null);
        }
        return response;
    }

    private long countVotes(Component component, VoteType voteType) {
        if (component.getVotes() != null) {
            return component.getVotes().stream()
                    .filter(v -> v.getVoteType().equals(voteType))
                    .count();
        }
        return 0;
    }
}
