package com.example.demo.util;

public class SaveWorkOrdersRequest {
    private Integer id;
    private String scgd;
    private String printCount;

    // getter 和 setter
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getScgd() {
        return scgd;
    }

    public void setScgd(String scgd) {
        this.scgd = scgd;
    }

    public String getPrintCount() {
        return printCount;
    }

    public void setPrintCount(String printCount) {
        this.printCount = printCount;
    }

}
