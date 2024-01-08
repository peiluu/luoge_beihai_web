import request from '@/utils/permission-request'

export function login(ticket) {
    return request.post('public/a4login', {
        ticket: ticket,
    });
}

export function getTenants() {
    return request.get('tenant/getUserAllTenants?listFlag=1&pageNo=1&pageSize=999');
}

export function getApps(userCode, tenantCode) {
    return request.get(`getUserApplications?userCode=${userCode}&tenantCode=${tenantCode}`);
}

export function getMenus(userCode, tenantCode, applicationCode) {
    return request.get(`getAllResources?userCode=${userCode}&tenantCode=${tenantCode}&applicationCode=${applicationCode}`);
}

export function getDefaultMenus() {
    return [
        {
            resourceCode: '1',
            resourceName: '首页',
            resourceUrl: '/index',
            iconUrl: 'el-icon-s-home'
        },
        {
            resourceCode: '2',
            resourceName: '系统设置',
            iconUrl: 'el-icon-s-tools',
            subResources: [
                {
                    resourceCode: '3',
                    parentId: '2',
                    resourceName: '权限管理',
                    resourceUrl: '/setting/index'
                },
                {
                    resourceCode: '4',
                    parentId: '2',
                    resourceName: '登录日志',
                    resourceUrl: '/setting/log'
                },
                {
                    resourceCode: '5',
                    parentId: '2',
                    resourceName: '系统配置',
                    resourceUrl: '/setting/config'
                },
            ]
        },
    ]
}