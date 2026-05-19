package com.rabbiter.em.config;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.File;

import static org.junit.jupiter.api.Assertions.assertEquals;

class UploadStoragePropertiesTest {

    @Test
    void resolvesConfiguredUploadRootIntoFileAndAvatarDirectories() {
        UploadStorageProperties properties = new UploadStorageProperties();
        ReflectionTestUtils.setField(properties, "uploadDir", "/opt/project-fyp-mall/uploads");

        assertEquals(
                "/opt/project-fyp-mall/uploads" + File.separator + "file" + File.separator,
                properties.getFileFolderPath()
        );
        assertEquals(
                "/opt/project-fyp-mall/uploads" + File.separator + "avatar" + File.separator,
                properties.getAvatarFolderPath()
        );
    }
}
