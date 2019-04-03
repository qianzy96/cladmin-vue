import httpRequest from '@/utils/httpRequest'

const api = {
  getUserInfo: (params = {}) => httpRequest({
    url: httpRequest.adornUrl('/v1/users/personal'),
    method: 'get',
    params: httpRequest.adornParams(params)
  }),
  getMenuInfo: (params = {}) => httpRequest({
    url: httpRequest.adornUrl('/v1/menus/get'),
    method: 'get',
    params: httpRequest.adornParams(params)
  }),
  getMenuNav: (params = {}) => httpRequest({
    url: httpRequest.adornUrl('/v1/menus/nav'),
    method: 'get',
    params: httpRequest.adornParams(params)
  }),
  getMenuList: (params = {}) => httpRequest({
    url: httpRequest.adornUrl('/v1/menus/list'),
    method: 'get',
    params: httpRequest.adornParams(params)
  }),
  getMenuSelect: (params = {}) => httpRequest({
    url: httpRequest.adornUrl('/v1/menus/select'),
    method: 'get',
    params: httpRequest.adornParams(params)
  }),
  getRefreshToken: (params = {}) => httpRequest({
    url: httpRequest.adornUrl('/refresh'),
    method: 'get',
    params: httpRequest.adornParams(params)
  }),
  postLogin: ((data = {}) => httpRequest({
    url: httpRequest.adornUrl('/login'),
    method: 'post',
    data: httpRequest.adornData(data)
  })),
  postLoginOut: ((data = {}) => httpRequest({
    url: httpRequest.adornUrl('/sys/logout'),
    method: 'post',
    data: httpRequest.adornData(data)
  })),
  postOrPutMenu: ((data = {}) => httpRequest({
    url: httpRequest.adornUrl(`/v1/menus/${data.menuId ? "update" : "create"}`),
    method: `${data.menuId ? "put" : "post"}`,
    data: httpRequest.adornData(data)
  })),
  deleteMenu: (params = {}) => httpRequest({
    url: httpRequest.adornUrl('/v1/menus/del'),
    method: 'delete',
    params: httpRequest.adornParams(params)
  }),
}

// export default api
export default { //作为组件库(install)
  install: function (Vue, name = "$http") { //自定义名字(vue-resource也使用$http)
    Object.defineProperty(Vue.prototype, name, {
      value: api
    }); //将组件库挂载在原型对象上
    Vue.http = api;
  }
}
