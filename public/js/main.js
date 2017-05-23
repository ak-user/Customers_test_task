
var usersTable = document.getElementById("users-table");

var xhrCustomers = new XMLHttpRequest();
xhrCustomers.open("GET", "/api/customers");

xhrCustomers.addEventListener("readystatechange", function () {
    if (this.readyState !== 4) {
        return;
    }

    var pars = JSON.parse(this.responseText);

    function parsCell(data, newTr) {
        var td = document.createElement("td");
        td.innerText = data;
        newTr.appendChild(td);
    }

    for (var i = 0; i < pars.length; i++) {
        var newTr = document.createElement("tr");
        newTr.setAttribute("id", pars[i].id);
        usersTable.appendChild(newTr);

        parsCell(pars[i].name, newTr);
        parsCell(pars[i].address, newTr);
        parsCell(pars[i].phone, newTr);

        var newTd = document.createElement("td");
        newTr.appendChild(newTd);

        var btnRemove = document.createElement("button");
        btnRemove.setAttribute("id", pars[i].id);
        btnRemove.style.backgroundColor = "#E75454";
        btnRemove.style.border = "0";
        newTd.appendChild(btnRemove);
        var textRemove = document.createTextNode("Remove");
        btnRemove.appendChild(textRemove);

        var btnEdit = document.createElement("button");
        btnEdit.setAttribute("id", pars[i].id);
        newTd.appendChild(btnEdit);
        btnEdit.style.backgroundColor = "#41BEA8";
        btnEdit.style.border = "0";
        var textEdit = document.createTextNode("Edit");
        btnEdit.appendChild(textEdit);
        removeRow(btnRemove, i, pars);
        editRow(btnEdit, i, pars);
    }
});

xhrCustomers.send();

function removeRow(btn, index, elements) {
    btn.addEventListener("click", function (e) {
        var remove = new XMLHttpRequest();
        remove.open("DELETE", "/api/customers/" + elements[index].id);
        remove.addEventListener("readystatechange", function () {
            if (remove.readyState !== 4) {
                return;
            }
            var newTr = e.target.parentNode.parentNode;
            var parent = newTr.parentNode;
            parent.removeChild(newTr);
        });

        remove.send();
    });
}

// ------------ add products and price --------------------- //
var xhrProducts = new XMLHttpRequest();
xhrProducts.open("GET", "/api/products");

xhrProducts.addEventListener("readystatechange", function () {
    if (this.readyState !== 4) {
        return;
    }

    var parsProducts = JSON.parse(this.responseText);
    for (var i = 0; i < parsProducts.length; i++) {
        var optionProduct = document.createElement("option");
        optionProduct.innerText = parsProducts[i].name;
        products.appendChild(optionProduct);
    }

    products.addEventListener("change", function () {
        var productIndex = products.selectedIndex;
        price.innerText = parsProducts[productIndex].price;
    });

});

xhrProducts.send();


// ------------------- show form, clear input ----------------------- //
var form = document.querySelector(".users-edit"),
    fullName = document.getElementById("name"),
    address = document.getElementById("address"),
    phone = document.getElementById("phone"),
    btnSave = document.querySelector(".btn-save"),
    products = document.getElementById("products"),
    price = document.getElementById("price"),
    create = document.getElementById("create"),
    cancel = document.getElementById("cancel");

create.addEventListener("click", function () {
    form.classList.remove("users-edit-hidden");
    fullName.value = " ";
    phone.value = " ";
    address.value = " ";
});

cancel.addEventListener("click", function () {
    form.classList.add("users-edit-hidden");
});


//--------------------- edit USER ----------------------------------
function editRow(btnEdit, ind, el) {
    btnEdit.addEventListener("click", function (e) {
        form.classList.remove("users-edit-hidden");
        var edit = new XMLHttpRequest();
        edit.open("GET", "/api/customers/" + el[ind].id);
        edit.addEventListener("readystatechange", function () {
            if (this.readyState !== 4) {
                return;
            }
            var editPars = JSON.parse(this.responseText);
            form.id.value = editPars.id;
            form.name.value = editPars.name;
            form.address.value = editPars.address;
            form.phone.value = editPars.phone;
        });

        edit.send();
    });
}

// ------------------- save new user ----------------------- //

form.addEventListener("submit", function (e) {
    e.preventDefault();
    var fName = document.getElementById("name"),
        addr = document.getElementById("address"),
        ph = document.getElementById("phone");

    var save = new XMLHttpRequest();
    save.open("POST", "/api/customers");
    save.setRequestHeader('Content-Type', 'application/json');

    var userInfo = {
        name: fName.value,
        address: addr.value,
        phone: ph.value
    };

    save.send(JSON.stringify(userInfo));
    form.classList.add("users-edit-hidden");

    save.addEventListener("readystatechange", function () {
        if (this.readyState !== 4) {
            return;
        }

        var user = JSON.parse(this.responseText);

        function createCell(data, newTr) {
            var td = document.createElement("td");
            td.innerText = data;
            newTr.appendChild(td);
        }

        var newTr = document.createElement("tr");
        newTr.setAttribute("id", user.id);
        usersTable.appendChild(newTr);

        createCell(user.name, newTr);
        createCell(user.address, newTr);
        createCell(user.phone, newTr);

        var newTd = document.createElement("td");
        newTr.appendChild(newTd);

        var btnRemove = document.createElement("button");
        btnRemove.setAttribute("id", user.id);
        btnRemove.style.backgroundColor = "#E75454";
        btnRemove.style.border = "0";
        newTd.appendChild(btnRemove);
        var textRemove = document.createTextNode("Remove");
        btnRemove.appendChild(textRemove);

        var btnEdit = document.createElement("button");
        btnEdit.setAttribute("id", user.id);
        newTd.appendChild(btnEdit);
        btnEdit.style.backgroundColor = "#41BEA8";
        btnEdit.style.border = "0";
        var textEdit = document.createTextNode("Edit");
        btnEdit.appendChild(textEdit);

        btnRemove.addEventListener("click", function (e) {
            var remove = new XMLHttpRequest();
            remove.open("DELETE", "/api/customers/" + user.id);
            remove.addEventListener("readystatechange", function () {
                if (remove.readyState !== 4) {
                    return;
                }
                var newTr = e.target.parentNode.parentNode;
                var parent = newTr.parentNode;
                parent.removeChild(newTr);
            });

            remove.send();
        });
    });
});
