cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad: function () {
        this.node.name = "wall#" + Date.now();
    },


});
