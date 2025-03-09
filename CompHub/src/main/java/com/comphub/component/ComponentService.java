package com.comphub.component;

import com.comphub.common.PageResponse;
import com.comphub.component.category.Category;
import com.comphub.component.category.CategoryMapper;
import com.comphub.component.category.CategoryRepository;
import com.comphub.component.componentFile.ComponentFileMapper;
import com.comphub.component.dto.ComponentQueryParams;
import com.comphub.component.dto.ComponentRequest;
import com.comphub.component.dto.ComponentResponse;
import com.comphub.component.dto.ComponentShowcase;
import com.comphub.component.userComponentVote.UserComponentVote;
import com.comphub.component.userComponentVote.UserComponentVoteRepository;
import com.comphub.component.userComponentVote.VoteRequest;
import com.comphub.exception.InvalidInputParametersException;
import com.comphub.exception.UnauthorizedAccessException;
import com.comphub.user.User;
import com.comphub.utils.Utils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
public class ComponentService {

    private final ComponentRepository componentRepository;
    private final CategoryRepository categoryRepository;
    private final UserComponentVoteRepository componentVoteRepository;
    private final ComponentMapper componentMapper;
    private final CategoryMapper categoryMapper;
    private final ComponentFileMapper componentFileMapper;

    public ComponentResponse createComponent(ComponentRequest componentRequest, User user) {
        Set<Category> categories = categoryRepository.findByIdIn(componentRequest.categoryIds());
        Component component = componentMapper.toEntity(componentRequest, user);
        component.setCategories(categories);
        Component savedComponent = componentRepository.save(component);

        return componentMapper.toResponse(savedComponent, categoryMapper);
    }

    @Transactional(readOnly = true)
    public PageResponse<ComponentShowcase> getAllComponents(ComponentQueryParams queryParams) {
        Pageable pageable = PageRequest.of(queryParams.getPage(), queryParams.getSize());
        Specification<Component> specification = ComponentSpecification.applySorting(queryParams.getSortBy(), queryParams.getOrder());

        if (queryParams.getCategories() != null && !queryParams.getCategories().isEmpty()) {
            specification = specification.and(ComponentSpecification.findByCategoryNames(queryParams.getCategories()));
        }

        Page<Component> components = componentRepository.findAll(specification, pageable);

        return Utils.generatePageResponse(components, c -> componentMapper.toShowcase(c, categoryMapper));
    }

    @Transactional(readOnly = true)
    public PageResponse<ComponentShowcase> getComponentsByUsername(
            int page,
            String query,
            String username
    ) {
        Pageable pageable = PageRequest.of(page, 24);
        Specification<Component> specification = Specification.where(ComponentSpecification.filterByUsername(username));
        specification = specification.and(ComponentSpecification.applySorting("updatedAt", "desc"));

        if (query != null && !query.isBlank()) {
            specification = specification.and(ComponentSpecification.searchByName(query));
        }

        Page<Component> components = componentRepository.findAll(specification, pageable);
        return Utils.generatePageResponse(components, c -> componentMapper.toShowcase(c, categoryMapper));
    }

    @Transactional(readOnly = true)
    public PageResponse<ComponentShowcase> getComponentsByQuery(
            ComponentQueryParams queryParams,
            String querySearch
    ) {
        Pageable pageable = PageRequest.of(queryParams.getPage(), queryParams.getSize());
        Specification<Component> specification = Specification.where(ComponentSpecification.searchByName(querySearch));

        specification = specification.and(ComponentSpecification.applySorting(queryParams.getSortBy(), queryParams.getOrder()));

        if (queryParams.getCategories() != null && !queryParams.getCategories().isEmpty()) {
            specification = specification.and(ComponentSpecification.findByCategoryNames(queryParams.getCategories()));
        }

        Page<Component> components = componentRepository.findAll(specification, pageable);
        return Utils.generatePageResponse(components, c -> componentMapper.toShowcase(c, categoryMapper));
    }

    @Transactional(readOnly = true)
    public ComponentResponse getComponentById(Long id) {
        Component component = componentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Component with id " + id + " not found"));

        return componentMapper.toResponse(component, categoryMapper, componentFileMapper);
    }

    @Transactional(readOnly = true)
    public List<String> getUserComponentNames(Long userId) {
        return new ArrayList<>(componentRepository.findComponentNamesByUserId(userId));
    }

    public void deleteComponent(Long componentId, User user) {
        verifyComponentAccess(componentId, user);

        componentRepository.deleteById(componentId);
    }

    public ComponentResponse updateComponent(Long componentId, ComponentRequest updateRequest, User user) {
        Component component = verifyComponentAccess(componentId, user);
        Set<String> names = componentRepository.findComponentNamesByUserId(user.getId());

        if (updateRequest.name() != null) {
            if (names.contains(updateRequest.name()))
                throw new InvalidInputParametersException("Component name already exists");
            component.setName(updateRequest.name());
        }
        if (updateRequest.categoryIds() != null) {
            component.setCategories(categoryRepository.findByIdIn(updateRequest.categoryIds()));
        }
        if (updateRequest.description() != null) {
            component.setDescription(updateRequest.description());
        }
        Component savedComponent = componentRepository.save(component);

        return componentMapper.toResponse(savedComponent, categoryMapper, componentFileMapper);
    }

    public void voteOnComponent(
            Long componentId,
            VoteRequest request,
            User user
    ) {
        Component component = componentRepository.findById(componentId)
                .orElseThrow(() -> new EntityNotFoundException("Component with id " + componentId + " was not found"));

        // Check if the user has already voted on this component
        Optional<UserComponentVote> existingVote = componentVoteRepository.findByUserAndComponent(user, component);

        if (existingVote.isPresent()) {
            UserComponentVote vote = existingVote.get();

            if (vote.getVoteType() == request.voteType()) {
                throw new IllegalStateException("You have already " + request.voteType().name().toLowerCase() + "d this component");
            }

            // Update the vote type
            vote.setVoteType(request.voteType());
            componentVoteRepository.save(vote);
        } else {
            // Create a new vote
            var newVote = UserComponentVote.builder()
                    .voteType(request.voteType())
                    .component(component)
                    .user(user)
                    .build();

            component.getVotes().add(newVote);
            user.getVotes().add(newVote);

            componentVoteRepository.save(newVote);
        }

    }

    private Component verifyComponentAccess(Long componentId, User user) {
        Component componentFound = componentRepository.findById(componentId)
                .orElseThrow(() -> new EntityNotFoundException("Component with id " + componentId + " was not found"));

        if (!isAuthorizedUser(componentFound, user)) {
            throw new UnauthorizedAccessException("You do not have permission to delete this component. Please ensure you have the necessary rights.");
        }
        return componentFound;
    }


    public ComponentResponse getComponentByUsernameAndName(String username, String componentName) {
        Component component = componentRepository.findByUserUsernameAndName(username, componentName)
                .orElseThrow(() -> new EntityNotFoundException("Component with name '" + componentName + "' not found for user '" + username + "'"));

        return componentMapper.toResponse(component, categoryMapper, componentFileMapper);
    }

    private boolean isAuthorizedUser(Component component, User user) {
        return component.getUser() != null && Objects.equals(component.getUser().getId(), user.getId());
    }

    public boolean userHasComponentName(String componentName, User user) {
        Set<String> userComponentNames = componentRepository.findComponentNamesByUserId(user.getId());
        return userComponentNames.contains(componentName);
    }
}
