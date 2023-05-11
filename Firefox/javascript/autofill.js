console.log("Applicator extension loaded");

// Define the interface
document.addEventListener('DOMContentLoaded', function() {
    var inputs = document.querySelectorAll('input[data-field]');

    // Load the last entered values from storage and populate the input fields
    browser.storage.local.get(null, function(result) {
        for (var i = 0; i < inputs.length; i++) {
            var field = inputs[i].dataset.field;
            if (result[field]) {
                inputs[i].value = result[field];
            }
        }
    });

    // Save the values when the user types or changes the input fields
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', function(event) {
            var field = event.target.dataset.field;
            var value = event.target.value;

            // Store the last entered value in storage
            var data = {};
            data[field] = value;
            browser.storage.local.set(data);
        });
    }

    

});

