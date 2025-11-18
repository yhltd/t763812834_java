var idd;
function getList() {
    $('#khmc').val("");
    $('#kddh').val("");
    $ajax({
        type: 'post',
        url: '/dskh/getList',
    }, false, '', function (res) {
        if (res.code == 200) {
            setTable(res.data);
            $("#dskhTable").colResizable({
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
        var khmc = $('#khmc').val();
        var kddh = $('#kddh').val();
        $ajax({
            type: 'post',
            url: '/dskh/queryList',
            data: {
                khmc: khmc,
                kddh: kddh,
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
    $("#add-submit-btn").click(function () {
        let params = formToJson("#add-form");
        if (checkForm('#add-form')) {
            $ajax({
                type: 'post',
                url: '/dskh/add',
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
        let rows = getTableSelection('#dskhTable');
        if (rows.length > 1 || rows.length == 0) {
            swal('请选择一条数据修改!');
            return;
        }
        // $ajax({
        //     type: 'post',
        //     url: '/user/getName',
        // }, false, '', function (res) {
        //     var this_name = res.data
        //     $ajax({
        //         type: 'post',
        //         url: '/czqx/queryList',
        //         data: JSON.stringify({
        //             czr: this_name,
        //             biao: "代收客户",
        //             czqx: "修改",
        //         }),
        //         dataType: 'json',
        //         contentType: 'application/json;charset=utf-8'
        //     }, false, '', function (res) {
        //         var this_czr = res.data[0].czr;
        //         var this_biao = res.data[0].biao;
        //         var this_czqx = res.data[0].czqx;
        //         var this_sfyx = res.data[0].sfyx;
        //         var this_czid = res.data[0].czid;
        //         if (this_czr == this_name && this_biao == "代收客户" && this_czqx == "修改" && this_sfyx == "是"){
        //             $('#update-submit-btn').click(function () {
        //                 var msg = confirm("确认要修改吗？");
        //                 if (msg) {
        //                     if (checkForm('#update-form')) {
        //                         let params = formToJson('#update-form');
        //                         $ajax({
        //                             type: 'post',
        //                             url: '/dskh/update1',
        //                             data: {
        //                                 updateJson: JSON.stringify(params)
        //                             },
        //                             dataType: 'json',
        //                             contentType: 'application/json;charset=utf-8'
        //                         }, false, '', function (res) {
        //                             if (res.code == 200) {
        //                                 swal("", res.msg, "success");
        //                                 $('#update-close-btn').click();
        //                                 $('#update-modal').modal('hide');
        //                                 getList();
        //                             } else {
        //                                 swal("", res.msg, "error");
        //                             }
        //                         })
        //                     }
        //                 }
        //             });
        //         }
        //     })
        //     $.each(rows, function (index, row) {
        //         $ajax({
        //             type: 'post',
        //             url: '/user/getPower',
        //         }, false, '', function (res) {
        //             var this_power = res.data
        //             if (this_power != "管理员") {
        //                 var msg = confirm("确认要通知管理员吗？");
        //                 if (msg) {
        //                     $ajax({
        //                         type: 'post',
        //                         url: '/czqx/add',
        //                         data: {
        //                             czr: this_name,
        //                             biao: "代收客户",
        //                             czqx: "修改",
        //                             czid: rows[0].data.id
        //                         },
        //                     }, false, '', function (res) {
        //                         swal(res.msg);
        //                     })
        //                 }
        //             }
        //         })
        //     })
        // });

        $('#update-modal').modal('show');
        setForm(rows[0].data, '#update-form');
        $('#update-riqi').val(rows[0].data.riqi);
        $('#update-khmc').val(rows[0].data.khmc);
        $('#update-dsje').val(rows[0].data.dsje);
        $('#update-kddh').val(rows[0].data.kddh);
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
                    url: '/dskh/update',
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
    $('#delete-btn').click(function () {
        var msg = confirm("确认要删除吗？");
        if (msg) {
            let rows = getTableSelection("#dskhTable");
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
                url: '/dskh/delete',
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
    if ($('#dskhTable').html != '') {
        $('#dskhTable').bootstrapTable('load', data);
    }

    $('#dskhTable').bootstrapTable({
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
                field: 'riqi',
                title: '日期',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'khmc',
                title: '客户名称',
                align: 'center',
                sortable: true,
                width: 150,
            }, {
                field: 'dsje',
                title: '代收金额',
                align: 'center',
                sortable: true,
                width: 130,
            }, {
                field: 'kddh',
                title: '快递单号',
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