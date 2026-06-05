$(function () {
    $("#submit-btn").click(function () {
        if (checkForm('#login-form')) {
            let params = formToJson('#login-form'); // 确保这个函数已定义
            $.ajax({
                type: 'post',
                url: 'user/login',
                data: {
                    username: params.username,
                    password: params.password
                },
                success: function (res) {
                    if (res.code > 0) {
                        swal("", res.msg, "success");
                        setTimeout(function () {
                            window.location.href = "html/main.html";
                        }, 1500);
                    } else {
                        swal("", res.msg, "error");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error: " + error);
                    swal("", "Error connecting to server", "error");
                }
            });
        }
    });

    function formToJson(el) {
        let formData = $(el).serialize();
        let deCode = decodeURIComponent(formData);
        deCode = deCode.replace(/&/g, "\",\"").replace(/=/g, "\":\"").replace(/\+/g, " ").replace(/[\r\n]/g, "<br>");
        deCode = "{\"" + deCode + "\"}";
        return JSON.parse(deCode);
    }

    // 假设的 checkForm 函数实现
    function checkForm(el) {
        let result = true
        $(el + ' input').each(function(index,input){
            let isRequired = $(input).data('required');
            if(isRequired == "1"){
                return true;
            }
            if($(input).val() == '' || $(input).val() <= 0){
                $(input).next().css('display','block');
                result = false
            }else{
                $(input).next().css('display','none');
            }
        });
        $(el + ' select').each(function(index,select){
            let isRequired = $(select).data('required');
            if(isRequired == "1"){
                return true;
            }
            if($(select).val() == '' || $(select).val() == undefined){
                $(select).next().css('display','block');
                result = false
            }else{
                $(select).next().css('display','none');
            }
        });
        return result;
    }
});