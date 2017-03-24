cc.Class({
    extends: cc.Component,

   properties: {
        btnArray: [cc.Node],
        _initActive: [],
        _touchNum: 0
    },


    onLoad: function () {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.node.name = 'btn#' + Date.now();
    },

    start: function(){
        for(let item of this.btnArray){
            this._initActive[item.name] = item.active;
        }
    },

    onCollisionEnter: function(other,self){
        if(other.node.group == 'shadow-player' || other.node.group == 'player'){
            this._touchNum++;
            for(let item of this.btnArray){
                //warning  every item in scene should have unique name
                item.active = !this._initActive[item.name];
            }
        }
        console.log(this._touchNum);
    },

    onCollisionExit: function(other,self){
        if(other.node.group == 'shadow-player' || other.node.group == 'player'){
            this._touchNum--;
            if(!this._touchNum){
                for(let item of this.btnArray){
                    //warning  every item in scene should have unique name
                    item.active = this._initActive[item.name];
                }
            }
            
        }
        console.log(this._touchNum);
    },

    
});
