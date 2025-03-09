package com.comphub.component.componentFile;

import com.comphub.component.Component;
import com.comphub.component.ComponentRepository;
import com.comphub.component.componentFile.dto.ComponentFileResponse;
import com.comphub.exception.FileProcessingException;
import com.comphub.exception.UnauthorizedAccessException;
import com.comphub.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
public class ComponentFileService {

    private final ComponentRepository componentRepository;
    private final ComponentFileRepository componentFileRepository;
    private final ComponentFileMapper componentFileMapper;

    public ComponentFileResponse getComponentFileById(Long id) {
        ComponentFile file = componentFileRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("File with id " + id + " not found"));

        return componentFileMapper.toResponse(file);
    }

    public ComponentFileResponse uploadFileToComponent(MultipartFile file, Long componentId, User user) {
        validateFile(file);

        Component component = componentRepository.findById(componentId)
                .orElseThrow(() -> new EntityNotFoundException("Component with id " + componentId + " not found"));

        if (!isAuthorizedUser(component, user)) {
            throw new UnauthorizedAccessException("You do not have permission to upload files to this component. Please ensure you have the necessary rights.");
        }

        try {
            ComponentFile componentFile = componentFileMapper.toEntity(file, component);

            component.setFile(componentFile);

            //componentRepository.save(component);
            ComponentFile savedFile = componentFileRepository.save(componentFile);

            return componentFileMapper.toResponse(savedFile);
        } catch (IOException e) {
            throw new FileProcessingException("Failed to process the file: " + file.getOriginalFilename(), e);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty() || file.getSize() == 0) {
            throw new FileProcessingException("Cannot upload an empty file or folder.");
        }
    }

    private boolean isAuthorizedUser(Component component, User user) {
        return component.getUser() != null && Objects.equals(component.getUser().getId(), user.getId());
    }

    public void deleteFile(Long id, User user) {
        ComponentFile fileFound = componentFileRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Component with id " + id + " not found"));

        if (!Objects.equals(fileFound.getComponent().getUser().getId(), user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to delete this file. Please ensure you have the necessary rights.");
        }

        componentFileRepository.deleteById(id);
    }

    public ComponentFileResponse updateFile(MultipartFile file, Long fileId, User user) {
        ComponentFile fileFound = componentFileRepository.findById(fileId)
                .orElseThrow(() -> new EntityNotFoundException("ComponentFile with id " + fileId + " not found"));

        if (!Objects.equals(fileFound.getComponent().getUser().getId(), user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to update this file.");
        }

        validateFile(file);

        try {
            fileFound.setFilename(file.getOriginalFilename());
            fileFound.setSize(file.getSize());
            fileFound.setFileContent(file.getBytes());

            fileFound = componentFileRepository.save(fileFound);

            return componentFileMapper.toResponse(fileFound);
        } catch (IOException e) {
            throw new FileProcessingException("Failed to process the file: " + file.getOriginalFilename(), e);
        }
    }
}
