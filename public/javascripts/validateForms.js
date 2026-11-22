(function () {
    'use strict'

    // Bootstrap-style custom validation for every form using .validated-form
    const forms = Array.from(document.querySelectorAll('.validated-form'))

    function fieldWrapper(field) {
        return field.closest('.form-field')
    }

    function syncField(field) {
        if (!field || !field.willValidate) return

        const wrapper = fieldWrapper(field)
        if (!wrapper) return

        const invalid = !field.checkValidity()
        field.classList.toggle('is-invalid', invalid)
        field.setAttribute('aria-invalid', invalid ? 'true' : 'false')
        wrapper.classList.toggle('has-error', invalid)
    }

    forms.forEach(function (form) {
        const fields = Array.from(form.querySelectorAll('input, select, textarea'))

        form.addEventListener('submit', function (event) {
            fields.forEach(syncField)

            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()

                const firstInvalid = fields.find(function (field) {
                    return field.willValidate && !field.checkValidity()
                })

                if (firstInvalid) {
                    firstInvalid.focus()
                    // Native message ties the failure to the focused control
                    if (typeof firstInvalid.reportValidity === 'function') {
                        firstInvalid.reportValidity()
                    }
                }
            }

            form.classList.add('was-validated')
        }, false)

        // Clear an error as soon as the visitor fixes that field
        form.addEventListener('input', function (event) {
            if (form.classList.contains('was-validated')) syncField(event.target)
        })

        form.addEventListener('change', function (event) {
            if (form.classList.contains('was-validated')) syncField(event.target)
        })
    })

    // Keep the file-upload label in sync with the native file picker
    document.querySelectorAll('input[type="file"][data-file-label]').forEach(function (input) {
        const label = document.getElementById(input.dataset.fileLabel)
        if (!label) return

        const emptyLabel = label.textContent.trim()

        input.addEventListener('change', function () {
            const count = input.files ? input.files.length : 0
            label.textContent = count === 0
                ? emptyLabel
                : count + (count === 1 ? ' image selected' : ' images selected')
        })
    })
})()
