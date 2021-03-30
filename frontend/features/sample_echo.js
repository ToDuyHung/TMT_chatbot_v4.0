/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

 resp = require("../response/response.js");
 request = require("request");
 sync = require("sync-request");
 
 var UserController = require("../utils/usercontroller.js");
 const CONVERSATION_MANAGER_ENDPOINT = "http://localhost:5000/api/send-message";
 
 var userController = new UserController();

module.exports = function(controller) {

    function transfer_to_admin(bot, message, body) {
        bot.reply(message, {
            text: resp.transfer_to_admin,
        });
    }
    function found_id_product(bot, message, body) {
        bot.reply(message, {
            text: resp.found_id_product + body[0]['product_name'],
        });
    }

    function rep_hello(bot, message, body){
        bot.reply(message, {
            text: resp.rep_hello,
        });
    }

    function rep_done(bot, message, body){
        bot.reply(message, {
            text: resp.rep_done,
        });
    }

    function rep_inform(bot, message, body){
        bot.reply(message, {
            text: resp.rep_inform + String(body[0][2]) + " " + body[0][3] + " " + body[0][0] + " size " + body[0][1],
        });
    }

    function rep_request(bot, message, body){
        bot.reply(message, {
            text: resp.rep_request,
        });
    }

    function rep_feedback(bot, message, body){
        bot.reply(message, {
            text: resp.rep_feedback,
        });
    }

    // Giong rep_inform
    function rep_connect(bot, message, body){
        bot.reply(message, {
            text: resp.rep_connect,
        });
    }

    function rep_order(bot, message, body){
        bot.reply(message, {
            text: resp.rep_order,
        });
    }

    function rep_order_color(bot, message, body){
        bot.reply(message, {
            text: resp.rep_order_color,
            product_introduction: body[0],
        });
    }

    function rep_order_size(bot, message, body){
        bot.reply(message, {
            text: resp.rep_order_size,
            product_introduction: body[0],
        });
    }

    function rep_order_amount(bot, message, body){
        bot.reply(message, {
            text: resp.rep_order_amount,
            product_introduction: body[0],
        });
    }

    function rep_order_product_name(bot, message, body){
        bot.reply(message, {
            text: resp.rep_order_product_name,
        });
    }

    function rep_changing(bot, message, body){
        bot.reply(message, {
            text: resp.rep_changing,
        });
    }

    function rep_return(bot, message, body){
        bot.reply(message, {
            text: resp.rep_return,
        });
    }

    function have_product_name(bot, message, body){
        bot.reply(message, {
            text: resp.have_product_name,
        });
    }

    function nothing(bot, message, body) {
        bot.reply(message, {
            text: resp.n,
        });
    }

    function dont_reg_color(bot, message, body) {
        bot.reply(message, {
            text: resp.dont_reg_color,
        });
    }

    function misunderstand_color(bot, message, body) {
        bot.reply(message, {
            text: resp.misunderstand_color,
        });
    }

    function misunderstand_size(bot, message, body) {
        bot.reply(message, {
            text: resp.misunderstand_size,
        });
    }

    function misunderstand_amount(bot, message, body) {
        bot.reply(message, {
            text: resp.misunderstand_amount,
        });
    }

    function misunderstand_product_name(bot, message, body) {
        bot.reply(message, {
            text: resp.misunderstand_product_name,
        });
    }

    function not_found_product(bot, message, body) {
        bot.reply(message, {
            text: resp.not_found_product,
        });
    }

    function not_found_product_from_image(bot, message, body) {
        bot.reply(message, {
            text: resp.not_found_product_from_image,
        });
    }

    function found_lots_products(bot, message, body) {
        bot.reply(message, {
            text: resp.found_lots_products + ' ' + body[0][0],
        });
    }

    function handleUnknown(bot, message, body) {
        bot.reply(message, {
            text: resp.dontunderstand,
        });
    }

    function handleError(bot, message, body) {
        bot.reply(message, {
            text: resp.err,
        });
    }

    function callConversationManager(bot, message, body) {
        var body = null;
        var id = message.user;

        var raw_mesg = message.text;
        if (
            new RegExp(
                [
                    "tks",
                    "thanks",
                    "thank",
                    "cảm ơn",
                    "cam on",
                    "cảm ơn bạn",
                    "Cảm ơn",
                    "bye",
                ].join("|")
            ).test(message.text.toLowerCase())
        ) {
            bot.reply(message, {
                text: "Cảm ơn bạn. Hẹn gặp lại!",
                goodbye: true,
            });
            return;
        }
        if (message.type === "confirm") {
            bot.reply(message, {
                text: `bạn muốn hỏi gì về  ${message.name}?`,
            });
        }
        console.log(message);
        if (message.tthc_name) {
            bot.reply(message, {
                text: `Bạn đã chọn thủ tục: ${message.tthc_name}. Bạn muốn hỏi gì về thủ tục này?`,
            });
            return;
        }
        request.post(
            CONVERSATION_MANAGER_ENDPOINT,
            {
                json: {
                    message: message.text,
                    image: message.image,
                    state: message.tthc_id ? message.tthc_id : "not_found",
                },
            },
            (error, res, body) => {
                if (error) {
                    console.log(error);
                    handleError(bot, message, body);
                    return;
                }
                // console.log(message);
                if (message.user == "master") {
                    // console.log(bot);
                    broadcast(message);
                }
                console.log(message.user)
                switch (body[1].type) {
                    case "True":
                        shopping_True(bot, message, body);
                        break;
                    case "False":
                        shopping_False(bot, message, body);
                        break;
                    case "tentthc":
                        handleListTTHC(bot, message, body);
                        break;
                    case "coquan_linhvuc":
                        handleCoQuanLinhVuc(bot, message, body);
                        break;
                    case "coquan":
                        handleCoQuan(bot, message, body);
                        break;
                    case "linhvuc":
                        handleLinhVuc(bot, message, body);
                        break;
                    case "thoigian":
                        handleThoiGian(bot, message, body);
                        break;
                    case "chiphi":
                        handleChiPhi(bot, message, body);
                        break;
                    case "diadiem":
                        handleDiaDiem(bot, message, body);
                        break;
                    // case "giayto":
                    //     handleGiayTo(bot, message, body);
                    //     break;
                    case "ketqua":
                        handleKetQua(bot, message, body);
                        break;
                    case "thuchien":
                        handleThucHien(bot, message, body);
                        break;
                    case "color_size":
                        color_size(bot, message, body);
                        break;
                    case "color":
                        color(bot, message, body);
                        break;
                    case "size":
                        size(bot, message, body);
                        break;
                    case "transfer_to_admin":
                        transfer_to_admin(bot, message, body);
                        break;
                    case "found_id_product":
                        found_id_product(bot, message, body);
                        break;
                    case "rep_hello":
                        rep_hello(bot, message, body);
                        break;
                    case "rep_done":
                        rep_done(bot, message, body);
                        break;
                    case "rep_inform":
                        rep_inform(bot, message, body);
                        console.log(body[0])
                        break;
                    case "rep_request":
                        rep_request(bot, message, body);
                        break;
                    case "rep_feedback":
                        rep_feedback(bot, message, body);
                        break;
                    case "rep_connect":
                        rep_connect(bot, message, body);
                        break;
                    case "rep_order":
                        rep_inform(bot, message, body);
                        console.log(body[0])
                        break;
                    case "rep_order_color":
                        rep_order_color(bot, message, body);
                        break;
                    case "rep_order_size":
                        rep_order_size(bot, message, body);
                        break;
                    case "rep_order_amount":
                        rep_order_amount(bot, message, body);
                        break;
                    case "rep_order_product_name":
                        rep_order_product_name(bot, message, body);
                        break;
                    case "rep_changing":
                        rep_changing(bot, message, body);
                        break;
                    case "rep_return":
                        rep_return(bot, message, body);
                        break;
                    case "have_product_name":
                        have_product_name(bot, message, body);
                        break;
                    case "nothing":
                        nothing(bot, message, body);
                        break;
                    case "dont_reg_color":
                        dont_reg_color(bot, message, body);
                        break;
                    case "misunderstand_color":
                        misunderstand_color(bot, message, body);
                        break;
                    case "misunderstand_size":
                        misunderstand_size(bot, message, body);
                        break;
                    case "misunderstand_amount":
                        misunderstand_amount(bot, message, body);
                        break;
                    case "misunderstand_product_name":
                        misunderstand_product_name(bot, message, body);
                        break;
                    case "not_found_product":
                        not_found_product(bot, message, body);
                        break;

                    case "not_found_product_from_image":
                        not_found_product_from_image(bot, message, body);
                        break;

                    case "found_lots_products":
                        found_lots_products(bot, message, body);
                        break;
                    default:
                        handleUnknown(bot, message, body);
                }
            }
        );

        var user = userController.searchSession(id);
        if (user == null) {
            user = userController.insertSession(id, bot);
        }
        // console.log(id);
        if (raw_mesg) {
            if (conversation[message.user]) {
                conversation[message.user].push("user: " + raw_mesg);
            } else {
                conversation[message.user] = ["user: " + raw_mesg];
            }
        }
        if (message.quit) {
            restartConversation(bot, message);
            return;
        }

        // if (message.completed) {
        //     bot.reply(message, {
        //         text: resp.goodbye[Math.floor(Math.random() * resp.goodbye.length)],
        //         force_result: [
        //             {
        //                 title: 'Bắt đầu hội thoại mới',
        //                 payload: {
        //                     'restart_conversation': true
        //                 }
        //             }
        //         ]
        //     });
        //     var success = userController.deleteSession(id);
        //     if (!success) {
        //         console.log("Error in delete function");
        //     } else {
        //         console.log("Delete success");
        //     }
        //     return;
        // }
        // if (message.restart_conversation) {
        //     bot.reply(message, {
        //         text: resp.hello
        //     });
        //     return;
        // }
        // if (!promiseBucket[id]) {
        //     promiseBucket[id] = []
        // }
        // var bucket = promiseBucket[id]
        // var pLoading = { value: true };
        // bucket.push(pLoading)

        // if (raw_mesg && raw_mesg.length > 0) {
        //     var messageBack = raw_mesg;
        //     if (message.continueToConversation != undefined && message.continueToConversation != null){
        //         handleInformResponse(bot, message, message.continueToConversation);
        //         return;
        //     }
        //     if (message.userResponeToInform != null){
        //         if (message.userResponeToInform.anything){
        //             userAction = message.userResponeToInform.userAction;
        //             for (var prop in userAction.inform_slots){
        //                 // if (userAction.inform_slots.hasOwnProperty(prop)){
        //                 //     userAction.inform_slots.prop = 'anything'
        //                 // }
        //                 userAction.inform_slots[prop] = 'anything';
        //             }
        //             delete userAction.round;
        //             delete userAction.speaker;
        //             messageBack = userAction;
        //         }
        //         else if (message.userResponeToInform.acceptInform){
        //             userAction = message.userResponeToInform.userAction;
        //             delete userAction.round;
        //             delete userAction.speaker;
        //             messageBack = userAction;
        //         } else {
        //             var enableEditInform = null;
        //             userAction = message.userResponeToInform.userAction;
        //             slot = resp.AGENT_INFORM_OBJECT[Object.keys(userAction.inform_slots)[0]];
        //             var msg = `Vậy ${slot} là gì bạn?`;
        //             if (message.userResponeToInform.enableEditInform != null){
        //                 enableEditInform = message.userResponeToInform.enableEditInform;
        //                 msg = `Vậy bạn điều chỉnh lại thông tin giúp mình nhé!`;
        //             }

        //             bot.reply(message, {
        //                     text: msg,
        //                     enableEditInform : enableEditInform
        //                 });
        //             return;

        //         }
        //     }
        //     if (message.userResponeToMatchfound != null){
        //         if (message.userResponeToMatchfound.acceptMatchfound){
        //             messageBack = {intent: "done", inform_slots:{}, request_slots: {}}
        //         } else {
        //             messageBack = {intent: "reject", inform_slots:{}, request_slots: {}}
        //         }
        //     }
        //     if (message.userEditedInformSlot != null){
        //         userAction = {intent: "inform", request_slots: {}, inform_slots:message.userEditedInformSlot.userInform};
        //         messageBack = userAction;
        //     }
        //     console.log("request action::#########")
        //     console.log(messageBack)
        //     request.post(CONVERSATION_MANAGER_ENDPOINT, {
        //         json: {
        //             message: messageBack,
        //             state_tracker_id: id
        //         }
        //     }, (error, res, body) => {
        //         intent = null;

        //         if (error || res.statusCode != 200) {
        //             console.log(error);
        //             bot.reply(message, {
        //                 text: resp.err
        //             });
        //             return;
        //         }
        //         if (body != null && body.agent_action != null){
        //             console.log(body.agent_action)
        //             currentRound += 1;
        //             switch (body.agent_action.intent){
        //                 case "inform":
        //                     handleInformResponse(bot, message, body);
        //                     break;
        //                 case "match_found":
        //                     console.log(body.agent_action.inform_slots[body.agent_action.inform_slots['activity']])

        //                     handleMatchfoundResponse(bot, message, body);
        //                     break;
        //                 case "done":
        //                     handleDoneResponse(bot, message, body);
        //                     break;
        //                 case "hello":
        //                     handleHelloResponse(bot, message, body);
        //                     break;
        //                 case "no_name":
        //                     handleNonameResponse(bot, message, body);
        //                     break;
        //                 default:
        //                     bot.reply(message, {
        //                         text: body.message
        //                     })
        //             }

        //             return;
        //         }

        //     });

        // }
    }

        // var user = userController.searchSession(id);
        // if (user == null) {
        //     user = userController.insertSession(id, bot);
        // }

    // controller.hears('sample','message,direct_message', async(bot, message) => {
    //     await bot.reply(message, 'I heard a sample message.');
    // });

    controller.on('message,direct_message', async(bot, message, body) => {
        await bot.reply(message, `Echo: ${ message.text }`);
        callConversationManager(bot, message, body);
    });

}
