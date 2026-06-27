package com.rufeng.em.service;

import com.rufeng.em.config.UploadStorageProperties;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.File;

import static org.junit.jupiter.api.Assertions.assertTrue;

class FileServiceDownloadTest {

    @Test
    void downloadsBundledSeedFileWhenUploadFolderDoesNotContainFile() {
        UploadStorageProperties properties = new UploadStorageProperties();
        ReflectionTestUtils.setField(
                properties,
                "uploadDir",
                System.getProperty("java.io.tmpdir") + File.separator + "missing-mall-upload-root"
        );

        FileService fileService = new FileService();
        ReflectionTestUtils.setField(fileService, "uploadStorageProperties", properties);

        MockHttpServletResponse response = new MockHttpServletResponse();
        fileService.download("15cb9fc604984dfa97e0e968eb1d196d.jpg", response);

        assertTrue(response.getContentAsByteArray().length > 0);
    }
}
