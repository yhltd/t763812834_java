var idd;
function getList() {
    $ajax({
        type: 'post',
        url: '/grxx/queryList',
    }, false, '', function (res) {
        if (res.code == 200) {
            var a = res.data[0].byyx +" "+ res.data[0].xl;
            document.getElementById("p1").value = a;
            document.getElementById("p2").value = res.data[0].phone;
            document.getElementById("p3").value = res.data[0].address;
            document.getElementById("p4").value = res.data[0].qm;

            $('#id').val(res.data[0].id)
            $('#username').val(res.data[0].username)
            $('#phone').val(res.data[0].phone)
            $('#name').val(res.data[0].name)
            $('#nc').val(res.data[0].nc)
            $('#yx').val(res.data[0].yx)
            $('#address').val(res.data[0].address)
            $('#xl').val(res.data[0].xl)
            $('#byyx').val(res.data[0].byyx)
            $('#xb').val(res.data[0].xb)
            $('#sr').val(res.data[0].sr)
            $('#qm').val(res.data[0].qm)
            $('#password').val(res.data[0].password)

            for (i=0;i<=res.data.id;i++){
                idd=i;
            }
        }
        getTx();
    })
}

function getTx(){
    var glid = document.getElementById("id").value;
    console.log(glid)
    $ajax({
        type: 'post',
        url: '/filetable/getFile',
        data: {
            glid: glid,
        },
        async: false,
    }, false, '', function (res) {
        if (res.data[0].filename != '' && res.data[0].filename != null) {
            downloadFileByBase64(res.data[0].filename, res.data[0].files.split(',')[1])
        }
        var filename = res.data[0].filename;
        var path = "file://C:/Users/Administrator.SC-202303041236/Downloads/" + filename
        var p = document.getElementById('pic');
        p.src = res.data[0].files;
        $('#pid').val(res.data[0].id)
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
        document.getElementById("dlm1").innerText = this_name;
    })

    //刷新
    $("#refresh-btn").click(function () {
        getList();
    });

    //点击保存按钮
    $('#save-btn').click(function () {

        var d1 = document.getElementById('username').value;
        var d2 = document.getElementById('phone').value;
        var d3 = document.getElementById('name').value;
        var d4 = document.getElementById('nc').value;
        var d5 = document.getElementById('yx').value;
        var d6 = document.getElementById('address').value;
        var d7 = document.getElementById('xl').value;
        var d8 = document.getElementById('byyx').value;
        var d9 = document.getElementById('xb').value;
        var d10 = document.getElementById('sr').value;
        var d11 = document.getElementById('qm').value;
        var d12 = document.getElementById('password').value;
        var d13 = document.getElementById('id').value;

        var msg = confirm("确认保存吗？");
        if (msg) {
                $ajax({
                    type: 'post',
                    url: '/grxx/update',
                    data: {
                        username: d1,
                        phone: d2,
                        name:d3,
                        nc:d4,
                        yx:d5,
                        address:d6,
                        xl:d7,
                        byyx:d8,
                        xb:d9,
                        sr:d10,
                        qm:d11,
                        password:d12,
                        id:d13,
                    },
                }, false, '', function (res) {
                    if (res.code == 200) {
                        swal("", res.msg, "success");
                        getList();
                    } else {
                        swal("", res.msg, "error");
                    }
                })
        }
    });

    $('#upload').change(function () {
        var file = document.getElementById("upload").files;
        var oFReader = new FileReader();
        var this_file = file[0];
        var filename = file[0].name;
        var obj = [];
        var d13 = document.getElementById('id').value;
        oFReader.readAsDataURL(this_file);
        oFReader.onloadend = function (oFRevent) {
            this_file = oFRevent.target.result;
            obj = {
                "glid": d13,
                "filename": filename,
                "files": this_file,
            };
            var id = document.getElementById("pid").value;
            console.log(id)
            let idList = [];
            idList.push(id)
            $ajax({
                type: 'post',
                url: '/filetable/delete',
                data: JSON.stringify({
                    idList: idList
                }),
                dataType: 'json',
                contentType: 'application/json;charset=utf-8'
            }, false, '', function (res) {
            })

            $ajax({
                type: 'post',
                url: '/filetable/add',
                data: JSON.stringify({
                    addInfo: obj
                }),
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                async: false,
            }, false, '', function (res) {
                if (res.code == 200) {
                    swal("", res.msg, "success");
                } else {
                    swal("", res.msg, "error");
                }
                // var fileInput = document.getElementById('file');
                // fileInput.value = '';
            })
        };
    });

    // $('#download').click(function () {
    //     var glid = document.getElementById("id").value;
    //     console.log(glid)
    //     $ajax({
    //         type: 'post',
    //         url: '/filetable/getFile',
    //         data: {
    //             glid: glid,
    //         },
    //         async: false,
    //     }, false, '', function (res) {
    //         if (res.data[0].filename != '' && res.data[0].filename != null) {
    //             downloadFileByBase64(res.data[0].filename, res.data[0].files.split(',')[1])
    //         }
    //         var filename = res.data[0].filename;
    //         var path = "file://C:/Users/Administrator.SC-202303041236/Downloads/" + filename
    //         var p = document.getElementById('pic');
    //         p.src = res.data[0].files;
    //         $('#pid').val(res.data[0].id)
    //     })
    // });

    function getBase64Image(imgElem) {
        return imgElem.replace("/^data:image\/(jpeg|jpg);base64,/", "");
    }

});

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

// //主函数
function downloadFileByBase64(name, base64) {
    var myBlob = dataURLtoBlob(base64, name);
    var myUrl = URL.createObjectURL(myBlob);
    // downloadFile(myUrl, name)
}

function fileShow(id) {
    $('#id').val("");
    $ajax({
        type: 'post',
        url: '/filetable/getList',
        data: {
            id: id,
        }
    }, false, '', function (res) {
        if (res.code == 200) {
            customerId = id;
            setFileTable(res.data);
            $('#show-file-modal').modal('show');
        }
    })
}