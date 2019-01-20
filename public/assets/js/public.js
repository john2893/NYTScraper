$(document).ready(function () {
    $(".delete-btn").click(function (event) {
        event.preventDefault();
        const id = $(this).attr("data");
        $.ajax(`/remove/${id}`, {
            type: "PUT"
        }).then(function(){
            location.reload();
        })
    });
    $(".save-btn").click(function(event) {
        event.preventDefault();
        const button = $(this);
        const id = button.attr("id");
        $.ajax(`/save/${id}`, {
            type: "PUT"
        }).then(function() {
            const alert = `
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
            The article has been saved!
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>`
            button.parent().append(alert);
            }
        );
    });
});