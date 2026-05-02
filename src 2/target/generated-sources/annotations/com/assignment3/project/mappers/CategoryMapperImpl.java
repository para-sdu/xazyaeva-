package com.assignment3.project.mappers;

import com.assignment3.project.dto.responses.CategoryResponse;
import com.assignment3.project.entities.Category;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-03T01:05:40+0500",
    comments = "version: 1.6.2, compiler: javac, environment: Java 25.0.1 (Oracle Corporation)"
)
@Component
public class CategoryMapperImpl implements CategoryMapper {

    @Override
    public CategoryResponse toDto(Category entity) {
        if ( entity == null ) {
            return null;
        }

        CategoryResponse categoryResponse = new CategoryResponse();

        categoryResponse.setId( entity.getId() );
        categoryResponse.setName( entity.getName() );
        categoryResponse.setDescription( entity.getDescription() );

        return categoryResponse;
    }

    @Override
    public Category toEntity(CategoryResponse dto) {
        if ( dto == null ) {
            return null;
        }

        Category category = new Category();

        category.setId( dto.getId() );
        category.setName( dto.getName() );
        category.setDescription( dto.getDescription() );

        return category;
    }
}
