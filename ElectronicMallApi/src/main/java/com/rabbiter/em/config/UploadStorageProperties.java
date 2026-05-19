package com.rabbiter.em.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.File;
import java.nio.file.Paths;

@Component
public class UploadStorageProperties {
    @Value("${mall.upload-dir:}")
    private String uploadDir;

    public String getFileFolderPath() {
        return resolveFolder("file");
    }

    public String getAvatarFolderPath() {
        return resolveFolder("avatar");
    }

    private String resolveFolder(String folderName) {
        String root = StringUtils.hasText(uploadDir)
                ? uploadDir
                : Paths.get(System.getProperty("user.dir"), "uploads").toString();
        return Paths.get(root, folderName).toString() + File.separator;
    }
}
