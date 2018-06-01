// select which fieds will be in the header &  rows
// for example: 'genre' in header, 'year' in rows etc.
function StructureSet(params, parent) {

    // private:
    var 
        parent = parent,
        params = params,
        name = params['name'],
        code = params['code'],
        __value = undefined,
        __onCheck,
        __onUncheck;


    function check() {
        var currValue = $('.structure__body input[type="radio"][name="' + code + '"]:checked').val();

        if (__value == undefined) {
            __value = currValue;
            __onCheck(params);
        } else if (__value != currValue) {
            __value = currValue;
        } else {
            // uncheck all 
            $('.structure__body input[type="radio"][name="' + code + '"]').prop("checked", false);
            __value = undefined;
            __onUncheck(params);
        }
    }

    var item = $('<tr/>')
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



        $(parent).append($(item));
    // public:

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

    this.value = function () {
        return __value;
    }
    this.code = function () {
       return code;
    }

}


// set what kind of data will be showed in cube
// for example: 'count' or 'profit'
function Measurements(params, parent) {
    var list = params,
        parent = $(parent),
        __value;

    function onClick(id) {
        __value = id;
    }

    $(parent).empty();
    list.forEach(function (element) {
        var item = $('<label/>', {
            text: element['name'],
            for: element['code']
        }).prepend($('<input/>', {
            name: 'measure',
            id: element['code'],
            type: 'radio',
            value: element['code']
        }))
        .click( function(e) {
             onClick(element['code']);
        });
        $(parent).append($(item));

    }, this);


    // this.data = data;
    // this.append = function (parent) {
    //     $(parent).append($(data));
    //     // $('.measurements__body').append($(data));
    // }
    this.value = function () {
        return __value;
    }


}

// select which values of field will be used
// for example: values '2012','2015' for field "year"
function DropDownList(params, parent) {

    var name = params['name'],
        id = params['id'],
        code = params['code'],
        list = params['data'],
        __values;

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
                    value: ((element['id'] == undefined)? element['name'] : element['id'])
                }))
            );
        $(ul).append($(tmpLi));

    }, this);

    var data = $('<div/>', {
        class: 'menu',
        id: code
    });

    data.append($('<span/>', {
                class: 'title',
                text: name
            })
            .click(function () {
                $(data).toggleClass('open');
            })
        )
        .append($(ul));

    $(parent).append($(data));
    // this.data = data;
    // this.append = function (parent) {

    //     $(parent).append($(data));
    //     // $('.drop-down-list').append($(data));
    // }
    this.values = function () {
        __values = [];
        var i = 0;
        $('.drop-down-list #'+code+'.menu input[type="checkbox"]:checked').each(function (i, item) {
            __values[i++] = $(item).val();
        }, this);
        return __values;
    }
    this.code = function () {
       return code;
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

    var data = new Measurements({
            "id": 1,
            "code": "count",
            "name": "Количество"
        });

    $('.measurements__body').empty().append($(data.data));

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
    $('.drop-down-list').empty().append($(list.data));

*/