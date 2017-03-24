cc.Class({
    extends: cc.Component,

    properties: {
        
    },

     onLoad: function () {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.node.name = 'danger#' + Date.now();
    },

    onCollisionEnter: function(other,self){
        if(other.node.group == 'shadow-player'){
            other.node.removeFromParent();
        }else if(other.node.group == 'player'){
            cc.find('Canvas').emit('player-touch-danger');
        }
    }
});
