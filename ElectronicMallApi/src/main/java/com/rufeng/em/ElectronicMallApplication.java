package com.rufeng.em;

import com.rufeng.em.utils.PathUtils;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@MapperScan("com.rufeng.em.mapper")
@SpringBootApplication
public class ElectronicMallApplication {

    public static void main(String[] args) {
        System.out.println("Project Path: " + PathUtils.getClassLoadRootPath());
        SpringApplication.run(ElectronicMallApplication.class, args);
    }

}
