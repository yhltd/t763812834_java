var idd;



function getMc() {
    $ajax({
        type: 'post',
        url: '/spmc/getList',
    }, false, '', function (res) {
        if (res.code == 200) {
            for (var i = 0; i < res.data.length; i++) {
                $("#add-mc").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc").append("<option>" + res.data[i].mc + "</option>");
            }
        }
    })
}


function getGsm() {
    $ajax({
        type: 'post',
        url: '/khzl/hqxlGsm',
    }, false, '', function (res) {
        if (res.code == 200) {
            for (var i = 0; i < res.data.length; i++) {
                $("#add-gsm").append("<option>" + res.data[i].fuzhu + "</option>");
                $("#update-gsm").append("<option>" + res.data[i].fuzhu + "</option>");
            }
        }
    })
}

function getGys() {
    $ajax({
        type: 'post',
        url: '/gyszl/getList',
    }, false, '', function (res) {
        if (res.code == 200) {
            for (var i = 0; i < res.data.length; i++) {
                $("#add-gys").append("<option>" + res.data[i].gsm + "</option>");
                $("#update-gys").append("<option>" + res.data[i].gsm + "</option>");
            }
        }
    })
}




function getList() {
    // $('#ksrq').val("");
    // $('#jsrq').val("");

    var  date = new Date();
    date.setMonth(date.getMonth()-3);
    var year = date.getFullYear();
    var month = ('0'+(date.getMonth()+1)).slice(-2);
    var day = ('0'+date.getDate()).slice(-2);
    var ks = year+'-'+month+'-'+day
    document.getElementById("ksrq").value = ks;
    var jsyear = date.getFullYear();
    var jsmonth = ('0'+(date.getMonth()+4)).slice(-2);
    var jsday = ('0'+date.getDate()).slice(-2);
    var js = jsyear+'-'+jsmonth+'-'+jsday
    document.getElementById("jsrq").value = js;

    $ajax({
        type: 'post',
        url: '/rk/getList',
    }, false, '', function (res) {
        if (res.code == 200) {
            setTable(res.data);
            $("#rkTable").colResizable({
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
    getMc();
    getGsm();
    getGys()
    var  date = new Date();
    date.setMonth(date.getMonth()-3);
    var year = date.getFullYear();
    var month = ('0'+(date.getMonth()+1)).slice(-2);
    var day = ('0'+date.getDate()).slice(-2);
    var ks = year+'-'+month+'-'+day
    document.getElementById("ksrq").value = ks;
    var jsyear = date.getFullYear();
    var jsmonth = ('0'+(date.getMonth()+4)).slice(-2);
    var jsday = ('0'+date.getDate()).slice(-2);
    var js = jsyear+'-'+jsmonth+'-'+jsday
    document.getElementById("jsrq").value = js;

    $ajax({
        type: 'post',
        url: '/user/getName',
    }, false, '', function (res) {
        var this_name = res.data
        document.getElementById("dlm").innerText = this_name;
    })

    // $ajax({
    //     type: 'post',
    //     url: '/rk/getKcjj',
    // }, false, '', function (res) {
    //     // var dataArray  = res
    //     var kcjj = res.data[0].kcjj
    //     document.getElementById("kcjj").value = kcjj;
    // })

    $('#select-btn').click(function () {
        var ksrq = $('#ksrq').val();
        var jsrq = $('#jsrq').val();
        var mc= $('#mc').val();
        $ajax({
            type: 'post',
            url: '/rk/queryList',
            data: {
                ksrq: ksrq,
                jsrq: jsrq,
                mc:mc
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

        // var rksl = parseFloat(document.getElementById('add-rksl').value);
        var rkdj = parseFloat(document.getElementById('add-rkdj').value);
        var rkzl = parseFloat(document.getElementById('add-rkzl').value);
        var zje = rkdj * rkzl

        document.getElementById("add-zje").value = zje

        var  date = new Date();
        date.setMonth(date.getMonth()-3);
        var year = date.getFullYear();
        var month = ('0'+(date.getMonth()+1)).slice(-2);
        var day = ('0'+date.getDate()).slice(-2);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        var danhao =year+''+month+''+day+''+hours+''+minutes+seconds;
        console.log(danhao)
        document.getElementById("add-danhao").value = danhao;

        let params = formToJson("#add-form");
        if (checkForm('#add-form')) {
            $ajax({
                type: 'post',
                url: '/rk/add',
                data: JSON.stringify({
                    addInfo: params
                }),
                dataType: 'json',
                contentType: 'application/json;charset=utf-8'
            }, false, '', function (res) {
                if (res.code == 200) {
                    $ajax({
                        type: 'post',
                        url: '/mx/add1',
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

        let rows = getTableSelection('#rkTable');
        if (rows.length > 1 || rows.length == 0) {
            swal('请选择一条数据修改!');
            return;
        }
        $('#update-modal').modal('show');
        setForm(rows[0].data, '#update-form');
        $('#update-riqi').val(rows[0].data.riqi);
        $('#update-gsm').val(rows[0].data.gsm);
        $('#update-gys').val(rows[0].data.gys);
        $('#update-mc').val(rows[0].data.spmc);
        $('#update-rksl').val(rows[0].data.rksl);
        $('#update-rkdj').val(rows[0].data.rkdj);
        $('#update-rkzl').val(rows[0].data.rkzl);
        $('#update-zje').val(rows[0].data.zje);
        $('#update-fkfs').val(rows[0].data.fkfs);
        $('#update-danhao').val(rows[0].data.danhao);
    });

    //修改弹窗点击关闭按钮
    $('#update-close-btn').click(function () {
        $('#update-form')[0].reset();
        $('#update-modal').modal('hide');
    });

    //修改弹窗里点击提交按钮
    $('#update-submit-btn').click(function () {
        var msg = confirm("确认要修改吗？");

        // var rksl = parseFloat(document.getElementById('update-rksl').value);
        // var rkdj = parseFloat(document.getElementById('update-rkdj').value);
        // var rkzl = parseFloat(document.getElementById('update-rkzl').value);
        // var zje = rksl * rkdj * rkzl
        // document.getElementById("update-zje").value = zje
        // var d1 = document.getElementById('riqi').value;
        // var d2 = document.getElementById('gsm').value;
        // var d3 = document.getElementById('update-mc').value;
        // var d4 = document.getElementById('update-rksl').value;
        // var d5 = document.getElementById('update-rkdj').value;
        // var d6 = document.getElementById('update-rkzl').value;
        // var d7 = document.getElementById('zje').value;
        // var d8 = document.getElementById('fkfs').value;
        // var d9 = document.getElementById('gys').value;
        // var  date = new Date();
        // date.setMonth(date.getMonth()-3);
        // var year = date.getFullYear();
        // var month = ('0'+(date.getMonth()+1)).slice(-2);
        // var day = ('0'+date.getDate()).slice(-2);
        // const hours = date.getHours().toString().padStart(2, '0');
        // const minutes = date.getMinutes().toString().padStart(2, '0');
        // const seconds = date.getSeconds().toString().padStart(2, '0');
        // var danhao =year+''+month+''+day+''+hours+''+minutes+seconds;
        //  var danhao=document.getElementById("update-danhao").value ;

        var rksl = parseFloat(document.getElementById('update-rksl').value);
        var rkdj = parseFloat(document.getElementById('update-rkdj').value);
        var rkzl = parseFloat(document.getElementById('update-rkzl').value);
        // var zje = rksl * rkdj * rkzl
        var zje = rksl * rkdj
        document.getElementById("update-zje").value = zje

        var d1 = document.getElementById('update-mc').value;
        var d2 = document.getElementById('update-rksl').value;
        var d3 = document.getElementById('update-zje').value;
        var d4 = document.getElementById('update-rkzl').value;
        var d5 = document.getElementById('update-danhao').value;
        var d6 = document.getElementById('id').value;

        if (msg) {
            if (checkForm('#update-form')) {
                let params = formToJson('#update-form');
                $ajax({
                    type: 'post',
                    url: '/rk/update',
                    data: {
                        updateJson: JSON.stringify(params)
                    },
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8'
                }, false, '', function (res) {
                    if (res.code == 200) {
                        // $ajax({
                        //     type: 'post',
                        //     url: '/mx/update',
                        //     data: {
                        //         // riqi:d1,
                        //         // gsm:d2,
                        //         mc:d3,
                        //         js:d4,
                        //         je:d5,
                        //         zl:d6,
                        //         danhao:danhao,
                        //         // zje:d7,
                        //     },
                        //     dataType: 'json',
                        //     contentType: 'application/json;charset=utf-8'
                        // }, false, '', function (res) {
                        //     if (true) {
                        //         swal("", res.msg, "success");
                        //     } else {
                        //         swal("", res.msg, "error");
                        //     }
                        // })
                        swal("", res.msg, "success");
                        // $('#update-close-btn').click();
                        // $('#update-modal').modal('hide');
                        // getList();
                    } else {
                        swal("", res.msg, "error");
                    }
                    // $('#update-close-btn').click();
                    // $('#update-modal').modal('hide');

                })
                // $ajax({
                //     type: 'post',
                //     url: '/mx/update',
                //     data: {
                //         // riqi:d1,
                //         // gsm:d2,
                //         mc:d3,
                //         js:d4,
                //         je:d5,
                //         zl:d6,
                //         danhao:danhao,
                //         // zje:d7,
                //     },
                //     dataType: 'json',
                //     contentType: 'application/json;charset=utf-8'
                // }, false, '', function (res) {
                    // if (res.code==200) {
                    //     swal("", res.msg, "success");
                    //     $('#update-close-btn').click();
                    //     $('#update-modal').modal('hide');
                    //     getList();
                    // } else {
                    //     swal("", res.msg, "error");
                    //     $('#update-close-btn').click();
                    //     $('#update-modal').modal('hide');
                    //     getList();
                    // }
                //     if (res.code == 200) {
                //         swal("", res.msg, "success");
                //         getList();
                //     } else {
                //         swal("", res.msg, "error");
                //     }
                // })
// -----------
                $ajax({
                    type: 'post',
                    url: '/mx/queryListMingxi',
                    data: {
                        danhao: d5,
                        id: d6,
                        mc: d1,
                        rksl: d2,
                        rkzl:d4,
                        zje:d3,

                    }
                }, true, '', function (res) {
                    if (res.code == 200) {
                        // setTable(res.data);
                        console.log(res.data)
                        getList();
                    }
                })
            }
        }
    });

    // $('#update-submit-btn').click(function () {
    //     var msg = confirm("确认要修改吗？");
    //
    //     var rksl = parseFloat(document.getElementById('update-rksl').value);
    //     var rkdj = parseFloat(document.getElementById('update-rkdj').value);
    //     var rkzl = parseFloat(document.getElementById('update-rkzl').value);
    //     var zje = rksl * rkdj * rkzl
    //     document.getElementById("update-zje").value = zje
    //     // var d1 = document.getElementById('riqi').value;
    //     // var d2 = document.getElementById('gsm').value;
    //     var d3 = document.getElementById('update-mc').value;
    //     var d4 = document.getElementById('update-rksl').value;
    //     var d5 = document.getElementById('update-rkdj').value;
    //     var d6 = document.getElementById('update-rkzl').value;
    //     // var d7 = document.getElementById('zje').value;
    //     // var d8 = document.getElementById('fkfs').value;
    //     // var d9 = document.getElementById('gys').value;
    //     // var  date = new Date();
    //     // date.setMonth(date.getMonth()-3);
    //     // var year = date.getFullYear();
    //     // var month = ('0'+(date.getMonth()+1)).slice(-2);
    //     // var day = ('0'+date.getDate()).slice(-2);
    //     // const hours = date.getHours().toString().padStart(2, '0');
    //     // const minutes = date.getMinutes().toString().padStart(2, '0');
    //     // const seconds = date.getSeconds().toString().padStart(2, '0');
    //     // var danhao =year+''+month+''+day+''+hours+''+minutes+seconds;
    //     var danhao=document.getElementById("update-danhao").value ;
    //     if (msg) {
    //         if (checkForm('#update-form')) {
    //             let params = formToJson('#update-form');
    //             // $ajax({
    //             //     type: 'post',
    //             //     url: '/rk/update',
    //             //     data: {
    //             //         updateJson: JSON.stringify(params)
    //             //     },
    //             //     dataType: 'json',
    //             //     contentType: 'application/json;charset=utf-8'
    //             // }, false, '', function (res) {
    //             //     if (res.code == 200) {
    //             //         // $ajax({
    //             //         //     type: 'post',
    //             //         //     url: '/mx/update',
    //             //         //     data: {
    //             //         //         // riqi:d1,
    //             //         //         // gsm:d2,
    //             //         //         mc:d3,
    //             //         //         js:d4,
    //             //         //         je:d5,
    //             //         //         zl:d6,
    //             //         //         danhao:danhao,
    //             //         //         // zje:d7,
    //             //         //     },
    //             //         //     dataType: 'json',
    //             //         //     contentType: 'application/json;charset=utf-8'
    //             //         // }, false, '', function (res) {
    //             //         //     if (true) {
    //             //         //         swal("", res.msg, "success");
    //             //         //     } else {
    //             //         //         swal("", res.msg, "error");
    //             //         //     }
    //             //         // })
    //             //         swal("", res.msg, "success");
    //             //         // $('#update-close-btn').click();
    //             //         // $('#update-modal').modal('hide');
    //             //         // getList();
    //             //     } else {
    //             //         swal("", res.msg, "error");
    //             //     }
    //             //     // $('#update-close-btn').click();
    //             //     // $('#update-modal').modal('hide');
    //             //     getList();
    //             // })
    //             // $ajax({
    //             //     type: 'post',
    //             //     url: '/mx/update',
    //             //     data: {
    //             //         // riqi:d1,
    //             //         // gsm:d2,
    //             //         mc:d3,
    //             //         js:d4,
    //             //         je:d5,
    //             //         zl:d6,
    //             //         danhao:danhao,
    //             //         updateJson: JSON.stringify(d3,d4,d5,d6,danhao)
    //             //         // zje:d7,
    //             //     },
    //             //     dataType: 'json',
    //             //     contentType: 'application/json;charset=utf-8'
    //             // }, false, '', function (res) {
    //                 // if (res.code==200) {
    //                 //     swal("", res.msg, "success");
    //                 //     $('#update-close-btn').click();
    //                 //     $('#update-modal').modal('hide');
    //                 //     getList();
    //                 // } else {
    //                 //     swal("", res.msg, "error");
    //                 //     $('#update-close-btn').click();
    //                 //     $('#update-modal').modal('hide');
    //                 //     getList();
    //                 // }
    //                 if (res.code == 200) {
    //                     swal("", res.msg, "success");
    //                     getList();
    //                 } else {
    //                     swal("", res.msg, "error");
    //                 }
    //             })
    //         }
    //     }
    // });

    // $('#update-submit-btn').click(function () {
    //     var rksl = parseFloat(document.getElementById('update-rksl').value);
    //     var rkdj = parseFloat(document.getElementById('update-rkdj').value);
    //     var rkzl = parseFloat(document.getElementById('update-rkzl').value);
    //     // var zje = rksl * rkdj * rkzl
    //     var zje = rksl * rkdj
    //     document.getElementById("update-zje").value = zje
    //
    //     var d1 = document.getElementById('update-mc').value;
    //     var d2 = document.getElementById('update-rksl').value;
    //     var d3 = document.getElementById('update-zje').value;
    //     var d4 = document.getElementById('update-rkzl').value;
    //     var d5 = document.getElementById('update-danhao').value;
    //     var d6 = document.getElementById('id').value;
    //
    //     var msg = confirm("确认保存吗？");
    //     if (msg) {
    //         $ajax({
    //             type: 'post',
    //             url: '/mx/queryListMingxi',
    //             data: {
    //                 danhao: d5,
    //                 id: d6,
    //                 mc: d1,
    //                 rksl: d2,
    //                 rkzl:d4,
    //                 zje:d3,
    //
    //             }
    //         }, true, '', function (res) {
    //             if (res.code == 200) {
    //                 // setTable(res.data);
    //                 console.log(res.data)
    //             }
    //         })
    //     }
    // });

    //点击删除按钮
    $('#delete-btn').click(function () {
        var msg = confirm("确认要删除吗？");
        if (msg) {
            let rows = getTableSelection("#rkTable");
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
                url: '/rk/delete',
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
    if ($('#rkTable').html != '') {
        $('#rkTable').bootstrapTable('load', data);
    }

    $('#rkTable').bootstrapTable({
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
        style: 'table-layout:fixed',
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
                field: 'danhao',
                title: '单号',
                align: 'center',
                sortable: true,
                width: 150,
            }, {
                field: 'riqi',
                title: '日期',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'gsm',
                title: '公司名',
                align: 'center',
                sortable: true,
                width: 150,
            }, {
                field: 'gys',
                title: '供应商',
                align: 'center',
                sortable: true,
                width: 150,
            }, {
                field: 'mc',
                title: '商品名称',
                align: 'center',
                sortable: true,
                width: 150,
            }
            // , {
            //     field: 'rksl',
            //     title: '数量',
            //     align: 'center',
            //     sortable: true,
            //     width: 150,
            // }
            , {
                field: 'rkdj',
                title: '单价',
                align: 'center',
                sortable: true,
                width: 150,
            }, {
                field: 'rkzl',
                title: '重量',
                align: 'center',
                sortable: true,
                width: 150,
            }, {
                field: 'zje',
                title: '总金额',
                align: 'center',
                sortable: true,
                width: 150,
            }, {
                field: 'fkfs',
                title: '付款方式',
                align: 'center',
                sortable: true,
                width: 150,
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

