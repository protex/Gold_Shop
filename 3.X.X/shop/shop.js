var vitals = vitals || {};
var goldShop = pb.plugin.get('gold_shop');
vitals.shop = {
    data: {

            version: "",

            userData: {

                b: {},

                r: {},

            },

            user: {

                username: pb.data('user').username,
                displayname: pb.data('user').name,
                id: pb.data('user').id,

            },

            shopVariables: {

                shopName: goldShop.settings.shopName,
                shopMessage: goldShop.settings.welcome_message,
                categories: goldShop.settings.categories,
                items: goldShop.settings.items,
                packages: {},

                images: {
                    dollar: (goldShop.settings.dollar_image_replacement !== "")? goldShop.settings.dollar_image_replacement: goldShop.images.DollarSmall,
                    information: goldShop.images.InformationSmall,
                    dollarLarge: goldShop.images.DollarLarge,
                    yootilBar: goldShop.images.shop_20x20,
                    infoLarge: goldShop.images.InformationLarge,
                    shopLarge: goldShop.images.ShopLarge,
                    package: goldShop.images.package
                },

                styles: {

                    shopItem: {
                        "border-width": goldShop.settings.item_border_width + 'px',
                        "border-style": goldShop.settings.item_border_style,
                        "border-color": goldShop.settings.item_border_color,
                        "width": goldShop.settings.item_total_width,
                        "height": goldShop.settings.item_total_height,
                        "border-top-left-radius": goldShop.settings.item_border_top_left_radius,
                        "border-top-right-radius": goldShop.settings.item_border_top_right_radius,
                        "border-bottom-right-radius": goldShop.settings.item_border_bottom_left_radius,
                        "border-bottom-left-radius": goldShop.settings.item_border_bottom_right_radius,
                        "padding": "0px",
                        "margin": "5px",
                        "float": "left",
                    },

                    shopItemName: {
                        "width": "100%",
                        "font-weight": "bolder",
                        "text-align": "center",
                    },

                    shopContent: {
                        "padding": "auto",
                    },

                    shopItemInner: {
                        "position": "relative",
                        "width": "100%",
                        "height": "100%",
                        "border-top-left-radius": goldShop.settings.item_border_top_left_radius,
                        "border-top-right-radius": goldShop.settings.item_border_top_right_radius,
                        "border-bottom-right-radius": goldShop.settings.item_border_bottom_left_radius,
                        "border-bottom-left-radius": goldShop.settings.item_border_bottom_right_radius,
                    },

                    shopItemInfo: {
                        "margin-left": "10px"
                    },

                    shopItemOverlay: {
                        "position": "absolute",
                        "z-index": "50000",
                        "left": "0",
                        "top": "0",
                        "background-color": "grey",
                        "opacity": "0.5",
                        "filter": "Alpha(opacity=50)",
                        "width": "100%",
                        "height": "100%",
                        "display": "none",
                        "border-top-left-radius": goldShop.settings.item_border_top_left_radius,
                        "border-top-right-radius": goldShop.settings.item_border_top_right_radius,
                        "border-bottom-right-radius": goldShop.settings.item_border_bottom_left_radius,
                        "border-bottom-left-radius": goldShop.settings.item_border_bottom_right_radius,
                    },

                    shopItemIcon: {
                        "margin-top": "15px",
                        "cursor": "pointer",
                    },

                    shopItemIconLeft: {
                        "float": "left",
                        "margin-left": "10px",
                    },

                    shopItemIconRight: {
                        "float": "right",
                        "margin-right": "10px",
                    },

                    returnImageBox: {
                        "width": "225px",
                        "height": "225px",
                    },

                    catBar: {
                        "width": "100%",
                        "height": "20px",
                    },

                    catSelected: {
                        "background-color": "#" + goldShop.settings.category_selected_color,
                    },

                    catBarItem: {
                        "background-color": "#" + goldShop.settings.category_bar_color,
                    },

                },

            },

        },
};