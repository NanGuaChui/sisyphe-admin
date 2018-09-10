const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,

    userCode: state => state.user.userCode,
    userName: state => state.user.userName,

    routers: state => state.permission.routers,
    addRouters: state => state.permission.addRouters,

    // menus: state => state.user.menus,
    station: state => state.user.station,
    scopeStations: state => state.user.scopeStations,
    currentStation: state => state.user.currentStation,

    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,

    toggle: state => state.auth.toggle,
    authorizeKey: state => state.auth.authorizeKey
};
export default getters;
