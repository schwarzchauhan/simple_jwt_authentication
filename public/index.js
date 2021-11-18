$(document).ready(function() {
    const myFooterA = $('.my-footer a');
    // console.log(myFooterA);
    for (let i = 0; i < myFooterA.length; i++) {
        // https://api.jquery.com/eq/
        var e = myFooterA.eq(i);
        // console.log(typeof(e));
        // console.log(e);
        console.log(e[0]);
        e.addClass('text-decoration-none');
    }
    $('#my-button-addon').click(() => {
        // https://api.jquery.com/val/
        const downloadUrl = $('#myDownloadUrl').val();
        console.log(downloadUrl);
        // https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
        navigator.clipboard.writeText(downloadUrl);
    });
});