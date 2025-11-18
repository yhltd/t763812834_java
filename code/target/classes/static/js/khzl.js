var idd;
function getList() {
    $('#gsm').val("");
    $ajax({
        type: 'post',
        url: '/khzl/getList',
    }, false, '', function (res) {
        if (res.code == 200) {
            setTable(res.data);
            $("#khzlTable").colResizable({
                liveDrag: true,
                gripInnerHtml: "<div class='grip'></div>",
                draggingClass: "dragging",
                resizeMode: 'fit'
            });
            for (i=0;i<=res.data.id;i++){
                idd=i;
            }
        }
    })
}

$(function () {
    getList();

    $ajax({
        type: 'post',
        url: '/user/getName',
    }, false, '', function (res) {
        var this_name = res.data
        document.getElementById("dlm").innerText = this_name;
    })

    $('#select-btn').click(function () {
        var gsm = $('#gsm').val();
        $ajax({
            type: 'post',
            url: '/khzl/queryList',
            data: {
                gsm: gsm,
            }
        }, true, '', function (res) {
            if (res.code == 200) {
                setTable(res.data);
            }
        })
    });

    //刷新
    $("#refresh-btn").click(function () {
        getList();
    });

    //点击新增按钮显示弹窗
    $("#add-btn").click(function () {
        $('#add-modal').modal('show');
    });

    //新增弹窗里点击关闭按钮
    $('#add-close-btn').click(function () {
        $('#add-modal').modal('hide');
    });

    //新增弹窗里点击提交按钮
    // $("#add-submit-btn").click(function () {
    //     let params = formToJson("#add-form");
    //     if (checkForm('#add-form')) {
    //         $ajax({
    //             type: 'post',
    //             url: '/khzl/add',
    //             data: JSON.stringify({
    //                 addInfo: params
    //             }),
    //             dataType: 'json',
    //             contentType: 'application/json;charset=utf-8'
    //         }, false, '', function (res) {
    //             if (res.code == 200) {
    //                 swal("", res.msg, "success");
    //                 $('#add-form')[0].reset();
    //                 getList();
    //                 $('#add-close-btn').click();
    //             }
    //         })
    //     }
    // });
    //新增弹窗里点击提交按钮
    $("#add-submit-btn").click(function () {
        var a1 = document.getElementById("add-gsm").value;
        var a2 = document.getElementById("add-bh").value;
        var a3 = a1+a2
        document.getElementById("add-fuzhu").value = a3;
        let params = formToJson("#add-form");
        if (checkForm('#add-form')) {
            $ajax({
                type: 'post',
                url: '/khzl/add',
                data: JSON.stringify({
                    addInfo: params
                }),
                dataType: 'json',
                contentType: 'application/json;charset=utf-8'
            }, false, '', function (res) {
                if (res.code == 200) {
                    swal("", res.msg, "success");
                    $('#add-form')[0].reset();
                    getList();
                    $('#add-close-btn').click();
                }
            })
        }
    });



    //点击修改按钮显示弹窗
    $('#update-btn').click(function () {
        let rows = getTableSelection('#khzlTable');
        if (rows.length > 1 || rows.length == 0) {
            swal('请选择一条数据修改!');
            return;
        }
        $('#update-modal').modal('show');
        setForm(rows[0].data, '#update-form');
        $('#update-gsm').val(rows[0].data.gsm);
        $('#update-bh').val(rows[0].data.bh);
        $('#update-lxr').val(rows[0].data.lxr);
        $('#update-lxdh').val(rows[0].data.lxdh);
        $('#update-dz').val(rows[0].data.dz);
        $('#update-sfhs').val(rows[0].data.sfhs);
        $('#update-sfyj').val(rows[0].data.sfyj);
        $('#update-tzkc').val(rows[0].data.tzkc);
        $('#update-tkkc').val(rows[0].data.tkkc);
        $('#update-ysje').val(rows[0].data.ysje);
        $('#update-kddsje').val(rows[0].data.kddsje);
    });

    //修改弹窗点击关闭按钮
    $('#update-close-btn').click(function () {
        $('#update-form')[0].reset();
        $('#update-modal').modal('hide');
    });

    //修改弹窗里点击提交按钮
    $('#update-submit-btn').click(function () {
        var msg = confirm("确认要修改吗？");
        if (msg) {
            if (checkForm('#update-form')) {
                let params = formToJson('#update-form');
                $ajax({
                    type: 'post',
                    url: '/khzl/update',
                    data: {
                        updateJson: JSON.stringify(params)
                    },
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8'
                }, false, '', function (res) {
                    if (res.code == 200) {
                        swal("", res.msg, "success");
                        $('#update-close-btn').click();
                        $('#update-modal').modal('hide');
                        getList();
                    } else {
                        swal("", res.msg, "error");
                    }
                })
            }
        }
    });

    //点击删除按钮
//     $('#delete-btn').click(function () {
//         var msg = confirm("确认要删除吗？");
//         if (msg) {
//             let rows = getTableSelection("#jcxxTable");
//             if (rows.length == 0) {
//                 swal('请选择要删除的数据！');
//                 return;
//             }
//             let idList = [];
//             $.each(rows, function (index, row) {
//                 idList.push(row.data.id)
//             });
//             $ajax({
//                 type: 'post',
//                 url: '/khzl/delete',
//                 data: JSON.stringify({
//                     idList: idList
//                 }),
//                 dataType: 'json',
//                 contentType: 'application/json;charset=utf-8'
//             }, false, '', function (res) {
//                 if (res.code == 200) {
//                     swal("", res.msg, "success");
//                     getList();
//                 } else {
//                     swal("", res.msg, "error");
//                 }
//             })
//         }
//     })
// });
    //点击删除按钮
    $('#delete-btn').click(function () {
        var msg = confirm("确认要删除吗？");
        if (msg) {
            let rows = getTableSelection("#khzlTable");
            if (rows.length == 0) {
                swal('请选择要删除的数据！');
                return;
            }
            let idList = [];
            $.each(rows, function (index, row) {
                idList.push(row.data.id)
            });
            $ajax({
                type: 'post',
                url: '/khzl/delete',
                data: JSON.stringify({
                    idList: idList
                }),
                dataType: 'json',
                contentType: 'application/json;charset=utf-8'
            }, false, '', function (res) {
                if (res.code == 200) {
                    swal("", res.msg, "success");
                    getList();
                } else {
                    swal("", res.msg, "error");
                }
            })
        }
    })
});

