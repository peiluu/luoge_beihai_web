import { auth } from '@/utils/pts/auth'

/*
    SUCCESS("0", "Success"),
    FAILED("1", "系统繁忙,请稍后再试"),
    ACCOUNT_OR_PASSOWD_WRONG("11", "账号或密码错误"),
    NO_PERMISSION("2", "没有访问该资源的权限"),
    SIGN_ERROR_WITH_EMPTY_DATA("3", "数据签名错误,存在为空的参数"),
    GET_SECRET_ERROR("4", "找不到本应用失败"),
    NO_CURRENT_USER("5", "当前没有登录的用户"),
    TOKEN_EXPIRED("6", "token过期"),
    TOKEN_ERROR("7", "token验证失败"),
    PERMISSION_ERROR("8", "没有访问该资源的权限"),
    SIGN_ERROR("9", "签名验证失败"),
    USER_NO_EXISTS("10", "找不到该用户,请联系管理员"),
    VERSION_EXPIRES("110", "数据已过期，请刷新后操作"),
    WRITE_ERROR("500", "渲染界面错误"),
    REQUEST_NULL("400", "请求数据为空或格式错误"),
    PARAMETER_INVALID("501", "参数校验失败"),
    PAGE_NULL("404", "请求页面不存在"),
    IO_ERROR("500", "流读取异常"),
    SERVICE_ERROR("500", "服务器异常"),
    REMOTE_SERVICE_NULL("404", "远程服务不存在"),
 */
export function handleRequest(res) {
    if (res.code == 403 || res.code == 401 || res.code == 8 || res.code == 2) {
        location.href = '/#/403'
        return
    }
    if(res.code == 500 || res.code == 502){
        location.href = '/#/500'
        return
    }
    if(res.code == 404){
        location.href = '/#/404'
        return
    }
 //   auth.logout();
}

export function handleError(error) {
    if (error.response && error.response.data) {
        const data = error.response.data;
        if (typeof(data) == 'object') {
            handleRequest(data);
        }
    }
}
