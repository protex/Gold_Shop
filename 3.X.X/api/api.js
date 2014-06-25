

var api = (function() {

    return {

        name: 'api',

        module: 'shop',

        initFast: true,

        init: function () {

            var start = setInterval(function() {
                if (!$.isReady) return;
                clearInterval(start);

            var route = pb.data('route').name;
                if ( route == 'thread' || route == 'list_posts' || route == 'conversation' || route == 'list_messages' ){
                    vitals.shop.api.addProfileItems();
                }

            proboards.on('pageChange', function () { vitals.shop.api.addProfileItems() });

            }, 100);            

        },

        addProfileItems: function () {
            $('.mini-profile').each(function(){
                var x = $(this).find('.user-link').attr('class').match(/user-[0-9]/).toString().replace(/user-/, '');
                $(this).append('<span onclick="vitals.shop.api.createItemBox(\'' + x + '\')">Shop Items</span>');
            });
        },

        get: function(user) {

            if (user == null || user == undefined) user = pb.data('user').id;

            return pb.plugin.key('gold_shop').get(user);

        },

        set: function(args) {

            pb.plugin.key('gold_shop').set(args);

        },

        update: function() {

            pb.window.alert('update', {

                title: "Gold Shop Updater",
                html: "The Gold Shop was updated and needs to change some of your data, this will not affect any of your items",
                buttons: {

                    "OK": function() {

                        var data = pb.plugin.key('gold_shop').get(),
                            object = {
                                b: {},
                                r: {}
                            };

                        if (data.b.length > 0) {

                            for ( var i in data.b) {

                                console.log(object.b[data.b[i]] == undefined);

                                if (object.b[data.b[i]] == undefined) {

                                    object.b[data.b[i]] = countInArray(data.b, data.b[i]);

                                }

                            }

                        }

                        if (data.r.length > 0) {

                            for ( var i in data.r) {

                                console.log(object.r[data.r[i]] == undefined);

                                if (object.r[data.r[i]] == undefined) {

                                    object.r[data.r[i]] = countInArray(data.r, data.r[i]);

                                }

                            }

                        }

                        pb.plugin.key('gold_shop').set({
                            object_id: pb.data('user').id,
                            value: object
                        });

                        $(this).dialog('close');                        

                    }



                },

            });

        function countInArray(array, what) {
                var count = 0;
                for (var xyz = 0; xyz < array.length; xyz++) {
                    if (array[xyz] === what) {
                        count++;
                    }
                }
                return count;
            }

        },

        add: function(amount, id, given, user) {

            if (user == undefined || user == null)
                user = pb.data('user').id; 

            if( typeof this.get( user ) !== "object" )
                this.set( { 
                    object_id: user, 
                    value: { 
                        b:{}, 
                        r:{} 
                    } 
                } );            

            if ( given == true )
                type = "r";
            else 
                type = "b";           

            for (var i = 0; i < amount; i++) {

                this.increment(id, type, user);

            }

            this.set({
                object_id: user,
                value: this.get( user )
            });

        },

        increment: function(id, type, user) {

            if (user == undefined || user == null)
                user = pb.data('user').id;

            if (this.get( user )[type][id] != undefined) {

                this.get( user )[type][id] = ( parseInt(this.get( user )[type][id]) + 1 );

            } else {

                this.get( user )[type][id] = 1;

            }

        },

        subtract: function(amount, id, given, user) {

            if (user == undefined || user == null)
                user = pb.data('user').id;

            if ( typeof this.get( user ) !== "object" ) {
                this.set( { 
                    object_id: user, 
                    value: { 
                        b:{}, 
                        r:{} 
                    } 
                } );   
                return false;
            }                  

            for (var i = 0; i < amount; i++) {

                if ( this.get( user ).b[id] !== undefined && given != true) {
                    this.decrement(id, "b", user);

                }else if ( this.get( user).b[id] === undefined || given === true )
                    this.decrement( id, "r", user );
                else if ( given === true && this.get(user).r[id] === undefined )
                    this.decrement( id, "b", user)

            }

            this.set({
                object_id: user,
                value: this.get( user )
            });

        },

        decrement: function(id, type, user) {

            if (user == undefined || user == null)
                user = pb.data('user').id;

            if (this.get( user )[type][id] !== undefined) {

                this.get( user )[type][id] = ( parseInt(this.get( user )[type][id]) - 1 );

                if ( parseInt( this.get( user )[type][id] ) == 0 )

                    this.get( user )[type][id] = undefined;      
                                  
                }

        },

        createItemBox: function (user) {

            var data = vitals.shop.api.get( user ),
                html = '';

            pb.window.dialog('user_item_box', {
                title: 'Items',
                html: '<div id="items-container"></div><div style="float: right; min-height: 75px" id="item-info-box">', 
                width: "500px",  
                buttons: {
                    "Close": function(){
                        $(this).dialog('close');
                    },
                },
            });

            vitals.shop.profilePage.addItems(user);

            vitals.shop.profilePage.addCss();

        },

        removeNavItem: function (args) {

            var array
                _nav = $('#nav-tree');

            if ( Object.prototype.toString.call(args) !== "[object Array]" )
                array = new Array(args);
            else
                array = args;

            for ( i in array ) { 

                _nav.find('[href="' + array[i].toString() + '"]').parentsUntil('#nav-tree').remove();

            }       

            return vitals.shop.api;
        },        

        register: function () {
            vitals.shop.mainFrame.register(this);
        }

    };

})().register();