function setTable(data) {
    if ($('#khzlTable').html != '') {
        $('#khzlTable').bootstrapTable('load', data);
    }

    $('#khzlTable').bootstrapTable({
        data: data,
        sortStable: true,
        classes: 'table table-hover text-nowrap table table-bordered',
        idField: 'id',
        pagination: true,
        pageSize: 15,//单页记录数
        clickToSelect: true,
        locale: 'zh-CN',
        toolbar: '#table-toolbar',
        toolbarAlign: 'left',
        theadClasses: "thead-light",//这里设置表头样式
        style:'table-layout:fixed',
        columns: [
            {
                field: '',
                title: '序号',
                align: 'center',
                width: 50,
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'gsm',
                title: '公司名',
                align: 'center',
                sortable: true,
                width: 150,
            }, {
                field: 'bh',
                title: '编号',
                align: 'center',
                sortable: true,
                width: 110,
            }, {
                field: 'lxr',
                title: '联系人',
                align: 'center',
                sortable: true,
                width: 110,
            }, {
                field: 'lxdh',
                title: '联系电话',
                align: 'center',
                sortable: true,
                width: 110,
            }, {
                field: 'dz',
                title: '地址',
                align: 'center',
                sortable: true,
                width: 150,
            }, {
                field: 'sfhs',
                title: '是否含税',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'sfyj',
                title: '是否月结',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'qcye',
                title: '期初余额',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'tzkc',
                title: '铜渣库存',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'tkkc',
                title: '铜块库存',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'ysje',
                title: '应收金额',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'kddsje',
                title: '快递代收金额',
                align: 'center',
                sortable: true,
                width: 130,
            }
        ],
        onClickRow: function (row, el) {
            let isSelect = $(el).hasClass('selected')
            if (isSelect) {
                $(el).removeClass('selected')
            } else {
                $(el).addClass('selected')
            }
        }
    })
}