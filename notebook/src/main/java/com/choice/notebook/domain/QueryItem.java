package com.choice.notebook.domain;

import lombok.Data;

@Data
public class QueryItem {
    int id;
    String tableName;
    String fieldType;
    String fieldKey;
    String fieldValue;
}
