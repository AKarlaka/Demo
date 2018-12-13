package com.choice.notebook.mapper;

import com.choice.notebook.domain.QueryItem;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface QueryItemMapper {
    List<QueryItem> getItemsByTableName(String tableName);
}
