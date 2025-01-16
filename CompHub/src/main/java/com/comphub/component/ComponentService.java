package com.comphub.component;

import com.comphub.common.PageResponse;
import com.comphub.component.category.Category;
import com.comphub.component.category.CategoryMapper;
import com.comphub.component.category.CategoryRepository;
import com.comphub.component.componentFile.ComponentFile;
import com.comphub.component.componentFile.ComponentFileMapper;
import com.comphub.component.dto.ComponentRequest;
import com.comphub.component.dto.ComponentResponse;
import com.comphub.component.dto.ComponentShowcase;
import com.comphub.component.userComponentVote.UserComponentVote;
import com.comphub.component.userComponentVote.UserComponentVoteRepository;
import com.comphub.exception.InvalidInputParametersException;
import com.comphub.exception.UnauthorizedAccessException;
import com.comphub.user.User;
import com.comphub.utils.Utils;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

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
        Set<Category> categories = categoryRepository.findByIdIn(componentRequest.categoriIds());
        Component component = componentMapper.toEntity(componentRequest, user);
        component.setCategories(categories);
        Component savedComponent = componentRepository.save(component);

        return componentMapper.toResponse(savedComponent, categoryMapper);
    }

    @Transactional(readOnly = true)
    public PageResponse<ComponentShowcase> getComponentsByUsername(
            int page,
            int size,
            String sortBy,
            boolean descending,
            boolean sortByUpvotes,
            String userName
    ){
        Pageable pageable;

        if (Component.SortableField.isValid(sortBy)) {
            pageable = validateAndReturnPageable(page, size, sortBy, descending);
            Page<Component> components = componentRepository.findAllByUserUsername(userName, pageable);

            return Utils.generatePageResponse(components, c -> componentMapper.toShowcase(c, categoryMapper));
        }

        Specification<Component> specification = Specification.where(
                ComponentSpecification.sortByVotes(sortByUpvotes)
        );

        pageable = PageRequest.of(page, size);

        Page<Component> components = componentRepository.findAll(specification, pageable);

        return Utils.generatePageResponse(components, c -> componentMapper.toShowcase(c, categoryMapper));
    }

    @Transactional(readOnly = true)
    public PageResponse<ComponentShowcase> getComponentsByCategories(
            int page,
            int size,
            String sortBy,
            boolean descending,
            Set<Long> categories
    ) {
        Pageable pageable = validateAndReturnPageable(page,size,sortBy,descending);
        Page<Component> components = componentRepository.findByCategoryIds(categories,categories.size(),pageable);

        return Utils.generatePageResponse(components,c -> componentMapper.toShowcase(c,categoryMapper));
    }

    @Transactional(readOnly = true)
    public ComponentResponse getComponentById(Long id) {
        Component component = componentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Component with id " + id + " not found"));

        return componentMapper.toResponse(component,categoryMapper,componentFileMapper);
    }

    public ComponentResponse copyComponentToUser(Long componentId, User user) {

        Component toCopy = componentRepository.findById(componentId)
                .orElseThrow(() -> new EntityNotFoundException("Component with id " + componentId + " not found"));

        Component copy = Component.builder()
                .description(toCopy.getDescription())
                .categories(
                        new HashSet<>(
                                toCopy.getCategories()
                        )
                )
                .user(user)
                .build();

        copy.setFiles(
                toCopy.getFiles().stream()
                        .map(file -> ComponentFile.builder()
                                .component(copy)
                                .filename(file.getFilename())
                                .fileContent(file.getFileContent())
                                .size(file.getSize())
                                .build())
                        .collect(Collectors.toList())
        );

        Set<String> userComponentNames = new HashSet<>(
                componentRepository.findComponentNamesByUsername(
                        user.getUsername()
                )
        );

        String baseName = toCopy.getName();
        String newName = baseName;
        int counter = 1;

        while (userComponentNames.contains(newName)) {
            newName = baseName + " (Copy " + counter + ")";
            counter++;
        }
        copy.setName(newName);


        Component savedComponent = componentRepository.save(copy);
        return componentMapper.toResponse(savedComponent,categoryMapper,componentFileMapper);
    }

    @Transactional(readOnly = true)
    public List<String> getUserComponentNames(String userName) {
        return new ArrayList<>(componentRepository.findComponentNamesByUsername(userName));
    }


    public void deleteComponent(Long componentId, User user) {
        verifyComponentAccess(componentId, user);

        componentRepository.deleteById(componentId);
    }

    public ComponentResponse updateComponent(Long componentId, ComponentRequest updateRequest, User user) {
        Component component = verifyComponentAccess(componentId, user);
        Set<String> names = componentRepository.findComponentNamesByUsername(user.getUsername());

        if (updateRequest.name() != null) {
            if (names.contains(updateRequest.name())) throw new InvalidInputParametersException("Component name already exists");
            component.setName(updateRequest.name());
        }
        if (updateRequest.categoriIds() != null) {
            component.setCategories(categoryRepository.findByIdIn(updateRequest.categoriIds()));
        }
        if (updateRequest.description() != null) {
            component.setDescription(updateRequest.description());
        }
        Component savedComponent = componentRepository.save(component);

        return componentMapper.toResponse(savedComponent,categoryMapper,componentFileMapper);
    }

    public void voteOnComponent(
            Long componentId,
            UserComponentVote.VoteType voteType,
            User user
    ) {
        Component component = componentRepository.findById(componentId)
                .orElseThrow(() -> new EntityNotFoundException("Component with id " + componentId + " was not found"));

        // Check if the user has already voted on this component
        Optional<UserComponentVote> existingVote = componentVoteRepository.findByUserAndComponent(user, component);

        if (existingVote.isPresent()) {
            UserComponentVote vote = existingVote.get();
            if (vote.getVoteType() == voteType) {
                throw new IllegalStateException("You have already " + voteType.name().toLowerCase() + "d this component");
            }

            // Update the vote type
            vote.setVoteType(voteType);
            componentVoteRepository.save(vote);
        } else {
            // Create a new vote
            var newVote = UserComponentVote.builder()
                    .voteType(voteType)
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

        if(!isAuthorizedUser(componentFound,user)) {
            throw new UnauthorizedAccessException("You do not have permission to delete this component. Please ensure you have the necessary rights.");
        }
        return componentFound;
    }

    private boolean isAuthorizedUser(Component component, User user) {
        return component.getUser() != null && Objects.equals(component.getUser().getId(), user.getId());
    }

    private Pageable validateAndReturnPageable(int page,int size, String sortBy, boolean descending) {
        if (page < 0 || size < 0) {
            throw new InvalidInputParametersException("Invalid input parameters: "
                    + "page must be >= 0, "
                    + "size must be >= 0, "
                    + "sortBy must be one of the valid fields");
        }
        Sort sort = Sort.by(sortBy);

        if(descending) sort = sort.descending();

        return PageRequest.of(page, size, sort);
    }


}
