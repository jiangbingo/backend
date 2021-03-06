/**
 * Created by hxhuang on 15-11-3.
 */


var categoryApp = function () {
    var first_category = 0;
    var second_category = 0;
    var third_category = 0;
    var step = 1;
    var manufactor = 0;
    var brand = 0;
    var series = 0;
    var settings_series = 0;
    var settings_category = 0;
    var settings_attribute = 0;
    var checkboxFlag = false;
    var modalTmp;
    var settingModalFlag = false;

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    var changeClass = function (obj) {
        $(obj).addClass('selected').siblings().removeClass('selected');
    };

    var checkboxHide = function () {
        $('input[type=checkbox]').hide();
        checkboxFlag = false;
    };

    var batchDelete = function () {
        checkboxHide();
        $('button[data-type=normal]').show();
        $('button[data-for=batch-delete]').hide();
        bindCategoryMainBtn();
        var selected_ids = new Array();
        $('input[type="checkbox"]:checked').each(function () {
            selected_ids.push($(this).val());
        });
        var ids = selected_ids.join(',');
        if ($(this).attr('data-type') == 1) {
            console.log('confirm');
            if (brand != 0) {
                $.post(
                    encodeURI("/sdk/series/batch_delete/"),
                    {
                        'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
                        'ids': ids,
                    },
                    function (data) {
                        if (data.success == 1) {
                            for (var index in selected_ids) {
                                $('div.js-series[data-id="' + selected_ids[index] + '"]').remove();
                            }
                            series = 0;
                        }
                    },
                    "json"
                );
            } else if (manufactor != 0) {
                $.post(
                    encodeURI('/sdk/brand/batch_delete/'),
                    {
                        'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
                        'category_id': third_category,
                        'manufactor_id': manufactor,
                        'ids': ids,
                    },
                    function (data) {
                        if (data.success == 1) {
                            for (var index in selected_ids) {
                                $('div.js-brand[data-id="' + selected_ids[index] + '"]').remove();
                            }
                            brand = 0;
                        }
                    },
                    "json"
                );
            } else if (third_category != 0) {
                $.post(
                    encodeURI('/sdk/manufactor/batch_delete/'),
                    {
                        'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
                        'category_id': third_category,
                        'ids': ids,
                    },
                    function (data) {
                        if (data.success == 1) {
                            for (var index in selected_ids) {
                                $('div.js-manufactor[data-id="' + selected_ids[index] + '"]').remove();
                            }
                            manufactor = 0;
                        }
                    },
                    "json"
                );
            } else if (second_category != 0) {
                $.post(
                    encodeURI('/sdk/category/batch_delete/'),
                    {
                        'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
                        'ids': ids,
                    },
                    function (data) {
                        if (data.success == 1) {
                            for (var index in selected_ids) {
                                $('div.js-third-category[data-id="' + selected_ids[index] + '"]').remove();
                            }
                            third_category = 0;
                        }
                    },
                    "json"
                );
            } else if (first_category != 0) {
                $.post(
                    encodeURI('/sdk/category/batch_delete/'),
                    {
                        'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
                        'ids': ids,
                    },
                    function (data) {
                        if (data.success == 1) {
                            for (var index in selected_ids) {
                                $('div.js-second-category[data-id="' + selected_ids[index] + '"]').remove();
                            }
                            selected_manufactor = 0;
                        }
                    },
                    "json"
                );
            }
        } else if ($(this).attr('data-type') == 0) {
            var selected_series = $('.js-series.selected').attr('data-id');
            var selected_brand = $('.js-brand.selected').attr('data-id');
            var selected_manufactor = $('.js-manufactor.selected').attr('data-id');
            var selected_third_category = $('.js-third-category.selected').attr('data-id');
            var selected_second_category = $('.js-second-category.selected').attr('data-id');
            var selected_first_category = $('.js-first-category.selected').attr('data-id');
            if (selected_series != undefined)
                $('.js-series[data-id="' + selected_series + '"]').click();
            else if (selected_brand != undefined)
                $('.js-brand[data-id="' + selected_brand + '"]').click();
            else if (selected_manufactor != undefined)
                $('.js-manufactor[data-id="' + selected_manufactor + '"]').click();
            else if (selected_third_category != undefined)
                $('.js-third-category[data-id="' + selected_third_category + '"]').click();
            else if (selected_second_category != undefined)
                $('.js-second-category[data-id="' + selected_second_category + '"]').click();
            else if (selected_first_category != undefined)
                $('.js-first-category[data-id="' + selected_first_category + '"]').click();

            console.log('cancel');
        }
        $('input[type=checkbox]').removeAttr("checked");
    };

    var first_category_onclick = function () {
        $('.js-second-category-div').empty();
        $('.js-third-category-div').empty();
        $('.js-manufactor-div').empty();
        $('.js-brand-div').empty();
        $('.js-series-div').empty();
        first_category = 0;
        if (checkboxFlag) return;
        first_category = $(this).attr('data-id');
        changeClass(this);
        $.get(
            "/sdk/category/" + first_category + "/sub_categories/",
            {},
            function (data) {
                for (var index in data) {
                    var category = data[index];
                    $('.js-second-category-div').append('<div class="header js-second-category" data-id="' + category.id + '"><input type="checkbox" name="second-category-id" value="' + category.id + '"><div class="center-line js-second-category-name">' + category.name + '</div></div>');
                }
                $('.js-second-category').bind('click', second_category_onclick);
                checkboxHide();
            },
            "json"
        );
        second_category = 0;
        third_category = 0;
        manufactor = 0;
        brand = 0;
        series = 0;
    };

    var second_category_onclick = function () {
        $('.js-third-category-div').empty();
        $('.js-manufactor-div').empty();
        $('.js-brand-div').empty();
        $('.js-series-div').empty();
        second_category = 0;
        if (checkboxFlag) return;
        second_category = $(this).attr('data-id');
        changeClass(this);
        $.get(
            "/sdk/category/" + second_category + "/sub_categories/",
            {},
            function (data) {
                for (var index in data) {
                    var category = data[index];
                    $('.js-third-category-div').append('<div class="header js-third-category" data-id="' + category.id + '"><input type="checkbox" name="third-category-id" value="' + category.id + '"><div class="center-line js-third-category-name">' + category.name + '</div></div>');
                }
                $('.js-third-category').bind('click', third_category_onclick);
                checkboxHide();
            },
            "json"
        );
        third_category = 0;
        manufactor = 0;
        brand = 0;
        series = 0;
    };

    var third_category_onclick = function () {
        $('.js-manufactor-div').empty();
        $('.js-brand-div').empty();
        $('.js-series-div').empty();
        third_category = 0;
        if (checkboxFlag) return;
        third_category = $(this).attr('data-id');
        changeClass(this);
        $.get(
            "/sdk/category/" + third_category + "/manufactors/",
            {},
            function (data) {
                for (var index in data) {
                    var category = data[index];
                    $('.js-manufactor-div').append('<div class="header js-manufactor" data-id="' + category.id + '"><input type="checkbox" name="manufactor-id" value="' + category.id + '"><div class="center-line js-manufactor-name">' + category.name + '</div></div>');
                }
                $('.js-manufactor').bind('click', manufactor_onclick);
                checkboxHide();
            },
            "json"
        );
        manufactor = 0;
        brand = 0;
        series = 0;
    };

    var manufactor_onclick = function () {
        $('.js-brand-div').empty();
        $('.js-series-div').empty();
        manufactor = 0;
        if (checkboxFlag) return;
        manufactor = $(this).attr('data-id');
        changeClass(this);
        $.get(
            "/sdk/category/" + third_category + "/brands/",
            {'manufactor_id': manufactor},
            function (data) {

                for (var index in data) {
                    var category = data[index];
                    $('.js-brand-div').append('<div class="header js-brand" data-id="' + category.id + '"><input type="checkbox" name="brand-id" value="' + category.id + '"><div class="center-line js-brand-name">' + category.name + '</div></div>');
                }
                $('.js-brand').bind('click', brand_onclick);
                checkboxHide();
            },
            "json"
        );
        brand = 0;
        series = 0;
    };

    var brand_onclick = function () {
        $('.js-series-div').empty();
        brand = 0;
        if (checkboxFlag)  return;
        brand = $(this).attr('data-id');
        changeClass(this);
        $.get(
            "/sdk/brand/" + brand + "/series/",
            {},
            function (data) {
                for (var index in data) {
                    var category = data[index];
                    $('.js-series-div').append('<div class="header js-series" data-id="' + category.id + '"><input type="checkbox"  name="series-id" value="' + category.id + '"><div class="center-line js-series-name">' + category.name + '</div></div>');
                }
                $('.js-series').bind('click', series_onclick);
                checkboxHide();
            },
            "json"
        );
        series = 0;
    };

    var series_onclick = function () {
        series = 0;
        if (checkboxFlag)  return;
        series = $(this).attr('data-id');
        changeClass(this);
        $('.fa-cog').attr('category-id', third_category);
        $('.fa-cog').attr('series-id', series);
    };

    var add_second_category = function () {
        console.log(first_category);
        if (first_category != 0) {
            step = 2;
            $('.js-modal-save-button').bind('click', save_second_category);
            $('#addCategoryForm').modal({backdrop: 'static', keyboard: false});
            $('#addCategoryFormLabel').html('添加二级分类');
            $('.js-modal-category-label').html('二级分类名称');
            $('.js-modal-category-name').val('');
        }
    };

    var add_third_category = function () {
        console.log(second_category);
        if (second_category != 0) {
            step = 3;
            $('.js-modal-save-button').bind('click', save_third_category);
            $('#addCategoryForm').modal({backdrop: 'static', keyboard: false});
            $('#addCategoryFormLabel').html('添加三级分类');
            $('.js-modal-category-label').html('三级分类名称');
            $('.js-modal-category-name').val('');
        }
    };

    var add_manufactor = function () {
        if (third_category != 0) {
            $('.js-modal-save-button').bind('click', save_manufactor);
            $('#addCategoryForm').modal({backdrop: 'static', keyboard: false});
            $('#addCategoryFormLabel').html('添加厂家');
            $('.js-modal-category-label').html('厂家名称');
            $('.js-modal-category-name').val('');
        }
    };

    var add_brand = function () {
        if (manufactor != 0) {
            $('.js-modal-save-button').bind('click', save_brand);
            $('#addCategoryForm').modal({backdrop: 'static', keyboard: false});
            $('#addCategoryFormLabel').html('添加品牌');
            $('.js-modal-category-label').html('品牌名称');
            $('.js-modal-category-name').val('');
        }
    };

    var add_series = function () {
        if (brand != 0) {
            $('.js-modal-save-button').bind('click', save_series);
            $('#addCategoryForm').modal({backdrop: 'static', keyboard: false});
            $('#addCategoryFormLabel').html('添加系列');
            $('.js-modal-category-label').html('系列名称');
            $('.js-modal-category-name').val('');
        }
    };

    var save_second_category = function () {
        var category_name = $('.js-modal-category-name').val();
        if (first_category != 0) {
            $.post(
                "/sdk/category/",
                {
                    'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
                    'category_id': first_category,
                    'name': category_name,
                    'step': step
                },
                function (data) {
                    if (data.success == 1) {
                        $('.js-second-category-div').append('<div class="header js-second-category" data-id="' + data.category.id + '"><input type="checkbox" name="second-category-id" value="' + data.category.id + '"><div class="center-line js-second-category-name">' + data.category.name + '</div></div>');
                        $('div.js-second-category[data-id="' + data.category.id + '"]').on('click', second_category_onclick);
                        checkboxHide();
                        $('.js-modal-save-button').unbind('click');
                        $('#addCategoryForm').modal('hide');
                    } else {
                        sweetAlert(data.message);
                    }
                },
                "json"
            );
        }

    };

    var save_third_category = function () {
        var category_name = $('.js-modal-category-name').val();
        if (second_category != 0) {
            $.post(
                "/sdk/category/",
                {
                    'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
                    'category_id': second_category,
                    'name': category_name,
                    'step': step
                },
                function (data) {
                    if (data.success == 1) {
                        $('.js-third-category-div').append('<div class="header js-third-category" data-id="' + data.category.id + '"><input type="checkbox" name="third-category-id" value="' + data.category.id + '"><div class="center-line js-third-category-name">' + data.category.name + '</div></div>');
                        $('div.js-third-category[data-id="' + data.category.id + '"]').on('click', third_category_onclick);
                        checkboxHide();
                        $('.js-modal-save-button').unbind('click');
                        $('#addCategoryForm').modal('hide');
                    } else {
                        sweetAlert(data.message);
                    }
                },
                "json"
            );
        }

    };

    var save_manufactor = function () {
        var manufactor_name = $('.js-modal-category-name').val();
        if (third_category != 0) {
            $.post(
                "/sdk/manufactor/",
                {
                    'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
                    'category_id': third_category,
                    'name': manufactor_name,
                },
                function (data) {
                    if (data.success == 1) {
                        $('.js-manufactor-div').append('<div class="header js-manufactor" data-id="' + data.manufactor.id + '"><input type="checkbox" name="manufactor-id" value="' + data.manufactor.id + '"><div class="center-line js-manufactor-name">' + data.manufactor.name + '</div></div>');
                        $('div.js-manufactor[data-id="' + data.manufactor.id + '"]').on('click', manufactor_onclick);
                        checkboxHide();
                        $('.js-modal-save-button').unbind('click');
                        $('#addCategoryForm').modal('hide');
                    } else {
                        sweetAlert(data.message);
                    }
                },
                "json"
            );
        }

    };

    var save_brand = function () {
        var brand_name = $('.js-modal-category-name').val();
        if (manufactor != 0 && third_category != 0) {
            $.post(
                "/sdk/brand/",
                {
                    'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
                    'category_id': third_category,
                    'manufactor_id': manufactor,
                    'name': brand_name,
                },
                function (data) {
                    if (data.success == 1) {
                        $('.js-brand-div').append('<div class="header js-brand" data-id="' + data.brand.id + '"><input type="checkbox" name="brand-id" value="' + data.brand.id + '"><div class="center-line js-brand-name">' + data.brand.name + '</div></div>');
                        $('div.js-brand[data-id="' + data.brand.id + '"]').on('click', brand_onclick);
                        checkboxHide();
                        $('.js-modal-save-button').unbind('click');
                        $('#addCategoryForm').modal('hide');
                    } else {
                        sweetAlert(data.message);
                    }
                },
                "json"
            );
        }

    };

    var save_series = function () {
        var series_name = $('.js-modal-category-name').val();
        if (brand != 0) {
            $.post(
                "/sdk/series/",
                {
                    'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
                    'brand_id': brand,
                    'name': series_name,
                },
                function (data) {
                    if (data.success == 1) {
                        $('.js-series-div').append('<div class="header js-series" data-id="' + data.series.id + '"><input type="checkbox" name="series-id" value="' + data.series.id + '"><div class="center-line js-series-name">' + data.series.name + '</div></div>');
                        $('div.js-series[data-id="' + data.series.id + '"]').on('click', series_onclick);
                        checkboxHide();
                        $('.js-modal-save-button').unbind('click');
                        $('#addCategoryForm').modal('hide');
                    } else {
                        sweetAlert(data.message);
                    }
                },
                "json"
            );
        }

    };

    var deleteInfo = function (words) {
        $('#deleteCategoryForm .modal-body-1>div').html('是否删除 ' + words + ' ?');
    };

    var delete_second_category = function () {
        if (second_category != 0) {
            deleteInfo($('.js-second-category-div .selected .center-line').html());
            $('#deleteCategoryForm').modal({
                backdrop: 'static',
                keyboard: false
            });
            $('.js-modal-confirm-button').bind('click', delete_second_category_confirm);
        }

    };

    var delete_third_category = function () {
        if (third_category != 0) {
            deleteInfo($('.js-third-category-div .selected .center-line').html());
            $('#deleteCategoryForm').modal({
                backdrop: 'static',
                keyboard: false
            });
            $('.js-modal-confirm-button').bind('click', delete_third_category_confirm);
        }
    };

    var delete_manufactor = function () {
        if (third_category != 0 && manufactor != 0) {
            deleteInfo($('.js-manufactor-div .selected .center-line').html());
            $('#deleteCategoryForm').modal({
                backdrop: 'static',
                keyboard: false
            });
            $('.js-modal-confirm-button').bind('click', delete_manufactor_confirm);
        }
    };

    var delete_brand = function () {
        if (third_category != 0 && manufactor != 0 && brand != 0) {
            deleteInfo($('.js-brand-div .selected .center-line').html());
            $('#deleteCategoryForm').modal({
                backdrop: 'static',
                keyboard: false
            });
            $('.js-modal-confirm-button').bind('click', delete_brand_confirm);
        }
    };

    var delete_series = function () {
        if (series != 0) {
            deleteInfo($('.js-series-div .selected .center-line').html());
            $('#deleteCategoryForm').modal({
                backdrop: 'static',
                keyboard: false
            });
            $('.js-modal-confirm-button').bind('click', delete_series_confirm);
        }
    }

    var delete_second_category_confirm = function () {
        if (second_category != 0) {
            var csrftoken = getCookie('csrftoken');
            $.ajax({
                url: "/sdk/category/" + second_category + "/",
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                type: "DELETE",
                dataType: 'json',
                success: function (data) {
                    if (data.success == 1) {
                        $('div.js-second-category[data-id="' + second_category + '"]').remove();
                        second_category = 0;
                        $('.js-third-category-div').empty();
                        $('.js-manufactor-div').empty();
                        $('.js-brand-div').empty();
                        $('.js-series-div').empty();
                    }
                }
            });
        }
        $('#deleteCategoryForm').modal('hide');
        $('.js-modal-confirm-button').unbind('click');
    };

    var delete_third_category_confirm = function () {
        if (third_category != 0) {
            var csrftoken = getCookie('csrftoken');
            $.ajax({
                url: "/sdk/category/" + third_category + "/",
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                type: "DELETE",
                dataType: 'json',
                success: function (data) {
                    if (data.success == 1) {
                        $('div.js-third-category[data-id="' + third_category + '"]').remove();
                        third_category = 0;
                        $('.js-manufactor-div').empty();
                        $('.js-brand-div').empty();
                        $('.js-series-div').empty();
                    }
                }
            });
        }
        $('#deleteCategoryForm').modal('hide');
        $('.js-modal-confirm-button').unbind('click');
    };

    var delete_manufactor_confirm = function () {
        if (third_category != 0 && manufactor != 0) {
            var csrftoken = getCookie('csrftoken');
            $.ajax({
                url: "/sdk/manufactor/" + manufactor + "/",
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                data: {
                    'category_id': third_category,

                },
                type: "DELETE",
                dataType: 'json',
                success: function (data) {
                    if (data.success == 1) {
                        $('div.js-manufactor[data-id="' + manufactor + '"]').remove();
                        manufactor = 0;
                        $('.js-brand-div').empty();
                        $('.js-series-div').empty();
                    }
                }
            });
        }
        $('#deleteCategoryForm').modal('hide');
        $('.js-modal-confirm-button').unbind('click');
    };

    var delete_brand_confirm = function () {
        if (third_category != 0 && manufactor != 0 && brand != 0) {
            var csrftoken = getCookie('csrftoken');
            $.ajax({
                url: "/sdk/brand/" + brand + "/",
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                data: {
                    'category_id': third_category,
                    'manufactor_id': manufactor
                },
                type: "DELETE",
                dataType: 'json',
                success: function (data) {
                    if (data.success == 1) {
                        $('div.js-brand[data-id="' + brand + '"]').remove();
                        brand = 0;
                        $('.js-series-div').empty();
                    }
                }
            });
        }
        $('#deleteCategoryForm').modal('hide');
        $('.js-modal-confirm-button').unbind('click');
    };

    var delete_series_confirm = function () {
        if (series != 0) {
            var csrftoken = getCookie('csrftoken');
            $.ajax({
                url: "/sdk/series/" + series + "/",
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                type: "DELETE",
                dataType: 'json',
                success: function (data) {
                    if (data.success == 1) {
                        $('div.js-series[data-id="' + series + '"]').remove();
                        series = 0;
                    }
                }
            });
        }
        $('#deleteCategoryForm').modal('hide');
        $('.js-modal-confirm-button').unbind('click');
    };

    var edit_second_category = function () {
        if (second_category != 0) {
            $('.js-modal-save-button').bind('click', save_second_category_edit);
            $('#addCategoryForm').modal({backdrop: 'static', keyboard: false});
            $('#addCategoryFormLabel').html('编辑二级分类');
            $('.js-modal-category-label').html('二级分类名称');
            $('.js-modal-category-name').val($('.js-second-category[data-id="' + second_category + '"]').find('.js-second-category-name').html());
        }
    };

    var edit_third_category = function () {
        if (third_category != 0) {
            $('.js-modal-save-button').bind('click', save_third_category_edit);
            $('#addCategoryForm').modal({backdrop: 'static', keyboard: false});
            $('#addCategoryFormLabel').html('编辑三级分类');
            $('.js-modal-category-label').html('三级分类名称');
            $('.js-modal-category-name').val($('.js-third-category[data-id="' + third_category + '"]').find('.js-third-category-name').html());
        }
    };

    var edit_manufactor = function () {
        if (manufactor != 0) {
            $('.js-modal-save-button').bind('click', save_manufactor_edit);
            $('#addCategoryForm').modal({backdrop: 'static', keyboard: false});
            $('#addCategoryFormLabel').html('编辑厂家');
            $('.js-modal-category-label').html('厂家名称');
            $('.js-modal-category-name').val($('.js-manufactor[data-id="' + manufactor + '"]').find('.js-manufactor-name').html());
        }
    };

    var edit_brand = function () {
        if (brand != 0) {
            $('.js-modal-save-button').bind('click', save_brand_edit);
            $('#addCategoryForm').modal({backdrop: 'static', keyboard: false});
            $('#addCategoryFormLabel').html('编辑品牌');
            $('.js-modal-category-label').html('品牌名称');
            $('.js-modal-category-name').val($('.js-brand[data-id="' + brand + '"]').find('.js-brand-name').html());
        }
    };

    var edit_series = function () {
        if (series != 0) {
            $('.js-modal-save-button').bind('click', save_series_edit);
            $('#addCategoryForm').modal({backdrop: 'static', keyboard: false});
            $('#addCategoryFormLabel').html('编辑系列');
            $('.js-modal-category-label').html('系列名称');
            $('.js-modal-category-name').val($('.js-series[data-id="' + series + '"]').find('.js-series-name').html());
        }
    };

    var save_second_category_edit = function () {
        var category_name = $('.js-modal-category-name').val();
        if (second_category != 0) {
            var csrftoken = getCookie('csrftoken');
            $.ajax({
                url: "/sdk/category/" + second_category + "/",
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                data: {
                    'name': category_name,
                },
                type: "PUT",
                dataType: 'json',
                success: function (data) {
                    if (data.success == 1) {
                        $('.js-second-category[data-id="' + second_category + '"]').find('.js-second-category-name').html(category_name);
                        $('.js-modal-save-button').unbind('click');
                        $('#addCategoryForm').modal('hide');
                    } else {
                        sweetAlert(data.message);
                    }
                }
            });
        }

    };

    var save_third_category_edit = function () {
        var category_name = $('.js-modal-category-name').val();
        if (third_category != 0) {
            var csrftoken = getCookie('csrftoken');
            $.ajax({
                url: "/sdk/category/" + third_category + "/",
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                data: {
                    'name': category_name,
                },
                type: "PUT",
                dataType: 'json',
                success: function (data) {
                    if (data.success == 1) {
                        $('.js-third-category[data-id="' + third_category + '"]').find('.js-third-category-name').html(category_name);
                        $('.js-modal-save-button').unbind('click');
                        $('#addCategoryForm').modal('hide');
                    } else {
                        sweetAlert(data.message);
                    }
                }
            });
        }
    };

    var save_manufactor_edit = function () {
        var category_name = $('.js-modal-category-name').val();
        if (manufactor != 0) {
            var csrftoken = getCookie('csrftoken');
            $.ajax({
                url: "/sdk/manufactor/" + manufactor + "/",
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                data: {
                    'name': category_name,
                },
                type: "PUT",
                dataType: 'json',
                success: function (data) {
                    if (data.success == 1) {
                        $('.js-manufactor[data-id="' + manufactor + '"]').find('.js-manufactor-name').html(category_name);
                        $('.js-modal-save-button').unbind('click');
                        $('#addCategoryForm').modal('hide');
                    } else if (data.success == 2) {
                        if ($('.js-manufactor[data-id="' + data.manufactor_id + '"]').length > 0) {
                            $('.js-manufactor[data-id="' + manufactor + '"]').remove();
                            manufactor = 0;
                            $('.js-manufactor[data-id="' + data.manufactor_id + '"]').click();
                        } else {
                            $('.js-manufactor[data-id="' + manufactor + '"]').find('.js-manufactor-name').html(category_name);
                            $('.js-manufactor[data-id="' + manufactor + '"]').find('input').val(data.manufactor_id);
                            $('.js-manufactor[data-id="' + manufactor + '"]').attr('data-id', data.manufactor_id);
                        }
                        $('.js-modal-save-button').unbind('click');
                        $('#addCategoryForm').modal('hide');
                    } else {
                        sweetAlert(data.message);
                    }
                }
            });
        }

    };

    var save_brand_edit = function () {
        var category_name = $('.js-modal-category-name').val();
        if (brand != 0) {
            var csrftoken = getCookie('csrftoken');
            $.ajax({
                url: "/sdk/brand/" + brand + "/",
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                data: {
                    'name': category_name,
                },
                type: "PUT",
                dataType: 'json',
                success: function (data) {
                    if (data.success == 1) {
                        $('.js-brand[data-id="' + brand + '"]').find('.js-brand-name').html(category_name);
                        $('.js-modal-save-button').unbind('click');
                        $('#addCategoryForm').modal('hide');
                    } else {
                        sweetAlert(data.message);
                    }
                }
            });
        }

    };

    var save_series_edit = function () {
        var category_name = $('.js-modal-category-name').val();
        if (series != 0) {
            var csrftoken = getCookie('csrftoken');
            $.ajax({
                url: "/sdk/series/" + series + "/",
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                data: {
                    'name': category_name,
                },
                type: "PUT",
                dataType: 'json',
                success: function (data) {
                    if (data.success == 1) {
                        $('.js-series[data-id="' + series + '"]').find('.js-series-name').html(category_name);
                        $('.js-modal-save-button').unbind('click');
                        $('#addCategoryForm').modal('hide');
                    } else {
                        sweetAlert(data.message);
                    }
                }
            });
        }

    };

    var upload_file = function () {
        var data = new FormData();
        data.append('file', document.getElementById('file').files[0]);
        data.append('csrfmiddlewaretoken', $('input[name="csrfmiddlewaretoken"]').val());
        $.ajax({
            type: "POST",
            url: "/products/import/",
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function () {
                $('#importForm').modal('hide');
                location.reload();
            }
        });
    };

    var sessionValW = function () {
        var tmpArr = new Array;
        for (var i = 0; i < $('#settingForm .modal-body-4 select').length; i++) {
            tmpArr[i] = $($('#settingForm .modal-body-4 select')[i]).val();
        }
        sessionStorage.tmpArr = tmpArr;
    };

    var seesionValR = function () {
        var tmpArr = new Array;
        tmpArr = sessionStorage.tmpArr.split(',');
        for (var i = 0; i < tmpArr.length; i++) {
            $($('#settingForm .modal-body-4 select')[i]).val(tmpArr[i]);
        }
    };

    var setting = function () {
        if ($(this).attr('series-id') == undefined && settings_series == 0) return;
        $('#settingForm').modal({backdrop: 'static', keyboard: false});
        var category_id = $(this).attr('category-id');
        var series_id = $(this).attr('series-id');
        settings_series = series_id;
        settings_category = category_id;
        settingModalFlag = true;
        init_setting_form1();
        $('#settingForm .modal-body-5').hide();
        $('#settingForm .modal-body-6').hide();
        $('#settingForm button[data-for]').hide();
        $(document).on('click', '.modal-body-4 button[data-name=add]', function () {
            $('.modal-body-6 input[data-type]').val('');
            $('.modal-body-6 textarea[data-type]').val('');
            $('.modal-body-6').show();
            $('.modal-body-4').hide();
            sessionValW();
            $('#settingForm .modal-title').html('新增属性');
            $('#settingForm button[data-action]').hide();
            $('#settingForm button[data-for=modal-body-6]').show();
        });
        $(document).on('click', '.modal-body-4 .modal-span .fa-cog', function () {
            settingModalFlag = false;
            settings_attribute = $(this).parent().parent().attr('data-id');
            init_attribute_value();
            $('.modal-body-5').show();
            $('.modal-body-4').hide();
            sessionValW();
            $('#settingForm .modal-title').html('修改属性值');
            $('#settingForm button[data-action]').hide();
            $('#settingForm button[data-for=modal-body-5]').show();
        });
        $('#settingForm button[data-for=modal-body-5]').on('click', function () {
            settingModalFlag = false;
            $('.modal-body-5').hide();
            $('.modal-body-4').show();
            init_setting_form1();
            $('#settingForm button[data-action]').show();
            $('#settingForm button[data-for=modal-body-5]').hide();
            $('#settingForm .modal-body-5 input').removeClass('selected');
            $('#settingForm .modal-title').html('{ { 放属性名 } }的值:');
        });
        $('#settingForm button[data-for=modal-body-6]').on('click', function () {
            $('.modal-body-6').hide();
            $('.modal-body-4').show();
            init_setting_form1();
            $('#settingForm button[data-action]').show();
            $('#settingForm button[data-for=modal-body-6]').hide();
            $('#settingForm .modal-title').html('属性设置');
            if ($(this).hasClass('btn-default')) return;
        });
    };

    var init_attribute_value = function () {
        $.get(
            "/sdk/attr/" + settings_attribute + "/default_values/",
            {},
            function (data) {
                console.log(data);
                $('.js-value-text').remove();
                $('.js-value-text-label').remove();
                for (var index in data) {
                    $('.js-attribute-default-rows').append('<input type="text" class="form-control js-value-text" data-index="' + index + '" value="' + data[index] +
                        '" readonly><span class="js-value-text-label" data-index="' + index + '">确定</span>'
                    )
                    ;
                }
                $('.js-attribute-default-rows').find('span.js-value-text-label').hide();
            },
            "json"
        );
    };

    var init_setting_form1 = function () {
        $.get(
            "/sdk/series/" + settings_series + "/attribute_values/",
            {'category_id': settings_category},
            function (data) {
                $('.js-modal-attribute-row').remove();
                for (var index in data) {
                    var attribute = data[index];
                    var row_html = '<div class="modal-row js-modal-attribute-row" data-id="' + attribute.id + '">' +
                        '<div>' + attribute.name + '</div>' +
                        '<div>' +
                        '<select name="value" class="form-control">';
                    for (value_index in attribute.values) {
                        row_html += '<option value="' + attribute.values[value_index] + '">' + attribute.values[value_index] + '</option>';
                    }
                    row_html +=
                        '</select>' +
                        '</div>' +
                        '<div>' +
                        '<select name="searchable" class="form-control">' +
                        '<option value="1">允许</option>' +
                        '<option value="0">不允许</option>' +
                        '</select>' +
                        '</div>' +
                        '<div class="modal-span"><span class="fa fa-cog"></span>&nbsp;&nbsp;&nbsp;&nbsp;<span ' +
                        'class="fa fa-close"></span></div>' +
                        '</div>';
                    $('.modal-body-4').append(row_html);
                    $('.modal-body-4').find('div[data-id="' + attribute.id + '"]').find('select[name="value"]').val(attribute.value);
                    $('.modal-body-4').find('div[data-id="' + attribute.id + '"]').find('select[name="searchable"]').val(attribute.searchable);
                }
                if(!settingModalFlag) {
                    seesionValR();
                }
            },
            "json"
        );
    };

    var settingAction = function () {
        ////////.attr('editTarget','flag');
        if ($(this).attr('data-action') == 'save') {
            var attr_ids = new Array();
            var attr_values = new Array();
            var attr_searchables = new Array();
            $('.js-modal-attribute-row').each(function () {
                attr_ids.push($(this).attr('data-id'));
                attr_values.push($(this).find('select[name="value"]').val());
                attr_searchables.push($(this).find('select[name="searchable"]').val());
            });
            console.log(attr_ids);
            console.log(attr_values);
            console.log(attr_searchables);
            if (attr_values.includes(null) || attr_searchables.includes(null)) {
                sweetAlert("必须选择属性值！");
                return;
            }
            $.post(
                "/sdk/series/" + settings_series + "/update_attribute_values/",
                {
                    'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
                    'ids': attr_ids,
                    'values': attr_values,
                    'searchables': attr_searchables
                },
                function (data) {
                    if (data.success == 1) {
                    }
                },
                "json"
            );
            console.log('save');
        }
        $('#settingForm').modal('hide');
    };

    var inputSelected = function () {
        $(this).addClass('selected').siblings().removeClass('selected');
    };

    var modal5Action = function () {
        if ($(this).attr('name') == 'edit') {
            if ($('.modal-body-5 input.selected').length == 0) return;
            $('.modal-body-5 input.selected').removeAttr('readonly').next().show();
            modal5UnbindAction();
        } else if ($(this).attr('name') == 'add') {
            var max_index = parseInt($('.js-value-text').last().attr('data-index')) + 1;
            $('.modal-body-5 .modal-row').append('<input type="text" class="form-control js-value-text" data-index="' + max_index + '" readonly><span class="js-value-text-label"  data-index="' + max_index + '">确定</span>')
            modal5bindAction();
        } else if ($(this).attr('name') == 'remove') {
            $('.modal-body-5 input.selected').next().remove();
            $('.modal-body-5 input.selected').remove();
            var index = $(this).attr('data-index');
            $.post(
                "/sdk/attr/" + settings_attribute + "/delete_default_value/",
                {
                    'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
                    'index': index,
                },
                function (data) {
                    if (data.success == 1) {
                    }
                },
                "json"
            );
        }
    };

    var changeModal5Val = function () {
        modal5bindAction();
        $(this).prev().attr('readonly', 'readonly');
        var data_index = $(this).attr('data-index');
        var text = $('.js-value-text[data-index="' + data_index + '"]').val();
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            url: "/sdk/attr/" + settings_attribute + "/",
            headers: {
                'X-CSRFToken': csrftoken,
            },
            data: {
                'index': data_index,
                'text': text,
            },
            type: "PUT",
            dataType: 'json',
            success: function (data) {
                if (data.success == 1) {
                }
            }
        });
    };

    var modal5bindAction = function () {
        $(document).on('click', '.modal-body-5 input', inputSelected);
        $(document).off('click', '.modal-body-5 input+span');
        $('.modal-body-5 input+span').hide();
    };

    var modal5UnbindAction = function () {
        $(document).off('click', '.modal-body-5 input');
        $(document).on('click', '.modal-body-5 input+span', changeModal5Val);
    };

    var loadPager = function (sum) {
        if (sum > 1) {
            $('div[data-name=nav]').css('visibility', 'visible');
        } else {
            $('div[data-name=nav]').css('visibility', 'hidden');
        }
        $('select[data-name=navPager]').empty();
        for (var i = 1; i <= sum; i++) {
            $('select[data-name=navPager]').append('<option value="' + i + '">' + i + '</option>');
        }
    };

    var export_xls = function () {
        window.open('/products/export/');
    };

    var search_kw = function () {
        var kw = $('.js-kw').val();
        if (kw.trim() == '') {
            $('#attentionForm').modal({backdrop: 'static', keyboard: false});
            $('#attentionForm .attention-text').html('请输入关键字！');
            return;
        }
        $.get(
            "/sdk/category/search/",
            {
                'kw': kw,
            },
            function (data) {
                $('.js-search-result').find('.js-search-detail').remove();
                var tmp = 0;
                var temp = 0;
                for (tmp in data.data) {
                    temp = Math.ceil((eval(tmp) + 1) / 20);
                    $('.js-search-result').append(
                        '<div class="search-detail-row js-search-detail" data-group="' + temp + '">' +
                        '<div>' + data.data[tmp].first_category + '</div>' +
                        '<div>' + data.data[tmp].second_category + '</div>' +
                        '<div>' + data.data[tmp].third_category + '</div>' +
                        '<div>' + data.data[tmp].manufactor + '</div>' +
                        '<div>' + data.data[tmp].brand + '</div>' +
                        '<div>' + data.data[tmp].series + '</div>' +
                        '<div><span class="fa fa-cog" category-id="' + data.data[tmp].category_id + '" series-id="' + data.data[tmp].series_id + '"></span></div>' +
                        '</div>'
                    );
                }
                $('.js-search-result').find('.fa-cog').on('click', setting);
                $('div.js-search-detail').hide();
                $('div[data-group=1]').show();
                tmp++;
                //baseApp.changeSize(1086);
                loadPager(temp);
            },
            "json"
        );
        $('.js-search-result').css('visibility', 'visible');
    };

    var attribute_delete = function () {
        var attribute_id = $(this).parent().parent().attr('data-id');
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            url: "/sdk/attr/" + attribute_id + "/",
            headers: {
                'X-CSRFToken': csrftoken,
            },
            type: "DELETE",
            dataType: 'json',
            success: function (data) {

            }
        });
        $(this.parentNode.parentNode).remove();
    };

    var save_new_attribute = function () {
        if ($('.modal-body-6 input[data-type]').val().trim() == '') return;
        $.post(
            "/sdk/attr/",
            {
                'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
                'category_id': settings_category,
                'name': $('input[name="new-attribute-name"]').val(),
                'value': $('textarea[name="new-attribute-value"]').val(),
                'searchable': $('select[name="new-attribute-searchable"]').val()
            },
            function (data) {
                if (data.success == 1) {
                    init_setting_form1();
                }
            },
            "json"
        );
    };

    var bindCategoryMainBtn = function () {
        $('.js-add-second-category').on('click', add_second_category);
        $('.js-add-third-category').on('click', add_third_category);
        $('.js-add-manufactor').on('click', add_manufactor);
        $('.js-add-brand').on('click', add_brand);
        $('.js-add-series').on('click', add_series);
        $('.js-delete-second-category').on('click', delete_second_category);
        $('.js-delete-third-category').on('click', delete_third_category);
        $('.js-delete-manufactor').on('click', delete_manufactor);
        $('.js-delete-brand').on('click', delete_brand);
        $('.js-delete-series').on('click', delete_series);
        $('.js-edit-second-category').on('click', edit_second_category);
        $('.js-edit-third-category').on('click', edit_third_category);
        $('.js-edit-manufactor').on('click', edit_manufactor);
        $('.js-edit-brand').on('click', edit_brand);
        $('.js-edit-series').on('click', edit_series);
    };

    var unbindCategoryMainBtn = function () {
        $('.js-add-second-category').off('click');
        $('.js-add-third-category').off('click');
        $('.js-add-manufactor').off('click');
        $('.js-add-brand').off('click');
        $('.js-add-series').off('click');
        $('.js-delete-second-category').off('click');
        $('.js-delete-third-category').off('click');
        $('.js-delete-manufactor').off('click');
        $('.js-delete-brand').off('click');
        $('.js-delete-series').off('click');
        $('.js-edit-second-category').off('click');
        $('.js-edit-third-category').off('click');
        $('.js-edit-manufactor').off('click');
        $('.js-edit-brand').off('click');
        $('.js-edit-series').off('click');
    };


    return {

        init: function () {
            $('.js-first-category').on('click', first_category_onclick);
            bindCategoryMainBtn();
            $('.js-batch-delete-button').on('click', function () {
                $('input[type="checkbox"]').show();
                $('button[data-for=batch-delete]').show();
                $('button[data-type=normal]').hide();
                checkboxFlag = true;
                unbindCategoryMainBtn();
            });
            $('.js-modal-cancel-button').on('click', function () {
                $('#deleteCategoryForm').modal('hide');
            });
            $('.js-upload-button').on('click', upload_file);
            $('.modal-body-3 input[type=text]').on('click', function () {
                $('input[name=file]').click();
            });

            $('input[name=file]').on('change', function () {
                $('.modal-body-3 input[type=text]').val(this.files[0].name);
            });
            $('.js-export-button').on('click', export_xls);
            $('button[data-for=batch-delete]').on('click', batchDelete);

            $('button[data-for=batch-delete]').hide();

            $('.fa-cog').on('click', setting);
            $('button[data-action]').on('click', settingAction);

            modal5bindAction();

            $('.js-search-button').on('click', search_kw);
            $('.js-search-result').css('visibility', 'hidden');
            $('div[data-name=nav]').css('visibility', 'hidden');

            $(document).on('hidden.bs.modal', '#settingForm', function () {
                $('#settingForm .modal-body-5 input').removeClass('selected');
                $('#settingForm .modal-body-4').show();
                $('#settingForm .modal-body-5').hide();
                $('#settingForm .modal-body-6').hide();
                $('#settingForm button[data-action]').show();
                $('#settingForm button[data-for]').hide();
            });
            $(document).on('click', '.modal-body-5 div[data-name=action-box] span', modal5Action);
            $(document).on('click', '.modal-body-4 .modal-span .fa-close', attribute_delete);
            $(document).on('click', 'button.btn-primary[data-for="modal-body-6"]', save_new_attribute);

            $('#attentionForm .btn').on('click', function () {
                $('#attentionForm').modal('hide');
            });

            //pager
            $('select[data-name=navPager]').on('change', function () {
                $('div.js-search-detail').hide();
                $('div[data-group=' + $('select[data-name=navPager]').val() + ']').show();
            });
            $('nav div[data-name=navLeft]').on('click', function () {
                var tmp = eval($('select[data-name=navPager]').val()) - 1;
                if (tmp <= 0) return;
                $('select[data-name=navPager]').val(tmp);
                $('select[data-name=navPager]').change();
            });
            $('nav div[data-name=navRight]').on('click', function () {
                var tmp = eval($('select[data-name=navPager]').val()) + 1;
                if (tmp > $('select[data-name=navPager] option').length) return;
                $('select[data-name=navPager]').val(tmp);
                $('select[data-name=navPager]').change();
            });

            $('.modal').on('show.bs.modal', function () {
                modalTmp = this;
                baseApp.dialogShow(this);
            });

            window.top.$('.tabs-main > div').scroll(function () {
                baseApp.dialogShow(modalTmp);
            })
        }
    }
}();


