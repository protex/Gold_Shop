
        find_amount: function(obj, val) {
            var objects = [];
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                    if (typeof obj[i] == 'object') {
                        objects = objects.concat(vitals.shop.find_amount(obj[i], val));
                    } else if (obj[i] == val && i != '') {
                    objects.push(i);
                }
            }
        return objects;
        },