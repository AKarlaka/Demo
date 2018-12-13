package com.choice.notebook;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.awt.*;

@Configuration
@EnableSwagger2
public class Swagger2 {
    @Bean
    public Docket createRestApi(){
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()

                .apis(RequestHandlerSelectors.basePackage("com.choice.notebook.controller"))
                .paths(PathSelectors.any())
                .build();
    }

    private ApiInfo apiInfo() {
        Contact contact = new Contact("WK","http://localhost:8080","1169519360@qq.com");
        return new ApiInfoBuilder()
                .title("笔记管理工具")
                .description("记录每天精彩的故事...")
                .termsOfServiceUrl("http://www.baidu.com")
                .contact(contact)
                .version("1.0")
                .build();
    }
}
