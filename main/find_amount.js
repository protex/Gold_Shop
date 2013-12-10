

        /*
        * Function find_amount
        * purpose: to find the amount of a certain item in an array
        * variables:
        * obj: the array to check
        * val: the value you wish to find
        */
        find_amount: function(obj, val) {

            // An emty array
            var objects = [];

            // loop through the array passed in the function variable obj
            for (var i in obj) {

                // Check if the current loop is actually on an array property
                if (!obj.hasOwnProperty(i)) continue;

                // Check if the current loop points to an object
                if (typeof obj[i] == 'object') {

                    // If it does, we we check and see if the inner object contains our value using this function, then join the two functions together
                    objects = objects.concat(vitals.shop.find_amount(obj[i], val));

                    // If it's not an object, check if the current loop points to a value that matches the value were looking for, also make sure i isn't blank
                } else if (obj[i] == val && i != '') {

                    // Push the key to the object
                    objects.push(i);

                }

            }

            // Return objects for later use
            return objects;

        },