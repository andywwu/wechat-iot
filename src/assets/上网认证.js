\uFEFF<link href="/wifiauth/wifiauth.css" rel="stylesheet" type="text/css">
<style>
body{background: #3A72C7;}
</style>
<div class="info" id="logonuser" style="display: none;">
	<div class="logo2">\u6B22\u8FCE\u767B\u5F55</div>
	<div class="stat">
	<input id="login_user_str" type="hidden">
	<table>
		<tbody><tr><td width="40%">\u767B\u5F55\u7528\u6237:</td><td><span id="login_user"></span><br></td></tr>
		<tr><td>IP\u5730\u5740:</td><td><span id="login_ipaddr"></span><br></td></tr>
		<tr><td>\u767B\u5F55\u65F6\u95F4:</td><td><span id="login_time"></span><br></td></tr>
		</tbody>
	</table>
	</div>
	<div><input id="logoutButton" onclick="continue_visit();" type="button" value="\u7EE7\u7EED\u8BBF\u95EE"></div>
	<div>
		<a id="logout" onclick="logout();" href="javascript:void(0);">\u9000\u51FA\u767B\u5F55</a></div>
	</div>

<script>
function get_redirect_uri(){
	var retURL;
	
	retURL = redirect_uri.replace( /^(http:\/\/|https:\/\/)/, "").replace( /\/.*/, "" );
	//alert("get_redirect_uri1, redirect_uri=" + redirect_uri + ",retURL=" + retURL );
	
	retURL = "http://" + retURL + "/cgi-bin/verify3d";
	
	//alert("get_redirect_uri2, redirect_uri=" + redirect_uri + ",retURL=" + retURL );
	return retURL;
}

function checkbypassPC(){
    //alert("userAgent="+window.navigator.userAgent);
    if( window.navigator.userAgent != undefined && window.navigator.userAgent.indexOf("Windows") > -1 ){

       //\u5982\u679C\u662Fwindows\u7CFB\u7EDF\uFF0C\u81EA\u52A8bypass\u3002

        $.ajax( "/cgi-bin/verify?tid=bypasspc", {
            method: 'GET',
            cache: false,
            dataType: 'text',
            success: function(data) {

               //\u8DF3\u8F6C\u5230\u6210\u529F\u8BA4\u8BC1\u7684\u8DF3\u8F6C\u9875\u9762
                check_landing_page();
            }
        });
    }
}

checkbypassPC()

if( wifiType == "dingtalk" ){
	var url = "https://oapi.dingtalk.com/connect/qrconnect?appid=" + appid + "&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=" + get_redirect_uri();
	bypass();
	if( !getstat( false ) ){
		window.location.href=url;
	}
}else if( wifiType == "wechatbusiness" ){
	var url = "https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=" + corpid + "&agentid=" + agentid + "&state=STATE&redirect_uri=" + get_redirect_uri();
	bypass();
	if( !getstat( false ) ){
		window.location.href=url;
	}
}else{
	alert("not supported wifiType.");
}
</script>
