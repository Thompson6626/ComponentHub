package com.comphub.component;

import com.comphub.component.category.CategoryMapper;
import com.comphub.component.componentFile.ComponentFileMapper;
import com.comphub.component.dto.ComponentRequest;
import com.comphub.component.dto.ComponentResponse;
import com.comphub.component.dto.ComponentShowcase;
import com.comphub.component.userComponentVote.UserComponentVote;
import com.comphub.user.User;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.stream.Collectors;

@Service
public class ComponentMapper {

    public Component toEntity(ComponentRequest request, User user){
        return Component.builder()
                .user(user)
                .name(request.name())
                .description(request.description())
                .build();
    }

    public ComponentShowcase toShowcase(Component component, CategoryMapper mapper){
        return new ComponentShowcase(
                component.getId(),
                component.getName(),
                component.getCategories().stream()
                        .map(mapper::toShowCase)
                        .collect(Collectors.toSet()),
                component.getUpdatedAt().toLocalDate(),
                component.getDescription()
        );
    }

    public ComponentResponse toResponse(Component component,CategoryMapper categoryMapper){
        return new ComponentResponse(
                component.getName(),
                component.getDescription(),
                component.getCategories().stream()
                        .map(categoryMapper::toResponse)
                        .collect(Collectors.toSet()),
                Collections.emptyList(),
                component.getCreatedAt(),
                component.getUpdatedAt(),
                countVotes(component, UserComponentVote.VoteType.UPVOTE),
                countVotes(component, UserComponentVote.VoteType.DOWNVOTE)
        );
    }
    public ComponentResponse toResponse(Component component, CategoryMapper categoryMapper, ComponentFileMapper fileMapper) {
        return new ComponentResponse(
                component.getName(),
                component.getDescription(),
                component.getCategories().stream()
                        .map(categoryMapper::toResponse)
                        .collect(Collectors.toSet()),
                component.getFiles().stream()
                        .map(fileMapper::toShowcase)
                        .collect(Collectors.toList()),
                component.getCreatedAt(),
                component.getUpdatedAt(),
                countVotes(component, UserComponentVote.VoteType.UPVOTE),
                countVotes(component, UserComponentVote.VoteType.DOWNVOTE)
                );
    }

    private long countVotes(Component component, UserComponentVote.VoteType voteType) {
        return component.getVotes().stream()
                .filter(v -> v.getVoteType().equals(voteType))
                .count();
    }
}
