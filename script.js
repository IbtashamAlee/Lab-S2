// api url link
const url = 'https://usman-recipes.herokuapp.com/api/products/';

let prod;

$(() => {
    $('#spinner').css('display', 'flex');
    $('#main').hide();
    getProducts(function (products) {
        prod = products;
        if (products != undefined) {
            products.forEach(product => {
                addRow(product);
                $('#spinner').hide();
                $('#main').show();
            });
        }
    });

    $('#add-product-form').submit(onSubmit);
    $('#addButton').click(onAddClicked);
    $('#close-addProduct').click(closeAddProductForm);

});


// Operations
function getProducts(onSuccess) {
    $.getJSON(url, (result) => {
        onSuccess(result);
    }).fail(() =>
        console.log('Failed')
    ).always();
}

function addProduct(product, onSuccess) {
    $.post(url, product, onSuccess).fail(() =>
        console.log('Failed')
    ).always();
}

function getProduct(id, onSuccess) {
    $.getJSON(`${url}${id}`, onSuccess).fail(() =>
        console.log('Failed')
    ).always();
}

function deleteProduct(id, onSuccess) {
    $.ajax({
        type: "delete",
        url: url + id,
        success: function (response) {
            onSuccess(response);
        }
    }).fail(() => {
        console.log('Failed')
        }
    ).always();
}

function updateProduct(id, product, onSuccess) {
    $.ajax({
        type: "put",
        url: url + id,
        data: product,
        success: function (response) {
            onSuccess(response);
        }
    }).fail(function () {
        console.log('Failed')
            closeAddProductForm();
        }
    ).always();
}

function addRow(product) {
    var row = $('<div>', {'id': product._id, 'class': 'product p-4 col-12 col-md-12 prod-div'});
    row.html(`
                <div class="bg-light rounded-lg overflow-hidden shadow-sm p-4">
                    <div class="d-flex align-items-center justify-content-between">
                        <h3>${product.name}</h3>
                        <div class="ml-2 d-flex align-items-center">
                            <button onClick="onUpdateClicked('${product._id}')" type="button" id="${product._id}" class="btn btn-primary rounded-lg align-self-end">
                                <svg width="24" height="24" fill="currentColor"
                                    class="bi bi-pencil-fill p-1" viewBox="0 0 16 16">
                                    <path
                                        d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                </svg>
                            </button>
                            <button onClick="onDeleteClicked('${product._id}')" id="${product._id}" type="button" class="btn btn-danger ml-1 rounded-lg align-self-end">
                                <svg width="24" height="24" fill="currentColor"
                                    class="bi bi-trash-fill p-1" viewBox="0 0 16 16">
                                    <path
                                        d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <p>${product.department}</p>
                    <p>${product.description}</p>
                    <div class="d-flex justify-content-between">
                        <p class="mb-0">${product.price}</p>
                        <p class="pr-2 mb-0">${product.color}</p>
               
                    </div>
                </div>
    `);
    $("#products-grid").append(row);
}

function onDeleteClicked(id) {
    deleteProduct(id, (deleted) => {
        $(`#${deleted._id}`).remove();
        console.log('Failed')
    });
}

function onUpdateClicked(id) {
    getProduct(id, (product) => {
        $('#add-product-form').trigger("reset");
        $('#_id').val(product._id);
        $('#name').val(product.name);
        $('#description').val(product.description);
        $('#price').val(product.price);
        $('#department').val(product.department);
        $('#color').val(product.color);
        $('#add-product').removeClass('d-none').addClass('d-flex');
    });
}

function onAddClicked() {
    $('#add-product-form').trigger("reset");
    $('#_id').val("");
    $('#add-product').removeClass('d-none').addClass('d-flex');
}

function onSubmit(e) {
    isUpdating = $('#add-product-form #_id').val() != "";
    data = $('#add-product-form').serialize();

    if (isUpdating) {
        updateProduct($('#add-product-form #_id').val(), data, (product) => {
            $(`#${product._id}`).remove();
            addRow(product);
            closeAddProductForm();
        });
    } else {
        addProduct(data, (product) => {
            addRow(product);
            closeAddProductForm();
        });
    }

    e.preventDefault();
}

function closeAddProductForm() {
    $('#add-product').removeClass('d-flex').addClass('d-none');
}

