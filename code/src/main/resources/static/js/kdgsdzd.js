var idd;
function getList() {
    // $('#drkhmc').val("");
    // $('#drkddh').val("");
    $ajax({
        type: 'post',
        url: '/kdgsdzd/getList',
    }, false, '', function (res) {
        if (res.code == 200) {
            setTable(res.data);
            $("#kdgsdzdTable").colResizable({
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
    // $ajax({
    //     type: 'post',
    //     url: '/kdgsdzd/getDrList',
    // }, false, '', function (res) {
    //     if (res.code == 200) {
    //         setTable(res.data);
    //         $("#kdgsdzdTable").colResizable({
    //             liveDrag: true,
    //             gripInnerHtml: "<div class='grip'></div>",
    //             draggingClass: "dragging",
    //             resizeMode: 'fit'
    //         });
    //         for (i=0;i<=res.data.id;i++){
    //             idd=i;
    //         }
    //     }
    // })
}

// function getDrList() {
//     $('#drkhmc').val("");
//     $('#drkddh').val("");
//     $ajax({
//         type: 'post',
//         url: '/kdgsdzd/getDrList',
//     }, false, '', function (res) {
//         if (res.code == 200) {
//             setTable(res.data);
//             $("#kdgsdzdTable").colResizable({
//                 liveDrag: true,
//                 gripInnerHtml: "<div class='grip'></div>",
//                 draggingClass: "dragging",
//                 resizeMode: 'fit'
//             });
//             for (i=0;i<=res.data.id;i++){
//                 idd=i;
//             }
//         }
//     })
// }

$(function () {
    getList();
    // getDrList();

    $ajax({
        type: 'post',
        url: '/user/getName',
    }, false, '', function (res) {
        var this_name = res.data
        document.getElementById("dlm").innerText = this_name;
    })

    $('#select-btn').click(function () {
        var drkhmc = $('#drkhmc').val();
        var drkddh = $('#drkddh').val();
        $ajax({
            type: 'post',
            url: '/kdgsdzd/queryList',
            data: {
                drkhmc: drkhmc,
                drkddh: drkddh,
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
                url: '/kdgsdzd/add',
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
        let rows = getTableSelection('#kdgsdzdTable');
        if (rows.length > 1 || rows.length == 0) {
            swal('请选择一条数据修改!');
            return;
        }
        $('#update-modal').modal('show');
        setForm(rows[0].data, '#update-form');
        $('#update-riqi').val(rows[0].data.riqi);
        $('#update-khmc').val(rows[0].data.khmc);
        $('#update-dsje').val(rows[0].data.dsje);
        $('#update-kddh').val(rows[0].data.kddh);
        $('#update-kdf').val(rows[0].data.kdf);
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
                    url: '/kdgsdzd/update',
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
            let rows = getTableSelection("#kdgsdzdTable");
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
                url: '/kdgsdzd/delete',
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

    //上传excel
    $('#import-btn').click(function () {
        $('#file').trigger('click');
    });

    //判断文件名改变
    $('#file').change(function () {
        var url = null;
        if ($('#file').val() != '') {
            if ($('#file').val().substr(-5) == '.xlsx') {
                var excel = document.getElementById("file").files[0]
                var oFReader = new FileReader();
                oFReader.readAsDataURL(excel);
                oFReader.onloadend = function (oFRevent) {
                    url = oFRevent.target.result;
                    $ajax({
                        type: 'post',
                        url: '/kdgsdzd/upload',
                        data: {
                            excel: url
                        },
                    }, false, '', function (res) {
                        $('#file').val('');
                        swal(res.msg);
                        if (res.code == 200) {
                            getDrList();
                        }
                    })
                }
            } else {
                swal("请选择正确的Excel文件！")
                $('#file').val('');
            }
        }
    })

});

function setTable(data) {
    if ($('#kdgsdzdTable').html != '') {
        $('#kdgsdzdTable').bootstrapTable('load', data);
    }

    $('#kdgsdzdTable').bootstrapTable({
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
                width: 80,
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'jjrq',
                title: '寄件日期',
                align: 'center',
                sortable: true,
                width: 120,
            }
            // , {
            //     field: 'riqi',
            //     title: '日期',
            //     align: 'center',
            //     sortable: true,
            //     width: 80,
            // }
            // , {
            //     field: 'drkhmc',
            //     title: '客户名称(导入)',
            //     align: 'center',
            //     sortable: true,
            //     width: 150,
            // }, {
            //     field: 'khmc',
            //     title: '客户名称',
            //     align: 'center',
            //     sortable: true,
            //     width: 150,
            // }
            , {
                field: 'dh',
                title: '单号',
                align: 'center',
                sortable: true,
                width: 150,
            },
            // , {
            //     field: 'dsje',
            //     title: '代收金额',
            //     align: 'center',
            //     sortable: true,
            //     width: 150,
            // },
        {
                field: 'jshk',
                title: '结算货款',
                align: 'center',
                sortable: true,
                width: 150,
            }
            , {
                field: 'fkrq',
                title: '返款日期',
                align: 'center',
                sortable: true,
                width: 150,
            }
            // , {
            //     field: 'drkdf',
            //     title: '快递费(导入)',
            //     align: 'center',
            //     sortable: true,
            //     width: 150,
            // }, {
            //     field: 'kdf',
            //     title: '快递费',
            //     align: 'center',
            //     sortable: true,
            //     width: 150,
            // }
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

function dataURLtoBlob(dataurl, name) {//name:文件名
    var mime = name.substring(name.lastIndexOf('.') + 1)//后缀名
    var bstr = atob(dataurl), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}

function downloadFile(url, name = '默认文件名') {
    var a = document.createElement("a")//创建a标签触发点击下载
    a.setAttribute("href", url)//附上
    a.setAttribute("download", name);
    a.setAttribute("target", "_blank");
    let clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", true, true);
    a.dispatchEvent(clickEvent);
}

//主函数
function downloadFileByBase64(name, base64) {
    var myBlob = dataURLtoBlob(base64, name);
    var myUrl = URL.createObjectURL(myBlob);
    downloadFile(myUrl, name)
}

//获取后缀
function getType(file) {
    var filename = file;
    var index1 = filename.lastIndexOf(".");
    var index2 = filename.length;
    var type = filename.substring(index1 + 1, index2);
    return type;
}

//根据文件后缀 获取base64前缀不同
function getBase64Type(type) {
    switch (type) {
        case 'data:text/plain;base64':
            return 'txt';
        case 'data:application/msword;base64':
            return 'doc';
        case 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64':
            return 'docx';
        case 'data:application/vnd.ms-excel;base64':
            return 'xls';
        case 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64':
            return 'xlsx';
        case 'data:application/pdf;base64':
            return 'pdf';
        case 'data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64':
            return 'pptx';
        case 'data:application/vnd.ms-powerpoint;base64':
            return 'ppt';
        case 'data:image/png;base64':
            return 'png';
        case 'data:image/jpeg;base64':
            return 'jpg';
        case 'data:image/gif;base64':
            return 'gif';
        case 'data:image/svg+xml;base64':
            return 'svg';
        case 'data:image/x-icon;base64':
            return 'ico';
        case 'data:image/bmp;base64':
            return 'bmp';
    }
}

function base64ToBlob(code) {
    code = code.replace(/[\n\r]/g, '');
    const raw = window.atob(code);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
    }
    return new Blob([uInt8Array], {type: 'application/pdf'})
}