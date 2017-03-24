cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    onLoad: function () {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.node.name = 'gate#' + Date.now();
    },

    onCollisionEnter: function(other,self){
        if(other.node.group == 'shadow-player' || other.node.group == 'player'){
            cc.find('Canvas').emit('touch-gate');
        }
    }

});
