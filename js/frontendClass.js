// select which fieds will be in the header &  rows
// for example: 'genre' in header, 'year' in rows etc.
function StructureSet(params) {

    var params = params,
        name = params['name'],
        id = params['id'],
        code = params['code'],
        tmpCheck = undefined,
        item;

    var __onCheck, __onUncheck;
    this.onCheck = function (promise) {
        __onCheck = function (params) {
            return promise(params);
        }
    }

    this.onUncheck = function (promise) {
        __onUncheck = function (params) {
            return promise(params);
        }
    }

    function check() {
        var currValue = $('input[type="radio"][name="' + code + '"]:checked').val();

        if (tmpCheck == undefined) {
            tmpCheck = currValue;
            __onCheck(params);
        } else if (tmpCheck != currValue) {
            tmpCheck = currValue;
        } else {
            // uncheck all 
            $('input[type="radio"][name="' + code + '"]').prop("checked", false);
            tmpCheck = undefined;
            __onUncheck(params);
        }
    }

    item = $('<tr/>')
        .append($('<th/>', {
            text: name
        }))
        .append($('<td/>')
            .append($('<input/>', {
                type: 'radio',
                name: code,
                value: 'header'
            }).click(function (e) {
                check();
            })))
        .append($('<td/>')
            .append($('<input/>', {
                type: 'radio',
                name: code,
                value: 'row'
            }).click(function (e) {
                check();
            })));



    // return tr;

    this.item = item;
    this.append = function (parent) {

        $(parent).append($(item));
    }

}


// set what kind of data will be showed in cube
// for example: 'count' or 'profit'
function Measurements(params) {
    var name = params['name'],
        id = params['id'],
        code = params['code'],
        item;

    item = $('<label/>', {
        text: name,
        for: code
    }).prepend($('<input/>', {
        name: 'measure',
        id: code,
        type: 'radio',
        value: id
    }))

    this.item = item;
    this.append = function (parent) {

        $(parent).append($(item));
        // $('.measurements__body').append($(item));
    }

}

// select which values of field will be used
// for example: values '2012','2015' for field "year"
function DropDownList(params) {

    var name = params['name'],
        id = params['id'],
        code = params['code'],
        list = params['data'];

    var ul = $('<ul/>');

    list.forEach(function (element) {
        var tmpLi = $('<li/>')
            .append($('<label/>', {
                    text: element['name'],
                    for: (element['name'] + element['id'])
                })
                .prepend($('<input/>', {
                    type: 'checkbox',
                    name: (element['name'] + element['id']),
                    id: (element['name'] + element['id']),
                    value: element['id']
                }))
            );
        $(ul).append($(tmpLi));

    }, this);

    var item = $('<div/>', {
        class: 'menu',
        id: code
    });

    item.append($('<span/>', {
                class: 'title',
                text: name
            })
            .click(function () {
                $(item).toggleClass('open');
            })
        )
        .append($(ul));

    this.item = item;
    this.append = function (parent) {

        $(parent).append($(item));
        // $('.drop-down-list').append($(item));
    }

}


/*
   var params = {
            "id": 1,
            "code": "countries",
            "name": "Страна"
        };
    var tr = new StructureSet(params);
    tr.append(true);

    var item = new Measurements({
            "id": 1,
            "code": "count",
            "name": "Количество"
        });

    $('.measurements__body').empty().append($(item.item));

    params['data'] = [{
            "id": "1",
            "name": "Россия"
        },
        {
            "id": "2",
            "name": "Япония"
        },
        {
            "id": "3",
            "name": "Китай"
        }
    ];

    var list = new DropDownList(params);
    $('.drop-down-list').empty().append($(list.item));

*/