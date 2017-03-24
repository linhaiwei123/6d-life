cc.Class({
    extends: cc.Component,

    properties: {
        _left: false,
        _right: false,
        _up: false,
        _down: false,

        _jumping: false,
        jumpY: 40,
        speedX: 5,
        _speedY: 0,
        g: -10,

        _leftBlock: 0,
        _rightBlock: 0,
        _upBlock: 0,
        _downBlock: 0,

        _anim: null,
        _animState : null,
    },

    onLoad: function () {
        this._anim = this.getComponent(cc.Animation);
        cc.systemEvent.on('keydown',this.onKeyDown,this);
        cc.systemEvent.on('keyup',this.onKeyUp,this);

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },

    onCollisionEnter: function(other,self){

        if(other.node.group == 'btn' || other.node.group == 'toggle'|| other.node.group == 'gate' || other.node.group == 'danger'){
            return;
        }

        let blockArray = [];
        let selfAabb = self.world.aabb;
        let otherAabb = other.world.aabb;
        let selfPreAabb = self.world.preAabb;
        let otherPreAabb = other.world.preAabb;

        if(selfPreAabb.xMax <= otherAabb.xMin && selfAabb.xMax >= otherAabb.xMin){
            //right block
            //console.log('right');
            let worldPositionX = selfAabb.center.x - Math.abs(otherAabb.xMin - selfAabb.xMax);
            this.node.x = this.node.parent.convertToNodeSpaceAR(cc.v2(worldPositionX,0)).x;
            blockArray.push("_rightBlock");
            this._rightBlock++;
        }
        if(selfPreAabb.xMin >= otherAabb.xMax && selfAabb.xMin <= otherAabb.xMax){
            //left block
            //console.log('left');
            let worldPositionX = selfAabb.center.x  +  Math.abs(otherAabb.xMax - selfAabb.xMin);
            this.node.x = this.node.parent.convertToNodeSpaceAR(cc.v2(worldPositionX,0)).x;
            blockArray.push("_leftBlock");
            this._leftBlock++;
        }
        if(selfPreAabb.yMax <= otherAabb.yMin && selfAabb.yMax >= otherAabb.yMin){
            //up block
            //console.log('up');
            let worldPositionY = selfAabb.center.y - Math.abs(otherAabb.yMin - selfAabb.yMax);
            this.node.y = this.node.parent.convertToNodeSpaceAR(cc.v2(0,worldPositionY)).y;
            blockArray.push("_upBlock");
            this._upBlock++;
        }
        if(selfPreAabb.yMin >= otherAabb.yMax && selfAabb.yMin <= otherAabb.yMax){
            //down block
            //console.log('down');
            let worldPositionY = selfAabb.center.y + Math.abs(otherAabb.yMax - selfAabb.yMin);
            this.node.y = this.node.parent.convertToNodeSpaceAR(cc.v2(0,worldPositionY)).y;
            blockArray.push("_downBlock");
            this._jumping = false;
            this._downBlock++;
        }

        if(other.blockArrays == undefined){
            other.blockArrays = [];
        }
        other.blockArrays[this.node.name] = blockArray;
        
    },



    onCollisionExit: function(other,self){
        if(other.node.group == 'btn' || other.node.group == 'toggle'|| other.node.group == 'gate' || other.node.group == 'danger'){
            return;
        }
        if(other.blockArrays && other.blockArrays[this.node.name] != undefined){
            let blockArray = other.blockArrays[this.node.name]
            for(let item of blockArray){
                this[item]--;
            }
        }
    },

    onKeyDown: function(e){
        switch(e.keyCode){//离奇bug 
            case cc.KEY.left: {this._left = true;this.node.scaleX = -1;break;}
            case cc.KEY.right: {this._right = true;this.node.scaleX = 1;break;}
            case cc.KEY.up: {if(!this._jumping){this._up = true;this._jumping = true;}break;}
            case cc.KEY.down: {this._down = true;break;}
        };
        this.changeAnim();
    },

    onKeyUp: function(e){
        switch(e.keyCode){
            case cc.KEY.left: {this._left = false;break;}
            case cc.KEY.right: {this._right = false;break;}
            //case cc.KEY.up: {this._up = false;this._jumping = true;break;}
            case cc.KEY.down: {this._down = false;break;}
        }
        this.changeAnim();
    },
    //忘记录了
    //刚刚做了个帧动画

    changeAnim: function(){
        //check squat
        if(this._down){
            if(!this._animState || this._animState.name !== 'squat'){
                this._anim.stop();
                this._animState = this._anim.play('squat');
            }
        }
        //check jump
        else if(this._jumping){
            if(!this._animState || this._animState.name !== 'jump'){
                this._anim.stop();
                this._animState = this._anim.play('jump');
            }
        }
        //check move
        else if(this._left == false && this._right == true ||
           this._left == true && this._right == false){
               if(!this._animState || this._animState.name !== 'move'){
                    this._anim.stop();
                    this._animState = this._anim.play('move');
               }
           }
        //check idle
        else if(this._left == false && this._right == false ||
                this._left == true && this._right == true){
                    if(!this._animState || this._animState.name !== 'idle'){
                        this._anim.stop();
                        this._animState = this._anim.play('idle');
                    }
                }
    },//等会简单演示下帧动画的制作吧。。


    update: function(dt){
        if(this._left && !this._leftBlock){this.node.x -= this.speedX};
        if(this._right && !this._rightBlock){this.node.x += this.speedX};
        
        if(!this._downBlock){
            this._speedY += this.g * dt;
        }else{
            this._speedY = 0;
            this._jumping = false;
            this.changeAnim();
        }
        if(this._up){
            this._speedY = this.jumpY;
            this._up = false;
            this._jumping = true;
        }
        let currentSpeedY = this._speedY;
        if(!!this._upBlock){
            currentSpeedY = Math.min(this._speedY,0);
        }
        this.node.y += currentSpeedY * dt;
    }

});
