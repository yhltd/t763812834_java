package com.example.demo.util;

import lombok.Data;
import java.util.List;

@Data
public class PageResult<T> {
    private List<T> list;
    private Long total;
    private Long pages;

    public PageResult(List<T> list, Long total, Long pages) {
        this.list = list;
        this.total = total;
        this.pages = pages;
    }

    public PageResult(Integer param1, String param2, String param3, String param4,
                      String param5, String param6, String param7) {

    }

    public PageResult(List<T> list) {
        this.list = list;
    }
}